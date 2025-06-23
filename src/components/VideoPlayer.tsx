import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Heart, MessageCircle, Share, MoreHorizontal, ExternalLink } from "lucide-react";

interface VideoPlayerProps {
  platform: string;
  videoUrl: string;
  title: string;
  description?: string;
  isNew?: boolean;
}

const VideoPlayer = ({ platform, videoUrl, title, description, isNew = false }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 1000));

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube': return 'bg-red-500 text-white';
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'tiktok': return 'bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-white';
      case 'facebook': return 'bg-blue-600 text-white';
      case 'twitter': return 'bg-black text-white';
      case 'linkedin': return 'bg-blue-700 text-white';
      case 'snapchat': return 'bg-yellow-400 text-black';
      case 'twitch': return 'bg-purple-600 text-white';
      case 'vimeo': return 'bg-blue-500 text-white';
      case 'pinterest': return 'bg-red-600 text-white';
      case 'reddit': return 'bg-orange-500 text-white';
      case 'telegram': return 'bg-blue-400 text-white';
      case 'discord': return 'bg-indigo-600 text-white';
      case 'whatsapp': return 'bg-green-500 text-white';
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
    <div className="relative w-full h-full bg-black overflow-hidden snap-start">
      {/* Video Area */}
      <div className="relative w-full h-full">
        {embedUrl && isPlaying ? (
          <iframe
            src={embedUrl}
            className="w-full h-full object-cover"
            allowFullScreen
            title={title}
          />
        ) : (
          <div 
            className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}-${Math.floor(Math.random() * 1000000)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Play button */}
            <Button
              onClick={() => setIsPlaying(true)}
              className="relative z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full w-14 h-14 border-2 border-white/50"
              size="icon"
            >
              <Play size={28} fill="white" />
            </Button>
          </div>
        )}

        {/* Platform Badge and NEW badge */}
        <div className="absolute top-20 left-4 z-20 flex gap-2 drop-shadow-md sm:top-16">
          <Badge className={`${getPlatformColor(platform)} font-semibold px-3 py-1`}>
            {platform.toUpperCase()}
          </Badge>
          {isNew && (
            <Badge className="bg-green-500 text-white font-semibold px-3 py-1 animate-pulse">
              NEW
            </Badge>
          )}
        </div>

        {/* Right Side Actions (TikTok style) */}
        <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-4">
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

          <Button
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50"
            size="icon"
          >
            <MoreHorizontal size={20} className="text-white" />
          </Button>
        </div>

        {/* Bottom Content Overlay */}
        <div className="absolute bottom-24 left-0 right-20 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pb-8">
          <div className="text-white">
            <h3 className="font-bold text-xl mb-2 leading-tight">{title}</h3>
            {description && (
              <p className="text-base text-gray-200 mb-4 leading-relaxed opacity-90">{description}</p>
            )}
            <Button 
              variant="outline" 
              size="default" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <ExternalLink size={16} className="mr-2" />
              View Original
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
