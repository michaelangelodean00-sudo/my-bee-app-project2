# Phase 1: Business Discovery, Business Profiles, Events and Tours (plan only)

## 0. Evidence status

| Claim | Status |
|---|---|
| Signup gives only "user"; approval and rejection are atomic and logged; rename or category change sends a business back to review; suspended businesses are hidden | Independently verified in earlier turns (rolled-back test account plus one throwaway account, since deleted) |
| Permission checks: no direct role or log writes, guests blocked from admin tools, preview link accepted, unknown sites refused | Verified by me with read-only checks on Oct 12 |
| Non-admin user refused by the admin tool; admin buttons clicked end to end | UNVERIFIED (only the owner says so) |
| Admin tool sends "null" to unknown websites; the undo document brings back broad permissions | Open gaps from Checkpoint 2.1b; not fixed and not touched by this plan |

## 1. What exists today (read from code and database)

- **Businesses page:** reads `profiles` filtered to approved, business accounts that aren't suspended. It has a category grid with 7 categories and `?category=` filtering. It has no search, no island filter and no profile page of its own.
- **Profile page (`/profile/:id`):** a generic user profile, not a business page.
- **Business details stored today:** name, category, phone, address and avatar on `profiles`. There are no fields for description, hours, island, WhatsApp or social links.
- **Follows:** working, with rules that hide suspended businesses.
- **Events page:** sample items only in admin preview, and an honest empty state for the public. There is no events table.
- **BeeNow and video:** no real uploads yet, so profiles must not show video.
- **Live data:** 0 business accounts and 0 approved businesses. The launch is gated on real businesses signing up.
- **Data exposure:** the public rule returns the whole profile row of approved businesses. That includes `phone` and `address`, which is intended, and `rejection_reason`, which is always empty for approved businesses.

## 2. Minimum viable slice (Stage A, recommended first approval)

The business directory and business profiles. Events and tours come in Stage B.

### A1. Database (migration `business_profile_fields`, additive only)

1. **New table `business_details`:** one row per business, `business_id` linked to `profiles(id)` on delete cascade, plus:
   - `description` (up to 600 characters);
   - `island`, limited to a fixed list (New Providence, Grand Bahama, Abaco, Eleuthera, Exuma, Andros, Bimini, Long Island, Cat Island, Other);
   - `whatsapp` (phone number format checked);
   - `website`, `instagram`, `facebook` (web addresses checked);
   - `hours`, holding Mon–Sun entries with open and close times and a closed flag; the format is checked;
   - `updated_at`.
2. **Permissions on that table:**
   - guests and signed-in users can read;
   - signed-in users can add and edit rows;
   - the admin tools have full access.
3. **Row-level rules on that table:**
   - Anyone can read a row only if the linked profile is an approved, non-suspended business.
   - Owners can read, add and edit only their own row.
   - Admins can read everything.
   - No delete rule: rows go when the account goes.
4. **Search:** add an index for searching names to `profiles` (business name and category) and one to `business_details` (island).
5. **A safe public view** of approved businesses that leaves out `rejection_reason`, `suspended` and `status`. The directory reads from it.
6. **Re-review stays as it is:** name and category live on `profiles`, so the existing check keeps applying. `business_details` edits never affect approval, matching the owner's rule that phone and address edits don't either. Description could be added to re-review later if wanted.

### A2. Frontend

- **`src/lib/bahamasTime.ts`:** works out "Open now", "Closes 6 PM" or "Opens Mon 9 AM" using the `America/Nassau` timezone. It handles overnight hours and returns nothing when no hours are set, so no false "Open" badge appears.
- **`src/hooks/useBusinessDirectory.ts`:** reads the public view joined with details. Search text is debounced at 250ms. It filters by category and island, keeps filters in the page address, and loads 24 at a time.
- **`src/pages/Businesses.tsx`:** adds a search box, an island menu and an "Open now" switch to the existing grid. The truthful empty state ("No businesses match yet") stays.
- **New `src/pages/BusinessProfile.tsx` at `/business/:id`:**
  - shows the photo, name, category, island, description, a 7-day hours table with today highlighted, and the open-now badge;
  - contact buttons: Call, WhatsApp (link opens WhatsApp), Website and social links. Each shows only if it's filled in, and all are at least 44px;
  - the Follow button;
  - no video section until Checkpoint 3;
  - unknown, pending or suspended businesses show "Not found".
- **New `src/components/business/BusinessDetailsForm.tsx`** (opened from ProfileSettings): owners edit description, island, WhatsApp, social links and hours, with a "copy Monday to weekdays" helper. Changing the name or category stays in ProfileEditDialog, and it warns "This will send your business back for review."
- **Links:** directory cards and Trending items point to `/business/:id`.
- **Lazy-loaded route in App.tsx.** Header, homepage order, AdSplash, BeeNow, fonts and the demo pages are not touched.

### A3. Stage A tests

1. A guest sees no pending, rejected or suspended businesses. They also can't read those businesses' details directly through the data connection, by id.
2. An owner can't add or edit details for another business id; the rules check that the id is the owner's own.
3. An owner editing a name or category goes back to pending and loses business permissions, and their profile disappears from the public directory.
4. An owner editing hours or WhatsApp stays approved.
5. Open-now unit cases:
   - 8:59, 9:00 and 17:59;
   - overnight hours from 22:00 to 02:00;
   - a closed day;
   - empty hours;
   - Nassau winter time and summer time.
6. Wrong WhatsApp numbers, web addresses or hours formats are rejected by the database itself, not just the form.
7. Playwright at 390, 360 and 1280: no sideways scroll, keyboard tab order, labelled controls, 44px buttons, and the empty state with 0 businesses.
8. Homepage is unchanged: house ad, then "BeeNow is warming up", in that order. A guest sees no demo content.
9. Build and type check pass.

Test data: one throwaway business account created with owner approval and deleted afterwards. The activity log entries it creates stay.

## 3. Stage B: Events and tours (separate approval)

### Database (migration `events_moderation`)

- **New table `listings`:**
  - `id`, `owner_id` (linked to `profiles`), and `kind` (event or tour);
  - `title`, `description`, `island`, `venue`;
  - `starts_at` and `ends_at` (stored in a standard time format, shown in Nassau time); tours can repeat using a text field for now;
  - `price_text`, `contact_whatsapp`, `link`, `cover_url`;
  - `status` (pending, approved, rejected), `rejection_reason`, `reviewed_by`, `reviewed_at`, and `created_at`.
- **Who can create:** only signed-in users with the business role (derived, so only approved businesses). New listings always start as pending, enforced by a check that runs on save.
- **Owner edits:** owners can edit their own pending or rejected listings. Editing an approved listing sends it back to pending; the same check enforces this.
- **Public visibility:** anyone sees a listing only if it's approved, its end time hasn't passed, and its owner is still an approved, non-suspended business. Expiry is worked out when the page loads, with no scheduled cleanup job.
- **Admin review:** new tool `admin_review_listing(_id, _decision, _reason)`, with the same safe setup, admin check, row lock and activity log entry.
- **Cover images:** new storage folder `listing-covers` that anyone can read; owners can upload only into their own folder; 2MB limit; images only.

### Frontend

- **Events.tsx:** reads approved, upcoming listings, with Events and Tours tabs and filters for island and date (Today, This weekend, Later). Samples in admin preview and the public empty state stay as they are.
- **Business owners:** a "Post an event or tour" form.
- **Admin:** an "Events" review tab built like BusinessApprovals.
- **Business profile:** shows that business's upcoming listings.

### Stage B tests

- Pending, rejected and expired listings are invisible to guests through the data connection.
- Non-business users can't post.
- Owners can't approve their own listings.
- Suspending a business hides its listings.
- Edits to approved listings go back to review.
- Every review creates an activity log entry.
- Time-zone edge cases around midnight Nassau time.

## 4. Launch gates (before publishing Phase 1)

1. Fix the Checkpoint 2.1b gaps: the "null" reply to unknown websites, and the undo document.
2. Non-admin refusal and the admin buttons verified end to end with a throwaway account.
3. Security scan with no high findings; database lint clean.
4. At least 10 real approved businesses (the owner's choice of number). Until then, empty states stay truthful.
5. Guests see no demo content on any public address; the demo pages show Not Found on the published site.
6. Approval and rejection emails work, or the owner accepts going without them; this needs a sending email address set up.

## 5. Rollback

- **Stage A:** drop the details form and profile page routes, and point the directory back at `profiles`. The new table and view can stay in place unused, so no data is lost. To remove them fully, a written undo would drop the policies, then the view, then the table. That step is destructive and needs a separate approval.
- **Stage B:** same pattern. Hide the Events tab and stop calling the listings tables; keep the data.
- **Nothing touches:** `user_roles`, the business-permission sync, admin tools, the activity log, or the ad and demo safeguards.

## 6. Dependencies and open decisions

- **Island list:** confirm it.
- **Re-review on description edits:** recommended no.
- **Tours:** do repeating tours need structured schedules, or is free text fine for now? Recommended: free text.
- **Number of businesses for the launch gate:** pick one.
- **Video on profiles:** blocked until the Checkpoint 3 upload and moderation pipeline exists.

## Technical details

- Migrations go through the database migration tool and are additive only. Every new public table gets its permissions set before the row-level rules are turned on.
- New tools use a locked setup, check `auth.uid()`, and are made available only to signed-in users.
- Time zone: Nassau times are worked out with the browser's built-in date tools; no new library.
- Performance: directory images lazy-load, pages load 24 at a time, search is debounced, and the profile page is code-split.
