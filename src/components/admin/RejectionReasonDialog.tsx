import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, X } from "lucide-react";

interface RejectionReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subjectLabel: string; // e.g. business or video name
  onConfirm: (reason: string) => void | Promise<void>;
}

const MIN_LEN = 5;
const MAX_LEN = 500;

const RejectionReasonDialog = ({
  open,
  onOpenChange,
  title = "Reject submission",
  subjectLabel,
  onConfirm,
}: RejectionReasonDialogProps) => {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setReason("");
      setTouched(false);
      setSubmitting(false);
    }
  }, [open]);

  const trimmed = reason.trim();
  const tooShort = trimmed.length < MIN_LEN;
  const error = touched && tooShort ? `Please enter at least ${MIN_LEN} characters.` : "";

  const handleSubmit = async () => {
    setTouched(true);
    if (tooShort) return;
    setSubmitting(true);
    try {
      await onConfirm(trimmed);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !submitting && onOpenChange(o)}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <X className="h-4 w-4 text-rose-500" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Provide a reason for rejecting <span className="font-medium text-foreground">{subjectLabel}</span>.
            This is stored for the audit log and emailed to the submitter.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rejection-reason">Reason <span className="text-destructive">*</span></Label>
          <Textarea
            id="rejection-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, MAX_LEN))}
            onBlur={() => setTouched(true)}
            placeholder="e.g. Photos do not meet quality guidelines; please resubmit with clearer images."
            rows={4}
            autoFocus
            aria-invalid={!!error}
          />
          <div className="flex items-center justify-between text-xs">
            {error ? (
              <span className="text-destructive flex items-center gap-1">
                <AlertCircle size={12} /> {error}
              </span>
            ) : (
              <span className="text-muted-foreground">Minimum {MIN_LEN} characters.</span>
            )}
            <span className="text-muted-foreground">{trimmed.length}/{MAX_LEN}</span>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={submitting || tooShort}
          >
            {submitting ? "Rejecting…" : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionReasonDialog;
