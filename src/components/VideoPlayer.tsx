
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "lucide-react";

interface VideoPlayerProps {
  platform: string;
  videoUrl: string;
  title: string;
  description?: string;
}

const VideoPlayer = ({ platform, videoUrl, title, description }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube': return 'bg-red-100 text-red-800';
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'tiktok': return 'bg-gray-100 text-gray-800';
      case 'facebook': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {embedUrl && isPlaying ? (
          <iframe
            src={embedUrl}
            className="w-full h-48"
            allowFullScreen
            title={title}
          />
        ) : (
          <div className="h-48 bg-gray-200 flex items-center justify-center relative">
            <Button
              onClick={() => setIsPlaying(true)}
              className="bg-black/70 hover:bg-black/80 text-white rounded-full p-4"
            >
              <Play size={24} fill="white" />
            </Button>
            <Badge className={`absolute top-2 left-2 ${getPlatformColor(platform)}`}>
              {platform}
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        )}
        <Button variant="outline" size="sm" className="w-full">
          <ExternalLink size={16} className="mr-2" />
          View Original
        </Button>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
