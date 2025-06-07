
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Eye, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface PendingVideo {
  id: string;
  platform: string;
  videoUrl?: string;
  videoFile?: File;
  title: string;
  description: string;
  category: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  fileSize?: number; // in MB
}

// Mock data for demonstration - in real app this would come from your database
const mockPendingVideos: PendingVideo[] = [
  {
    id: "1",
    platform: "youtube",
    videoUrl: "https://youtube.com/watch?v=example1",
    title: "Amazing Business Tips for Local Entrepreneurs",
    description: "Learn how to grow your business with these simple tips that work in our community",
    category: "business",
    submittedBy: "John Doe",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "pending"
  },
  {
    id: "2",
    platform: "instagram", 
    videoUrl: "https://instagram.com/reel/example2",
    title: "Local Event Highlights - Community Festival",
    description: "Check out the highlights from our amazing community festival last weekend",
    category: "events",
    submittedBy: "Jane Smith",
    submittedAt: "2024-01-14T15:45:00Z",
    status: "pending"
  },
  {
    id: "3",
    platform: "mp4",
    title: "New Restaurant Opening Downtown",
    description: "Exciting new dining experience coming to our neighborhood",
    category: "business", 
    submittedBy: "Mike Johnson",
    submittedAt: "2024-01-13T09:20:00Z",
    status: "approved",
    fileSize: 25.7
  },
  {
    id: "4",
    platform: "tiktok",
    videoUrl: "https://tiktok.com/@user/video/example4",
    title: "Workout Class at Local Gym",
    description: "Join us for an energizing workout session",
    category: "events",
    submittedBy: "Sarah Wilson",
    submittedAt: "2024-01-12T14:15:00Z",
    status: "rejected"
  }
];

const AdminVideoReview = () => {
  const [videos, setVideos] = useState<PendingVideo[]>(mockPendingVideos);
  const [selectedVideo, setSelectedVideo] = useState<PendingVideo | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const handleApprove = (videoId: string) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId ? { ...video, status: 'approved' as const } : video
    ));
    toast.success("Video approved! It will now appear in the BEE APP.");
  };

  const handleReject = (videoId: string) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId ? { ...video, status: 'rejected' as const } : video
    ));
    toast.success("Video rejected and removed from pending queue.");
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
      case 'twitter': return 'bg-sky-100 text-sky-800';
      case 'linkedin': return 'bg-blue-100 text-blue-800';
      case 'mp4': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return 'bg-emerald-100 text-emerald-800';
      case 'events': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVideos = videos.filter(video => {
    if (filter === 'all') return true;
    return video.status === filter;
  });

  const pendingCount = videos.filter(v => v.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Video Review Panel</h2>
          <p className="text-gray-600 mt-1">Review and approve videos before they appear in the BEE APP</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock size={14} />
          {pendingCount} Pending Approval
        </Badge>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status} ({videos.filter(v => status === 'all' || v.status === status).length})
          </Button>
        ))}
      </div>

      {/* Videos Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Video Details</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVideos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  <div>
                    <h4 className="font-semibold text-sm">{video.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{video.description}</p>
                    {video.fileSize && (
                      <p className="text-xs text-gray-400 mt-1">File size: {video.fileSize} MB</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getPlatformColor(video.platform)}>
                    {video.platform.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(video.category)}>
                    {video.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{video.submittedBy}</TableCell>
                <TableCell className="text-sm">
                  {new Date(video.submittedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(video.status)}>
                    {video.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
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
                          <DialogTitle>Video Preview & Details</DialogTitle>
                        </DialogHeader>
                        {selectedVideo && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-lg">{selectedVideo.title}</h4>
                              <p className="text-gray-600 mt-2">{selectedVideo.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                              <div>
                                <p className="text-sm font-medium">Platform</p>
                                <Badge className={getPlatformColor(selectedVideo.platform)}>
                                  {selectedVideo.platform.toUpperCase()}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Category</p>
                                <Badge className={getCategoryColor(selectedVideo.category)}>
                                  {selectedVideo.category}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Submitted by</p>
                                <p className="text-sm">{selectedVideo.submittedBy}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Submitted</p>
                                <p className="text-sm">{new Date(selectedVideo.submittedAt).toLocaleDateString()}</p>
                              </div>
                            </div>

                            {selectedVideo.videoUrl && (
                              <div>
                                <p className="text-sm font-medium mb-2">Video URL</p>
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border">
                                  <code className="text-sm flex-1 break-all">{selectedVideo.videoUrl}</code>
                                  <Button size="sm" variant="outline">
                                    <ExternalLink size={14} />
                                  </Button>
                                </div>
                              </div>
                            )}

                            {selectedVideo.fileSize && (
                              <div>
                                <p className="text-sm font-medium">File Information</p>
                                <p className="text-sm text-gray-600">MP4 file • {selectedVideo.fileSize} MB</p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {video.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleApprove(video.id)}
                        >
                          <Check size={14} className="mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(video.id)}
                        >
                          <X size={14} className="mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredVideos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {filter === 'pending' ? 'No pending videos to review' : `No ${filter} videos found`}
        </div>
      )}
    </div>
  );
};

export default AdminVideoReview;
