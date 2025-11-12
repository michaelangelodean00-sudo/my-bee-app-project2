import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/AnimatedBackground";
import VideoUploadForm from "../components/VideoUploadForm";
import ScrollReveal from "../components/ScrollReveal";
import EnhancedCard from "../components/EnhancedCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const VideoUpload = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 pattern-bee-subtle transition-colors relative">
      <AnimatedBackground />
      
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
            onClick={toggleMobileSidebar}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-sidebar shadow-2xl transform ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-out md:hidden`}>
          <div className="flex justify-between items-center p-4 border-b border-border/50">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={toggleMobileSidebar}
              className="p-2 hover:bg-accent rounded-lg transition-colors active:scale-90 touch-manipulation"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <Sidebar />
        </div>
        
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <main className="flex-1 w-full max-w-4xl mx-auto py-6 px-4 relative z-10" role="main">
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mb-4"
              >
                <ArrowLeft className="mr-2" size={20} />
                Back to Home
              </Button>
              
              <h1 className="text-3xl font-bold mb-2">Upload Video</h1>
              <p className="text-muted-foreground">
                Share your videos with the BEE community. All uploads are reviewed before being published.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <EnhancedCard variant="floating">
              <VideoUploadForm />
            </EnhancedCard>
          </ScrollReveal>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default VideoUpload;
