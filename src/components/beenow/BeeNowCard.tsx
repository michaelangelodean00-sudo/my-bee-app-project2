import { memo, useEffect, useRef, useState } from "react";
import { Play, Pause, VolumeX, Heart, Bookmark, Share2, ArrowUpRight, MapPin } from "lucide-react";
import type { DemoBeeNowItem } from "@/lib/demoContent";
import { Button } from "@/components/ui/button";

/** Generated-photo motion, not recorded video. No audio, links, tracking or social actions. */
const BeeNowCard = memo(({ item }: { item: DemoBeeNowItem }) => {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Only the playing card subscribes; no per-card observers. Stop when offscreen or backgrounded.
  useEffect(() => {
    if (!playing) return;
    const check = () => {
      const bounds = ref.current?.getBoundingClientRect();
      if (document.hidden || !bounds || bounds.bottom < 100 || bounds.top > window.innerHeight - 100) setPlaying(false);
    };
    const stopOther = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== item.id) setPlaying(false);
    };
    window.addEventListener("scroll", check, { passive: true, capture: true });
    document.addEventListener("visibilitychange", check);
    window.addEventListener("bee-demo-play", stopOther);
    const timer = window.setTimeout(() => setPlaying(false), 15000);
    return () => {
      window.removeEventListener("scroll", check, true);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("bee-demo-play", stopOther);
      window.clearTimeout(timer);
    };
  }, [playing, item.id]);

  const toggle = () => {
    if (!playing) window.dispatchEvent(new CustomEvent("bee-demo-play", { detail: item.id }));
    setPlaying(value => !value);
  };

  return (
    <article ref={ref} className="bee-demo-card relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-muted" aria-label={`${item.title} — fictional animated design preview`} data-demo-id={item.id} data-playing={playing}>
      {!failed && <img src={item.posterUrl} alt={`Generated illustration of ${item.title}`} width={720} height={1280} loading="lazy" decoding="async" draggable={false} onError={() => setFailed(true)} className={`bee-demo-photo absolute inset-0 h-full w-full object-cover ${playing ? "is-playing" : ""}`} />}
      <div className="bee-demo-shade pointer-events-none absolute inset-0" />
      <div className="absolute inset-x-3 top-3 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded bg-destructive px-2 py-1 text-[10px] font-bold text-destructive-foreground">DEMO · NOT A REAL LISTING</span>
        <span className="bee-demo-glass rounded px-2 py-1 text-[10px] font-semibold">{item.type === "business" ? "Business Spotlight" : "Event Buzz"}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={toggle} disabled={failed || reduced} aria-label={`${playing ? "Pause" : "Play"} animated preview: ${item.title}`} aria-pressed={playing} className="bee-demo-glass absolute left-1/2 top-[42%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full hover:bg-primary hover:text-primary-foreground active:scale-95">
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </Button>
      <div className="absolute right-3 top-[53%] flex flex-col gap-1">
        {[{ Icon: Heart, name: "Like" }, { Icon: Bookmark, name: "Save" }, { Icon: Share2, name: "Share" }].map(({ Icon, name }) => (
          <Button key={name} variant="ghost" size="icon" disabled aria-label={`${name} — preview only`} title={`${name} — preview only`} className="bee-demo-glass rounded-full disabled:opacity-80"><Icon aria-hidden="true" /></Button>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="mb-2 flex items-center gap-1 text-xs"><MapPin size={12} aria-hidden="true" />{item.island} · Sample</p>
        <h3 className="max-w-[85%] font-heading text-xl font-bold leading-tight">{item.title}</h3>
        <p className="mt-2 max-w-[85%] text-sm leading-snug">{item.description}</p>
        {item.sampleSchedule && <p className="mt-2 text-xs font-semibold">{item.sampleSchedule} · illustrative date</p>}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-[10px]"><VolumeX size={13} aria-hidden="true" />{failed ? "Image unavailable" : reduced ? "Still design preview · no audio" : "Animated design preview · no audio"}</span>
          <span className="text-[10px]">Preview only</span>
        </div>
        <Button disabled className="mt-2 w-full justify-between disabled:opacity-90" aria-label={`${item.type === "business" ? "View Business" : "Event Details"} — preview only`}>
          {item.type === "business" ? "View Business" : "Event Details"}<ArrowUpRight aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
});
BeeNowCard.displayName = "BeeNowCard";
export default BeeNowCard;
