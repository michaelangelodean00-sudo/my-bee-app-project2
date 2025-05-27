
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, X, Eye, Clock } from "lucide-react";
import { toast } from "sonner";

interface PendingVideo {
  id: string;
  platform: string;
  videoUrl: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Mock data for demonstration
const mockPendingVideos: PendingVideo[] = [
  {
    id: "1",
    platform: "youtube",
    videoUrl: "https://youtube.com/watch?v=example1",
    title: "Amazing Business Tips",
    description: "Learn how to grow your business with these simple tips",
    submittedBy: "John Doe",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "pending"
  },
  {
    id: "2",
    platform: "instagram",
    videoUrl: "https://instagram.com/reel/example2",
    title: "Local Event Highlights",
    description: "Check out the highlights from our community event",
    submittedBy: "Jane Smith",
    submittedAt: "2024-01-14T15:45:00Z",
    status: "pending"
  }
];

const AdminVideoReview = () => {
  const [videos, setVideos] = useState<PendingVideo[]>(mockPendingVideos);
  const [selectedVideo, setSelectedVideo] = useState<PendingVideo | null>(null);

  const handleApprove = (videoId: string) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId ? { ...video, status: 'approved' as const } : video
    ));
    toast.success("Video approved and posted to B.E.E App!");
  };

  const handleReject = (videoId: string) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId ? { ...video, status: 'rejected' as const } : video
    ));
    toast.success("Video rejected.");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube': return 'bg-red-100 text-red-800';
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'tiktok': return 'bg-gray-100 text-gray-800';
      case 'facebook': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Video Review Panel</h2>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock size={14} />
          {videos.filter(v => v.status === 'pending').length} Pending
        </Badge>
      </div>

      <div className="grid gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{video.title}</h3>
                  <Badge className={getPlatformColor(video.platform)}>
                    {video.platform}
                  </Badge>
                  <Badge className={getStatusColor(video.status)}>
                    {video.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>By: {video.submittedBy}</span>
                  <span>Submitted: {new Date(video.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <Eye size={14} className="mr-1" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Video Preview</DialogTitle>
                    </DialogHeader>
                    {selectedVideo && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">{selectedVideo.title}</h4>
                          <p className="text-sm text-gray-600">{selectedVideo.description}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                          <p className="text-sm"><strong>Platform:</strong> {selectedVideo.platform}</p>
                          <p className="text-sm"><strong>URL:</strong> {selectedVideo.videoUrl}</p>
                          <p className="text-sm"><strong>Submitted by:</strong> {selectedVideo.submittedBy}</p>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {video.status === 'pending' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleApprove(video.id)}
                    >
                      <Check size={14} className="mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleReject(video.id)}
                    >
                      <X size={14} className="mr-1" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No video submissions to review
        </div>
      )}
    </div>
  );
};

export default AdminVideoReview;
