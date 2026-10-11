// Admin user management: list, suspend/unsuspend, delete — P0 hardened 2026-07-03
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const ALLOWED_ORIGINS = [
  "https://beeappbahamas.com",
  "https://www.beeappbahamas.com",
  "https://uadghawuvfzdqomklvha.lovableproject.com",
  "https://id-preview--fd0fbee7-53c9-4c82-885d-3738f7504d4f.lovable.app",
  "https://fd0fbee7-53c9-4c82-885d-3738f7504d4f.lovableproject.com",
  "http://localhost:8080",
];

const corsFor = (req: Request) => {
  const origin = req.headers.get("Origin") ?? "";
  // Exact-match allowlist; unknown origins get no ACAO header (browser blocks).
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : "null";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
};

const hits = new Map<string, { n: number; reset: number }>();
const rateLimited = (key: string): boolean => {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now > h.reset) {
    hits.set(key, { n: 1, reset: now + 60_000 });
    return false;
  }
  h.n += 1;
  return h.n > 30;
};

const json = (body: unknown, status: number, cors: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  const cors = corsFor(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, cors);

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401, cors);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "Forbidden" }, 403, cors);

    if (rateLimited(userData.user.id)) {
      return json({ error: "Too many requests. Slow down." }, 429, cors);
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    const audit = (action: string, targetId: string | null, detail?: unknown) =>
      admin.from("admin_actions").insert({
        actor_id: userData.user.id,
        action,
        target_type: "user",
        target_id: targetId,
        detail: detail ?? null,
      }).then(({ error }) => {
        if (error) console.error("admin-users: audit insert failed", error.message);
      });

    if (action === "list") {
      const { data: profiles, error: pErr } = await admin
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (pErr) throw pErr;

      const emailMap = new Map<string, string>();
      let page = 1;
      for (;;) {
        const { data: batch, error: uErr } = await admin.auth.admin.listUsers({
          page,
          perPage: 1000,
        });
        if (uErr) throw uErr;
        for (const u of batch.users) emailMap.set(u.id, u.email ?? "");
        if (batch.users.length < 1000) break;
        page += 1;
        if (page > 100) break;
      }

      const result = (profiles ?? []).map((p) => ({
        ...p,
        email: emailMap.get(p.id) ?? "",
      }));
      return json({ users: result }, 200, cors);
    }

    if (action === "suspend" || action === "unsuspend") {
      const targetId = body.user_id as string;
      if (!targetId) return json({ error: "user_id required" }, 400, cors);
      if (targetId === userData.user.id) {
        return json({ error: "Cannot suspend yourself" }, 400, cors);
      }
      const suspend = action === "suspend";

      // Step 1: DB flag + business role sync + audit, atomic and authorized as the caller.
      const { error: rpcErr } = await userClient.rpc("admin_set_suspended", {
        _target: targetId,
        _suspended: suspend,
      });
      if (rpcErr) return json({ error: `Could not ${action}: ${rpcErr.message}` }, 400, cors);

      // Step 2: sign-in ban/unban. On failure, compensate step 1 so both stay consistent.
      const { error: banErr } = await admin.auth.admin.updateUserById(targetId, {
        ban_duration: suspend ? "876000h" : "none",
      });
      if (banErr) {
        const { error: undoErr } = await userClient.rpc("admin_set_suspended", {
          _target: targetId,
          _suspended: !suspend,
          _reason: `compensation: sign-in ${suspend ? "ban" : "unban"} failed`,
        });
        await audit(`user.${action}.failed`, targetId, {
          stage: "auth_ban", error: banErr.message, compensated: !undoErr,
          compensation_error: undoErr?.message ?? null,
        });
        return json({
          error: undoErr
            ? `Sign-in ${suspend ? "block" : "unblock"} failed and the change could not be reverted. Retry now.`
            : `Sign-in ${suspend ? "block" : "unblock"} failed; no change was made. Please retry.`,
        }, 502, cors);
      }

      if (suspend) await admin.auth.admin.signOut(targetId).catch(() => {});
      return json({ ok: true }, 200, cors);
    }

    if (action === "delete") {
      const targetId = body.user_id as string;
      if (!targetId) return json({ error: "user_id required" }, 400, cors);
      if (targetId === userData.user.id) {
        return json({ error: "Cannot delete yourself" }, 400, cors);
      }
      // Step 1: authorize + snapshot audit row (refuses self / last admin / unknown user).
      const { error: reqErr } = await userClient.rpc("admin_request_user_deletion", { _target: targetId });
      if (reqErr) return json({ error: `Could not delete: ${reqErr.message}` }, 400, cors);

      // Step 2: delete the sign-in account; profile, roles and follows cascade in the database.
      const { error: dErr } = await admin.auth.admin.deleteUser(targetId);
      if (dErr) {
        await audit("user.delete.failed", targetId, { stage: "auth_delete", error: dErr.message });
        return json({ error: "Delete failed; the account was not removed. Please retry." }, 502, cors);
      }
      const { error: aErr } = await admin.from("admin_actions").insert({
        actor_id: userData.user.id, action: "user.delete.completed",
        target_type: "user", target_id: targetId, detail: null,
      });
      if (aErr) console.error("admin-users: completion audit failed", aErr.message);
      return json({ ok: true, audit_complete: !aErr }, 200, cors);
    }

    return json({ error: "Unknown action" }, 400, cors);
  } catch (e) {
    console.error("admin-users error:", e);
    return json({ error: "Internal error. Check function logs." }, 500, cors);
  }
});
