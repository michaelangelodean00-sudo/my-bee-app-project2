import { memo } from "react";
import { Play } from "lucide-react";
import type { DemoBeeNowItem } from "@/lib/demoContent";

/** Poster-only preview card. Demo cards are clearly labelled and have no links. */
const BeeNowCard = memo(({ item }: { item: DemoBeeNowItem }) => (
  <div
    className="relative aspect-[9/16] w-full overflow-hidden rounded-xl border border-dashed border-primary/50 bg-gradient-to-b from-secondary to-muted"
    aria-label={`${item.title} — demo placeholder, not a real listing`}
  >
    <span className="absolute left-2 top-2 rounded-md bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive-foreground">
      Demo – not real
    </span>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background/70 text-foreground">
        <Play size={20} aria-hidden="true" />
      </span>
    </div>
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-3">
      <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
      <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
    </div>
  </div>
));
BeeNowCard.displayName = "BeeNowCard";
export default BeeNowCard;
