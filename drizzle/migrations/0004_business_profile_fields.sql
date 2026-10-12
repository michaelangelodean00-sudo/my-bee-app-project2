CREATE OR REPLACE FUNCTION public.is_valid_business_hours(_h jsonb)
RETURNS boolean LANGUAGE plpgsql IMMUTABLE SET search_path = public, pg_temp AS $$
DECLARE d text; v jsonb; k text;
BEGIN
  IF _h IS NULL THEN RETURN true; END IF;
  IF jsonb_typeof(_h) <> 'object' THEN RETURN false; END IF;
  FOR k IN SELECT jsonb_object_keys(_h) LOOP
    IF k NOT IN ('mon','tue','wed','thu','fri','sat','sun') THEN RETURN false; END IF;
  END LOOP;
  FOREACH d IN ARRAY ARRAY['mon','tue','wed','thu','fri','sat','sun'] LOOP
    v := _h -> d;
    IF v IS NULL THEN CONTINUE; END IF;
    IF jsonb_typeof(v) <> 'object' THEN RETURN false; END IF;
    FOR k IN SELECT jsonb_object_keys(v) LOOP
      IF k NOT IN ('closed','open','close') THEN RETURN false; END IF;
    END LOOP;
    IF jsonb_typeof(v->'closed') IS DISTINCT FROM 'boolean' THEN RETURN false; END IF;
    IF (v->>'closed')::boolean THEN CONTINUE; END IF;
    IF coalesce(v->>'open','') !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
       OR coalesce(v->>'close','') !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
       OR v->>'open' = v->>'close' THEN RETURN false; END IF;
  END LOOP;
  RETURN true;
END; $$;

CREATE TABLE IF NOT EXISTS public.business_details (
  business_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  description text CHECK (description IS NULL OR char_length(description) <= 600),
  island text CHECK (island IS NULL OR island IN ('New Providence','Grand Bahama','Abaco','Eleuthera','Exuma','Andros','Bimini','Long Island','Cat Island','Other')),
  whatsapp text CHECK (whatsapp IS NULL OR whatsapp ~ '^\+?[0-9]{7,15}$'),
  website text CHECK (website IS NULL OR (char_length(website) <= 200 AND website ~ '^https://[A-Za-z0-9.-]+\.[A-Za-z]{2,}(/[A-Za-z0-9._~/?#&=%+-]*)?$')),
  instagram text CHECK (instagram IS NULL OR instagram ~ '^[A-Za-z0-9._]{1,30}$'),
  facebook text CHECK (facebook IS NULL OR facebook ~ '^[A-Za-z0-9.-]{1,80}$'),
  hours jsonb CHECK (public.is_valid_business_hours(hours)),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.business_details TO anon;
GRANT SELECT, INSERT, UPDATE ON public.business_details TO authenticated;
GRANT ALL ON public.business_details TO service_role;
ALTER TABLE public.business_details ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved business details" ON public.business_details;
CREATE POLICY "Public read approved business details" ON public.business_details FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = business_details.business_id
  AND p.account_type = 'business' AND p.status = 'approved' AND p.suspended = false));
DROP POLICY IF EXISTS "Owners read own business details" ON public.business_details;
CREATE POLICY "Owners read own business details" ON public.business_details FOR SELECT TO authenticated
USING (business_id = auth.uid());
DROP POLICY IF EXISTS "Admins read all business details" ON public.business_details;
CREATE POLICY "Admins read all business details" ON public.business_details FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Owners insert own business details" ON public.business_details;
CREATE POLICY "Owners insert own business details" ON public.business_details FOR INSERT TO authenticated
WITH CHECK (business_id = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.account_type = 'business'));
DROP POLICY IF EXISTS "Owners update own business details" ON public.business_details;
CREATE POLICY "Owners update own business details" ON public.business_details FOR UPDATE TO authenticated
USING (business_id = auth.uid())
WITH CHECK (business_id = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.account_type = 'business'));

DROP TRIGGER IF EXISTS trg_business_details_updated_at ON public.business_details;
CREATE TRIGGER trg_business_details_updated_at BEFORE UPDATE ON public.business_details
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS business_details_island_idx ON public.business_details (island);
CREATE INDEX IF NOT EXISTS profiles_public_business_idx ON public.profiles (business_category) WHERE account_type = 'business' AND status = 'approved' AND suspended = false;

CREATE OR REPLACE VIEW public.public_businesses WITH (security_invoker = true) AS
SELECT p.id, p.business_name, p.display_name, p.avatar_url, p.business_category, p.phone, p.address, p.created_at
FROM public.profiles p
WHERE p.account_type = 'business' AND p.status = 'approved' AND p.suspended = false;
GRANT SELECT ON public.public_businesses TO anon, authenticated;