-- Security hardening pass.
--
-- SEC-A  user_roles: admins could never actually grant a role from the client.
-- SEC-B  business_follows: the follower graph was readable by anonymous users.
-- SEC-C  protect_profile_columns(): the admin-only column guard was skipped
--        whenever auth.uid() was NULL, which failed open rather than closed.

-- ─────────────────────────────────────────────────────────────────────────────
-- SEC-A: let admins write user_roles.
--
-- "Admins manage roles" (FOR ALL) has existed since the first migration, but
-- `authenticated` only ever held GRANT SELECT. Table privileges are checked
-- BEFORE row security, so the admin UI's upsert in BusinessApprovals.tsx was
-- rejected outright and approving a business never granted the business role.
-- The RLS policy still gates every write on has_role(auth.uid(), 'admin'), so
-- a non-admin's INSERT/UPDATE/DELETE fails the policy's WITH CHECK/USING.
-- ─────────────────────────────────────────────────────────────────────────────
GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- SEC-B: stop exposing who follows whom.
--
-- The old policy let anon and every authenticated user SELECT whole rows -
-- including follower_id - for any approved business, so the entire follower
-- graph could be enumerated with the publishable key. Public pages only need
-- an aggregate count, and a signed-in user only needs to know about their own
-- follow, so scope the table to that and serve counts through a definer RPC.
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can read follows of approved businesses" ON public.business_follows;

REVOKE SELECT ON public.business_follows FROM anon;

CREATE POLICY "Users read their own follows"
ON public.business_follows FOR SELECT
TO authenticated
USING (follower_id = auth.uid());

CREATE POLICY "Admins read all follows"
ON public.business_follows FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Aggregate-only follower count. SECURITY DEFINER so it can count rows the
-- caller cannot read, but it returns a bare integer and never a follower_id.
CREATE OR REPLACE FUNCTION public.business_follower_count(_business_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*), 0)::integer
  FROM public.business_follows bf
  JOIN public.profiles p ON p.id = bf.business_id
  WHERE bf.business_id = _business_id
    AND p.account_type = 'business'
    AND p.status = 'approved';
$$;

GRANT EXECUTE ON FUNCTION public.business_follower_count(uuid) TO anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- SEC-C: make the profile column guard fail closed.
--
-- The previous body returned NEW unchanged when auth.uid() was NULL. That is
-- correct for the service role and for direct maintenance connections, but it
-- means any future edge function holding the service key silently bypasses the
-- suspended / rejection_reason / status guards. Gate the bypass on the request
-- actually being a service_role request (or having no PostgREST JWT context at
-- all, i.e. psql), and let anything else fall through to the guards.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_claims text := current_setting('request.jwt.claims', true);
  v_role   text := COALESCE(NULLIF(v_claims, '')::jsonb ->> 'role', '');
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Trusted server-side contexts: the service role, or a connection with no
  -- PostgREST JWT at all (migrations, psql, scheduled jobs).
  IF v_role = 'service_role' OR NULLIF(v_claims, '') IS NULL THEN
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

-- ─────────────────────────────────────────────────────────────────────────────
-- SEC-D: restore EXECUTE on has_role() to `authenticated`, without handing out
--        a role-enumeration oracle.
--
-- Migration 20260610190656 ran `REVOKE EXECUTE ... FROM PUBLIC, anon`. The
-- implicit PUBLIC grant was the only grant the function ever had, so that
-- revoke stripped `authenticated` too. RLS policy expressions are evaluated as
-- the querying role, so every policy calling has_role() - on profiles,
-- user_roles, video_moderation, admin_actions and business_follows - raised
-- "permission denied for function has_role" for every signed-in user. Not a
-- disclosure (it fails closed) but it takes the whole app down once you log in,
-- and it silently defeats the admin policies those tables rely on.
--
-- Granting EXECUTE back would expose has_role as a PostgREST RPC, letting any
-- signed-in user probe `has_role('<someone else>', 'admin')` and enumerate the
-- admins. The guard below removes that: a request carrying a real end-user JWT
-- may only ask about itself. RLS always calls has_role(auth.uid(), ...) so
-- policies are unaffected, and service_role callers (the admin-users function)
-- have no auth.uid() and keep the unrestricted behaviour they need.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- End-user requests may only ask about themselves. Returning false rather
  -- than raising keeps this from becoming an oracle: probing another account
  -- is indistinguishable from that account simply not holding the role.
  IF auth.uid() IS NOT NULL AND _user_id IS DISTINCT FROM auth.uid() THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
