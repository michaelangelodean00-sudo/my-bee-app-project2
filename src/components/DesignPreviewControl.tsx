import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreviewMode } from "@/hooks/usePreviewMode";

const DesignPreviewControl = ({ page = "home" }: { page?: "home" | "beenow" }) => {
  const { canPreview, isPreview, setPreview } = usePreviewMode();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!canPreview || searchParams.get("bee_preview") !== "1") return;
    setPreview(true);
    const cleaned = new URLSearchParams(searchParams);
    cleaned.delete("bee_preview");
    setSearchParams(cleaned, { replace: true });
  }, [canPreview, searchParams, setSearchParams, setPreview]);

  if (!canPreview) return null;

  return (
    <section aria-label="Design Preview" className="relative z-10 w-full border-y border-primary/30 bg-card/95 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1 basis-64">
          <h2 className="font-heading text-sm font-semibold text-primary">Design Preview · Admin only</h2>
          <p aria-live="polite" className="mt-1 text-sm text-foreground break-words">
            {isPreview
              ? "DEMO MODE: 6 sample rotating ads + 6 fictional BeeNow previews"
              : "Your sample ads and BeeNow previews are hidden. Turn on Design Preview to review the 6 ads and 6 video examples."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Photo-motion examples, not recorded clips · This tab only</p>
        </div>
        <Button
          type="button"
          variant={isPreview ? "outline" : "default"}
          aria-pressed={isPreview}
          onClick={() => setPreview(!isPreview)}
          className="min-h-[44px] max-w-full shrink-0 active:scale-95"
        >
          {isPreview ? <X aria-hidden="true" /> : <Eye aria-hidden="true" />}
          {isPreview ? "Exit Demo" : page === "beenow" ? "Preview the six sample clips" : "Show Demo Layout"}
        </Button>
      </div>
    </section>
  );
};

export default DesignPreviewControl;