# Bee App Bahamas — Product Strategy and Phased Roadmap (planning only)

Dual goal: (1) help Bahamians and visitors discover local businesses, events and tours; (2) earn advertising revenue from businesses. Nothing in this plan is approved for building. Each phase needs its own approval.

## 1. Where things stand today (checked this turn)

Database tables that exist: profiles, user_roles, business_follows, video_moderation, admin_actions, plus two permission backups dated 2026-10-11. Admin functions that exist: admin_review_business, admin_set_role, admin_set_suspended, sync_business_role, has_role, protect_profile_columns. Backend functions: admin-users, mcp.

| Area | Status |
|---|---|
| Homepage layout (header, compact splash, BeeNow tabs) | Built, browser-tested |
| Admin-only design preview + /design-demo (preview host only) | Built, browser-tested |
| Fonts served locally, holiday ticker, logo | Built |
| Sign-up / sign-in, regular vs business choice | Built |
| Business approval locked to admin (Checkpoint 2.1) | Database functions present; approval/user screens NOT clicked through in a browser. Treat as unverified until staged tests pass. |
| Suspension, hiding suspended businesses | Built in database; browser check unverified |
| Business directory with real listings, follows | Built |
| Rejection reason stored | Built; email delivery NOT working (no sending domain) |
| Splash ads | Hard-coded house ad + demo only. No ads table, no real tracking |
| Ad analytics | Memory/console only. Not usable for selling |
| BeeNow video upload / storage / feed | Not built (upload only logs; feed returns empty) |
| Events/tours | Public empty state; samples only in preview. No events table |
| Payments (Stripe) | Not built |
| Published site / custom domain | Not published, no domain |

## 2. Product principles
- Honest first: no fake listings, views, ratings or "sponsored" claims. Empty states stay honest until real content exists.
- Keep the existing redesign and AGENTS.md rules unchanged; new work slots into the current homepage order.
- Business powers only after admin approval (Checkpoint 2.1 model).
- Mobile-first, low data use: posters first, video on tap, 90-second cap.
- Sell ads only once impressions can be counted reliably.

## 3. Phases

### Phase 0 — Verify and stabilise (week 1–2)
- Run the Checkpoint 2.1 staged test matrix in the browser: sign-up as business, admin approve/reject/suspend, name/category change reverts to pending, direct-API bypass attempts refused, suspended listing hidden.
- Fix any findings; confirm rollback copy of permissions is still valid.
- Set up email sending domain; deliver approval/rejection emails.
- Security scan, accessibility pass (keyboard, screen reader, 44px targets).
- Gate: all tests pass, zero critical security findings.

### Phase 1 — Consumer discovery MVP (week 2–6)
- Approved business profiles: photo, description, contact, WhatsApp button, island/category filters, search.
- Events and tours: new events table owned by approved businesses, admin moderation, date/time in Nassau time, auto-expire past events, "Tonight and This Weekend" list.
- Publish + custom domain, basic SEO (titles, sitemap, Google Business guidance for listed businesses).
- Gate: at least ~20 approved real businesses and ~10 real upcoming events before public promotion.

### Phase 2 — BeeNow short video (week 5–10)
- Upload by approved businesses only; private pending storage, admin review via short-lived links, approved copies public; rejected never public.
- 90s cap, size limit, poster image, sound off by default, play on tap, stop offscreen.
- Social media "imports": link-out or official embeds only (TikTok/Instagram/YouTube embed APIs), or owner uploads their own file with a confirmation they own the rights. No scraping or re-hosting others' clips. Report/takedown button and admin removal.
- Follow/save/share for real items only.
- Gate: moderation turnaround under 24h, no unreviewed video ever public.

### Phase 3 — Splash Ads and analytics (week 8–12)
- Tables: advertisers, campaigns, creatives, ad events, daily stats (sketched in the earlier analytics plan).
- Viewable impression = active slide, at least 50% visible for 1 second; one per ad per session per 30 minutes; clicks only on the call-to-action; server-checked events with rate limits; no raw IP; house/test separated from paid.
- Admin dashboard; advertiser sees only their own numbers; CSV export.
- Run 2–4 weeks of house ads to validate counts before selling.
- Gate: counts match independent checks within an agreed tolerance.

### Phase 4 — Payments and self-serve ads (after 90 days)
- Start with manual invoicing (bank transfer) for first advertisers; add Stripe only after demand is proven and Bahamas account eligibility is confirmed.
- Self-serve booking of splash slots, receipts, refunds.

## 4. Monetization experiments (no revenue promises)
- Founding-advertiser offer: a few weeks of free or discounted splash slots to 5–10 businesses in exchange for feedback.
- Flat weekly splash slot price vs per-1,000-impression price; compare uptake.
- Featured listing in a category; event boost before the weekend.
- Measure: number of businesses that pay twice. Pricing decided from real traffic, not projections.

## 5. AI only where it helps
- Moderation assist: flag likely-inappropriate captions/thumbnails for the admin (admin still decides).
- Help businesses write a 2-sentence profile or event description.
- Not used for fake content, fake reviews or auto-approvals.

## 6. Metrics
- Discovery: weekly active visitors, searches, profile views, WhatsApp/contact taps, event detail views.
- Supply: approved businesses, upcoming events, approved videos per week, moderation time.
- Ads: viewable impressions, CTR, advertisers retained.
- Health: page load on mid-range phones, error rate, accessibility issues.

## 7. 30 / 60 / 90 days
- Day 0–30: Phase 0 complete; emails working; business profiles + events table; publish with domain; recruit first businesses personally (WhatsApp, in person).
- Day 31–60: events live; BeeNow upload + moderation; house ads with real tracking running.
- Day 61–90: analytics validated; first paid or founding advertisers on manual invoicing; review metrics and decide on Stripe.

## 8. Dependencies and risks
- Dependencies: email sending domain (owner), custom domain (owner), real businesses willing to join, admin time for moderation, Stripe eligibility for a Bahamas business.
- Risks: empty app at launch (mitigate: do not promote until supply gate met); copyright on imported clips (embeds/own uploads only); moderation load; inflated ad counts (server checks, bot guards); video data cost on mobile; privacy law (Bahamas Data Protection Act — minimal data, privacy policy before launch); Checkpoint 2.1 still unverified in browser.

## Technical notes
- Each phase = separate approved checkpoint, idempotent migrations with RLS and grants, rollback that keeps user data.
- Demo content stays in demoAds/demoContent and never feeds real hooks.
- Storage: private pending bucket, public approved bucket, signed URLs for review.
