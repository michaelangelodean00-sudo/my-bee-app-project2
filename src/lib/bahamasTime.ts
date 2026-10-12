// Open-now logic for business hours, always evaluated in America/Nassau (handles DST via Intl).
export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayKey = (typeof DAYS)[number];
export const DAY_LABELS: Record<DayKey, string> = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday",
};
export interface DayHours { closed: boolean; open?: string; close?: string }
export type WeekHours = Partial<Record<DayKey, DayHours>>;

const TZ = "America/Nassau";
const WD: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

/** Nassau weekday index (0 = Mon) and minutes since midnight. */
export const nassauNow = (date: Date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: WD[get("weekday")] ?? 0, minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
};

const toMin = (s?: string) => {
  if (!s || !/^\d{2}:\d{2}$/.test(s)) return null;
  return Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
};

export const formatTime = (s?: string) => {
  const m = toMin(s);
  if (m === null) return "";
  const h = Math.floor(m / 60), mm = m % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${mm ? `:${String(mm).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`;
};

const span = (d?: DayHours) => {
  if (!d || d.closed) return null;
  const o = toMin(d.open), c = toMin(d.close);
  if (o === null || c === null || o === c) return null;
  return { o, c, overnight: c < o };
};

export type OpenStatus = { open: boolean; label: string } | null;

/** Returns null when no usable hours exist, so no badge is shown. */
export const getOpenStatus = (hours: WeekHours | null | undefined, date: Date = new Date()): OpenStatus => {
  if (!hours || !DAYS.some((d) => span(hours[d]))) return null;
  const { day, minutes } = nassauNow(date);
  const today = span(hours[DAYS[day]]);
  const yesterday = span(hours[DAYS[(day + 6) % 7]]);

  if (yesterday?.overnight && minutes < yesterday.c) {
    return { open: true, label: `Open · closes ${formatTime(hours[DAYS[(day + 6) % 7]]!.close)}` };
  }
  if (today && minutes >= today.o && (today.overnight || minutes < today.c)) {
    return { open: true, label: `Open · closes ${formatTime(hours[DAYS[day]]!.close)}` };
  }
  if (today && minutes < today.o) return { open: false, label: `Closed · opens ${formatTime(hours[DAYS[day]]!.open)}` };
  for (let i = 1; i <= 7; i++) {
    const k = DAYS[(day + i) % 7];
    if (span(hours[k])) {
      return { open: false, label: `Closed · opens ${i === 1 ? "tomorrow" : DAY_LABELS[k].slice(0, 3)} ${formatTime(hours[k]!.open)}` };
    }
  }
  return null;
};
