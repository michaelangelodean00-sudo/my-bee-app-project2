-- Checkpoint 2.1b: least-privilege audit log + video_moderation; audited user deletion request.
DROP POLICY IF EXISTS "Admins write audit log" ON public.admin_actions;
REVOKE INSERT, UPDATE, DELETE ON public.admin_actions FROM authenticated, anon;
REVOKE ALL ON public.admin_actions FROM anon;
GRANT SELECT ON public.admin_actions TO authenticated;
GRANT ALL ON public.admin_actions TO service_role;

REVOKE ALL ON public.video_moderation FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_moderation TO authenticated;
GRANT ALL ON public.video_moderation TO service_role;

CREATE OR REPLACE FUNCTION public.admin_request_user_deletion(_target uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE v_actor uuid := auth.uid(); p record;
BEGIN
  IF v_actor IS NULL OR NOT public.has_role(v_actor, 'admin') THEN
    RAISE EXCEPTION 'permission denied' USING ERRCODE = '42501';
  END IF;
  IF _target = v_actor THEN RAISE EXCEPTION 'cannot delete yourself'; END IF;
  SELECT account_type, status, suspended INTO p FROM public.profiles WHERE id = _target;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown user'; END IF;
  IF public.has_role(_target, 'admin') AND (SELECT count(*) FROM public.user_roles WHERE role = 'admin') <= 1 THEN
    RAISE EXCEPTION 'cannot delete the last admin';
  END IF;
  INSERT INTO public.admin_actions (actor_id, action, target_type, target_id, detail)
  VALUES (v_actor, 'user.delete.requested', 'user', _target::text,
    jsonb_build_object('account_type', p.account_type, 'status', p.status, 'suspended', p.suspended,
      'roles', (SELECT coalesce(jsonb_agg(role), '[]'::jsonb) FROM public.user_roles WHERE user_id = _target)));
END; $$;
REVOKE ALL ON FUNCTION public.admin_request_user_deletion(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_request_user_deletion(uuid) TO authenticated;