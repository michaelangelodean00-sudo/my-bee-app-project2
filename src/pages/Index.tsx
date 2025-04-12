
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AdSplash from "../components/AdSplash";
import CreatePost from "../components/CreatePost";
import Post, { PostProps } from "../components/Post";
import RightSidebar from "../components/RightSidebar";

const initialPosts: PostProps[] = [
  {
    id: "post1",
    author: {
      id: "user9",
      name: "Maria Rodriguez",
      avatarUrl: "https://i.pravatar.cc/100?img=47",
      avatarFallback: "MR",
    },
    content: "Just arrived in Nassau! The beaches here are absolutely stunning. Anyone have recommendations for local restaurants? #BahamasVacation #Paradise",
    imageUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1000",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5,
    shares: 2,
  },
  {
    id: "post2",
    author: {
      id: "user6",
      name: "Emily Clark",
      avatarUrl: "https://i.pravatar.cc/100?img=23",
      avatarFallback: "EC",
    },
    content: "Had an amazing time at the Fish Fry last night. The conch salad was incredible and the live music made the evening perfect! #BahamasCulture",
    imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1000",
    timestamp: "5 hours ago",
    likes: 45,
    comments: 12,
    shares: 8,
  },
  {
    id: "post3",
    author: {
      id: "user4",
      name: "Jessica Davis",
      avatarUrl: "https://i.pravatar.cc/100?img=9",
      avatarFallback: "JD",
    },
    content: "Our community cleanup this weekend was a huge success! Thank you to everyone who participated. Together, we can keep our beautiful islands clean. #CommunitySpirit #CleanBahamas",
    timestamp: "Yesterday",
    likes: 87,
    comments: 32,
    shares: 15,
  },
];

const Index = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [posts, setPosts] = useState<PostProps[]>(initialPosts);
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  const handleNewPost = (newPost: PostProps) => {
    setPosts([newPost, ...posts]);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      <AdSplash />
      
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleMobileSidebar}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:hidden`}>
          <Sidebar />
        </div>
        
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <div className="flex-1 max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-4">
          <CreatePost onPostCreated={handleNewPost} />
          
          <div className="space-y-4">
            {posts.map((post) => (
              <Post key={post.id} {...post} />
            ))}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Index;
