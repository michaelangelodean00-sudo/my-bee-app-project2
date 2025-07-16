
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, BarChart3, Play, Pause, Eye, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { VideoAd } from "@/types/ads";

// Mock data
const mockAds: VideoAd[] = [
  {
    id: "ad1",
    title: "Local Restaurant Special",
    description: "Try our new menu items this week!",
    videoUrl: "https://youtube.com/watch?v=example",
    advertiser: "Bahama Breeze Restaurant",
    category: "business",
    targetSection: "businesses",
    duration: 30,
    clickUrl: "https://bahamabreeze.com",
    impressions: 1250,
    clicks: 89,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    budget: 500,
    costPerView: 0.05
  },
  {
    id: "ad2",
    title: "Music Festival 2024",
    description: "Join us for the biggest music event of the year",
    videoUrl: "https://youtube.com/watch?v=example2",
    advertiser: "Nassau Music Events",
    category: "events",
    targetSection: "events",
    duration: 45,
    impressions: 2100,
    clicks: 156,
    isActive: true,
    createdAt: "2024-01-14T15:30:00Z",
    budget: 1000,
    costPerView: 0.08
  }
];

const AdManagement = () => {
  const [ads, setAds] = useState<VideoAd[]>(mockAds);
  const [selectedAd, setSelectedAd] = useState<VideoAd | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'business' | 'events'>('all');

  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    videoUrl: '',
    advertiser: '',
    category: 'business' as const,
    targetSection: 'businesses' as const,
    duration: 30,
    clickUrl: '',
    budget: 0,
    costPerView: 0.05
  });

  const handleCreateAd = () => {
    const ad: VideoAd = {
      id: `ad${Date.now()}`,
      ...newAd,
      impressions: 0,
      clicks: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    setAds(prev => [...prev, ad]);
    setIsCreateDialogOpen(false);
    setNewAd({
      title: '',
      description: '',
      videoUrl: '',
      advertiser: '',
      category: 'business',
      targetSection: 'businesses',
      duration: 30,
      clickUrl: '',
      budget: 0,
      costPerView: 0.05
    });
    toast.success("Video ad created successfully!");
  };

  const toggleAdStatus = (adId: string) => {
    setAds(prev => prev.map(ad => 
      ad.id === adId ? { ...ad, isActive: !ad.isActive } : ad
    ));
    toast.success("Ad status updated!");
  };

  const deleteAd = (adId: string) => {
    setAds(prev => prev.filter(ad => ad.id !== adId));
    toast.success("Ad deleted successfully!");
  };

  const getCTR = (clicks: number, impressions: number) => {
    return impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
  };

  const getTotalSpent = (ad: VideoAd) => {
    return (ad.impressions * ad.costPerView!).toFixed(2);
  };

  const filteredAds = ads.filter(ad => filter === 'all' || ad.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Video Ad Management</h2>
          <p className="text-gray-600 mt-1">Create and manage video advertisements for Events and Business sections</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Create New Ad
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Video Ad</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Ad Title</Label>
                  <Input
                    id="title"
                    value={newAd.title}
                    onChange={(e) => setNewAd(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter ad title"
                  />
                </div>
                <div>
                  <Label htmlFor="advertiser">Advertiser</Label>
                  <Input
                    id="advertiser"
                    value={newAd.advertiser}
                    onChange={(e) => setNewAd(prev => ({ ...prev, advertiser: e.target.value }))}
                    placeholder="Company/Business name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAd.description}
                  onChange={(e) => setNewAd(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter ad description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    value={newAd.videoUrl}
                    onChange={(e) => setNewAd(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <Label htmlFor="clickUrl">Click URL (Optional)</Label>
                  <Input
                    id="clickUrl"
                    value={newAd.clickUrl}
                    onChange={(e) => setNewAd(prev => ({ ...prev, clickUrl: e.target.value }))}
                    placeholder="https://website.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newAd.category}
                    onValueChange={(value: 'business' | 'events') => 
                      setNewAd(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="targetSection">Target Section</Label>
                  <Select
                    value={newAd.targetSection}
                    onValueChange={(value: 'businesses' | 'events' | 'both') => 
                      setNewAd(prev => ({ ...prev, targetSection: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="businesses">Businesses Only</SelectItem>
                      <SelectItem value="events">Events Only</SelectItem>
                      <SelectItem value="both">Both Sections</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newAd.duration}
                    onChange={(e) => setNewAd(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    min="15"
                    max="120"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newAd.budget}
                    onChange={(e) => setNewAd(prev => ({ ...prev, budget: parseFloat(e.target.value) }))}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="costPerView">Cost Per View ($)</Label>
                  <Input
                    id="costPerView"
                    type="number"
                    value={newAd.costPerView}
                    onChange={(e) => setNewAd(prev => ({ ...prev, costPerView: parseFloat(e.target.value) }))}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAd}>
                Create Ad
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'business', 'events'] as const).map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(category)}
            className="capitalize"
          >
            {category} ({filteredAds.filter(ad => category === 'all' || ad.category === category).length})
          </Button>
        ))}
      </div>

      {/* Ads Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Budget & Spend</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAds.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell>
                  <div>
                    <h4 className="font-semibold text-sm">{ad.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{ad.advertiser}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{ad.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {ad.category}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{ad.targetSection}</p>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Eye size={12} />
                      <span className="text-sm">{ad.impressions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">CTR: {getCTR(ad.clicks, ad.impressions)}%</span>
                    </div>
                    <div className="text-xs text-gray-500">{ad.clicks} clicks</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DollarSign size={12} />
                      <span className="text-sm">${ad.budget}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Spent: ${getTotalSpent(ad)}
                    </div>
                    <div className="text-xs text-gray-400">
                      ${ad.costPerView}/view
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={ad.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {ad.isActive ? 'Active' : 'Paused'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleAdStatus(ad.id)}
                    >
                      {ad.isActive ? <Pause size={14} /> : <Play size={14} />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedAd(ad)}
                    >
                      <BarChart3 size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteAd(ad.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredAds.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No video ads found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default AdManagement;
