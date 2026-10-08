// DEMO-ONLY content for the admin design preview. Never shown to guests or regular users.
// Contains no real business names and no working external links.
export type BeeNowTab = "for-you" | "businesses" | "events";

export interface DemoBeeNowItem {
  id: string;
  demo: true;
  type: "business" | "event";
  title: string;
  subtitle: string;
}

export const DEMO_BEENOW_ITEMS: DemoBeeNowItem[] = [
  { id: "demo-1", demo: true, type: "business", title: "Sample business video", subtitle: "Placeholder · Business" },
  { id: "demo-2", demo: true, type: "event", title: "Sample event video", subtitle: "Placeholder · Event" },
  { id: "demo-3", demo: true, type: "business", title: "Sample entrepreneur clip", subtitle: "Placeholder · Business" },
  { id: "demo-4", demo: true, type: "event", title: "Sample weekend event", subtitle: "Placeholder · Event" },
];

export const filterDemoByTab = (tab: BeeNowTab) =>
  tab === "for-you"
    ? DEMO_BEENOW_ITEMS
    : DEMO_BEENOW_ITEMS.filter((i) => (tab === "businesses" ? i.type === "business" : i.type === "event"));
