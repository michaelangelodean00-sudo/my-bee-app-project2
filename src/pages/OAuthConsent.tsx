import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Local typed wrapper for the beta `supabase.auth.oauth` namespace.
type AuthorizationDetails = {
  client?: { name?: string; logo_uri?: string };
  redirect_url?: string;
  redirect_to?: string;
  scopes?: string[];
};
type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: { redirect_url?: string; redirect_to?: string } | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: { redirect_url?: string; redirect_to?: string } | null; error: { message: string } | null }>;
};
const oauth = (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("Missing authorization_id");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        // Preserve FULL consent URL so auth returns the user here.
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      return setError(error.message);
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      return setError("No redirect returned by the authorization server.");
    }
    window.location.href = target;
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full p-6 space-y-3">
          <h1 className="text-lg font-semibold">Could not load this authorization request</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </Card>
      </main>
    );
  }
  if (!details) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  const clientName = details.client?.name ?? "this app";
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-md w-full p-6 space-y-5">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Connect {clientName} to your account</h1>
          <p className="text-sm text-muted-foreground">
            This lets {clientName} access the B.E.E App as you. You can revoke access at any time.
          </p>
        </div>
        <div className="flex gap-3">
          <Button disabled={busy} onClick={() => decide(true)} className="flex-1">
            Approve
          </Button>
          <Button disabled={busy} onClick={() => decide(false)} variant="outline" className="flex-1">
            Deny
          </Button>
        </div>
      </Card>
    </main>
  );
}
