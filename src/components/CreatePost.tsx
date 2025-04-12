
import { useState } from "react";
import { Image, Video, Smile, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface CreatePostProps {
  onPostCreated?: (post: any) => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    if (!postContent.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPost = {
        id: Date.now().toString(),
        author: {
          id: "user1",
          name: "John Doe",
          avatarUrl: "https://github.com/shadcn.png",
          avatarFallback: "JD",
        },
        content: postContent,
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        shares: 0,
      };
      
      if (onPostCreated) {
        onPostCreated(newPost);
      }
      
      setPostContent("");
      setIsSubmitting(false);
    }, 500);
  };
  
  return (
    <div className="bee-card p-4 mb-4">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Textarea
          placeholder="What's on your mind?"
          className="flex-1 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
      </div>
      
      <Separator className="my-3" />
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Image size={18} className="mr-2 text-bee-blue" />
            Photo
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Video size={18} className="mr-2 text-bee-blue" />
            Video
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hidden sm:flex">
            <Smile size={18} className="mr-2 text-bee-blue" />
            Feeling
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hidden sm:flex">
            <MapPin size={18} className="mr-2 text-bee-blue" />
            Check In
          </Button>
        </div>
        
        <Button 
          className="bg-bee-yellow text-bee-black hover:bg-bee-yellow/90"
          disabled={!postContent.trim() || isSubmitting}
          onClick={handleSubmit}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
