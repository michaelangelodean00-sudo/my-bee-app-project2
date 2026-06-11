import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Check,
  X,
  Phone,
  Globe,
  Instagram,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Facebook,
  Twitter,
  Navigation,
} from "lucide-react";
import {
  listApprovals,
  setApprovalStatus,
  subscribeApprovals,
  type BusinessApprovalSubmission,
} from "@/utils/businessApprovals";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import RejectionReasonDialog from "@/components/admin/RejectionReasonDialog";

// A valid v4 UUID — used to detect submissions tied to a real auth user
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Filter = "pending" | "approved" | "rejected" | "all";

const STATUS_META: Record<
  BusinessApprovalSubmission["status"],
  { label: string; icon: typeof Clock; className: string }
> = {
  pending: { label: "Pending", icon: Clock, className: "bg-amber-500 text-white" },
  approved: { label: "Approved", icon: CheckCircle2, className: "bg-emerald-500 text-white" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-rose-500 text-white" },
};

const BusinessApprovals = () => {
  const [rows, setRows] = useState<BusinessApprovalSubmission[]>(listApprovals());
  const [filter, setFilter] = useState<Filter>("pending");
  const [rejectTarget, setRejectTarget] = useState<BusinessApprovalSubmission | null>(null);

  useEffect(() => subscribeApprovals(() => setRows(listApprovals())), []);

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const counts = {
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
    all: rows.length,
  };

  const handleApprove = async (r: BusinessApprovalSubmission) => {
    if (UUID_RE.test(r.ownerKey)) {
      const userId = r.ownerKey;
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({ status: "approved", account_type: "business" })
        .eq("id", userId);
      if (profileErr) {
        toast.error(`Could not approve ${r.name}: ${profileErr.message}`);
        return;
      }
      // Grant the business role (idempotent — unique (user_id, role))
      const { error: roleErr } = await supabase
        .from("user_roles")
        .upsert({ user_id: userId, role: "business" }, { onConflict: "user_id,role" });
      if (roleErr && !roleErr.message.includes("duplicate")) {
        toast.error(`Profile approved but role grant failed: ${roleErr.message}`);
      }
    }
    setApprovalStatus(r.id, "approved");
    toast.success(`Approved ${r.name}`);
  };
  const performReject = async (r: BusinessApprovalSubmission, reason: string) => {
    if (UUID_RE.test(r.ownerKey)) {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "rejected", rejection_reason: reason })
        .eq("id", r.ownerKey);
      if (error) {
        toast.error(`Could not reject ${r.name}: ${error.message}`);
        return;
      }
      // Fire-and-forget email notification. Will fail silently until the
      // email domain + send-transactional-email function are configured.
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "submission-rejected",
            recipientUserId: r.ownerKey,
            idempotencyKey: `reject-business-${r.id}`,
            templateData: {
              submissionType: "business",
              submissionName: r.name,
              rejectionReason: reason,
            },
          },
        });
      } catch {
        /* email infra not yet provisioned — DB state is authoritative */
      }
    }
    setApprovalStatus(r.id, "rejected", reason);
    toast.message(`Rejected ${r.name}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Building2 className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold">Business Approvals</h2>
        <Badge variant="secondary" className="ml-auto">
          {counts.pending} pending
        </Badge>
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

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No {filter === "all" ? "" : filter} submissions.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const Meta = STATUS_META[r.status];
            const StatusIcon = Meta.icon;
            return (
              <div
                key={r.id}
                className="rounded-xl border border-border bg-card p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-amber-500/30">
                    <AvatarImage src={r.avatarUrl} />
                    <AvatarFallback className="bg-amber-100 text-amber-700">
                      {r.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm truncate">{r.name}</h3>
                      <Badge className={cn("text-xs", Meta.className)}>
                        <StatusIcon size={10} className="mr-1" />
                        {Meta.label}
                      </Badge>
                      {r.businessCategory && (
                        <Badge variant="outline" className="text-xs">
                          {r.businessCategory}
                        </Badge>
                      )}
                    </div>
                    {r.location && (
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin size={11} className="mr-1" />
                        {r.location}
                      </div>
                    )}
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Submitted {new Date(r.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {r.bio && (
                  <p className="text-xs text-foreground/80 leading-relaxed">{r.bio}</p>
                )}

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {r.businessPhone && (
                    <span className="flex items-center gap-1">
                      <Phone size={12} /> {r.businessPhone}
                    </span>
                  )}
                  {r.businessWebsite && (
                    <span className="flex items-center gap-1">
                      <Globe size={12} /> {r.businessWebsite}
                    </span>
                  )}
                  {r.businessStreetAddress && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {r.businessStreetAddress}
                    </span>
                  )}
                  {r.businessGoogleMapUrl && (
                    <span className="flex items-center gap-1">
                      <Navigation size={12} /> Map
                    </span>
                  )}
                  {r.businessInstagram && (
                    <span className="flex items-center gap-1">
                      <Instagram size={12} /> Instagram
                    </span>
                  )}
                  {r.businessFacebook && (
                    <span className="flex items-center gap-1">
                      <Facebook size={12} /> Facebook
                    </span>
                  )}
                  {r.businessTwitter && (
                    <span className="flex items-center gap-1">
                      <Twitter size={12} /> Twitter
                    </span>
                  )}
                  {r.businessTiktok && (
                    <span className="flex items-center gap-1">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.5-4.35 2.89 2.89 0 0 1 2.5-1.43c.26 0 .51.04.76.1V9.56a6.37 6.37 0 0 0-.76-.05A6.34 6.34 0 0 0 5 15.88a6.34 6.34 0 0 0 6.34 6.33 6.34 6.34 0 0 0 6.33-6.33V8.78a8.27 8.27 0 0 0 4.83 1.55V6.88a4.87 4.87 0 0 1-2.91-.19z"/>
                      </svg> TikTok
                    </span>
                  )}
                </div>

                {r.status === "rejected" && r.rejectionReason && (
                  <div className="rounded-lg border border-rose-200/60 bg-rose-50/60 dark:bg-rose-950/20 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
                    <span className="font-semibold">Rejection reason:</span> {r.rejectionReason}
                  </div>
                )}

                {r.status === "pending" && (
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={() => handleApprove(r)}
                    >
                      <Check size={14} className="mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      onClick={() => handleReject(r)}
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
    </div>
  );
};

export default BusinessApprovals;
