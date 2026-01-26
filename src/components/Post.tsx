
import { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ShareDialog from "./ShareDialog";

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
  
  const [shareCount, setShareCount] = useState(shares);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [messageDialog, setMessageDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [messageText, setMessageText] = useState("");
  
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

  const handleMessageUser = () => {
    setMessageDialog(true);
  };

  const sendMessage = () => {
    if (messageText.trim()) {
      toast.success(`Message sent to ${author.name} through BEE messenger!`);
      setMessageDialog(false);
      setMessageText("");
    }
  };

  const handleShareComplete = () => {
    setShareCount(prev => prev + 1);
    setShareDialog(false);
  };

  const totalReactions = reactions.reduce((sum, reaction) => sum + reaction.count, 0);
  const topReactions = reactions.filter(r => r.count > 0).slice(0, 3);
  
  return (
    <>
      <div className="bee-card p-4 mb-4 group relative overflow-hidden hover:animate-[morphism_3s_ease-in-out_infinite] animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Avatar className="transition-transform duration-300 hover:scale-110">
              <AvatarImage src={author.avatarUrl} alt={author.name} />
              <AvatarFallback className="font-heading font-semibold">{author.avatarFallback}</AvatarFallback>
            </Avatar>
            <div>
              <Link to={`/profile/${author.id}`} className="font-heading font-semibold hover:underline text-foreground tracking-tight transition-colors hover:text-primary">
                {author.name}
              </Link>
              <p className="text-muted-foreground text-sm font-body">{timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground transition-colors">
            <MoreHorizontal size={18} />
          </Button>
        </div>
        
        <div className="mt-3">
          <p className="text-foreground font-body leading-relaxed">{content}</p>
          {imageUrl && (
            <div className="mt-3 rounded-lg overflow-hidden group-hover:shadow-md transition-all duration-500 relative">
              <img 
                src={imageUrl} 
                alt="Post" 
                className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          )}
        </div>
        
        <div className="mt-3 flex justify-between text-sm text-muted-foreground font-body">
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
            <span>{comments} comments • {shareCount} shares</span>
          </div>
        </div>
        
        <Separator className="my-3" />
        
        <div className="flex justify-between relative">
          <div className="relative">
            <Button 
              variant="ghost" 
              className={`flex-1 font-medium transition-all duration-200 ${userReaction ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
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
                className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-xl shadow-lg p-2 flex gap-2 z-10 animate-pop-in"
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
          
          <Button variant="ghost" className="flex-1 text-muted-foreground hover:text-foreground font-medium transition-all duration-200" onClick={handleMessageUser}>
            <MessageSquare size={18} className="mr-2" />
            Message
          </Button>
          <Button variant="ghost" className="flex-1 text-muted-foreground hover:text-foreground font-medium transition-all duration-200" onClick={() => setShareDialog(true)}>
            <Share2 size={18} className="mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Message Dialog */}
      <Dialog open={messageDialog} onOpenChange={setMessageDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to {author.name} through BEE messenger
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={sendMessage} className="bg-bee-blue hover:bg-bee-blue/90">
              <MessageSquare size={16} className="mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialog}
        onOpenChange={setShareDialog}
        postId={id}
        postContent={content}
        onShareComplete={handleShareComplete}
      />
    </>
  );
};

export default Post;
