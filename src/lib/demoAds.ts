import type { Ad } from "@/utils/adUtils";
import seafood from "@/assets/preview/seafood.webp";
import boutique from "@/assets/preview/boutique-ad.webp";
import concert from "@/assets/preview/concert-ad.webp";
import exuma from "@/assets/preview/exuma.webp";
import salon from "@/assets/preview/salon-ad.webp";
import house from "@/assets/preview/cafe-ad.webp";

export interface DemoAd extends Ad {
  demo: true;
  eyebrow: string;
  headline: string;
  cta: string;
  style: "food" | "editorial" | "night" | "travel" | "beauty" | "house";
}

// Fictional generated creatives. Disabled CTAs; no analytics, links, claims or real endorsements.
export const DEMO_SPLASH_ADS: DemoAd[] = [
  { id: "demo-ad-seafood", demo: true, title: "Salt & Sunshine Kitchen", description: "Fictional seafood restaurant", imageUrl: seafood, linkUrl: "", eyebrow: "Island flavours", headline: "Fresh from the sea.", cta: "View menu", style: "food" },
  { id: "demo-ad-boutique", demo: true, title: "Coral Thread · Grand Opening", description: "Fictional boutique opening", imageUrl: boutique, linkUrl: "", eyebrow: "A fresh island wardrobe", headline: "Find your colour.", cta: "Explore collection", style: "editorial" },
  { id: "demo-ad-concert", demo: true, title: "Palm Lights Sessions", description: "Illustrative concert, not a real event", imageUrl: concert, linkUrl: "", eyebrow: "An imagined island night", headline: "Good music. Great company.", cta: "Event details", style: "night" },
  { id: "demo-ad-exuma", demo: true, title: "Blue Pocket Exuma Tours", description: "Fictional island excursion", imageUrl: exuma, linkUrl: "", eyebrow: "A little island escape", headline: "Meet your next blue.", cta: "Explore tour", style: "travel" },
  { id: "demo-ad-salon", demo: true, title: "Crown & Curl Studio", description: "Fictional beauty studio", imageUrl: salon, linkUrl: "", eyebrow: "Your crown, your way", headline: "A fresh kind of glow.", cta: "View studio", style: "beauty" },
  { id: "demo-ad-house", demo: true, title: "Advertise on Bee App", description: "Sample house placement — not a paid ad", imageUrl: house, linkUrl: "", eyebrow: "Bee App · House concept", headline: "Your story belongs here.", cta: "Contact us", style: "house" },
];