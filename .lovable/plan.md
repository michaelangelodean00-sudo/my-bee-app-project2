# Bee App Bahamas — Phase 1 Homepage Plan: Splash Ads → BeeNow

Status: planning only. **No changes were made** to app code, styles, routes, the database, storage, secrets or publishing. This plan replaces the earlier "events calendar first" plan.

## A. Current-state audit (verified by reading the code this turn)

| Feature | Verdict | Evidence |
|---|---|---|
| Header, logo, holiday ticker | Real, keep unchanged | Header.tsx, Logo.tsx, HolidayTicker.tsx |
| Splash carousel (AdSplash.tsx) | **Works as a carousel, but the content is sample** | Auto-rotates on a timer, has swipe, share and zoom. Ads are hard-coded in the code, including an "Advertise Here" sample image. There is no ads table. Images are h-48 on mobile, plus a long description and a 44px CTA, so the section is about 380–420px tall |
| Ad analytics (useAdAnalytics.ts) | **Not real** | Counts are kept only in memory and printed to the browser console. Nothing is saved. Any numbers shown are not trustworthy |
| Ad Management admin tab | **Mock** | Uses a `mockAds` array in local state. Nothing persists |
| Sponsored video widget | **Sample** | Plays a Google sample clip (`ForBiggerFun.mp4`) |
| Video upload (VideoUploadForm / VideoUpload page) | **Not real** | Submit only logs to the console. No file is stored, and **no storage buckets exist** |
| Admin video review | **Partly real** | The list is `mockPendingVideos`. Only approve/reject decisions are saved to `video_moderation`, keyed by mock IDs |
| BeeNow vertical feed | **Missing** | Nothing exists |
| Events page | **Sample** | Static "…2024" videos with example links. No events table |
| Business directory | **Real** | Reads approved businesses from `profiles`. Follows are real (`business_follows`) |
| Business approvals, users, suspension, audit log | **Real** | Backed by the database, with RLS |
| Home post feed | **Not real** | Lives in React state only and is lost on reload |
| Build | OK | Latest build log |
| Publish | Not published | Project URLs show no published site |

Conclusion: the only parts that could go in front of real visitors today are the header, the business directory and the follows. Splash Ads and BeeNow both need a real content source before launch. Until then, Phase 1 layout can ship with honest placeholders.

The Figma file (ze4AiBAVtYL1bubJ6RXqLt) needs a Figma login and can't be fetched from here. It is treated as a written design reference only. Its letter-B mark and illustrations will not be used.

## B. Before / after structure (mobile 390×844 first)

```text
BEFORE                                  AFTER
Header + ticker   ~ 110-150px            Header + ticker (unchanged)   ~ 110-150px
GreetingBanner                           SPLASH ADS (compact)          ~ 240px total
AdSplash          ~ 400px                  image 16:9 = 358x201 (cover)
Category grid                              overlay: "Sponsored" chip, title (1 line),
Sponsored video                            CTA pill, share icon; dots under image
CreatePost (Explore)                     BeeNow title + tabs           ~ 52px
Featured widget                            For You | Businesses | Events
In-memory posts                          BeeNow feed starts             first card top visible
                                         Bottom nav                    ~ 64px + safe area
```

**Above the fold at 390×844:** the header (about 130px), the splash (about 240px), the tabs (52px) and roughly 330px of the first BeeNow card, with the bottom nav fixed. That shows the first video's poster and title, as in the Figma opening screen. The ticker only appears in holiday windows. When it shows, the first card loses about 28px. That trade-off is acceptable.

**Proposed change (needs your approval):** drop the long ad description on mobile and keep only a 1-line title with a CTA. The full description and the zoom view open when the ad is tapped.

**Gestures**
- The splash uses horizontal swipe only (touch-action: pan-y), so vertical drags scroll the page.
- BeeNow is a normal vertical list on Home. Tapping a card, or "Watch BeeNow", opens the immersive full-height view at `/beenow`. That view uses CSS scroll-snap-y, one video per screen, and the browser's Back button returns to Home.
- I recommend against putting a scroll-snapping feed inside the home page. It traps the page scroll and fights the carousel, especially on iOS Safari.

**Tablet/desktop**
- The splash goes in a max-w-3xl centered column with 16:9 creatives at 21:9 crop ≥1024px.
- BeeNow becomes a 2–3 column grid of 9:16 posters. Clicking one opens the immersive view as a centered 9:16 player with keyboard ↑/↓.
- The left sidebar stays.

## C. File-by-file plan

**Keep unchanged:**
- Header.tsx, Logo.tsx, LogoImage.tsx, HolidayTicker.tsx and the ticker CSS
- logo and icon assets, Businesses.tsx, BusinessProfileCard, useBusinessFollow
- Admin approvals, users, admin-users, mcp, Auth, ProtectedRoute, useAuth, useMyProfile

**Modify (Phase 1, layout only):**
- `src/pages/Index.tsx`
  - New order: Header → AdSplash (compact) → BeeNowSection.
  - Remove GreetingBanner, BusinessCategorySection, SponsoredVideoWidget, CreatePost, FeaturedVideoAdWidget and PostList from Home. The components themselves stay in the codebase.
- `src/components/AdSplash.tsx`
  - Add a `variant="compact"` prop: 16:9 image, overlay text, a "Sponsored" chip on every paid slide, and the description hidden on mobile.
  - Keep the swipe, timer, share and zoom.
  - Hide AdPerformanceMetrics until analytics are real.
  - Pause auto-rotate under reduced motion.
- `src/components/MobileBottomNav.tsx` → Home, BeeNow, Events, Business, Profile. Shop moves to the Sidebar menu, which keeps the "E-commerce" label.
- `src/components/Sidebar.tsx`: add a BeeNow link.
- `src/App.tsx`: add the `/beenow` route (lazy).

**Add:**
- `src/components/beenow/BeeNowSection.tsx`: the title, Tabs (shadcn), a feed preview list, and the empty state.
- `src/components/beenow/BeeNowCard.tsx`: a 9:16 poster with a title, a business/event name and a CTA. The video is loaded only when the card is visible and tapped.
- `src/components/beenow/BeeNowPlayer.tsx`: muted by default, with play/pause and mute buttons (44px), `playsInline`, `preload="none"`, and a poster.
- `src/pages/BeeNow.tsx`: the immersive scroll-snap view.
- `src/lib/beenow.ts`: a `useBeeNowFeed(tab)` hook. In Phase 1 it returns `[]`, because there is no real source yet. There will be no sample clips.

**Defer:**
- Real uploads and storage, ads tables, real analytics, Events data, saves.
- Removing the mock arrays in AdminVideoReview and AdManagement. Phase 1 adds an admin-only "Demo data" banner to those tabs.

## D. BeeNow journeys

- **Visitor (guest):**
  1. Opens Home, watches the splash and scrolls to BeeNow.
  2. Taps a card to open the immersive view.
  3. The CTA "View business" goes to the business profile, and "View event" goes to the event page.
  - Follow, Save and Share: Share works for guests. Follow and Save ask the user to sign in.
- **Creator (approved business only):**
  1. Goes to Profile → Upload video.
  2. Fills in the clip (10–20 s recommended, 90 s max), a 9:16 poster, a title, the type (business/event) and a link target.
  3. Ticks a rights/consent checkbox.
  4. The video goes to pending review.
- **Admin:** reviews the video in Video Review (with the real queue), then approves or rejects it with a reason. Only approved videos appear in the feed. A report button follows later.
- **Tabs:**
  - For You = all approved videos, newest first, interleaved so the same business doesn't appear twice in a row.
  - Businesses = type 'business'.
  - Events = type 'event', hidden after the event date.
- **Empty state:** a bee mascot with "BeeNow is warming up — local businesses and events are coming soon." For approved businesses, add an "Upload your first video" button. Each tab gets its own empty message.

## E. Splash Ads requirements

- **Mechanics:**
  - Rotates every 6 s, pauses on touch, hover or when off-screen, and stops under reduced motion.
  - Swipe and arrow keys work, and the dots are buttons (44px hit area).
  - At most 8 slides (from memory).
- Every paid slide shows a visible "Sponsored" chip, and the advertiser's name is shown as given.
- One CTA per slide with an https link that opens in a new tab with `rel="noopener sponsored"`. Internal links go to a business page.
- **Schedule:** start/end date and time in Nassau time. Expired ads disappear automatically. If no ads are active, show a single honest "Advertise on Bee App" slide (house ad, labeled as such).
- **Creative spec:** 1920×1080 (16:9), WebP at 90% quality, under 400 KB. Keep a safe text area in the middle 80%, because a mobile overlay covers the bottom 30%. Titles are capped at 40 characters and the CTA at 18.
- **Analytics (later):**
  - Count an impression when the ad is ≥50% visible for 1 s, once per session per ad.
  - Count every click.
  - Show admins only. Nothing is shown to advertisers until the numbers are real.
- **Revenue:** no prices or reach figures are invented. Real tables make it possible to sell by date range or slot later. Payments are out of scope.

## F. Backend dependencies (additive only, not run)

For MVP content (Checkpoint 3):
- **Storage:** a `beenow` bucket (public read, so approved files can be served), max 50 MB. Uploads go to the user's own folder (`auth.uid()/...`). Pending files should not be visible publicly. Either use a private bucket with signed URLs, or a public bucket where only approved paths are referenced. **Your decision is needed.**
- **`videos` table:**
  - Columns: id, owner_id, type (business/event), title, description, video_path, poster_path, duration_s ≤ 90, link_type, link_target, status (pending/approved/rejected), rejection_reason, rights_confirmed bool, event_ends_at null, created_at, approved_at.
  - RLS:
    - Public can read approved rows.
    - The owner can insert, but only as an approved business; status is forced to pending by a trigger.
    - The owner can read their own rows.
    - Admins have full access.
  - Grants: select to anon; select, insert, update to authenticated; all to service_role.
- **video_moderation:** keep it. Point it at the new videos.id by adding a nullable `video_uuid`. The old text `video_id` rows stay and are marked deprecated.
- **For ads (Checkpoint 4):**
  - Table `splash_ads`: id, advertiser_name, title, image_path, cta_label, cta_url, is_house_ad, starts_at, ends_at, priority, active. Public reads active rows; admins write.
  - Table `ad_events`: ad_id, kind, session_hash, created_at. Anyone can insert with limited columns, and only admins can read. Abuse risk: no rate limiting, so counts are indicative only.
- **Later:** saved_videos, events, payments.
- **Blockers:**
  - No storage bucket exists.
  - The upload form saves nothing.
  - No email sender domain is set up.
- **Rollback:** the UI is turned off, tables get DEPRECATED comments, and nothing is dropped.

## G. Checkpoints

**1. Layout only (no database)**
- Done when:
  - Home order is Header → compact splash → BeeNow tabs → empty state.
  - The removed widgets no longer render on Home.
  - The nav shows Home, BeeNow, Events, Business, Profile, and Shop is in the menu.
  - `/beenow` shows the empty state.
  - The ticker and logo are pixel-identical.
  - The build is OK.
- Rollback: revert this one turn in History.

**2. Player and immersive view, using one admin-verified real clip at most**
- Done when:
  - Snap scroll works and the player is muted by default.
  - Off-screen videos are paused and unloaded.
  - No video downloads until it is near the viewport.

**3. Real uploads, moderation and feed** (storage + `videos` table + rewired AdminVideoReview)
- Done when:
  - An approved business uploads a clip, an admin approves it, and it appears in the correct tab.
  - A rejected clip never appears.
  - Guests can see approved clips only.

**4. Real Splash Ads and analytics** (`splash_ads` + AdManagement rewired)
- Done when:
  - Scheduled ads appear and expire on time, Nassau time.
  - The house ad appears when no ads are active.
  - Impression and click counts show in admin.

**Test every checkpoint on:**
- Android Chrome (back gesture, data saver)
- iPhone Safari: inline playback, the mute rule, safe-area bottom nav, and that the swipe doesn't trigger browser back navigation
- desktop Chrome/Safari at 1280px and 768px
- slow 3G throttling
- VoiceOver/TalkBack labels
- reduced-motion setting

## H. Risks and decisions for you

1. **Empty launch:** with honest data, both the Splash and BeeNow will start nearly empty. Do you approve showing house ads and the empty state, rather than the current sample ads?
2. **Current sample ads and the sponsored clip:** remove them from Home in Checkpoint 1 (recommended), or keep them, clearly marked as a demo, until real ads exist?
3. **Metrics:** "AdPerformanceMetrics" shows numbers that are not real. I recommend hiding them now.
4. **Nav label:** taking "Business" out of the first slot, and moving "Shop/E-commerce" to the menu, touches a memory rule. Please confirm.
5. **GreetingBanner:** removing it from Home overlaps with the holiday ticker. Please confirm.
6. **Mobile ad description:** keep the 1-line title only on mobile?
7. **Pending video privacy:** private bucket with signed URLs, or public? Private is safer but adds complexity.
8. **Admin workload:** every clip needs manual review. Estimate about 1 minute each.
9. **Rights:** music in clips may be copyrighted. A rights checkbox is required, plus a report flow later.
10. **Mobile data:** autoplaying on mobile data is a cost to users. The default is tap-to-play, with muted autoplay only on Wi-Fi when that can be detected.
11. **Concept challenge:** "Bahamian TikTok" plus ads works only with a steady supply of fresh clips. Without 20–30 approved clips at launch, the feed looks empty. Consider recruiting the first businesses before announcing.

## I. First build-turn prompt (after approval)

> Phase 1 Checkpoint 1, layout only. Do not touch the database, storage, auth, Header, Logo, LogoImage, HolidayTicker, logo files or the ticker CSS.
> 1. In src/pages/Index.tsx render, in order: Header, AdSplash with variant="compact", then a new BeeNowSection. Stop rendering GreetingBanner, BusinessCategorySection, SponsoredVideoWidget, CreatePost, FeaturedVideoAdWidget and PostList on Home. Do not delete those files. Keep the desktop Sidebar, Footer and MobileBottomNav.
> 2. In AdSplash.tsx add an optional `variant` prop. "compact" uses a 16:9 image (aspect-video, object-cover, max ~240px total section on 390px), overlays a "Sponsored" chip, a 1-line title, a CTA pill and a share icon, and hides the long description below md. Keep swipe, auto-rotate, dots, share and zoom. Set touch-action: pan-y and pause rotation under prefers-reduced-motion. Hide AdPerformanceMetrics in compact.
> 3. Create src/components/beenow/BeeNowSection.tsx with the heading "BeeNow" and shadcn Tabs For You | Businesses | Events (44px targets). Data comes from src/lib/beenow.ts `useBeeNowFeed(tab)`, which returns an empty array for now (no sample videos). Show a bee-mascot empty state per tab, plus "Upload your first video" for approved businesses linking to /upload-video.
> 4. Add a lazy /beenow route (src/pages/BeeNow.tsx) with the same tabs and empty state.
> 5. MobileBottomNav: Home, BeeNow (/beenow), Events, Business (/businesses), Profile. Add a BeeNow link to Sidebar. Keep E-commerce in the Sidebar unchanged.
> 6. Use semantic tokens only, and verify at 390×844 and 1280px with screenshots.

## J. Status
No changes made, apart from writing this plan document. Please approve the plan and answer the decisions in H (especially 1, 2, 4 and 7) before Checkpoint 1 is built.
