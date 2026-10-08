// Generated fictional media, used ONLY behind usePreviewMode. No real listings or links.
import cafe from "@/assets/preview/cafe.webp";
import boutique from "@/assets/preview/boutique.webp";
import salon from "@/assets/preview/salon.webp";
import concert from "@/assets/preview/concert.webp";
import festival from "@/assets/preview/festival.webp";
import foodFestival from "@/assets/preview/food-festival.webp";
export type BeeNowTab = "for-you" | "businesses" | "events";

export interface DemoBeeNowItem {
  id: string;
  demo: true;
  type: "business" | "event";
  title: string;
  subtitle: string;
  island: string;
  description: string;
  posterUrl: string;
  sampleSchedule?: string;
}

export const DEMO_BEENOW_ITEMS: DemoBeeNowItem[] = [
  { id: "demo-cafe", demo: true, type: "business", title: "Guava & Glow Café", subtitle: "Business Spotlight · Sample", island: "New Providence", description: "Fresh guava pastries, island coffee, and a little morning sunshine. Fictional café.", posterUrl: cafe },
  { id: "demo-concert", demo: true, type: "event", title: "Palm Lights Sessions", subtitle: "Event Buzz · Sample", island: "New Providence", description: "An imagined evening of island voices under the palms. Not a confirmed event.", posterUrl: concert, sampleSchedule: "SAMPLE · 14 Nov, 6–9 PM" },
  { id: "demo-boutique", demo: true, type: "business", title: "Coral Thread Boutique", subtitle: "Business Spotlight · Sample", island: "Grand Bahama", description: "Breezy linen, bright colour, and everyday island style. Fictional boutique.", posterUrl: boutique },
  { id: "demo-festival", demo: true, type: "event", title: "Island Colour Parade", subtitle: "Event Buzz · Sample", island: "Grand Bahama", description: "An illustrative celebration of handmade costumes and rhythm. Not a confirmed event.", posterUrl: festival, sampleSchedule: "SAMPLE · 21 Nov, 2–6 PM" },
  { id: "demo-salon", demo: true, type: "business", title: "Crown & Curl Studio", subtitle: "Business Spotlight · Sample", island: "Eleuthera", description: "Natural curls and a fresh point of view. Meet an imagined island stylist. Fictional salon.", posterUrl: salon },
  { id: "demo-food", demo: true, type: "event", title: "Nassau Flavour Yard", subtitle: "Event Buzz · Sample", island: "New Providence", description: "An imagined gathering of island cooks and colourful plates. Not a confirmed event.", posterUrl: foodFestival, sampleSchedule: "SAMPLE · 28 Nov, noon–5 PM" },
];

export const filterDemoByTab = (tab: BeeNowTab) =>
  tab === "for-you"
    ? DEMO_BEENOW_ITEMS
    : DEMO_BEENOW_ITEMS.filter((i) => (tab === "businesses" ? i.type === "business" : i.type === "event"));
