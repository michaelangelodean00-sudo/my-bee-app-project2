# Checkpoint 2.1 (rev. 2) — Business permissions only after admin approval

PLAN ONLY. No code, database, settings or publishing changes until this revision gets its own approval. No visual or homepage changes.

## Owner decisions (locked)

1. An approved business that changes its **business name or category** goes back to `pending` and loses business permissions until re-approved. Phone and address edits do not trigger re-review.
2. **Suspended businesses are hidden** from the public directory and every public listing or query.

## Current state (verified this turn)

Already live from the earlier step of this checkpoint:
- Signup (`handle_new_user`) grants only `user`. Business sign-ups start as `pending`.
- `sync_business_role` exists. `anon` and `authenticated` cannot execute it.
- `admin_review_business` exists, checks for admin on the server and writes the audit row. Only `authenticated` can execute it.
- `trg_sync_business_role` (AFTER UPDATE on profiles) keeps the role in step with status, suspension and type changes.
- `protect_profile_columns` already resets to `pending` when name or category changes (decision 1). Phone and address are untouched.
- The public profiles rule requires `suspended = false`. `Businesses.tsx` filters on `suspended = false`.
- `BusinessApprovals.tsx` uses the RPC. No client code writes `user_roles`. The only writer is the `admin-users` edge function (service role, delete path).

Gaps still open:
- **G1.** The "Admins manage roles" policy (ALL) still lets an admin write `user_roles` directly from the browser. That bypasses audit and sync.
- **G2.** Table grants on `user_roles`, `profiles`, `admin_actions` and the backup table didn't show up for `anon`/`authenticated` in `information_schema`. The effective privileges are **unconfirmed**; step 1 of the build re-checks them with `has_table_privilege`.
- **G3.** These public lists skip the suspended filter: `TrendingSection.tsx`, `supabase/functions/mcp/index.ts` (list_approved_businesses) and `src/lib/mcp/tools/list-approved-businesses.ts`. RLS already hides suspended rows from guests and normal users, but admins browsing the public pages still see them. The code should also state the rule explicitly.
- **G4.** The `business_follows` read and insert rules check approved status only, not `suspended = false`.
- **G5.** No business-only tables exist yet (videos and ads are future checkpoints), so there's no database capability left to guard today. Rule for the future: every business write path checks `has_role(auth.uid(),'business')` in RLS or in the edge function, never only in the UI.
- **G6.** `admin-users` suspend/unsuspend/delete don't write `admin_actions` for role changes in the same transaction.

## SQL migration (one, idempotent, additive)

Name: `business_permissions_hardening`. Every statement is safe to re-run.

```text
0. Backup: CREATE TABLE IF NOT EXISTS public.user_roles_backup_20261011_b AS SELECT * FROM user_roles
   (admin-only SELECT policy, no client grants beyond SELECT to authenticated, ALL to service_role).
1. user_roles least privilege:
   DROP POLICY IF EXISTS "Admins manage roles"   -- policy only, no data lost
   REVOKE INSERT, UPDATE, DELETE ON user_roles FROM anon, authenticated
   REVOKE ALL ON user_roles FROM anon
   GRANT SELECT ON user_roles TO authenticated; GRANT ALL TO service_role
   Keep "Users view own roles" and "Admins view all roles".
2. profiles grants: REVOKE ALL FROM anon; GRANT SELECT TO anon;
   GRANT SELECT, UPDATE TO authenticated (no INSERT/DELETE except via the admin policy;
   keep DELETE for the admin policy); GRANT ALL TO service_role.
3. admin_actions: REVOKE ALL FROM anon; GRANT SELECT, INSERT TO authenticated (existing admin-only policies).
4. New SECURITY DEFINER public.admin_set_role(_target uuid, _role app_role, _grant boolean)
   SET search_path = public, pg_temp. Caller must be admin; _role must be 'admin' or 'user'
   ('business' is rejected — it only comes from sync); an admin can't remove their own admin role;
   the last admin can't be removed. Writes admin_actions in the same transaction.
   REVOKE ALL FROM PUBLIC, anon; GRANT EXECUTE TO authenticated.
5. New SECURITY DEFINER public.admin_set_suspended(_target uuid, _suspended boolean, _reason text)
   Admin check, lock row FOR UPDATE, update suspended, PERFORM sync_business_role,
   audit row with previous state and role outcome. Same grants as 4.
6. business_follows: recreate both policies (DROP IF EXISTS + CREATE) adding p.suspended = false.
7. Re-assert hardening: CREATE OR REPLACE for sync_business_role / admin_review_business with
   identical bodies plus explicit REVOKE ALL ... FROM PUBLIC (defence against default PUBLIC execute).
8. Backfill: SELECT public.sync_business_role(id) FROM profiles (no-op today; correct on any data).
```

`protect_profile_columns`, `handle_new_user` and the public profile rule already match the owner's decisions and stay unchanged.

## File changes (logic only)

- `supabase/functions/admin-users/index.ts`: suspend and unsuspend call `admin_set_suspended` with the caller's token (so audit and sync are atomic), then ban or unban through the auth admin API. The delete path keeps the service role and adds an audit row first.
- `src/components/TrendingSection.tsx`: add `.eq("suspended", false)`.
- `supabase/functions/mcp/index.ts` and `src/lib/mcp/tools/list-approved-businesses.ts`: add `.eq("suspended", false)`.
- `src/components/admin/UserManagement.tsx`: if it changes roles, switch it to `admin_set_role`. It's read during the build; if it never writes roles, there's no change.
- `src/integrations/supabase/types.ts`: regenerated automatically.
- `AGENTS.md`: replace the business-role rule with: "Role and suspension changes go only through security-definer admin functions that audit in the same transaction. Clients have SELECT-only on user_roles, and business capabilities are enforced in RLS or edge functions."

## Staged test matrix (preview only; temporary test users made inside one transaction and rolled back)

| # | Actor | Attempt | Expected |
|---|---|---|---|
| 1 | new signup with metadata role=business | sign up | profile pending, roles = user |
| 2 | business user | REST insert into user_roles (business) | denied (no grant) |
| 3 | admin | REST insert/delete on user_roles | denied (policy removed) |
| 4 | user | RPC sync_business_role / admin_review_business | permission denied, no change |
| 5 | user | PATCH own status=approved / suspended / rejection_reason | blocked by trigger |
| 6 | admin | approve via RPC | business role + 1 audit row, atomic |
| 7 | admin | reject with empty reason / own account | error, no change |
| 8 | approved business | edit name or category | pending, role removed |
| 9 | approved business | edit phone/address | stays approved, role kept |
| 10 | admin | suspend / unsuspend | role removed / restored only if approved; audit rows |
| 11 | anon + other user | select suspended business, follow it, MCP list | not returned / insert denied |
| 12 | admin | admin_set_role business, remove own/last admin | rejected |
| 13 | anon | any write on profiles/admin_actions/backups | denied |

After that: the security linter and scan, a check that every new function sets `search_path`, browser checks of the approvals and users tabs at 390 and 1280 width, and a regression check of the homepage order, `/design-demo`, the directory, follows and the holiday ticker.

## Deployment sequence

1. Re-check the effective privileges (G2) and record them in the rollback notes.
2. Apply the migration.
3. Ship the edge function and frontend changes to the preview.
4. Run the test matrix.
5. Publish only after separate owner approval.

## Rollback (keeps all users, profiles, roles, audit rows)

- A follow-up migration recreates the "Admins manage roles" policy and the earlier grants as recorded in step 1, restores the old `business_follows` policies, and drops `admin_set_role` and `admin_set_suspended`.
- The edge function and frontend go back to the previous version.
- No tables or columns are dropped. If roles ever drift, they can be restored from `user_roles_backup_20261011_b` with an admin-run insert that adds back only the missing rows (ON CONFLICT DO NOTHING).

Implementation needs your separate approval.
