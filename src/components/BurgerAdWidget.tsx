import { useState, useEffect, useRef } from "react";
import { ExternalLink, Volume2, VolumeX, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { isValidUrl } from "../utils/security";

interface VideoAd {
  videoSrc: string;
  posterSrc: string;
  title: string;
  highlight: string;
  gradientFrom: string;
  gradientTo: string;
  highlightColor: string;
  linkUrl: string;
  label: string;
}

const videoAds: VideoAd[] = [
  {
    // W3Schools free sample – universally CORS-friendly
    videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    posterSrc: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=356&auto=format&fit=crop",
    title: "Try the new",
    highlight: "Deluxe Burger",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-600",
    highlightColor: "text-amber-200",
    linkUrl: "https://www.mcdonalds.com",
    label: "Food & Dining",
  },
  {
    // Mozilla sample vertical video
    videoSrc: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    posterSrc: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=356&auto=format&fit=crop",
    title: "Escape to",
    highlight: "Paradise Beaches",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-600",
    highlightColor: "text-cyan-200",
    linkUrl: "https://www.bahamas.com",
    label: "Travel",
  },
  {
    // Another CORS-open public sample
    videoSrc: "https://www.w3schools.com/html/movie.mp4",
    posterSrc: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=356&auto=format&fit=crop",
    title: "Relax & unwind",
    highlight: "Spa Day Packages",
    gradientFrom: "from-teal-500",
    gradientTo: "to-emerald-600",
    highlightColor: "text-teal-200",
    linkUrl: "https://www.spafinder.com",
    label: "Wellness",
  },
  {
    // Commondatastorage sample
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    posterSrc: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=356&auto=format&fit=crop",
    title: "New arrivals",
    highlight: "Shop the Look",
    gradientFrom: "from-rose-500",
    gradientTo: "to-pink-600",
    highlightColor: "text-rose-200",
    linkUrl: "https://www.shopbahamas.com",
    label: "Fashion",
  },
];

const BurgerAdWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = videoAds[currentIndex];

  // Auto-advance every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => advance(1), 12000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  // Reload & play video when ad changes
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.load();
    vid.play().catch(() => {/* autoplay blocked – poster shows */});
  }, [currentIndex]);

  const advance = (dir: 1 | -1) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + dir + videoAds.length) % videoAds.length);
      setIsTransitioning(false);
    }, 250);
  };

  const handleClick = () => {
    if (isValidUrl(current.linkUrl)) {
      window.open(current.linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) videoRef.current.muted = !isMuted;
    setIsMuted(m => !m);
  };

  return (
    <div
      className={`
        relative flex items-center w-full overflow-hidden
        bg-gradient-to-r ${current.gradientFrom} ${current.gradientTo}
        rounded-xl sm:rounded-2xl border border-white/20
        transition-opacity duration-250 ease-out
        min-h-[64px] sm:min-h-[80px]
        ${isTransitioning ? "opacity-60" : "opacity-100"}
      `}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 rounded-2xl pointer-events-none" />

      {/* ── 9:16 vertical video container ── */}
      <div
        className="relative flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl border-2 border-white/30 shadow-lg bg-black
                   w-[36px] h-[64px] sm:w-[45px] sm:h-[80px] md:w-[54px] md:h-[96px]
                   ml-2 sm:ml-3 my-2"
        /* 9:16 = width × (16/9), hardcoded so it never reflows */
        style={{ aspectRatio: "9/16" }}
      >
        <video
          ref={videoRef}
          src={current.videoSrc}
          poster={current.posterSrc}
          muted={isMuted}
          autoPlay
          loop
          playsInline
          preload="metadata"
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-transform duration-300
          `}
        />
        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="absolute bottom-0.5 right-0.5 z-20 w-5 h-5 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm border border-white/20 touch-manipulation"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted
            ? <VolumeX size={9} className="text-white" />
            : <Volume2 size={9} className="text-white" />
          }
        </button>
        {/* 9:16 badge */}
        <div className="absolute top-0.5 left-0.5 z-20 px-1 py-px rounded bg-black/60 backdrop-blur-sm">
          <span className="text-[7px] font-bold text-white/80 leading-none">9:16</span>
        </div>
      </div>

      {/* ── Text content ── */}
      <div
        className="flex-1 min-w-0 px-2 sm:px-3 md:px-4 overflow-hidden cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center gap-1 mb-0.5">
          <Sparkles size={9} className="text-white flex-shrink-0" />
          <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-sm">
            Ad · {current.label}
          </span>
        </div>
        <div className="text-white text-xs sm:text-sm md:text-base font-bold leading-tight drop-shadow truncate
                        [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">
          {current.title}
        </div>
        <div className={`${current.highlightColor} text-xs sm:text-sm md:text-base font-extrabold leading-tight truncate
                         drop-shadow [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]`}>
          {current.highlight}
        </div>

        {/* Progress dots */}
        <div className="flex gap-1 mt-1.5">
          {videoAds.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); advance(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-4 bg-white/90" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── CTA + nav arrows ── */}
      <div className="hidden sm:flex flex-col items-end gap-1.5 pr-3">
        <div
          onClick={handleClick}
          className="flex items-center gap-1.5 cursor-pointer
                     bg-white/20 backdrop-blur-sm text-white px-3 py-1.5
                     rounded-lg text-xs font-bold border border-white/25
                     hover:bg-white/30 transition-all duration-200 whitespace-nowrap"
        >
          <span>View</span>
          <ExternalLink size={12} className="opacity-80" />
        </div>
        <div className="flex gap-1">
          <button
            onClick={e => { e.stopPropagation(); advance(-1); }}
            className="w-6 h-6 flex items-center justify-center rounded-md bg-white/15 hover:bg-white/30 border border-white/20 transition-colors touch-manipulation"
            aria-label="Previous ad"
          >
            <ChevronLeft size={12} className="text-white" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); advance(1); }}
            className="w-6 h-6 flex items-center justify-center rounded-md bg-white/15 hover:bg-white/30 border border-white/20 transition-colors touch-manipulation"
            aria-label="Next ad"
          >
            <ChevronRight size={12} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BurgerAdWidget;
