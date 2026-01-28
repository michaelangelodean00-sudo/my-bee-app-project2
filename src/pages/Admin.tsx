import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import AdminVideoReview from "../components/AdminVideoReview";
import AdManagement from "../components/admin/AdManagement";
import GreetingManagement from "../components/admin/GreetingManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Video, Users, Settings, Play, MessageSquare } from "lucide-react";

const Admin = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
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
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="heading-large">Admin Panel</h1>
            </div>
            
            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
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
              
              <TabsContent value="videos" className="mt-6">
                <AdminVideoReview />
              </TabsContent>
              
              <TabsContent value="ads" className="mt-6">
                <AdManagement />
              </TabsContent>
              
              <TabsContent value="greetings" className="mt-6">
                <GreetingManagement />
              </TabsContent>
              
              <TabsContent value="users" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  User management coming soon...
                </div>
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
