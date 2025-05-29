
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

interface Reaction {
  emoji: string;
  label: string;
  count: number;
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
  const [reactions, setReactions] = useState<Reaction[]>([
    { emoji: "👍", label: "Like", count: likes },
    { emoji: "❤️", label: "Love", count: 0 },
    { emoji: "😂", label: "Laugh", count: 0 },
    { emoji: "😮", label: "Wow", count: 0 },
    { emoji: "😢", label: "Sad", count: 0 },
    { emoji: "😡", label: "Angry", count: 0 },
  ]);
  
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  
  const handleReaction = (emoji: string) => {
    setReactions(prev => prev.map(reaction => {
      if (reaction.emoji === emoji) {
        if (userReaction === emoji) {
          // Remove reaction
          setUserReaction(null);
          return { ...reaction, count: Math.max(0, reaction.count - 1) };
        } else {
          // Add new reaction
          const newCount = userReaction ? reaction.count : reaction.count + 1;
          return { ...reaction, count: newCount };
        }
      } else if (reaction.emoji === userReaction) {
        // Remove old reaction
        return { ...reaction, count: Math.max(0, reaction.count - 1) };
      }
      return reaction;
    }));
    
    setUserReaction(userReaction === emoji ? null : emoji);
    setShowReactions(false);
  };

  const totalReactions = reactions.reduce((sum, reaction) => sum + reaction.count, 0);
  const topReactions = reactions.filter(r => r.count > 0).slice(0, 3);
  
  return (
    <div className="bee-card p-4 mb-4 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback>{author.avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <Link to={`/profile/${author.id}`} className="font-semibold hover:underline dark:text-white">
              {author.name}
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{timestamp}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
          <MoreHorizontal size={18} />
        </Button>
      </div>
      
      <div className="mt-3">
        <p className="text-gray-800 dark:text-gray-200">{content}</p>
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
      
      <div className="mt-3 flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          {topReactions.length > 0 && (
            <div className="flex items-center gap-1">
              {topReactions.map((reaction, index) => (
                <span key={reaction.emoji} className="text-base">{reaction.emoji}</span>
              ))}
              <span>{totalReactions}</span>
            </div>
          )}
        </div>
        <div>
          <span>{comments} comments • {shares} shares</span>
        </div>
      </div>
      
      <Separator className="my-3 dark:border-gray-600" />
      
      <div className="flex justify-between relative">
        <div className="relative">
          <Button 
            variant="ghost" 
            className={`flex-1 ${userReaction ? 'text-bee-blue' : 'text-gray-600 dark:text-gray-400'}`}
            onClick={() => setShowReactions(!showReactions)}
            onMouseEnter={() => setShowReactions(true)}
          >
            {userReaction ? (
              <span className="mr-2 text-base">{userReaction}</span>
            ) : (
              <ThumbsUp size={18} className="mr-2" />
            )}
            Like
          </Button>
          
          {showReactions && (
            <div 
              className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-lg p-2 flex gap-2 z-10"
              onMouseLeave={() => setShowReactions(false)}
            >
              {reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  onClick={() => handleReaction(reaction.emoji)}
                  className="text-2xl hover:scale-125 transition-transform duration-200 p-1"
                  title={reaction.label}
                >
                  {reaction.emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <Button variant="ghost" className="flex-1 text-gray-600 dark:text-gray-400">
          <MessageSquare size={18} className="mr-2" />
          Comment
        </Button>
        <Button variant="ghost" className="flex-1 text-gray-600 dark:text-gray-400">
          <Share2 size={18} className="mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default Post;
