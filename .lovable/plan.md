# Bee App Bahamas — Phase 1 Plan (rev. 2): Splash Ads → BeeNow, with real ad analytics

Status: planning only. **No app code, styles, database, storage or publishing were changed.** This version replaces rev. 1.

## A. What exists vs what must be built (verified by reading the code)

| Area | Today | Needed for Phase 1 |
|---|---|---|
| Header, logo, holiday ticker | Real | Keep exactly as they are |
| Splash carousel (`AdSplash.tsx`) | Works: swipe, auto-rotate, share and zoom. **Ads are hard-coded samples** (incl. "Advertise Here") | Load real campaigns from the database. Samples appear in preview only |
| Ad analytics (`useAdAnalytics.ts`) | **Not real.** Counts stay in memory and are printed to the console | Persistent, server-validated tracking plus an admin dashboard |
| Ad Management admin (`AdManagement.tsx`) | **Mock** `mockAds` in local state | Real campaign create, schedule and creative upload |
| `AdPerformanceMetrics` display | Shows numbers that are not real | Hide until it reads real data |
| Sponsored video widget | Google sample clip | Remove from Home. Preview only |
| Video upload (`VideoUploadForm.tsx`) | **Not real.** Submit only logs to the console. **No storage buckets exist** | Private upload, a pending record, rights consent |
| Admin video review (`AdminVideoReview.tsx`) | **Mock list.** Only the decisions are saved to `video_moderation` | Real queue with signed-URL previews |
| BeeNow feed | Missing | Tabs, feed, player, honest empty state |
| Events page | Static "2024" samples | Out of Phase 1 scope. Mark the samples as preview-only (decision H6) |
| Business directory, follows, approvals, users, audit log | Real, with RLS | Keep |
| Build / publish | Build OK, not published | — |

## B. Homepage layout (mobile 390×844 first)

```text
Header + logo (+ holiday ticker in holiday windows)   ~130px (+28)
SPLASH ADS  16:9 image 358x201 + dots                 ~240px
  overlay: [Sponsored] or [Bee App] chip, 1-line title, CTA pill, share
BeeNow heading + tabs  For You | Businesses | Events  ~52px
BeeNow feed (first card ~330px visible above fold)
Bottom nav  Home | BeeNow | Events | Business | Profile  64px + safe area
```

- **Gestures:** the splash sets `touch-action: pan-y`, so a horizontal swipe changes the ad and a vertical drag scrolls the page.
- On Home, BeeNow is a normal list of posters. Tapping one opens `/beenow`, which is full-height with vertical snap, one clip per screen. Back returns to Home.
- I don't recommend a snapping feed inside Home. It fights the carousel on iOS Safari.
- **Tablet/desktop:** the splash goes in a centered max-w-3xl column. BeeNow becomes a 2–3 column poster grid, and the player is a centered 9:16 view with ↑/↓ keys.
- Removed from Home but kept in the code: GreetingBanner, the category grid, CreatePost/Explore, the sponsored and featured widgets, and the in-memory posts. Shop moves to the menu, keeping the "E-commerce" label.

## C. Revised sequence (critique of the proposed order)

I agree with your order, with one change: **video storage (3) must come before any public BeeNow cards. Analytics (2) comes before selling ads, and it can run alongside 3.** The checkpoints depend on each other like this:

- Checkpoint 1 (layout and preview mode) has no dependencies.
- Checkpoint 2a (campaigns) needs a storage bucket for ad creatives.
- Checkpoint 2b (tracking and dashboard) needs 2a.
- Checkpoint 3 (video storage and moderation) needs its own buckets.
- Checkpoint 4 (feed and player) needs 3.

Analytics are split into two short build turns, 2a and 2b, because one big turn is risky. **No paid campaign is accepted until 2b passes every metrics test in section G.**

## D. Preview / demo mode (checkpoint 1)

- **When it's on:** demo content shows only when `import.meta.env.DEV` is true, **or** a signed-in admin turns on a "Design preview" toggle, saved in sessionStorage. It never shows for guests, regular users or on the published site.
- **How demo content is marked:**
  - Each sample has a striped "DEMO — not a real listing" chip. The current Splash creatives get the same treatment.
  - Sample BeeNow cards use posters only, from local assets, with no business names and CTAs disabled ("Demo").
  - Sample clips are never mixed into the real feed hook. They come from `src/lib/demoContent.ts` and are injected only by `usePreviewMode()`.
- **Demo traffic never reaches the database.** Analytics calls exit early in preview mode, so no events are recorded for demo inventory.
- **Public with no data:**
  - Splash shows one **house ad** ("Advertise on Bee App", chip "Bee App" — not "Sponsored").
  - BeeNow shows the bee mascot with "BeeNow is warming up". Approved businesses also see an "Upload your first video" button.

## E. Splash Ads — mechanics and analytics spec (Phase 1, required)

**Ad types:**
- `paid`: the chip reads "Sponsored · {advertiser}". These are billable.
- `house`: the chip reads "Bee App". Tracked, but excluded from billable reports.
- `test`: shown only in preview or with `?adtest=<token>` to admins. Stored with `env='test'` and excluded from billable reports.

**Rotation:**
- Active campaigns (now between start and end, Nassau time; status active; creative approved) are ordered by `priority` and then shuffled with a daily seed.
- Maximum of 8 slides.
- Rotates every 6 s, pauses on touch, hover, an off-screen carousel or a hidden tab, and stops under reduced motion.

**Viewable impression** (proposed IAB-style threshold, adjustable in one constant):
- The slide is the active carousel slide, **and** ≥50% of the carousel is in the viewport (IntersectionObserver, threshold 0.5), **and** `document.visibilityState === 'visible'`, **and** all of this holds continuously for **1000 ms**.
- The timer resets if the user swipes away, scrolls the ad out of view, switches tabs, or the slide changes.

**Deduplication:**
- At most 1 impression per ad per session per 30-minute window. A session is an anonymous random ID in sessionStorage, regenerated per browser tab session.
- A reload inside the same tab session does not add a second impression.
- A new tab or a different device counts as a new session. The report will be labeled "viewable impressions (session-deduplicated)", not "unique people".

**Clicks:**
- Counted on CTA tap only, never on swipe or share.
- At most 1 click per ad per session per 30 minutes. Extra clicks are ignored server-side.
- A click without a recorded viewable impression in the last 30 minutes is stored as `flagged=true` and excluded from CTR.
- The link opens in a new tab with `rel="noopener sponsored"`. The click is recorded with `fetch` keepalive or `sendBeacon` so it isn't lost when leaving the page.

**Other events:**
- `share` (the share dialog already exists) is tracked.
- `profile_tap` is tracked only when the CTA links to an in-app business page.
- No conversion or video-view counts until those features are actually built.

**CTR:** clicks ÷ viewable impressions, shown as "—" when impressions are 0.

**Bots and abuse, honestly:**
- Server checks:
  - The ad must be active and of the stated type.
  - Rate limit of 60 events per session per hour.
  - Each event carries a client-generated UUID (idempotency key).
  - Requests whose user-agent matches known bots are dropped.
- Perfect bot detection is not possible. Reports will state "filtered with basic rules".

**Privacy:**
- Stored: event type, ad ID, campaign ID, anonymous session hash, timestamp, optional island (only if the user chose one in the app), device class (mobile/tablet/desktop).
- **Not stored:** IP address, precise location, user ID, or the full user-agent.
- Raw events are kept 13 months. Daily totals are kept indefinitely.

**Dashboard (admin, Checkpoint 2b):**
- Tiles: impressions, clicks, CTR, active campaigns.
- Filters: advertiser, campaign, date range (today, 7 days, 30 days, month, custom), and type (paid by default; house and test available as separate toggles).
- A daily trend chart from real data. It shows "No data yet" when there is none, never a placeholder chart.
- Top campaigns table and CSV export.
- All times in America/Nassau.

**Advertiser read-only view:** planned for Checkpoint 2c (after Phase 1). An advertiser linked to an approved business sees only their own campaigns' daily totals.

**Campaign flow (admin):**
1. Create the advertiser (optionally link it to an approved business).
2. Create the campaign: name, type, start/end, priority.
3. Upload the creative: 1920×1080, WebP, under 400 KB, title up to 40 characters, CTA label up to 18 characters, https CTA URL or an in-app business page.
4. Preview it with the test token.
5. Activate it.
- **Business-ops note:** there are no payments in the app. Invoicing is handled manually outside the app, and nothing in the app implies it.

**Go-live rule:**
- Tracking is switched on in production at the end of Checkpoint 2b, only after the tests in G pass using `test` campaigns.
- Before go-live, the existing house ad starts collecting real but non-billable data, which proves the pipeline works.

## F. Database and storage proposal (sketches, NOT executed)

All changes are additive. Existing tables and users are untouched.

```sql
-- enums
create type ad_kind as enum ('paid','house','test');
create type campaign_status as enum ('draft','active','paused','ended');
create type ad_event_type as enum ('impression','click','share','profile_tap');
create type video_status as enum ('pending','approved','rejected');

create table public.advertisers (id uuid pk, name text not null, business_id uuid null references public.profiles(id), contact_email text, created_at timestamptz default now());
create table public.ad_campaigns (id uuid pk, advertiser_id uuid null references advertisers, name text, kind ad_kind not null, status campaign_status default 'draft', starts_at timestamptz not null, ends_at timestamptz not null, priority int default 0, placement text default 'home_splash', created_by uuid, created_at, updated_at);
create table public.ad_creatives (id uuid pk, campaign_id uuid references ad_campaigns, image_path text not null, title text check (char_length(title)<=40), cta_label text check (char_length(cta_label)<=18), cta_url text, cta_business_id uuid null, approved boolean default false);
create table public.ad_events (id uuid pk /* client idempotency key */, event_type ad_event_type, campaign_id uuid, creative_id uuid, kind ad_kind, env text check (env in ('prod','test')), session_hash text, island text null, device text, flagged boolean default false, created_at timestamptz default now());
create unique index on ad_events (campaign_id, session_hash, event_type, date_trunc('hour', created_at)); -- coarse server dedup backstop
create table public.ad_daily_stats (day date, campaign_id uuid, kind ad_kind, env text, impressions int, clicks int, flagged_clicks int, shares int, profile_taps int, primary key(day,campaign_id,env));
create table public.advertiser_members (advertiser_id uuid, user_id uuid, primary key(advertiser_id,user_id)); -- for 2c

create table public.videos (id uuid pk, owner_id uuid not null, type text check (type in ('business','event')), title text, description text, pending_path text, public_path text null, poster_path text, duration_s int check (duration_s between 1 and 90), link_business_id uuid null, link_url text null, event_ends_at timestamptz null, rights_confirmed boolean not null default false, status video_status default 'pending', rejection_reason text, created_at, approved_at, approved_by uuid);
alter table public.video_moderation add column video_uuid uuid null; comment on column public.video_moderation.video_id is 'DEPRECATED for new rows: use video_uuid';
```

**RLS and grants:**
- `ad_campaigns` and `ad_creatives`: anyone can select active, approved rows in the current window where kind is paid or house (`select` granted to anon). Only admins can write.
- `ad_events`: **no insert grant to anon or authenticated.** Only the edge function (service role) writes. Only admins can select.
- `ad_daily_stats`: admins can select all. In 2c, members can select rows for their own advertiser through `advertiser_members`. There is no public access.
- `advertisers` and `advertiser_members`: admins only (members can read their own row).
- `videos`:
  - The public can select rows where status = 'approved' and the event hasn't ended.
  - The owner can select their own rows.
  - The owner can insert only if they are an approved business. A trigger forces status = 'pending' and requires `rights_confirmed = true`.
  - The owner cannot update the status.
  - Admins have full access.

**Edge function `track-ad-event`:**
- Validates with zod: UUID, type, campaign_id, creative_id, session_hash (32 hex characters), island (from the allowed list), device.
- Re-checks against the database that the campaign is active and matches its kind.
- Applies the rate limit by counting the session's events in the last hour, and drops bot user-agents.
- Inserts with `on conflict do nothing`.
- Returns 204.
- `env='test'` only when it receives a valid admin JWT plus the test token.
- **Daily roll-up:** a scheduled function (pg_cron) runs nightly and refreshes the last 2 days into `ad_daily_stats`. The dashboard reads the daily table for past days and live `ad_events` for today.

**Storage:**
- `ad-creatives` (public read): only admins can write, using `has_role` on `storage.objects`.
- `beenow-pending` (**private**): the owner writes to `{uid}/…`. Only admins read, through signed URLs that expire in 10 minutes.
- `beenow-public` (public read): files are written only by the `approve-video` edge function (service role). It copies the approved object there and deletes or keeps the pending one. On rejection, the pending file is deleted after 30 days.
- Pending and rejected media are never publicly reachable.
- Rights: the uploader ticks "I own or have permission for all footage and music, and people shown agreed to appear." The time of consent is stored.

**Rollback:** turn off the UI with the preview flag or a route, disable the edge function, and comment the tables DEPRECATED. Nothing is dropped. Existing data is unaffected.

## G. Checkpoints, acceptance tests and QA

**1. Layout and preview mode (no database)**
- Files:
  - Modify `Index.tsx`, `AdSplash.tsx` (compact variant, Sponsored/House/Demo chips, hide metrics), `MobileBottomNav.tsx`, `Sidebar.tsx`, `App.tsx`.
  - Add `beenow/BeeNowSection.tsx`, `beenow/BeeNowCard.tsx`, `pages/BeeNow.tsx`, `lib/beenow.ts` (returns [] for now), `lib/demoContent.ts`, `hooks/usePreviewMode.ts`.
  - Admin: add a "Demo data" banner to the AdManagement and AdminVideoReview tabs.
- Done when:
  - A guest sees the house ad and the honest BeeNow empty state.
  - An admin with preview on sees the samples, every one marked DEMO.
  - The logo and ticker are pixel-identical.
  - No database calls are added.

**2a. Campaigns:** migration for the advertisers, campaigns and creatives tables plus the `ad-creatives` bucket. `AdManagement.tsx` is rewired to real CRUD and AdSplash reads active creatives. Done when an admin creates a test campaign, it shows and expires on schedule (Nassau), and the house ad is the fallback.

**2b. Tracking and dashboard:** `ad_events`, `ad_daily_stats`, the `track-ad-event` edge function, the cron roll-up, a new `useAdTracking.ts` (replacing `useAdAnalytics.ts` usage) and a new `admin/AdAnalyticsDashboard.tsx`. **Metrics tests (all must pass):**
1. An ad that is active and visible for 1 s gives exactly 1 impression. At 0.9 s, or as an inactive slide, it gives 0.
2. Swiping away and back within 30 minutes still counts once.
3. One CTA tap gives +1 click and opens the correct URL. Five rapid taps still give +1.
4. Reloading in the same tab gives no new impression. A new device counts separately.
5. An expired or paused campaign creates no events; the server rejects them.
6. House and test events never appear in the default (paid) report.
7. Direct REST inserts into `ad_events` as anon or authenticated are denied.
8. An advertiser cannot read another advertiser's data. This is tested in 2c; in 2b, only admins can read.
9. The totals for a date range match the raw events, and Nassau day boundaries are correct across DST.
10. The dashboard shows the same numbers after a refresh and on another device.
11. CTR shows "—" when there are 0 impressions.

**3. Video storage and moderation:** migration for videos plus `video_uuid`, the two buckets, rewired `VideoUploadForm.tsx` (real upload, rights checkbox, duration ≤90 s, 10–20 s recommended), `AdminVideoReview.tsx` (real queue with signed-URL preview, mock list moved to preview only) and an `approve-video` edge function. Done when:
- A pending clip URL can't be opened as a guest.
- Approving a clip copies it to public storage.
- Rejecting a clip saves the reason and nothing goes public.

**4. Feed and player:** `useBeeNowFeed(tab)` reads approved videos. Tabs:
- For You: all approved videos, newest first, no two from the same owner in a row.
- Businesses: type business.
- Events: type event with `event_ends_at` in the future.

The player (`BeeNowPlayer.tsx`):
- Plays muted, `playsInline`, `preload="none"` with a poster.
- Plays only when ≥60% visible, pauses when off-screen, and keeps at most 2 video elements in memory.
- 44px mute and pause buttons, share, and Follow (real, existing).
- Save is deferred.
- The CTA goes to the business profile or the event link.

**Cross-device QA (every checkpoint):**
- iPhone Safari at 390×844: inline playback, safe area, horizontal swipe doesn't trigger browser back or page scroll.
- Android Chrome at 360×800 and 412×915: back gesture, data saver.
- iPad at 768px.
- Desktop at 1280px (Chrome and Safari).
- Slow 3G throttle.
- VoiceOver and TalkBack.
- Reduced motion.
- Checkpoint 2b only: the test suite above, using `test` campaigns on preview.

**Rollback per checkpoint:** each checkpoint is a separate build turn that can be reverted from History. Database objects are additive and get DEPRECATED comments if retired.

## H. Risks, costs and owner decisions

1. **Empty public launch:** you approve house ad + empty BeeNow over samples? (Recommended.)
2. **Dedup window:** 30 min per ad per session. Do you accept this definition for billing language?
3. **Viewability threshold:** 50% for 1 s. Do you accept it, or prefer 2 s?
4. **Nav:** Home, BeeNow, Events, Business, Profile, with E-commerce in the menu. This touches the memory rule that preserves the "E-commerce" label. Please confirm.
5. **Remove GreetingBanner from Home** (it overlaps with the ticker). Please confirm.
6. **Events page samples ("2024"):** hide them behind preview mode in Checkpoint 1? (Recommended.)
7. **Retention:** raw events kept 13 months. OK?
8. **Costs:** video storage and bandwidth grow with views (10–20 s at 720p is about 2–5 MB per view). Recommend 720p max, posters first, and no autoplay on cellular where detectable. Ad tracking adds 1–3 small requests per view, which is negligible.
9. **Admin workload:** reviewing videos and ad creatives takes about 1–2 minutes each.
10. **Data integrity:** the current mock ads, mock video queue, sample clip and fake metrics must never be shown as real. The plan isolates all of them.
11. **Content supply:** the feed needs about 20–30 approved clips before announcing.
12. **Email notices:** still blocked by the missing sender domain.
13. **Figma:** it can't be fetched from here, so the written specs above are the reference. Its placeholder B mark won't be used.

## I. First authorized build prompt (Checkpoint 1 only)

> Checkpoint 1, layout and preview mode only. Do not change the database, storage, auth, edge functions, Header, Logo, LogoImage, HolidayTicker, logo files or ticker CSS.
> 1. Add `src/hooks/usePreviewMode.ts`: true if `import.meta.env.DEV`, or if an admin (useAuth().isAdmin) enabled `sessionStorage['bee_preview']='1'`. Add an admin-only "Design preview" toggle in the Admin page header.
> 2. Add `src/lib/demoContent.ts` (move the current AdSplash sample ads there, plus 4 poster-only BeeNow samples using local assets, all flagged `demo:true`). Add `src/lib/beenow.ts` with `useBeeNowFeed(tab)` returning [].
> 3. AdSplash: add a `variant="compact"` (16:9 aspect-video image, ~240px total on 390px, overlay chip, 1-line title, CTA pill, share; description hidden below md). Use `touch-action: pan-y` and pause under reduced motion. Hide AdPerformanceMetrics. Data is demo ads only when preview is on (chip "DEMO — not a real listing", CTA disabled); otherwise a single house ad "Advertise on Bee App" with chip "Bee App" linking to mailto. Remove the console analytics calls from the render path.
> 4. Index.tsx order: Header, AdSplash compact, BeeNowSection. Stop rendering GreetingBanner, BusinessCategorySection, SponsoredVideoWidget, CreatePost, FeaturedVideoAdWidget and PostList on Home (keep the files).
> 5. BeeNowSection plus the /beenow page: heading, shadcn Tabs (For You | Businesses | Events, 44px), honest bee empty state per tab, "Upload your first video" for approved businesses; demo posters only in preview mode, marked DEMO.
> 6. MobileBottomNav: Home, BeeNow, Events, Business, Profile. Sidebar: add BeeNow; keep E-commerce. Events page: show the sample events only in preview mode, otherwise an empty state.
> 7. Add a "Demo data" banner to the AdManagement and AdminVideoReview tabs. Use semantic tokens only. Verify with screenshots as a guest and with preview on, at 390×844 and 1280px.

## J. Status
No changes made, apart from updating this planning document. Please approve the plan and answer H1–H7 before Checkpoint 1 is built.
