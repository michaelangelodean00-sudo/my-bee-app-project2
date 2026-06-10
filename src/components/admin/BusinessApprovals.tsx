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
} from "lucide-react";
import {
  listApprovals,
  setApprovalStatus,
  subscribeApprovals,
  type BusinessApprovalSubmission,
} from "@/utils/businessApprovals";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  useEffect(() => subscribeApprovals(() => setRows(listApprovals())), []);

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const counts = {
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
    all: rows.length,
  };

  const handleApprove = (r: BusinessApprovalSubmission) => {
    setApprovalStatus(r.id, "approved");
    toast.success(`Approved ${r.name}`);
  };
  const handleReject = (r: BusinessApprovalSubmission) => {
    setApprovalStatus(r.id, "rejected");
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
                  {r.businessSocial && (
                    <span className="flex items-center gap-1">
                      <Instagram size={12} /> {r.businessSocial}
                    </span>
                  )}
                </div>

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
