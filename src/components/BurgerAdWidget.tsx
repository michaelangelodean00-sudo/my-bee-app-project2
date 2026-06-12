import { useState, useEffect, useRef } from "react";
import { ExternalLink, Volume2, VolumeX, Sparkles, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { isValidUrl } from "../utils/security";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAdAnalytics } from "@/hooks/useAdAnalytics";
import AdPerformanceMetrics from "./AdPerformanceMetrics";

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
    videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    posterSrc: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=450&auto=format&fit=crop",
    title: "Try the new",
    highlight: "Deluxe Burger",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-600",
    highlightColor: "text-amber-200",
    linkUrl: "https://www.mcdonalds.com",
    label: "Food & Dining",
  },
  {
    videoSrc: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    posterSrc: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&auto=format&fit=crop",
    title: "Escape to",
    highlight: "Paradise Beaches",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-600",
    highlightColor: "text-cyan-200",
    linkUrl: "https://www.bahamas.com",
    label: "Travel",
  },
  {
    videoSrc: "https://www.w3schools.com/html/movie.mp4",
    posterSrc: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&auto=format&fit=crop",
    title: "Relax & unwind",
    highlight: "Spa Day Packages",
    gradientFrom: "from-teal-500",
    gradientTo: "to-emerald-600",
    highlightColor: "text-teal-200",
    linkUrl: "https://www.spafinder.com",
    label: "Wellness",
  },
  {
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    posterSrc: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=450&auto=format&fit=crop",
    title: "New arrivals",
    highlight: "Shop the Look",
    gradientFrom: "from-rose-500",
    gradientTo: "to-pink-600",
    highlightColor: "text-rose-200",
    linkUrl: "https://www.shopbahamas.com",
    label: "Fashion",
  },
];

const BurgerAdWidget = ({ showMetrics = false }: { showMetrics?: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const pendingIndex = useRef<number | null>(null);
  const { trackImpression, trackClick, getAdPerformance } = useAdAnalytics();

  const current = videoAds[currentIndex];
  const performance = getAdPerformance(`burger-${currentIndex}`);

  const goTo = (nextIndex: number) => {
    if (pendingIndex.current !== null) return;
    pendingIndex.current = nextIndex;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      pendingIndex.current = null;
      setIsTransitioning(false);
    }, 250);
  };

  // Advance to next ad when inline video ends
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onEnded = () => {
      goTo((currentIndex + 1) % videoAds.length);
    };
    vid.addEventListener('ended', onEnded);
    return () => vid.removeEventListener('ended', onEnded);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const MAX_AD_DURATION = 90; // 90 seconds max for video ads

  // Track impression and sync video on index change
  useEffect(() => {
    trackImpression(`burger-${currentIndex}`);
    const vid = videoRef.current;
    if (!vid) return;
    vid.load();
    vid.play().catch(() => {});
  }, [currentIndex, trackImpression]);

  // Enforce 90-second max on inline video
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const enforceLimit = () => {
      if (vid.currentTime >= MAX_AD_DURATION) {
        vid.currentTime = 0;
        vid.pause();
        // Trigger rotation when max duration is hit
        goTo((currentIndex + 1) % videoAds.length);
      }
    };
    vid.addEventListener('timeupdate', enforceLimit);
    return () => vid.removeEventListener('timeupdate', enforceLimit);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // When modal opens: seek modal video to same time, unmute and play
  useEffect(() => {
    const inline = videoRef.current;
    const modal = modalVideoRef.current;
    if (!modal) return;

    if (modalOpen) {
      modal.load();
      if (inline) modal.currentTime = inline.currentTime;
      modal.muted = false;
      modal.play().catch(() => {});
    } else {
      modal.pause();
    }
  }, [modalOpen]);

  // Sync modal video source when ad changes while modal is open
  useEffect(() => {
    if (!modalOpen) return;
    const modal = modalVideoRef.current;
    if (!modal) return;
    modal.load();
    modal.muted = false;
    modal.play().catch(() => {});
  }, [currentIndex, modalOpen]);

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleCTA = () => {
    trackClick(`burger-${currentIndex}`);
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
    <>
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
        <div className="absolute inset-0 bg-white/5 rounded-2xl pointer-events-none" />

        {/* 16:9 video thumbnail — tap to expand */}
        <div
          className="relative flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl border-2 border-white/30 shadow-lg bg-black cursor-pointer group
                     w-[120px] h-[68px] sm:w-[160px] sm:h-[90px] md:w-[200px] md:h-[112px]
                     ml-2 sm:ml-3 my-2"
          style={{ aspectRatio: "16/9" }}
          onClick={openModal}
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
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Expand hint on hover/tap */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
            <Maximize2 size={18} className="text-white opacity-0 group-hover:opacity-90 transition-opacity duration-200 drop-shadow-lg" />
          </div>
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
          {/* 16:9 badge */}
          <div className="absolute top-0.5 left-0.5 z-20 px-1 py-px rounded bg-black/60 backdrop-blur-sm">
            <span className="text-[7px] font-bold text-white/80 leading-none">16:9</span>
          </div>
        </div>

        {/* Text content */}
        <div
          className="flex-1 min-w-0 px-2 sm:px-3 md:px-4 overflow-hidden cursor-pointer flex flex-col items-center justify-center text-center"
          onClick={openModal}
        >
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Sparkles size={9} className="text-white flex-shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-sm">
              Ad · {current.label}
            </span>
          </div>
          <div className="text-white text-xs sm:text-sm md:text-base font-bold leading-tight drop-shadow truncate w-full
                          [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">
            {current.title}
          </div>
          <div className={`${current.highlightColor} text-xs sm:text-sm md:text-base font-extrabold leading-tight truncate w-full
                           drop-shadow [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]`}>
            {current.highlight}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1 mt-1.5">
            {videoAds.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); goTo(i); }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-4 bg-white/90" : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Ad Performance Metrics */}
        {showMetrics && (
          <AdPerformanceMetrics
            impressions={performance.totalImpressions}
            clicks={performance.totalClicks}
            views={performance.totalViews}
            variant="overlay"
            className="absolute bottom-1 left-2 z-20"
          />
        )}

        {/* Nav arrows (desktop) */}
        <div className="hidden sm:flex flex-col items-end gap-1.5 pr-3">
          <div className="flex gap-1">
            <button
              onClick={e => { e.stopPropagation(); goTo((currentIndex - 1 + videoAds.length) % videoAds.length); }}
              className="w-6 h-6 flex items-center justify-center rounded-md bg-white/15 hover:bg-white/30 border border-white/20 transition-colors touch-manipulation"
              aria-label="Previous ad"
            >
              <ChevronLeft size={12} className="text-white" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); goTo((currentIndex + 1) % videoAds.length); }}
              className="w-6 h-6 flex items-center justify-center rounded-md bg-white/15 hover:bg-white/30 border border-white/20 transition-colors touch-manipulation"
              aria-label="Next ad"
            >
              <ChevronRight size={12} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Full-screen 16:9 modal ── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="!fixed !inset-0 !translate-x-0 !translate-y-0 !left-0 !top-0 !max-w-none !w-screen !h-screen !rounded-none !p-0 !border-0 bg-black flex flex-col items-center justify-center z-[100]">
          {/* Close button */}
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors touch-manipulation"
            aria-label="Close"
          >
            <X size={18} className="text-white" />
          </button>

          {/* Ad label */}
          <div className="absolute top-4 left-4 z-50 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/15">
            <Sparkles size={10} className="text-white/80" />
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Ad · {current.label}</span>
          </div>

          {/* 16:9 video — fills screen width, centered vertically */}
          <div className="w-full" style={{ aspectRatio: "16/9", maxHeight: "calc(100vh - 120px)" }}>
            <video
              ref={modalVideoRef}
              src={current.videoSrc}
              poster={current.posterSrc}
              autoPlay
              loop
              playsInline
              controls
              className="w-full h-full object-contain bg-black"
            />
          </div>

          {/* Bottom: title + CTA */}
          <div className={`w-full px-5 py-4 bg-gradient-to-r ${current.gradientFrom} ${current.gradientTo} flex items-center justify-between gap-4`}>
            <div className="min-w-0">
              <p className="text-white/80 text-xs font-medium">{current.title}</p>
              <p className={`${current.highlightColor} text-base sm:text-lg font-extrabold leading-tight truncate [text-shadow:_0_1px_4px_rgba(0,0,0,0.6)]`}>
                {current.highlight}
              </p>
            </div>
            <button
              onClick={handleCTA}
              className="flex-shrink-0 flex items-center gap-2 bg-background text-foreground px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-background/90 active:scale-95 transition-all touch-manipulation"
            >
              <span>Visit Now</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BurgerAdWidget;
