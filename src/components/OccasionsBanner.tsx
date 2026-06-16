import { memo } from "react";
import { Sparkles } from "lucide-react";

interface Occasion {
  label: string;
  icon: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

const occasions: Occasion[] = [
  { label: "Happy New Year", icon: "🎆", startMonth: 12, startDay: 28, endMonth: 1, endDay: 5 },
  { label: "Happy Valentine's Day", icon: "💘", startMonth: 2, startDay: 10, endMonth: 2, endDay: 15 },
  { label: "Happy Easter", icon: "🐰", startMonth: 3, startDay: 20, endMonth: 4, endDay: 25 },
  { label: "Happy Mother's Day", icon: "🌸", startMonth: 5, startDay: 5, endMonth: 5, endDay: 12 },
  { label: "Happy Father's Day", icon: "👔", startMonth: 6, startDay: 10, endMonth: 6, endDay: 16 },
  { label: "Happy Independence Day", icon: "🎇", startMonth: 6, startDay: 28, endMonth: 7, endDay: 6 },
  { label: "Happy Halloween", icon: "🎃", startMonth: 10, startDay: 20, endMonth: 11, endDay: 2 },
  { label: "Merry Christmas", icon: "🎄", startMonth: 12, startDay: 1, endMonth: 12, endDay: 27 },
  { label: "Happy Thanksgiving", icon: "🦃", startMonth: 11, startDay: 15, endMonth: 11, endDay: 30 },
];

function getCurrentOccasion(): Occasion | null {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  for (const occ of occasions) {
    const inRange = (month: number, day: number, startM: number, startD: number, endM: number, endD: number): boolean => {
      const dateVal = month * 100 + day;
      const startVal = startM * 100 + startD;
      const endVal = endM * 100 + endD;
      if (startVal <= endVal) {
        return dateVal >= startVal && dateVal <= endVal;
      }
      // wraps around year (e.g., Dec 28 -> Jan 5)
      return dateVal >= startVal || dateVal <= endVal;
    };

    if (inRange(m, d, occ.startMonth, occ.startDay, occ.endMonth, occ.endDay)) {
      return occ;
    }
  }
  return null;
}

const OccasionsBanner = memo(() => {
  const occasion = getCurrentOccasion();
  if (!occasion) return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-primary/15 via-primary/5 to-primary/15 border border-primary/20 shadow-sm backdrop-blur-sm animate-shimmer whitespace-nowrap">
      <Sparkles size={12} className="text-primary flex-shrink-0" />
      <span className="text-[10px] sm:text-xs font-heading font-semibold text-primary tracking-wide select-none">
        {occasion.icon} {occasion.label}
      </span>
      <Sparkles size={12} className="text-primary flex-shrink-0" />
    </div>
  );
});

OccasionsBanner.displayName = "OccasionsBanner";

export default OccasionsBanner;
