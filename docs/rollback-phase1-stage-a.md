# Rollback: Phase 1 Stage A (business details)

Non-destructive: no user, profile, role or follow data changes.

1. Frontend: restore Businesses.tsx, BusinessProfileCard.tsx, ProfileSettings.tsx, App.tsx from version history before Stage A; remove BusinessProfile.tsx, BusinessDetailsForm.tsx, bahamasTime.ts, businessLinks.ts.
2. Database: leave `business_details`, `public_businesses` and `is_valid_business_hours` in place unused (data kept).
   To hide details without deleting data:
   ```sql
   REVOKE SELECT ON public.business_details FROM anon;
   REVOKE INSERT, UPDATE ON public.business_details FROM authenticated;
   ```
   Full removal (DROP VIEW/TABLE) is destructive and needs separate owner approval.
3. Verify: /businesses lists approved businesses; homepage unchanged.
