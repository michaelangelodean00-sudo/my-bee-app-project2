import { memo, useState, useCallback } from "react";
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

const initialReactions = (likes: number): Reaction[] => [
  { emoji: "👍", label: "Like", count: likes },
  { emoji: "❤️", label: "Love", count: 0 },
  { emoji: "😂", label: "Laugh", count: 0 },
  { emoji: "😮", label: "Wow", count: 0 },
  { emoji: "😢", label: "Sad", count: 0 },
  { emoji: "😡", label: "Angry", count: 0 },
];

const Post = memo(({
  id,
  author,
  content,
  imageUrl,
  timestamp,
  likes,
  comments,
  shares,
}: PostProps) => {
  const [reactions, setReactions] = useState<Reaction[]>(() => initialReactions(likes));
  const [shareCount, setShareCount] = useState(shares);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [messageDialog, setMessageDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [messageText, setMessageText] = useState("");
  
  const handleReaction = useCallback((emoji: string) => {
    setReactions(prev => prev.map(reaction => {
      if (reaction.emoji === emoji) {
        if (userReaction === emoji) {
          return { ...reaction, count: Math.max(0, reaction.count - 1) };
        } else {
          const newCount = userReaction ? reaction.count : reaction.count + 1;
          return { ...reaction, count: newCount };
        }
      } else if (reaction.emoji === userReaction) {
        return { ...reaction, count: Math.max(0, reaction.count - 1) };
      }
      return reaction;
    }));
    
    setUserReaction(prev => prev === emoji ? null : emoji);
    setShowReactions(false);
  }, [userReaction]);

  const handleMessageUser = useCallback(() => {
    setMessageDialog(true);
  }, []);

  const sendMessage = useCallback(() => {
    if (messageText.trim()) {
      toast.success(`Message sent to ${author.name} through BEE messenger!`);
      setMessageDialog(false);
      setMessageText("");
    }
  }, [messageText, author.name]);

  const handleShareComplete = useCallback(() => {
    setShareCount(prev => prev + 1);
    setShareDialog(false);
  }, []);

  const totalReactions = reactions.reduce((sum, reaction) => sum + reaction.count, 0);
  const topReactions = reactions.filter(r => r.count > 0).slice(0, 3);
  
  return (
    <>
      <div className="bee-card p-4 md:p-5 mb-4 group relative overflow-hidden animate-fade-in-up hover:shadow-[0_8px_32px_hsl(var(--primary)/0.10)] transition-shadow duration-300" style={{ contain: 'layout style' }}>
        {/* Subtle top gradient accent on hover */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Avatar className="transition-transform duration-300 hover:scale-110">
              <AvatarImage src={author.avatarUrl} alt={author.name} loading="lazy" />
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
            <div className="mt-3 rounded-lg overflow-hidden group-hover:shadow-md transition-shadow duration-300 relative">
              <img 
                src={imageUrl} 
                alt="Post" 
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
        </div>
        
        <div className="mt-3 flex justify-between text-sm text-muted-foreground font-body">
          <div className="flex items-center gap-2">
            {topReactions.length > 0 && (
              <div className="flex items-center gap-1">
                {topReactions.map((reaction) => (
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
        
        <Separator className="my-3 md:my-4" />
        
        <div className="flex justify-between relative">
          <div className="relative">
            <Button 
              variant="ghost" 
              className={`flex-1 font-medium transition-colors duration-200 ${userReaction ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setShowReactions(!showReactions)}
              onMouseEnter={() => setShowReactions(true)}
            >
              {userReaction ? (
                <span key={userReaction} className="mr-2 text-base animate-reaction-pop">{userReaction}</span>
              ) : (
                <ThumbsUp size={18} className="mr-2 transition-transform group-hover/like:scale-110" />
              )}
              Like
            </Button>
            
            {showReactions && (
              <div 
                className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-xl shadow-lg p-2 flex gap-1 z-10 animate-pop-in"
                onMouseLeave={() => setShowReactions(false)}
              >
                {reactions.map((reaction) => (
                  <button
                    key={reaction.emoji}
                    onClick={() => handleReaction(reaction.emoji)}
                    className="text-2xl hover:scale-125 transition-transform duration-200 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation active:scale-110 rounded-lg hover:bg-accent/50"
                    title={reaction.label}
                  >
                    {reaction.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Button variant="ghost" className="flex-1 text-muted-foreground hover:text-foreground font-medium transition-colors duration-200" onClick={handleMessageUser}>
            <MessageSquare size={18} className="mr-2" />
            Message
          </Button>
          <Button variant="ghost" className="flex-1 text-muted-foreground hover:text-foreground font-medium transition-colors duration-200" onClick={() => setShareDialog(true)}>
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
            <Button onClick={sendMessage} variant="premium">
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
});

Post.displayName = 'Post';

export default Post;
