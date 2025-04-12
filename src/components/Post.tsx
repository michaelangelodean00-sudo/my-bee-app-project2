
import { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface PostProps {
  id: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
    avatarFallback: string;
  };
  content: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
}

const Post = ({
  id,
  author,
  content,
  imageUrl,
  timestamp,
  likes,
  comments,
  shares,
}: PostProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  
  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };
  
  return (
    <div className="bee-card p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback>{author.avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <Link to={`/profile/${author.id}`} className="font-semibold hover:underline">
              {author.name}
            </Link>
            <p className="text-gray-500 text-sm">{timestamp}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <MoreHorizontal size={18} />
        </Button>
      </div>
      
      <div className="mt-3">
        <p className="text-gray-800">{content}</p>
        {imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Post" 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="mt-3 flex justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          {liked ? (
            <Heart size={14} className="text-red-500 fill-red-500" />
          ) : (
            <ThumbsUp size={14} />
          )}
          <span>{likeCount}</span>
        </div>
        <div>
          <span>{comments} comments • {shares} shares</span>
        </div>
      </div>
      
      <Separator className="my-3" />
      
      <div className="flex justify-between">
        <Button 
          variant="ghost" 
          className={`flex-1 ${liked ? 'text-bee-blue' : 'text-gray-600'}`}
          onClick={handleLike}
        >
          <ThumbsUp size={18} className="mr-2" />
          Like
        </Button>
        <Button variant="ghost" className="flex-1 text-gray-600">
          <MessageSquare size={18} className="mr-2" />
          Comment
        </Button>
        <Button variant="ghost" className="flex-1 text-gray-600">
          <Share2 size={18} className="mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default Post;
