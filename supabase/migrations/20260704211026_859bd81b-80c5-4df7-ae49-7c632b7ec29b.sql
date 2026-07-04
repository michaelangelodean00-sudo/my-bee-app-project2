-- SEC-1: Trigger guard on privileged profile columns
CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.suspended IS DISTINCT FROM OLD.suspended THEN
    RAISE EXCEPTION 'permission denied: suspended is admin-only';
  END IF;

  IF NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason THEN
    RAISE EXCEPTION 'permission denied: rejection_reason is admin-only';
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status
     AND NEW.status <> 'pending'::public.business_status THEN
    RAISE EXCEPTION 'permission denied: only admins can approve or reject';
  END IF;

  IF NEW.account_type IS DISTINCT FROM OLD.account_type THEN
    NEW.status := 'pending'::public.business_status;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.protect_profile_columns() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_protect_profile_columns ON public.profiles;
CREATE TRIGGER trg_protect_profile_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_columns();

-- SEC-8: stop leaking moderation records to every authenticated user
DROP POLICY IF EXISTS "Authenticated read video moderation" ON public.video_moderation;

-- Directory performance index
CREATE INDEX IF NOT EXISTS idx_profiles_business_status
  ON public.profiles (account_type, status);

-- Admin audit log
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text,
  detail jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.admin_actions TO authenticated;
GRANT ALL ON public.admin_actions TO service_role;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read audit log" ON public.admin_actions;
CREATE POLICY "Admins read audit log"
  ON public.admin_actions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins write audit log" ON public.admin_actions;
CREATE POLICY "Admins write audit log"
  ON public.admin_actions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) AND actor_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_admin_actions_created
  ON public.admin_actions (created_at DESC);