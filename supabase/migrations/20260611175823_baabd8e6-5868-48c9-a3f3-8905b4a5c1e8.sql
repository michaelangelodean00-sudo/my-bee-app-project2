
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rejection_reason text;

CREATE TABLE IF NOT EXISTS public.video_moderation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id text NOT NULL UNIQUE,
  status text NOT NULL CHECK (status IN ('pending','approved','rejected')),
  rejection_reason text,
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_moderation TO authenticated;
GRANT ALL ON public.video_moderation TO service_role;

ALTER TABLE public.video_moderation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage video moderation" ON public.video_moderation;
CREATE POLICY "Admins manage video moderation"
  ON public.video_moderation FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Authenticated read video moderation" ON public.video_moderation;
CREATE POLICY "Authenticated read video moderation"
  ON public.video_moderation FOR SELECT TO authenticated USING (true);

DROP TRIGGER IF EXISTS trg_video_moderation_updated_at ON public.video_moderation;
CREATE TRIGGER trg_video_moderation_updated_at
  BEFORE UPDATE ON public.video_moderation
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
