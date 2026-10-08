# Bee App Bahamas — Restructure Plan (Events + Local Business Discovery)

Plan only. Nothing here is executed until approved, and each stage is built in its own turn.

## 0. What we keep no matter what
Approved business accounts, users, sign-in, follows, admin and moderation tools, audit log, the bee mascot and logo files (exactly as they are), the holiday ticker and its date windows, and the backend. Nothing gets deleted. Old screens are hidden or redirected, not removed.

## 1. Audit: keep / rework / defer

Checked in this turn: the data calls in `src`, the sample data in `Events.tsx`, the edge functions (`admin-users`, `mcp`) and the table list.

| Area | Current state | Decision |
|---|---|---|
| `/` Index.tsx | AdSplash first, then category buttons, sponsored videos, and a post feed held only in React state (`useState`), so posts are lost on reload | **Rework** into "What's Buzzing". Move AdSplash below the organic content, shrink it to one labeled card, remove CreatePost and the post feed |
| `/events` Events.tsx | Hard-coded sample videos ("…Festival 2024", example links) | **Rework**: read real events from the database and show an empty state when there are none. Delete the sample array |
| `/businesses` Businesses.tsx | Reads approved businesses from `profiles`; has a category grid | **Keep**, move it under `/discover`, and redirect `/businesses` there |
| `/ecommerce` Ecommerce.tsx | "Coming Soon" page | **Defer**: remove it from the nav but keep the page reachable from the footer. The memory rule "E-commerce label preserved" still applies, so the label is not renamed. Needs your confirmation (see section 6) |
| `/upload-video`, VideoUpload, AdminVideoReview, video_moderation | Business videos limited to 90 seconds | **Keep**, and reuse them as optional event/business preview clips |
| `/admin` (BusinessApprovals, UserManagement, AdManagement, GreetingManagement) | Works | **Keep**. Add tabs for Events, Spotlight, Sponsors and Stale info |
| `/profile`, `/settings`, ProfileEditDialog, useMyProfile | Works | **Keep**. Add "My business" and "My events" entries |
| BusinessProfileCard, useBusinessFollow | Works | **Keep**, and add a business detail page (`/b/:id`) |
| MobileBottomNav / Sidebar | Home, Business, Events, Shop, Profile | **Rework** to Home, Events, Discover, Saved, Profile |
| SponsoredVideoWidget, FeaturedVideoAdWidget, AdSplash | Promo content above the feed | **Rework**: move below the organic content, add a clear "Sponsored" label, one placement at a time |
| TrendingSection, RightSidebar | Not mounted, or barely used | **Defer** |
| HolidayTicker, Header, Logo | Works | **Keep, unchanged** |
| Tables: profiles, user_roles, business_follows, admin_actions, video_moderation | RLS is on | **Keep**, add columns only (section 3) |
| Missing | No tables yet for events, saved items, spotlight, sponsors or business hours | **Add** (section 3) |

## 2. Page map and component hierarchy

```text
/                 Home "What's Buzzing"
  HomeTopBar: IslandPicker (All, New Providence, Grand Bahama, Abaco, Eleuthera, Exuma, Andros, Bimini, Other) + SearchBar
  QuickChips: Today | This Weekend | New Businesses
  TodayRail (EventCard x N, empty state)
  WeekendRail
  NewBusinessSpotlight (rotating, equal exposure)
  ExploreByCategory (7 segments)
  SponsoredSlot (labeled "Sponsored", 1 card, lazy)
/events           Tabs: Today / This Weekend / Upcoming; filters: island, date, category
/e/:slug          EventDetail: cover, title, date/time (Bahamas time), venue, map link, organizer, booking link, Save, Share, optional clip
/discover         Spotlight, categories, BeeNow previews (optional, tap to play)
/b/:id            BusinessDetail: logo, open-now, weekly hours incl. Sunday, phone/WhatsApp/socials, map, Follow, optional clip
/saved            Saved events + followed businesses (sign-in required; guests see a sign-in prompt)
/profile          + "My business", "My events" (owners) -> /owner/events, /owner/events/new
/admin            + Events queue, Spotlight, Sponsors, Stale info
```

Shared UI: EventCard, BusinessCard, LazyMedia (poster first, video loads only on tap; muted autoplay only when a "data saver" check passes), EmptyState (bee mascot), FilterSheet (bottom sheet). Touch targets are at least 44px. Every card links to a detail page.

## 3. Database changes (additive only, not run yet)

New enums: `event_status` (draft, pending, approved, rejected, archived) and `island`.

**events**
- Columns: id, organizer_id uuid (owner), business_id uuid null → profiles, title, slug unique, description, category, island, venue_name, venue_address, lat/lng null, starts_at timestamptz, ends_at timestamptz, timezone text default 'America/Nassau', cover_url, video_url null (90 seconds or less), booking_url, status default 'pending', rejection_reason, published_at, expires_at, is_sponsored bool default false, sponsor_label text, last_verified_at, created_at, updated_at.
- Validation trigger: ends_at ≥ starts_at, booking_url must be https, and expires_at defaults to ends_at + 1 day.
- RLS:
  - anon and signed-in users can read rows where status='approved' and coalesce(expires_at, ends_at) > now().
  - The owner can read and insert their own rows (organizer_id = auth.uid()). On insert the status is forced to 'pending' by a trigger.
  - The owner can update their own rows only while they are pending or rejected. Any owner edit sends the event back to pending.
  - Admins (has_role) have full access.
- Grants: select to anon; select, insert, update to authenticated; all to service_role.

**saved_events**
- Columns: user_id, event_id, created_at.
- Unique on (user_id, event_id).
- RLS: users can select, insert and delete only their own rows. No anon access.

**business_hours**
- Columns: business_id → profiles, weekday 0–6 (Sunday = 0), opens time, closes time, closed bool.
- Unique on (business_id, weekday).
- RLS: public read for approved businesses. The owner (business_id = auth.uid()) can write. Admins have full access.

**spotlights**
- Columns: id, business_id, starts_on date, ends_on date, created_by.
- RLS: public read of active rows. Only admins can write.

**sponsored_placements**
- Columns: id, slot, target_type, target_id, label default 'Sponsored', starts_at, ends_at, active.
- RLS: public read of active rows. Only admins can write.

**profiles (new nullable columns)**
- New columns: island, whatsapp, website, instagram, facebook, description, last_verified_at.
- Update `protect_profile_columns` so users can't change last_verified_at themselves.

**Other rules**
- Open-now is calculated in the app using `Intl` with timeZone 'America/Nassau'. Nothing is stored for it.
- Spotlight rotation: active spotlights are shuffled with a seed based on the date, so every business gets equal exposure each day. No ranking algorithm.

**Backfill:** set profiles.island = null (owners fill it in). There are no events to backfill, and sample data is never inserted.

**Rollback:** every new table and column is unused by existing code. Rolling back means turning off the UI and adding a `COMMENT ... DEPRECATED`. Nothing is dropped.

## 4. Stages

**Stage 1 — Real events + new navigation (read side)**
- Acceptance criteria:
  - The events table and saved_events exist.
  - Events page and EventDetail read only approved, unexpired events, with a proper empty state. There is no sample data anywhere.
  - Bottom nav shows Home, Events, Discover, Saved, Profile. `/businesses` redirects to `/discover`.
  - Home leads with the island picker, search, chips, the Today/Weekend rails and the Spotlight placeholder (approved businesses, newest first). The sponsored widgets move below and are labeled.
  - An admin can approve or reject events, with the reason saved and logged in admin_actions.
  - Owners and admins can create events through a simple form.

**Stage 2 — Business detail + spotlight + saved**
- Acceptance criteria:
  - `/b/:id` shows hours including Sunday and a correct open/closed status in Nassau time (also checked from a device set to a different timezone).
  - WhatsApp opens wa.me with a prefilled message.
  - The map opens the device's maps app.
  - Spotlight windows and rotation work.
  - Saved page works.

**Stage 3 — Admin ops + sponsors + stale info + optional clips**
- Acceptance criteria:
  - Sponsors tab with a date window and a forced "Sponsored" label.
  - Stale tab lists businesses or events whose last_verified_at is older than 90 days, with a one-tap "Verified" action.
  - Events auto-archive after they expire (filtered out by the query).
  - Optional 10–20 second clips are poster-first and tap-to-play with sound off, with a caption.

**Manual QA for every stage:**
- Devices: iPhone Safari (notch and safe area), Android Chrome (back button), and a desktop browser at 390px and 1280px widths.
- Checks:
  - Browse as a guest, sign in, and save.
  - All tap targets work, and the screen-reader labels make sense.
  - Reduced-motion setting is respected.
  - Slow 3G throttle: the first screen is usable without media, and videos don't load until tapped.
  - Holiday ticker is unchanged.

## 5. Stage 1 — exact build instructions

1. **Migration `create_events`:**
   - Create the enums, the events table, the validation and force-pending triggers (SECURITY DEFINER, search_path=public), saved_events, the indexes (status, starts_at, island), and the grants, then enable RLS and add the policies, all as in section 3.
   - Add `COMMENT ON` for the deferred features.
2. **`src/lib/events.ts`:**
   - Types plus `todayRange()`, `weekendRange()` (Fri 17:00 – Sun 23:59 Nassau) and `formatEventTime()` using America/Nassau.
   - Hooks `useEvents({range, island, category})`, `useEvent(slug)`, `useSaveEvent`, using react-query with a staleTime of 60 seconds.
3. **Components:** `EventCard`, `EventRail`, `IslandPicker` (value saved in localStorage), `QuickChips`, `EmptyState`.
4. **Events page:** rewrite `src/pages/Events.tsx` with tabs (Today / This Weekend / Upcoming), a filter sheet, and real data only. Delete the sample array.
5. **Event detail:** new `src/pages/EventDetail.tsx` at `/e/:slug`. Booking link opens with `rel="noopener noreferrer"`. Show the "Add to calendar" .ics download only if it's simple to do. Add SEOHead.
6. **Event form:** new `src/pages/OwnerEventForm.tsx` at `/owner/events/new`, protected, validated with zod (title ≤120, description ≤2000, https URLs). Cover upload uses the existing image-optimization util. Show the message "Submitted for review".
7. **Admin:** new `src/components/admin/EventApprovals.tsx` tab in Admin.tsx that reuses RejectionReasonDialog and admin_actions.
8. **Home:** in `Index.tsx`:
   - Remove CreatePost and PostList.
   - New order: Header (with ticker) → IslandPicker + Search → QuickChips → Today rail → Weekend rail → New Businesses (approved profiles, newest 8) → BusinessCategorySection → one labeled SponsoredVideoWidget.
   - AdSplash is removed from Home. The component file stays.
9. **Navigation:**
   - Update MobileBottomNav and Sidebar to Home, Events, Discover (`/discover` → Businesses page), Saved (`/saved`, simple list), Profile.
   - Add `<Navigate>` from `/businesses` to `/discover`.
   - E-commerce stays as a footer link.
10. **Records:** update `AGENTS.md` (events read path and timezone rule) and save the new positioning to memory.

## 6. Risks and unknowns
- **Content cold start:** with no fabricated events, the app will start empty. You'd need to seed real events by hand (an admin enters them from posters, Facebook and the tourism calendar) or recruit 10–20 organizers before launch. An honest empty state plus a "Submit an event" call to action is essential.
- **Admin workload:** every event needs review. Estimate 2–5 minutes each. Options: auto-approve trusted organizers later, and a queue that sorts by start date so urgent ones come first.
- **Stale information:** hours and events go out of date. The 90-day verify prompt and auto-expiry help.
- **Memory conflict:** "E-commerce label strictly preserved" — the plan keeps the label but takes it out of the main nav. Please confirm.
- **Timezone and DST:** Nassau observes DST, so always use the IANA zone, never a fixed offset.
- **Video:** consent/rights checkbox on upload, captions, no autoplay with sound, 90-second cap kept (10–20 seconds recommended).
- **Privacy and safety:** collect only an organizer contact. Booking links are external and https-only. Add a report button (stage 3). No exact private addresses for home-based businesses unless the owner opts in.
- **Email notices:** still waiting on a sender domain.
- **Maps:** external links only in the MVP. An embedded map would need the Google Maps connection and is deferred.
- **Out of scope:** AI concierge, payments, rewards, e-commerce, ranking algorithms.
