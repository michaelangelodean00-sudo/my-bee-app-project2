# Rollback: Checkpoint 2.1b

No user, profile or role rows are changed by this checkpoint or its rollback.

## 1. Database (run as one migration)
```sql
-- restore admin direct audit inserts
GRANT INSERT ON public.admin_actions TO authenticated;
CREATE POLICY "Admins write audit log" ON public.admin_actions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND actor_id = auth.uid());
-- restore previous anon grants on video_moderation (RLS still admin-only)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_moderation TO anon;
-- remove the new deletion helper
DROP FUNCTION IF EXISTS public.admin_request_user_deletion(uuid);
```

## 2. Edge function
Restore `supabase/functions/admin-users/index.ts` from the version history before Checkpoint 2.1b.
Note: the old delete path calls no RPC, so step 1 and 2 can be rolled back independently.

## 3. Verify
- `select has_table_privilege('authenticated','public.admin_actions','INSERT');` returns true.
- Users tab lists users; suspend/unsuspend works.

Earlier permission backups remain in `user_roles_backup_20261011` and `_b`.
