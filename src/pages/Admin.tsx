import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import AdminVideoReview from "../components/AdminVideoReview";
import AdManagement from "../components/admin/AdManagement";
import GreetingManagement from "../components/admin/GreetingManagement";
import BusinessApprovals from "../components/admin/BusinessApprovals";
import UserManagement from "../components/admin/UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Video, Users, Settings, Play, MessageSquare, Building2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { usePreviewMode } from "@/hooks/usePreviewMode";

const DemoDataNotice = ({ text }: { text: string }) => (
  <div role="note" className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-foreground">
    <strong>Demo data:</strong> {text}
  </div>
);

const Admin = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isPreview, setPreview } = usePreviewMode();
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleMobileSidebar}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:hidden`}>
          <Sidebar />
        </div>
        
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <div className="flex-1 w-full max-w-5xl mx-auto py-6 px-4">
          <div className="bee-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="heading-large">Admin Panel</h1>
              </div>
              <label className="flex min-h-[44px] items-center gap-3 rounded-lg border border-border px-3 text-sm">
                <span>
                  <span className="font-semibold">Design preview</span>
                  <span className="block text-xs text-muted-foreground">Shows labelled DEMO content to you only, this tab</span>
                </span>
                <Switch checked={isPreview} onCheckedChange={setPreview} aria-label="Design preview" />
              </label>
            </div>
            
            <Tabs defaultValue="approvals" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="approvals" className="flex items-center gap-2">
                  <Building2 size={16} />
                  <span className="hidden sm:inline">Approvals</span>
                  <span className="sm:hidden">Biz</span>
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <Video size={16} />
                  <span className="hidden sm:inline">Video Review</span>
                  <span className="sm:hidden">Videos</span>
                </TabsTrigger>
                <TabsTrigger value="ads" className="flex items-center gap-2">
                  <Play size={16} />
                  <span className="hidden sm:inline">Video Ads</span>
                  <span className="sm:hidden">Ads</span>
                </TabsTrigger>
                <TabsTrigger value="greetings" className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  <span className="hidden sm:inline">Greetings</span>
                  <span className="sm:hidden">Greet</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users size={16} />
                  Users
                </TabsTrigger>
                <TabsTrigger value="posts" className="flex items-center gap-2">
                  <Settings size={16} />
                  Posts
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings size={16} />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="approvals" className="mt-6">
                <BusinessApprovals />
              </TabsContent>

              <TabsContent value="videos" className="mt-6">
                <DemoDataNotice text="This queue currently lists sample videos. Real uploads and moderation arrive in Checkpoint 3." />
                <AdminVideoReview />
              </TabsContent>
              
              <TabsContent value="ads" className="mt-6">
                <DemoDataNotice text="These ads and figures are sample data, not real campaigns or analytics. Real campaigns and tracking arrive in Checkpoint 2." />
                <AdManagement />
              </TabsContent>
              
              <TabsContent value="greetings" className="mt-6">
                <GreetingManagement />
              </TabsContent>
              
              <TabsContent value="users" className="mt-6">
                <UserManagement />
              </TabsContent>
              
              
              <TabsContent value="posts" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Post management coming soon...
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Admin settings coming soon...
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Admin;
