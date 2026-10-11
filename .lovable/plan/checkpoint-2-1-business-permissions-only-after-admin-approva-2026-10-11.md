# Checkpoint 2.1 — Business permissions only after admin approval (PLAN ONLY)

No code, database, settings or publishing changes until this plan gets its own approval. Nothing on the homepage or anywhere else in the interface changes visually.

## What I checked (verified this turn)

- The `handle_new_user` signup trigger gives the `business` role straight away to anyone who signs up with `account_type='business'`, even though their status is `pending`. **This is the main gap.**
- `BusinessApprovals.tsx` approves in two separate client calls: a profile update, then a `user_roles` upsert, plus a best-effort audit insert. These don't share a transaction, so a partial failure leaves the status and role out of sync. Rejecting never removes the `business` role.
- The `protect_profile_columns` trigger blocks non-admins from changing `suspended` and `rejection_reason`, and blocks them from setting status to anything except `pending`. When `account_type` changes, it resets status to `pending`. It does not touch roles. A user who goes business → personal keeps any business role, and personal → business is self-service and sets `pending`.
- It skips all checks when `auth.uid()` is NULL (service role or SQL). That's intended, but it's noted here.
- `user_roles`: unique on (user_id, role). Only admins can write to it; users can only read their own.
- In the frontend, `isBusiness` (taken from roles) is used in `ProfileSettings.tsx` and in upload gating. Public pages (`Businesses.tsx`, `UserProfilePage.tsx`, MCP tools) already filter on `account_type='business' AND status='approved'`.
- `admin-users` edge function: suspending bans the account and sets `suspended`, but leaves roles alone. Deleting removes the profile and roles.
- Storage: there are no buckets, so there's nothing to review there yet. This must be revisited at the video-upload checkpoint.
- Current data: one personal admin account (roles `admin` + `user`) and one personal account. **There are no business accounts today, so the backfill risk is very low.**

## Rules after the change

1. Only `user` is granted at signup. A business application only sets `account_type='business'` and `status='pending'`.
2. The `business` role exists if and only if the account is business, approved and not suspended. It is changed only by security-definer functions, never by client writes.
3. These events revoke the business role: rejection, suspension, switching account type (business → personal), and an approved business re-applying with changed type data (status goes back to `pending`).
4. Unsuspending restores the role only if the account is still approved.
5. Every approve, reject, revoke or restore writes `admin_actions` in the same transaction.

## SQL migration outline (one migration, additive)

- **A. Replace `handle_new_user`.** Same profile insert as today; the role is always `user`; status is `pending` for business, `approved` for personal. It stays `SECURITY DEFINER SET search_path = public` and stays owned by postgres.
- **B. New `public.sync_business_role(_user_id uuid)`.** `SECURITY DEFINER`, `SET search_path = public, pg_temp`. It reads the profile, then inserts `business` with ON CONFLICT DO NOTHING when the account is business, approved and not suspended; otherwise it deletes the `business` role. It never touches `admin`. `REVOKE ALL ... FROM PUBLIC, anon, authenticated` so it can only be called internally.
- **C. New `public.admin_review_business(_target uuid, _decision text, _reason text default null)`.** `SECURITY DEFINER`, `SET search_path = public, pg_temp`.
  - **Caller checks:** `auth.uid()` must not be NULL and must pass `has_role(auth.uid(),'admin')`. The target can't be the caller. `_decision` must be `approve` or `reject`. A reject needs a reason of 1–500 characters after trimming. The target must be a business account with status `pending`; the decision may also run on a `rejected` account (to re-approve) or an `approved` one (to reject or revoke).
  - **In one transaction:** lock the profile row (`FOR UPDATE`), update status and `rejection_reason`, call `sync_business_role`, insert into `admin_actions` (actor = `auth.uid()`, action `business.approve` / `business.reject`, previous status in `detail`). Return the new status.
  - `GRANT EXECUTE ... TO authenticated` (the function checks the admin itself).
- **D. Trigger `trg_sync_business_role`.** An AFTER UPDATE trigger on profiles that fires when `account_type`, `status` or `suspended` changes and calls `sync_business_role(NEW.id)`. Suspension, unsuspension and type changes made by any path (edge function, admin UI or user edit) then keep the role correct automatically.
- **E. Harden `protect_profile_columns`.** Keep the existing checks. Add: a non-admin who changes business fields (`business_name`, `business_category`) while approved goes back to `pending`. This is optional; I need your decision (see questions). It keeps `SET search_path`.
- **F. Backfill (same migration):** `SELECT sync_business_role(id) FROM profiles`. This makes roles match today's data: no business accounts exist, so nothing changes, but it's safe on any data.
- **G. Policies:** keep "Admins manage roles" (admins can still fix roles by hand), but the UI stops using it. No policy loosening. No anon grants added.

Roles can't be escalated because users can't write to `user_roles`, the sync function can't be called by clients, the review function checks for admin from the server-side `auth.uid()`, and metadata at signup can no longer grant `business`.

## Frontend changes (logic only, no visual change)

- `src/components/admin/BusinessApprovals.tsx`: replace the profile update, role upsert and `writeAudit` with one call, `supabase.rpc('admin_review_business', {...})`. Approval and rejection buttons, toasts and the rejection dialog stay as they are; the rejection email stays best-effort after the call succeeds.
- `src/hooks/useAuth.tsx`: add a `refreshRoles()` and re-fetch roles when the tab regains focus, so a newly approved or revoked business sees the change without signing out. The shape of the hook stays the same.
- `src/pages/ProfileSettings.tsx` and upload gating: business-only actions require `isBusiness` (from the role). Pending or rejected accounts keep today's "Pending review" / rejection messaging.
- `supabase/functions/admin-users/index.ts`: no change needed (trigger D handles suspension). Optionally add the role revocation to the audit `detail`.
- `src/integrations/supabase/types.ts`: regenerated automatically.
- `AGENTS.md`: rule — "Business role is derived only by `sync_business_role` from approved + not-suspended business profiles; clients never write `user_roles`."

## Staged tests (preview before anything goes public)

- **1. SQL checks after migrating:** run the function and policy linter and the security scan; confirm search_path is set on every new function and that EXECUTE is revoked on `sync_business_role`.
- **2. Role matrix** (test accounts created through the preview signup flow, then deleted):
  - New business signup: profile is pending, roles = `user` only.
  - Admin approves: role `business` is added and one `admin_actions` row is written.
  - Admin rejects with a reason: the role is removed and the reason is stored.
  - Rejecting with an empty reason fails.
  - A non-admin calling `admin_review_business`: permission error, nothing changes.
  - A user trying to update `status`, `suspended` or `user_roles` directly: blocked.
  - Approved user switches to personal: the role is removed.
  - Suspend: role removed. Unsuspend: role restored.
  - Admin reviewing their own account: blocked.
- **3. Browser checks** (admin session, 390 and 1280 width): the approval queue, toasts and counts look the same as now; a business user's upload entry appears only after approval.
- **4. Regression:** directory, follows, `/design-demo`, homepage order and the holiday ticker are unchanged.

## Deployment sequence

1. Apply the migration (all additive; the old client code path still works because admins can still write `user_roles`).
2. Ship the frontend change to the preview, then run tests 2–4.
3. Publish only after you approve separately.

## Rollback (keeps all user data)

- **Frontend:** revert to the previous version; the old approval path still works.
- **Database:** a follow-up migration that drops `trg_sync_business_role`, `admin_review_business` and `sync_business_role` and restores the previous `handle_new_user` body (saved verbatim in the rollback file).
- No tables or columns are dropped, so profiles, roles, follows and audit rows stay in place.
- A role snapshot (`user_roles` copied to `user_roles_backup_20261011`, admin-only) is taken in the migration before the backfill, so it can be restored if needed.

## Open decisions for you

- **Re-review after edits:** should an approved business that edits its business name or category go back to pending review (E)? Recommended: yes for name and category, no for phone and address.
- **Suspension:** should it also hide the business from the public directory? Today the directory filter checks only approved status. Recommended: yes — add `suspended = false` to the public read rule and to the directory query.

Implementation needs your separate approval.
