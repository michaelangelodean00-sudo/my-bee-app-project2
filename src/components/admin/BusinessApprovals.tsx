import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Check,
  X,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import RejectionReasonDialog from "@/components/admin/RejectionReasonDialog";

// ─────────────────────────────────────────────────────────────────
// SEC-4 FIX: this queue is now driven by the `profiles` table.
// The old version read from the admin's OWN localStorage, so any
// submission made on another device was invisible to the admin.
// The database is the single source of truth.
// ─────────────────────────────────────────────────────────────────

type ApprovalStatus = "pending" | "approved" | "rejected";
type Filter = ApprovalStatus | "all";

interface BusinessRow {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  business_name: string | null;
  business_category: string | null;
  phone: string | null;
  address: string | null;
  status: ApprovalStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_META: Record<
  ApprovalStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  pending: { label: "Pending", icon: Clock, className: "bg-amber-500 text-white" },
  approved: { label: "Approved", icon: CheckCircle2, className: "bg-emerald-500 text-white" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-rose-500 text-white" },
};

const BusinessApprovals = () => {
  const [rows, setRows] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [rejectTarget, setRejectTarget] = useState<BusinessRow | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, display_name, avatar_url, business_name, business_category, phone, address, status, rejection_reason, created_at, updated_at"
      )
      .eq("account_type", "business")
      .order("updated_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Could not load submissions");
      return;
    }
    setRows((data ?? []) as BusinessRow[]);
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const writeAudit = async (action: string, targetId: string, detail?: object) => {
    const { data: userRes } = await supabase.auth.getUser();
    if (!userRes?.user) return;
    await supabase
      .from("admin_actions")
      .insert({
        actor_id: userRes.user.id,
        action,
        target_type: "business_profile",
        target_id: targetId,
        detail: detail ?? null,
      })
      .then(undefined, () => {}); // audit failure never blocks the action
  };

  const displayName = (r: BusinessRow) =>
    r.business_name || r.display_name || "Unnamed business";

  const handleApprove = async (r: BusinessRow) => {
    setBusyId(r.id);
    const { error: profileErr } = await supabase
      .from("profiles")
      .update({ status: "approved", rejection_reason: null })
      .eq("id", r.id);
    if (profileErr) {
      setBusyId(null);
      toast.error(`Could not approve ${displayName(r)}: ${profileErr.message}`);
      return;
    }
    // Grant the business role (idempotent — unique (user_id, role))
    const { error: roleErr } = await supabase
      .from("user_roles")
      .upsert({ user_id: r.id, role: "business" }, { onConflict: "user_id,role" });
    if (roleErr && !roleErr.message.includes("duplicate")) {
      toast.error(`Profile approved but role grant failed: ${roleErr.message}`);
    }
    await writeAudit("business.approve", r.id);
    setBusyId(null);
    toast.success(`Approved ${displayName(r)}`);
    fetchRows();
  };

  const performReject = async (r: BusinessRow, reason: string) => {
    setBusyId(r.id);
    const { error } = await supabase
      .from("profiles")
      .update({ status: "rejected", rejection_reason: reason })
      .eq("id", r.id);
    if (error) {
      setBusyId(null);
      toast.error(`Could not reject ${displayName(r)}: ${error.message}`);
      return;
    }
    await writeAudit("business.reject", r.id, { reason });
    // Fire-and-forget email notification. Fails silently until the
    // send-transactional-email function + sending domain exist.
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "submission-rejected",
          recipientUserId: r.id,
          idempotencyKey: `reject-business-${r.id}-${Date.now()}`,
          templateData: {
            submissionType: "business",
            submissionName: displayName(r),
            rejectionReason: reason,
          },
        },
      });
    } catch {
      /* email infra not yet provisioned — DB state is authoritative */
    }
    setBusyId(null);
    toast.message(`Rejected ${displayName(r)}`);
    fetchRows();
  };

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const counts = {
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
    all: rows.length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Building2 className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold">Business Approvals</h2>
        <Badge variant="secondary">{counts.pending} pending</Badge>
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto"
          onClick={fetchRows}
          disabled={loading}
          aria-label="Refresh submissions"
        >
          <RefreshCw size={14} className={cn("mr-1", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["pending", "approved", "rejected", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize",
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-muted-foreground/50"
            )}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading && rows.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No {filter === "all" ? "" : filter} submissions.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const Meta = STATUS_META[r.status];
            const StatusIcon = Meta.icon;
            const name = displayName(r);
            return (
              <div key={r.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-amber-500/30">
                    <AvatarImage src={r.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-amber-100 text-amber-700">
                      {name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm truncate">{name}</h3>
                      <Badge className={cn("text-xs", Meta.className)}>
                        <StatusIcon size={10} className="mr-1" />
                        {Meta.label}
                      </Badge>
                      {r.business_category && (
                        <Badge variant="outline" className="text-xs">
                          {r.business_category}
                        </Badge>
                      )}
                    </div>
                    {r.display_name && r.business_name && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Owner: {r.display_name}
                      </div>
                    )}
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Submitted {new Date(r.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {r.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={12} /> {r.phone}
                    </span>
                  )}
                  {r.address && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {r.address}
                    </span>
                  )}
                </div>

                {r.status === "rejected" && r.rejection_reason && (
                  <div className="rounded-lg border border-rose-200/60 bg-rose-50/60 dark:bg-rose-950/20 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
                    <span className="font-semibold">Rejection reason:</span> {r.rejection_reason}
                  </div>
                )}

                {r.status === "pending" && (
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                      disabled={busyId === r.id}
                      onClick={() => handleApprove(r)}
                    >
                      <Check size={14} className="mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      disabled={busyId === r.id}
                      onClick={() => setRejectTarget(r)}
                    >
                      <X size={14} className="mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <RejectionReasonDialog
        open={!!rejectTarget}
        onOpenChange={(o) => !o && setRejectTarget(null)}
        title="Reject business submission"
        subjectLabel={rejectTarget ? displayName(rejectTarget) : ""}
        onConfirm={async (reason) => {
          if (rejectTarget) await performReject(rejectTarget, reason);
        }}
      />
    </div>
  );
};

export default BusinessApprovals;
