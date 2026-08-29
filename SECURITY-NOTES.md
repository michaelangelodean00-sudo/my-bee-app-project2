# Security notes

Findings from the audit on commit `7ffac4af`, what was fixed, and what is
knowingly left open. Re-read the "Still open" section before any deploy.

## Fixed

| # | Issue | Where |
|---|---|---|
| 1 | **Open redirect.** The `?next=` guard tested string prefixes, so `/\evil.com` passed (it starts with `/`, not `//`) but resolved to `https://evil.com/` — browsers normalise backslashes to slashes for special schemes. Post-sign-in phishing vector. Now resolved against `window.location.origin` and compared by origin. | `src/utils/security.ts` (`safeInternalPath`), `src/pages/Auth.tsx` |
| 2 | **Vulnerable dependencies.** 17 → 5 advisories (11 → 4 in production deps). | `package-lock.json` |
| 3 | **Clickjacking.** `X-Frame-Options` lived only in `public/.htaccess` (Apache-only; ignored by Lovable/Vercel/Netlify), JS frame-busting was disabled, and the code claimed `frame-src 'none'` protected against framing — it does not; it governs what the page may *embed*. `frame-ancestors` is now served as a real HTTP header on every supported host, allowlisting the Lovable preview origins. **It cannot go in a `<meta>` tag — browsers ignore it there.** | `public/_headers`, `vercel.json`, `public/.htaccess` |
| 4 | **Weak CSP.** Dropped `'unsafe-eval'` from `script-src`, dropped `http:` from `img-src`, added `upgrade-insecure-requests`. | `index.html`, `src/components/SecurityProvider.tsx` |
| 5 | **Env hygiene.** `.gitignore` now covers the env files that hold real secrets. See "Still open" for the `.env` decision. | `.gitignore` |
| 6 | **Broken role grant.** `authenticated` held only `GRANT SELECT` on `user_roles`, and table privileges are checked *before* row security — so the admin UI's upsert was rejected outright and approving a business never granted the `business` role. Write privileges granted; the existing admin-only RLS policy still gates every write. | `supabase/migrations/20260829010000_security_hardening.sql` |
| 7 | **Follower-graph disclosure.** Anyone with the publishable key could read `follower_id` for every approved business and enumerate the social graph. The table is now scoped to your own rows (plus admins), and public follower counts come from an aggregate `SECURITY DEFINER` RPC that returns an integer and never an id. | same migration, `src/hooks/useBusinessFollow.ts` |
| 8 | **Guard failed open.** `protect_profile_columns()` returned early whenever `auth.uid()` was `NULL`, so any future service-role writer would silently bypass the `suspended` / `rejection_reason` / `status` guards. The bypass is now conditional on the request actually being service-role (or having no PostgREST JWT at all). | same migration |
| 9 | **Unbounded memory.** The `admin-users` rate-limit map never evicted expired entries. Now swept on write. | `supabase/functions/admin-users/index.ts` |
| 10 | **Bypassable sanitiser.** Removed the regex-based `sanitizeInput()` (unused, trivially defeated, invited false confidence). Added `openExternal()`, which enforces http(s) — blocking `javascript:` URLs that `window.open` would otherwise execute in this origin — and severs `window.opener` to prevent reverse tabnabbing. Applied to the supplier-controlled ad click URLs. | `src/utils/security.ts`, ad + share components |

## Still open — read before deploying

- **`react-router` GHSA-wrjc-x8rr-h8h6** (open redirect via backslash in `<Link>` / `useNavigate`) affects *all* of v6; only 7.18+ fixes it, which is a breaking major. **Not exploitable here today:** every navigation target in the app is a hardcoded module-level literal, and the one place untrusted input reached a redirect (`Auth.tsx`) is now guarded by an origin check that does not depend on router behaviour. Re-check this if you ever pass user input to `navigate()` or `<Link to>`. Plan the v7 migration separately.
- **`vite` / `esbuild` advisories are dev-server-only** and never ship to production. Fixing them means vite 8, another breaking major. Until then, avoid running `npm run dev` on an untrusted network.
- **`.env` is still tracked on purpose.** It holds only `VITE_*` publishable values — the project URL and the anon key — which are compiled into the client bundle and public by design, and Lovable's build expects the file in the repo. No secret is exposed. This does technically conflict with the "never commit `.env`" house rule, so if you would rather untrack it, move those values into Lovable's env settings first or local dev will break. A service-role key must *never* go in this file.
- **The live database was never verified.** The audit read migrations, not live state. The Supabase MCP connection points at a different org (project `spphnzotrwudukxtjwfb`), while the app uses `uadghawuvfzdqomklvha`, so `get_advisors` was unavailable and direct probes were blocked by network policy. Before launch, run `get_advisors` from a session connected to the right Supabase org and confirm: RLS is enabled on every table, no extra tables or policies were added through the Lovable UI, and auth has leaked-password protection on with a sane OTP expiry.
- **The new migration has not been run.** It was written against the committed migration history and is unapplied and untested on a live database.

## Verified sound (no change needed)

Roles live in a separate `user_roles` table behind a `SECURITY DEFINER`
`has_role()`, which avoids the classic `profiles.role` escalation; users hold no
write privilege on that table and so cannot self-assign admin. Signup metadata
is user-controlled but enum-constrained, giving no path to `admin`. The
`admin-users` function verifies the JWT, re-checks admin server-side, blocks
self-suspend and self-delete, and writes an audit log. The MCP function is
read-only under the caller's token with RLS intact. No secrets in client source,
and no file-upload surface.
