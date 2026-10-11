CREATE TABLE IF NOT EXISTS public.user_roles_backup_20261011_b AS SELECT * FROM public.user_roles;
REVOKE ALL ON public.user_roles_backup_20261011_b FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.user_roles_backup_20261011_b TO authenticated;
GRANT ALL ON public.user_roles_backup_20261011_b TO service_role;
ALTER TABLE public.user_roles_backup_20261011_b ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read role backup b" ON public.user_roles_backup_20261011_b;
CREATE POLICY "Admins read role backup b" ON public.user_roles_backup_20261011_b FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON public.user_roles_backup_20261011 FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.user_roles_backup_20261011 TO authenticated;
GRANT ALL ON public.user_roles_backup_20261011 TO service_role;

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
REVOKE ALL ON public.user_roles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

REVOKE ALL ON public.profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

REVOKE ALL ON public.admin_actions FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.admin_actions TO authenticated;
GRANT ALL ON public.admin_actions TO service_role;

REVOKE ALL ON public.business_follows FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.business_follows TO anon;
GRANT SELECT, INSERT, DELETE ON public.business_follows TO authenticated;
GRANT ALL ON public.business_follows TO service_role;

DROP POLICY IF EXISTS "Anyone can read follows of approved businesses" ON public.business_follows;
CREATE POLICY "Anyone can read follows of approved businesses" ON public.business_follows FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = business_follows.business_id AND p.account_type = 'business' AND p.status = 'approved' AND p.suspended = false));
DROP POLICY IF EXISTS "Users follow businesses" ON public.business_follows;
CREATE POLICY "Users follow businesses" ON public.business_follows FOR INSERT TO authenticated
WITH CHECK (follower_id = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = business_follows.business_id AND p.account_type = 'business' AND p.status = 'approved' AND p.suspended = false));

CREATE OR REPLACE FUNCTION public.admin_set_role(_target uuid, _role public.app_role, _grant boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE v_actor uuid := auth.uid();
BEGIN
  IF v_actor IS NULL OR NOT public.has_role(v_actor, 'admin') THEN
    RAISE EXCEPTION 'permission denied' USING ERRCODE = '42501';
  END IF;
  IF _role = 'business' THEN RAISE EXCEPTION 'business role is derived from approval'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = _target) THEN RAISE EXCEPTION 'unknown user'; END IF;
  PERFORM 1 FROM public.user_roles WHERE role = 'admin' FOR UPDATE;
  IF _grant THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_target, _role) ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    IF _role = 'admin' AND _target = v_actor THEN RAISE EXCEPTION 'cannot remove your own admin role'; END IF;
    IF _role = 'admin' AND (SELECT count(*) FROM public.user_roles WHERE role = 'admin') <= 1 THEN
      RAISE EXCEPTION 'cannot remove the last admin';
    END IF;
    DELETE FROM public.user_roles WHERE user_id = _target AND role = _role;
  END IF;
  INSERT INTO public.admin_actions (actor_id, action, target_type, target_id, detail)
  VALUES (v_actor, CASE WHEN _grant THEN 'role.grant' ELSE 'role.revoke' END, 'user', _target::text, jsonb_build_object('role', _role));
END; $$;
REVOKE ALL ON FUNCTION public.admin_set_role(uuid, public.app_role, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_role(uuid, public.app_role, boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_set_suspended(_target uuid, _suspended boolean, _reason text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE v_actor uuid := auth.uid(); v_prev boolean; v_has_business boolean;
BEGIN
  IF v_actor IS NULL OR NOT public.has_role(v_actor, 'admin') THEN
    RAISE EXCEPTION 'permission denied' USING ERRCODE = '42501';
  END IF;
  IF _target = v_actor THEN RAISE EXCEPTION 'cannot suspend yourself'; END IF;
  SELECT suspended INTO v_prev FROM public.profiles WHERE id = _target FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown user'; END IF;
  UPDATE public.profiles SET suspended = _suspended WHERE id = _target;
  PERFORM public.sync_business_role(_target);
  v_has_business := EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _target AND role = 'business');
  INSERT INTO public.admin_actions (actor_id, action, target_type, target_id, detail)
  VALUES (v_actor, CASE WHEN _suspended THEN 'user.suspend' ELSE 'user.unsuspend' END, 'user', _target::text,
    jsonb_build_object('previous_suspended', v_prev, 'business_role', v_has_business, 'reason', NULLIF(btrim(COALESCE(_reason,'')), '')));
END; $$;
REVOKE ALL ON FUNCTION public.admin_set_suspended(uuid, boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_suspended(uuid, boolean, text) TO authenticated;

REVOKE ALL ON FUNCTION public.sync_business_role(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_review_business(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_review_business(uuid, text, text) TO authenticated;

SELECT public.sync_business_role(id) FROM public.profiles;