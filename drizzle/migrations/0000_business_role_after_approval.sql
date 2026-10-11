-- Snapshot roles before changes (rollback aid)
CREATE TABLE public.user_roles_backup_20261011 AS SELECT * FROM public.user_roles;
GRANT ALL ON public.user_roles_backup_20261011 TO service_role;
GRANT SELECT ON public.user_roles_backup_20261011 TO authenticated;
ALTER TABLE public.user_roles_backup_20261011 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read role backup" ON public.user_roles_backup_20261011
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- A. Signup grants only 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_account_type public.account_type;
  v_status public.business_status;
BEGIN
  v_account_type := COALESCE((NEW.raw_user_meta_data->>'account_type')::public.account_type, 'personal');
  v_status := CASE WHEN v_account_type = 'business' THEN 'pending'::public.business_status ELSE 'approved'::public.business_status END;
  INSERT INTO public.profiles (id, display_name, avatar_url, account_type, business_name, business_category, phone, address, status)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'avatar_url', v_account_type,
    NEW.raw_user_meta_data->>'business_name', NEW.raw_user_meta_data->>'business_category',
    NEW.raw_user_meta_data->>'phone', NEW.raw_user_meta_data->>'address', v_status);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

-- B. Derive business role from profile state
CREATE OR REPLACE FUNCTION public.sync_business_role(_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE p record;
BEGIN
  SELECT account_type, status, suspended INTO p FROM public.profiles WHERE id = _user_id;
  IF FOUND AND p.account_type = 'business' AND p.status = 'approved' AND NOT p.suspended THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'business')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'business';
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.sync_business_role(uuid) FROM PUBLIC, anon, authenticated;

-- C. Atomic admin review
CREATE OR REPLACE FUNCTION public.admin_review_business(_target uuid, _decision text, _reason text DEFAULT NULL)
RETURNS public.business_status LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_prev public.business_status;
  v_type public.account_type;
  v_new public.business_status;
  v_reason text := NULLIF(btrim(COALESCE(_reason, '')), '');
BEGIN
  IF v_actor IS NULL OR NOT public.has_role(v_actor, 'admin') THEN
    RAISE EXCEPTION 'permission denied' USING ERRCODE = '42501';
  END IF;
  IF _target = v_actor THEN RAISE EXCEPTION 'cannot review your own account'; END IF;
  IF _decision NOT IN ('approve', 'reject') THEN RAISE EXCEPTION 'invalid decision'; END IF;
  IF _decision = 'reject' AND (v_reason IS NULL OR length(v_reason) > 500) THEN
    RAISE EXCEPTION 'rejection reason must be 1-500 characters';
  END IF;

  SELECT status, account_type INTO v_prev, v_type FROM public.profiles WHERE id = _target FOR UPDATE;
  IF NOT FOUND OR v_type <> 'business' THEN RAISE EXCEPTION 'target is not a business account'; END IF;

  v_new := CASE WHEN _decision = 'approve' THEN 'approved'::public.business_status ELSE 'rejected'::public.business_status END;
  UPDATE public.profiles
     SET status = v_new, rejection_reason = CASE WHEN _decision = 'reject' THEN v_reason ELSE NULL END
   WHERE id = _target;
  PERFORM public.sync_business_role(_target);

  INSERT INTO public.admin_actions (actor_id, action, target_type, target_id, detail)
  VALUES (v_actor, 'business.' || _decision, 'business_profile', _target::text,
          jsonb_build_object('previous_status', v_prev, 'reason', v_reason));
  RETURN v_new;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_review_business(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_review_business(uuid, text, text) TO authenticated;

-- D. Keep role in sync on any relevant profile change
CREATE OR REPLACE FUNCTION public.trg_sync_business_role_fn()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.sync_business_role(NEW.id);
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.trg_sync_business_role_fn() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER trg_sync_business_role
AFTER UPDATE OF account_type, status, suspended ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.trg_sync_business_role_fn();

-- E. Re-review when approved business edits name/category
CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN RETURN NEW; END IF;
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;
  IF NEW.suspended IS DISTINCT FROM OLD.suspended THEN
    RAISE EXCEPTION 'permission denied: suspended is admin-only';
  END IF;
  IF NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason THEN
    RAISE EXCEPTION 'permission denied: rejection_reason is admin-only';
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'pending'::public.business_status THEN
    RAISE EXCEPTION 'permission denied: only admins can approve or reject';
  END IF;
  IF NEW.account_type IS DISTINCT FROM OLD.account_type THEN
    NEW.status := 'pending'::public.business_status;
  END IF;
  IF NEW.account_type = 'business' AND OLD.status = 'approved'
     AND (NEW.business_name IS DISTINCT FROM OLD.business_name
          OR NEW.business_category IS DISTINCT FROM OLD.business_category) THEN
    NEW.status := 'pending'::public.business_status;
  END IF;
  RETURN NEW;
END;
$$;

-- Hide suspended businesses publicly
DROP POLICY IF EXISTS "Public view approved businesses" ON public.profiles;
CREATE POLICY "Public view approved businesses" ON public.profiles FOR SELECT TO anon, authenticated
  USING (account_type = 'business' AND status = 'approved' AND suspended = false);

-- F. Backfill
SELECT public.sync_business_role(id) FROM public.profiles;