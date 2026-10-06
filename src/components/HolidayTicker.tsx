interface HolidayGreeting {
  message: string;
  symbol: string;
  motion: "twinkle" | "hop" | "pulse" | "wave";
}

const dateAtStartOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const nthWeekdayOfMonth = (
  year: number,
  month: number,
  weekday: number,
  occurrence: number,
) => {
  const firstDay = new Date(year, month, 1);
  const offset = (weekday - firstDay.getDay() + 7) % 7;
  return new Date(year, month, 1 + offset + (occurrence - 1) * 7);
};

const easterSunday = (year: number) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
};

const isWithinDays = (date: Date, occasion: Date, daysBefore: number, daysAfter: number) => {
  const day = dateAtStartOfDay(date).getTime();
  const occasionDay = dateAtStartOfDay(occasion).getTime();
  const dayInMs = 24 * 60 * 60 * 1000;
  return day >= occasionDay - daysBefore * dayInMs && day <= occasionDay + daysAfter * dayInMs;
};

/** Splits a symbol string into single grapheme clusters (keeps flag emojis intact). */
const splitEmojis = (value: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(value), (part) => part.segment);
  }
  return Array.from(value);
};

export const getHolidayGreeting = (date = new Date()): HolidayGreeting | null => {
  const year = date.getFullYear();

  if (isWithinDays(date, new Date(year, 11, 25), 7, 5)) {
    return { message: "Merry Christmas from B.E.E App Bahamas", symbol: "🎄🎅✨🎁", motion: "twinkle" };
  }

  const newYear = new Date(date.getMonth() === 11 ? year + 1 : year, 0, 1);
  if (isWithinDays(date, newYear, 1, 1)) {
    return { message: "Happy New Year from B.E.E App Bahamas", symbol: "🎆🎉🥳✨", motion: "twinkle" };
  }

  if (isWithinDays(date, easterSunday(year), 1, 1)) {
    return { message: "Happy Easter from B.E.E App Bahamas", symbol: "🐣🐰🌷🥚", motion: "hop" };
  }

  if (isWithinDays(date, nthWeekdayOfMonth(year, 4, 0, 2), 1, 1)) {
    return { message: "Happy Mother’s Day from B.E.E App Bahamas", symbol: "💐💖🌸", motion: "pulse" };
  }

  if (isWithinDays(date, nthWeekdayOfMonth(year, 5, 0, 3), 1, 1)) {
    return { message: "Happy Father’s Day from B.E.E App Bahamas", symbol: "👔💙🎣", motion: "pulse" };
  }

  if (isWithinDays(date, new Date(year, 6, 10), 1, 1)) {
    return { message: "Happy Independence Day, Bahamas", symbol: "🇧🇸🎉✨", motion: "wave" };
  }

  return null;
};

const HolidayTicker = () => {
  const greeting = getHolidayGreeting() ?? (import.meta.env.DEV
    ? { message: "Merry Christmas from B.E.E App Bahamas", symbol: "🎄🎅✨🎁", motion: "twinkle" as const }
    : null);

  if (!greeting) return null;

  const emojis = splitEmojis(greeting.symbol);

  return (
    <div
      className="overflow-hidden bg-transparent"
      role="status"
      aria-label={greeting.message}
    >
      <div className="holiday-ticker-track flex w-max items-center gap-3 whitespace-nowrap py-1.5 font-heading text-xs font-semibold sm:text-sm text-foreground">
        <span aria-hidden="true">
          {emojis.map((emoji, index) => (
            <span
              key={`lead-${index}`}
              className="holiday-emoji"
              data-motion={greeting.motion}
              style={{ animationDelay: `${index * 0.18}s` }}
            >
              {emoji}
            </span>
          ))}
        </span>
        <span>{greeting.message}</span>
        <span aria-hidden="true">
          {emojis.map((emoji, index) => (
            <span
              key={`trail-${index}`}
              className="holiday-emoji"
              data-motion={greeting.motion}
              style={{ animationDelay: `${index * 0.18}s` }}
            >
              {emoji}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};

export default HolidayTicker;
