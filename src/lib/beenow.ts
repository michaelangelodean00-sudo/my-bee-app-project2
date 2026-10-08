import type { BeeNowTab } from "./demoContent";

export interface BeeNowVideo {
  id: string;
  type: "business" | "event";
  title: string;
  posterUrl: string;
  ownerName: string;
  linkPath: string;
}

/**
 * Real BeeNow feed. Approved, persisted videos do not exist yet
 * (upload/storage/moderation arrive in Checkpoint 3), so this honestly returns none.
 */
export const useBeeNowFeed = (_tab: BeeNowTab): { videos: BeeNowVideo[]; loading: boolean } => ({
  videos: [],
  loading: false,
});
