import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Check, X, Eye, Clock, ExternalLink, Undo2 } from "lucide-react";
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
  fileSize?: number;
}

const mockPendingVideos: PendingVideo[] = [
  {
    id: "1",
    platform: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Amazing Business Tips for Local Entrepreneurs",
    description: "Learn how to grow your business with these simple tips that work in our community",
    category: "business",
    submittedBy: "John Doe",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "pending",
  },
  {
    id: "2",
    platform: "instagram",
    videoUrl: "https://www.instagram.com/reel/CxYzExampleReel/",
    title: "Local Event Highlights - Community Festival",
    description: "Check out the highlights from our amazing community festival last weekend",
    category: "events",
    submittedBy: "Jane Smith",
    submittedAt: "2024-01-14T15:45:00Z",
    status: "pending",
  },
  {
    id: "3",
    platform: "mp4",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "New Restaurant Opening Downtown",
    description: "Exciting new dining experience coming to our neighborhood",
    category: "business",
    submittedBy: "Mike Johnson",
    submittedAt: "2024-01-13T09:20:00Z",
    status: "approved",
    fileSize: 25.7,
  },
  {
    id: "4",
    platform: "tiktok",
    videoUrl: "https://www.tiktok.com/@user/video/7234567890123456789",
    title: "Workout Class at Local Gym",
    description: "Join us for an energizing workout session",
    category: "events",
    submittedBy: "Sarah Wilson",
    submittedAt: "2024-01-12T14:15:00Z",
    status: "rejected",
  },
];

const PAGE_SIZE = 10;

const getYouTubeEmbed = (url: string) => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

const getInstagramEmbed = (url: string) => {
  const clean = url.split("?")[0].replace(/\/$/, "");
  return `${clean}/embed`;
};

const AdminVideoReview = () => {
  const [videos, setVideos] = useState<PendingVideo[]>(mockPendingVideos);
  const [selectedVideo, setSelectedVideo] = useState<PendingVideo | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const setStatus = (ids: string[], status: PendingVideo['status']) => {
    setVideos(prev => prev.map(v => (ids.includes(v.id) ? { ...v, status } : v)));
  };

  const handleApprove = (id: string) => {
    setStatus([id], 'approved');
    toast.success("Video approved! It will now appear in the BEE APP.");
  };

  const handleReject = (id: string) => {
    setStatus([id], 'rejected');
    toast.success("Video rejected and removed from pending queue.");
  };

  const handleRestore = (id: string) => {
    setStatus([id], 'pending');
    toast.success("Video restored to pending queue for re-review.");
  };

  const bulkApprove = () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    setStatus(ids, 'approved');
    setSelectedIds(new Set());
    toast.success(`Approved ${ids.length} video${ids.length > 1 ? 's' : ''}.`);
  };

  const bulkReject = () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    setStatus(ids, 'rejected');
    setSelectedIds(new Set());
    toast.success(`Rejected ${ids.length} video${ids.length > 1 ? 's' : ''}.`);
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

  const filteredVideos = useMemo(
    () => videos.filter(v => filter === 'all' || v.status === filter),
    [videos, filter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageVideos = filteredVideos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pendingCount = videos.filter(v => v.status === 'pending').length;

  const pagePendingIds = pageVideos.filter(v => v.status === 'pending').map(v => v.id);
  const allPagePendingSelected = pagePendingIds.length > 0 && pagePendingIds.every(id => selectedIds.has(id));
  const togglePageSelectAll = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allPagePendingSelected) {
        pagePendingIds.forEach(id => next.delete(id));
      } else {
        pagePendingIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isExternal = (p: string) => p !== 'mp4';

  const renderPreview = (v: PendingVideo) => {
    if (!v.videoUrl && !v.videoFile) {
      return <div className="aspect-video flex items-center justify-center bg-muted rounded text-sm text-muted-foreground">No preview available</div>;
    }
    if (v.platform === 'mp4') {
      const src = v.videoUrl || (v.videoFile ? URL.createObjectURL(v.videoFile) : '');
      return <video src={src} controls className="w-full aspect-video rounded bg-black" />;
    }
    if (v.platform === 'youtube' && v.videoUrl) {
      const embed = getYouTubeEmbed(v.videoUrl);
      if (embed) return <iframe src={embed} className="w-full aspect-video rounded" allow="autoplay; encrypted-media" allowFullScreen />;
    }
    if (v.platform === 'instagram' && v.videoUrl) {
      return <iframe src={getInstagramEmbed(v.videoUrl)} className="w-full aspect-video rounded" allowFullScreen />;
    }
    return (
      <div className="aspect-video flex flex-col items-center justify-center bg-muted rounded gap-2 p-4">
        <p className="text-sm text-muted-foreground">Preview not embeddable for {v.platform.toUpperCase()}.</p>
        <Button size="sm" variant="outline" asChild>
          <a href={v.videoUrl} target="_blank" rel="noreferrer">
            Open in new tab <ExternalLink size={14} className="ml-1" />
          </a>
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Video Review Panel</h2>
          <p className="text-muted-foreground mt-1">Review and approve videos before they appear in the BEE APP</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock size={14} />
          {pendingCount} Pending Approval
        </Badge>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => { setFilter(status); setPage(1); }}
            className="capitalize"
          >
            {status} ({videos.filter(v => status === 'all' || v.status === status).length})
          </Button>
        ))}
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={bulkApprove}>
            <Check size={14} className="mr-1" /> Approve Selected
          </Button>
          <Button size="sm" variant="destructive" onClick={bulkReject}>
            <X size={14} className="mr-1" /> Reject Selected
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>Clear</Button>
        </div>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allPagePendingSelected}
                  onCheckedChange={togglePageSelectAll}
                  disabled={pagePendingIds.length === 0}
                  aria-label="Select all pending on page"
                />
              </TableHead>
              <TableHead>Video Details</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Source / Size</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageVideos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  {video.status === 'pending' ? (
                    <Checkbox
                      checked={selectedIds.has(video.id)}
                      onCheckedChange={() => toggleOne(video.id)}
                      aria-label={`Select ${video.title}`}
                    />
                  ) : null}
                </TableCell>
                <TableCell>
                  <div>
                    <h4 className="font-semibold text-sm">{video.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{video.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getPlatformColor(video.platform)}>{video.platform.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(video.category)}>{video.category}</Badge>
                </TableCell>
                <TableCell className="text-xs max-w-[180px]">
                  {isExternal(video.platform) ? (
                    video.videoUrl ? (
                      <a href={video.videoUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate block">
                        {new URL(video.videoUrl).hostname.replace('www.', '')}
                      </a>
                    ) : <span className="text-muted-foreground">—</span>
                  ) : (
                    video.fileSize ? <span>MP4 • {video.fileSize} MB</span> : <span className="text-muted-foreground">MP4 file</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">{video.submittedBy}</TableCell>
                <TableCell className="text-sm">{new Date(video.submittedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(video.status)}>{video.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 justify-end flex-wrap">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedVideo(video)}>
                          <Eye size={14} className="mr-1" /> Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                          <DialogTitle>Video Preview & Details</DialogTitle>
                        </DialogHeader>
                        {selectedVideo && (
                          <div className="space-y-4">
                            {renderPreview(selectedVideo)}
                            <div>
                              <h4 className="font-semibold text-lg">{selectedVideo.title}</h4>
                              <p className="text-muted-foreground mt-2 text-sm">{selectedVideo.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                              <div>
                                <p className="text-sm font-medium">Platform</p>
                                <Badge className={getPlatformColor(selectedVideo.platform)}>{selectedVideo.platform.toUpperCase()}</Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Category</p>
                                <Badge className={getCategoryColor(selectedVideo.category)}>{selectedVideo.category}</Badge>
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
                            {selectedVideo.videoUrl && isExternal(selectedVideo.platform) && (
                              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded border">
                                <code className="text-xs flex-1 break-all">{selectedVideo.videoUrl}</code>
                                <Button size="sm" variant="outline" asChild>
                                  <a href={selectedVideo.videoUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} /></a>
                                </Button>
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
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(video.id)}
                        >
                          <Check size={14} className="mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(video.id)}>
                          <X size={14} className="mr-1" /> Reject
                        </Button>
                      </>
                    )}

                    {video.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleRevoke(video.id)}
                      >
                        <Undo2 size={14} className="mr-1" /> Revoke
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredVideos.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {filter === 'pending' ? 'No pending videos to review' : `No ${filter} videos found`}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <PaginationItem key={n}>
                <PaginationLink
                  href="#"
                  isActive={n === currentPage}
                  onClick={(e) => { e.preventDefault(); setPage(n); }}
                >
                  {n}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)); }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AdminVideoReview;
