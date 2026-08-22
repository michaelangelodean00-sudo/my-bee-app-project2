CREATE TABLE public.business_follows (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (follower_id, business_id),
  CHECK (follower_id <> business_id)
);

CREATE INDEX idx_business_follows_business ON public.business_follows(business_id);
CREATE INDEX idx_business_follows_follower ON public.business_follows(follower_id);

GRANT SELECT, INSERT, DELETE ON public.business_follows TO authenticated;
GRANT SELECT ON public.business_follows TO anon;
GRANT ALL ON public.business_follows TO service_role;

ALTER TABLE public.business_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read follows of approved businesses"
ON public.business_follows FOR SELECT
TO anon, authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles p
  WHERE p.id = business_follows.business_id
    AND p.account_type = 'business'
    AND p.status = 'approved'
));

CREATE POLICY "Users follow businesses"
ON public.business_follows FOR INSERT
TO authenticated
WITH CHECK (
  follower_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = business_id
      AND p.account_type = 'business'
      AND p.status = 'approved'
  )
);

CREATE POLICY "Users unfollow their own follows"
ON public.business_follows FOR DELETE
TO authenticated
USING (follower_id = auth.uid());