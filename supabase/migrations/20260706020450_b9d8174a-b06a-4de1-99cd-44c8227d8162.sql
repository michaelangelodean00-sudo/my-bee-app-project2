-- Revoke EXECUTE on SECURITY DEFINER trigger functions from client roles.
-- These are invoked only by triggers (and by postgres/service_role), so no
-- signed-in user needs to call them directly. has_role() is intentionally
-- left executable because RLS policies invoke it as the querying role.
REVOKE EXECUTE ON FUNCTION public.protect_profile_columns() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;