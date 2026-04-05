
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, Heart, MessageCircle, Share, MoreHorizontal, ExternalLink, Star, Crown } from "lucide-react";
import { VideoAd, SponsoredContent } from "@/types/ads";
import ContentFilterControls from "./ContentFilterControls";
import AdPerformanceMetrics from "./AdPerformanceMetrics";

interface VideoPlayerWithAdsProps {
  videoId: string;
  platform: string;
  videoUrl: string;
  title: string;
  description?: string;
  isNew?: boolean;
  isAd?: boolean;
  adData?: VideoAd;
  sponsoredData?: SponsoredContent;
  contentType?: 'business' | 'event';
  onAdImpression?: (adId: string) => void;
  onAdClick?: (adId: string) => void;
  autoPlay?: boolean;
  isVisible?: boolean;
}

const VideoPlayerWithAds = ({ 
  videoId,
  platform, 
  videoUrl, 
  title, 
  description, 
  isNew = false,
  isAd = false,
  adData,
  sponsoredData,
  contentType = 'business',
  onAdImpression,
  onAdClick,
  autoPlay = true,
  isVisible = false
}: VideoPlayerWithAdsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 1000));
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTrackedImpression = useRef(false);

  // Auto-play when visible
  useEffect(() => {
    if (isVisible && autoPlay && !isPlaying) {
      handlePlay();
    } else if (!isVisible && isPlaying) {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isVisible, autoPlay]);

  const handleAdClick = () => {
    if (isAd && adData && onAdClick) {
      onAdClick(adData.id);
      if (adData.clickUrl) {
        window.open(adData.clickUrl, '_blank');
      }
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if (isAd && adData && onAdImpression && !hasTrackedImpression.current) {
      onAdImpression(adData.id);
      hasTrackedImpression.current = true;
    }
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const getSponsorshipBadge = () => {
    if (!sponsoredData) return null;
    
    const badgeConfig = {
      promoted: { icon: Star, text: "PROMOTED", color: "bg-yellow-500" },
      featured: { icon: Crown, text: "FEATURED", color: "bg-purple-500" },
      sponsored: { icon: Star, text: "SPONSORED", color: "bg-blue-500" }
    };
    
    const config = badgeConfig[sponsoredData.sponsorshipType];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white font-semibold px-3 py-1 rounded animate-pulse flex items-center gap-1`}>
        <Icon size={12} />
        {config.text}
      </Badge>
    );
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube': return 'bg-red-500 text-white';
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'tiktok': return 'bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-white';
      case 'facebook': return 'bg-blue-600 text-white';
      case 'mp4': return 'bg-purple-100 text-purple-800';
      case 'ad': return 'bg-green-500 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getEmbedUrl = (url: string, platform: string) => {
    switch (platform) {
      case 'youtube':
        const youtubeId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return youtubeId ? `https://www.youtube.com/embed/${youtubeId[1]}` : null;
      case 'vimeo':
        const vimeoId = url.match(/vimeo\.com\/(\d+)/);
        return vimeoId ? `https://player.vimeo.com/video/${vimeoId[1]}` : null;
      default:
        return null;
    }
  };

  const embedUrl = getEmbedUrl(videoUrl, platform);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden snap-start transition-transform duration-300 ease-out will-change-transform">
      {/* Video Area */}
      <div className="relative w-full h-full" onClick={togglePlayPause}>
        {/* For YouTube/Vimeo embeds */}
        {embedUrl && isPlaying ? (
          <iframe
            src={`${embedUrl}?autoplay=1&mute=1`}
            className="w-full h-full object-cover"
            allowFullScreen
            allow="autoplay"
            title={title}
          />
        ) : platform === 'mp4' || videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') ? (
          /* For direct video files */
          <div className="w-full h-full relative">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              autoPlay={isVisible && autoPlay}
            />
            {/* Play/Pause overlay indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-14 h-14 border-2 border-white/50 flex items-center justify-center">
                  <Play size={28} fill="white" className="text-white" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div 
            className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative cursor-pointer"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}-${Math.floor(Math.random() * 1000000)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onClick={isAd ? handleAdClick : undefined}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Play/Pause button */}
            <Button
              onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
              className="relative z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full w-14 h-14 border-2 border-white/50"
              size="icon"
            >
              {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
            </Button>
          </div>
        )}

        {/* Ad Badge + Metrics */}
        {isAd && adData && (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <Badge className="bg-green-500 text-white font-semibold px-3 py-1 rounded animate-pulse w-fit">
              AD
            </Badge>
            {showMetrics && (
              <AdPerformanceMetrics
                impressions={adData.impressions}
                clicks={adData.clicks}
                variant="overlay"
              />
            )}
          </div>
        )}

        {/* Right Side Actions (TikTok style) */}
        <div className="absolute right-2 bottom-32 z-20 flex flex-col gap-4 sm:right-4 sm:bottom-32">
          <div className="flex flex-col items-center">
            <Button
              onClick={handleLike}
              className={`w-10 h-10 rounded-full ${
                liked ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
              } backdrop-blur-sm border-2 border-white/50`}
              size="icon"
            >
              <Heart size={20} className={liked ? 'fill-white text-white' : 'text-white'} />
            </Button>
            <span className="text-white text-xs font-semibold mt-1">{likeCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50"
              size="icon"
            >
              <MessageCircle size={20} className="text-white" />
            </Button>
            <span className="text-white text-xs font-semibold mt-1">{Math.floor(Math.random() * 100)}</span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50"
              size="icon"
            >
              <Share size={20} className="text-white" />
            </Button>
            <span className="text-white text-xs font-semibold mt-1">{Math.floor(Math.random() * 50)}</span>
          </div>
          {!isAd && (
            <ContentFilterControls
              videoId={videoId}
              contentType={contentType}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50"
            />
          )}
        </div>

        {/* Bottom Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pt-3 pb-3 sm:px-6 sm:pt-4 sm:pb-5 max-h-[28vh] overflow-hidden flex flex-col justify-end">
          <div className="text-white">
            <h3 className="font-bold text-base sm:text-lg mb-1 leading-tight line-clamp-1">
              {title}
              {isAd && adData && (
                <span className="ml-2 text-sm opacity-80">by {adData.advertiser}</span>
              )}
            </h3>
            {description && (
              <p className="text-xs sm:text-sm text-gray-200 mb-2 leading-snug opacity-90 line-clamp-2">{description}</p>
            )}
            {sponsoredData && (
              <p className="text-xs text-gray-300 mb-2">Sponsored by {sponsoredData.advertiser}</p>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
              onClick={isAd ? handleAdClick : undefined}
            >
              <ExternalLink size={16} className="mr-2" />
              {isAd ? 'Learn More' : 'View Original'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerWithAds;
