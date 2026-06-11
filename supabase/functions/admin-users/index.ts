// Admin user management: list, suspend/unsuspend, delete
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    if (action === "list") {
      const { data: profiles, error: pErr } = await admin
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (pErr) throw pErr;

      const { data: usersList, error: uErr } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (uErr) throw uErr;

      const emailMap = new Map(usersList.users.map((u) => [u.id, u.email ?? ""]));
      const result = (profiles ?? []).map((p) => ({
        ...p,
        email: emailMap.get(p.id) ?? "",
      }));
      return new Response(JSON.stringify({ users: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "suspend" || action === "unsuspend") {
      const targetId = body.user_id as string;
      if (!targetId) throw new Error("user_id required");
      const suspend = action === "suspend";
      const { error: upErr } = await admin
        .from("profiles")
        .update({ suspended: suspend })
        .eq("id", targetId);
      if (upErr) throw upErr;
      // Revoke active sessions when suspending
      if (suspend) {
        await admin.auth.admin.signOut(targetId).catch(() => {});
      }
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const targetId = body.user_id as string;
      if (!targetId) throw new Error("user_id required");
      if (targetId === userData.user.id) throw new Error("Cannot delete yourself");
      await admin.from("profiles").delete().eq("id", targetId);
      await admin.from("user_roles").delete().eq("user_id", targetId);
      const { error: dErr } = await admin.auth.admin.deleteUser(targetId);
      if (dErr) throw dErr;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-users error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
