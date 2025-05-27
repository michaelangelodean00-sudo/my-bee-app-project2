
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
}

const VideoPlayer = ({ platform, videoUrl, title, description }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 1000));

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube': return 'bg-red-500 text-white';
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'tiktok': return 'bg-black text-white';
      case 'facebook': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getEmbedUrl = (url: string, platform: string) => {
    switch (platform) {
      case 'youtube':
        const youtubeId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return youtubeId ? `https://www.youtube.com/embed/${youtubeId[1]}` : null;
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
    <Card className="relative w-full h-[600px] bg-black rounded-xl overflow-hidden border-0 shadow-lg">
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
              className="relative z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full w-20 h-20 border-2 border-white/50"
              size="icon"
            >
              <Play size={32} fill="white" />
            </Button>
          </div>
        )}

        {/* Platform Badge */}
        <Badge className={`absolute top-4 left-4 z-20 ${getPlatformColor(platform)} font-semibold px-3 py-1`}>
          {platform.toUpperCase()}
        </Badge>

        {/* Right Side Actions (TikTok style) */}
        <div className="absolute right-4 bottom-20 z-20 flex flex-col gap-4">
          <div className="flex flex-col items-center">
            <Button
              onClick={handleLike}
              className={`w-12 h-12 rounded-full ${
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
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50"
              size="icon"
            >
              <MessageCircle size={20} className="text-white" />
            </Button>
            <span className="text-white text-xs font-semibold mt-1">{Math.floor(Math.random() * 100)}</span>
          </div>

          <div className="flex flex-col items-center">
            <Button
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50"
              size="icon"
            >
              <Share size={20} className="text-white" />
            </Button>
            <span className="text-white text-xs font-semibold mt-1">{Math.floor(Math.random() * 50)}</span>
          </div>

          <Button
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50"
            size="icon"
          >
            <MoreHorizontal size={20} className="text-white" />
          </Button>
        </div>

        {/* Bottom Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pb-6">
          <div className="text-white">
            <h3 className="font-bold text-lg mb-1 leading-tight">{title}</h3>
            {description && (
              <p className="text-sm text-gray-200 mb-3 leading-relaxed opacity-90">{description}</p>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <ExternalLink size={14} className="mr-2" />
              View Original
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;
