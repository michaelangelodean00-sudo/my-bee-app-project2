#!/usr/bin/env bash
# RLS regression suite.
#
# Applies supabase/migrations/ to a scratch database and asserts the access
# rules the app depends on. Catches the class of bug where a policy silently
# stops working - e.g. REVOKEing EXECUTE on has_role() breaks every policy that
# calls it, which fails closed and takes the app down for all signed-in users.
#
# Usage:  PGHOST=/tmp PGPORT=5432 ./supabase/tests/rls-regression.sh
# Needs a superuser Postgres; it creates and drops a database called bee_test.
set -uo pipefail
PGHOST="${PGHOST:-/tmp}"; PGPORT="${PGPORT:-5432}"; PGUSER="${PGUSER:-postgres}"
DB=bee_test
PSQL="psql -h $PGHOST -p $PGPORT -U $PGUSER -v ON_ERROR_STOP=1 -q"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PASS=0; FAIL=0

$PSQL -d postgres -c "DROP DATABASE IF EXISTS $DB;" -c "CREATE DATABASE $DB;" >/dev/null || exit 1

# Minimal Supabase scaffolding (roles + auth.uid()), then the real migrations.
$PSQL -d $DB <<'SQL' >/dev/null
DO $r$ BEGIN CREATE ROLE anon NOLOGIN;          EXCEPTION WHEN duplicate_object THEN NULL; END $r$;
DO $r$ BEGIN CREATE ROLE authenticated NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $r$;
DO $r$ BEGIN CREATE ROLE service_role NOLOGIN BYPASSRLS; EXCEPTION WHEN duplicate_object THEN NULL; END $r$;
CREATE SCHEMA auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY, email text, raw_user_meta_data jsonb DEFAULT '{}'::jsonb);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(COALESCE(NULLIF(current_setting('request.jwt.claims',true),'')::jsonb->>'sub',''),'')::uuid;
$$;
GRANT USAGE ON SCHEMA public, auth TO anon, authenticated, service_role;
SQL
for f in $(ls "$ROOT"/supabase/migrations/*.sql | sort); do
  $PSQL -d $DB -f "$f" >/dev/null 2>&1 || { echo "MIGRATION FAILED: $(basename "$f")"; exit 1; }
done

ADMIN=11111111-1111-4111-8111-111111111111
USER=22222222-2222-4222-8222-222222222222
BIZ=33333333-3333-4333-8333-333333333333
PEND=44444444-4444-4444-8444-444444444444
$PSQL -d $DB <<SQL >/dev/null
INSERT INTO auth.users(id,email) VALUES ('$ADMIN','a@x'),('$USER','u@x'),('$BIZ','b@x'),('$PEND','p@x');
INSERT INTO public.user_roles(user_id,role) VALUES ('$ADMIN','admin');
UPDATE public.profiles SET account_type='business', business_name='Approved', status='approved' WHERE id='$BIZ';
UPDATE public.profiles SET account_type='business', business_name='Pending',  status='pending'  WHERE id='$PEND';
INSERT INTO public.business_follows(follower_id,business_id) VALUES ('$USER','$BIZ'),('$ADMIN','$BIZ');
SQL

_raw() { local c; if [ -n "$2" ]; then c="{\"sub\": \"$2\", \"role\": \"$1\"}"; else c="{\"role\": \"$1\"}"; fi
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d $DB -tA <<EOF 2>&1 | grep -vE '^(SET|BEGIN|COMMIT|ROLLBACK|\{)' | grep -v '^$'
BEGIN; SET LOCAL ROLE $1; SELECT set_config('request.jwt.claims','$c',true);
$3
COMMIT;
EOF
}
# last line - for value assertions
q()  { _raw "$@" | tail -1; }
# whole output - denial evidence can land on an ERROR or a CONTEXT line
qf() { _raw "$@" | tr '\n' ' '; }
chk() { if [ "$2" = "$3" ]; then PASS=$((PASS+1)); printf '  PASS  %s\n' "$1"
        else FAIL=$((FAIL+1)); printf '  FAIL  %s\n          expected=%s actual=%s\n' "$1" "$2" "$3"; fi; }
# A write is "denied" if it raised, or if RLS filtered every row.
deny() { case "$2" in
  *ERROR*|*"permission denied"*|*"UPDATE 0"*|*"DELETE 0"*|*"INSERT 0 0"*)
    PASS=$((PASS+1)); printf '  PASS  %s (denied)\n' "$1";;
  *) FAIL=$((FAIL+1)); printf '  FAIL  %s -- NOT denied: %s\n' "$1" "$2";; esac; }

echo "visibility"
chk "admin sees all profiles"                4 "$(q authenticated $ADMIN 'SELECT count(*) FROM public.profiles;')"
chk "user sees own + approved business"      2 "$(q authenticated $USER  'SELECT count(*) FROM public.profiles;')"
chk "anon sees approved businesses only"     1 "$(q anon "" 'SELECT count(*) FROM public.profiles;')"

echo "has_role is callable by RLS, but is not an enumeration oracle"
chk "admin self-check true"                  t "$(q authenticated $ADMIN "SELECT public.has_role('$ADMIN','admin');")"
chk "user self-check false"                  f "$(q authenticated $USER  "SELECT public.has_role('$USER','admin');")"
chk "user probing admin returns false"       f "$(q authenticated $USER  "SELECT public.has_role('$ADMIN','admin');")"
chk "anon cannot execute has_role"           "permission denied for function has_role" \
    "$(q anon "" "SELECT public.has_role('$ADMIN','admin');" | grep -o 'permission denied for function has_role')"

echo "privilege escalation"
deny "user self-grants admin"                "$(qf authenticated $USER "INSERT INTO public.user_roles(user_id,role) VALUES ('$USER','admin');")"
deny "pending business self-approves"        "$(qf authenticated $PEND "UPDATE public.profiles SET status='approved' WHERE id='$PEND';")"
deny "user sets suspended on self"           "$(qf authenticated $PEND "UPDATE public.profiles SET suspended=true WHERE id='$PEND';")"
deny "user suspends another account"         "$(qf authenticated $USER "UPDATE public.profiles SET suspended=true WHERE id='$BIZ';")"
chk "non-admin reads moderation queue (0 rows)" 0 "$(q authenticated $USER 'SELECT count(*) FROM public.video_moderation;')"
deny "non-admin writes audit log"            "$(qf authenticated $USER "INSERT INTO public.admin_actions(actor_id,action,target_type) VALUES ('$USER','x','user');")"

echo "admin workflow works end to end"
chk "admin approves business"      "UPDATE 1" "$(q authenticated $ADMIN "UPDATE public.profiles SET status='approved' WHERE id='$PEND';")"
chk "admin grants business role"   "INSERT 0 1" "$(q authenticated $ADMIN "INSERT INTO public.user_roles(user_id,role) VALUES ('$PEND','business');")"
chk "admin writes audit log"       "INSERT 0 1" "$(q authenticated $ADMIN "INSERT INTO public.admin_actions(actor_id,action,target_type) VALUES ('$ADMIN','a','user');")"

echo "follower graph is private, counts stay public"
chk "anon cannot read follows"     "permission denied" "$(q anon "" 'SELECT count(*) FROM public.business_follows;' | grep -o 'permission denied')"
chk "user sees only own follow"    1 "$(q authenticated $USER 'SELECT count(*) FROM public.business_follows;')"
chk "user sees no foreign rows"    0 "$(q authenticated $USER "SELECT count(*) FROM public.business_follows WHERE follower_id <> '$USER';")"
chk "anon still gets count"        2 "$(q anon "" "SELECT public.business_follower_count('$BIZ');")"
deny "user forges another's follow" "$(qf authenticated $USER "INSERT INTO public.business_follows(follower_id,business_id) VALUES ('$ADMIN','$BIZ');")"

echo "service_role bypass still works (admin-users edge function path)"
chk "service_role can suspend"     "UPDATE 1" "$(q service_role "" "UPDATE public.profiles SET suspended=true WHERE id='$BIZ';")"

echo
echo "PASS=$PASS FAIL=$FAIL"
$PSQL -d postgres -c "DROP DATABASE IF EXISTS $DB;" >/dev/null 2>&1
[ "$FAIL" -eq 0 ]
