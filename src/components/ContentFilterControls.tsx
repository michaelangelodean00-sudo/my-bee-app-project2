import React, { useState } from 'react';
import { MoreVertical, ThumbsDown, Eye, EyeOff, Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useContentFilter } from '@/contexts/ContentFilterContext';
import { toast } from '@/hooks/use-toast';

interface ContentFilterControlsProps {
  videoId: string;
  contentType: 'business' | 'event';
  className?: string;
}

const ContentFilterControls: React.FC<ContentFilterControlsProps> = ({
  videoId,
  contentType,
  className = ''
}) => {
  const {
    blockBusinessVideo,
    blockEventVideo,
    unblockBusinessVideo,
    unblockEventVideo,
    dislikeBusinessVideo,
    dislikeEventVideo,
    undislikeBusinessVideo,
    undislikeEventVideo,
    isBusinessVideoBlocked,
    isEventVideoBlocked,
    isBusinessVideoDisliked,
    isEventVideoDisliked
  } = useContentFilter();

  const [isOpen, setIsOpen] = useState(false);

  const isBlocked = contentType === 'business' 
    ? isBusinessVideoBlocked(videoId) 
    : isEventVideoBlocked(videoId);

  const isDisliked = contentType === 'business'
    ? isBusinessVideoDisliked(videoId)
    : isEventVideoDisliked(videoId);

  const handleBlock = () => {
    if (contentType === 'business') {
      blockBusinessVideo(videoId);
    } else {
      blockEventVideo(videoId);
    }
    toast({
      title: "Content blocked",
      description: "You won't see this content anymore. You can unblock it from your preferences.",
    });
    setIsOpen(false);
  };

  const handleUnblock = () => {
    if (contentType === 'business') {
      unblockBusinessVideo(videoId);
    } else {
      unblockEventVideo(videoId);
    }
    toast({
      title: "Content unblocked",
      description: "This content will appear in your feed again.",
    });
    setIsOpen(false);
  };

  const handleDislike = () => {
    if (contentType === 'business') {
      dislikeBusinessVideo(videoId);
    } else {
      dislikeEventVideo(videoId);
    }
    toast({
      title: "Marked as not interested",
      description: "We'll show you less content like this.",
    });
    setIsOpen(false);
  };

  const handleUndislike = () => {
    if (contentType === 'business') {
      undislikeBusinessVideo(videoId);
    } else {
      undislikeEventVideo(videoId);
    }
    toast({
      title: "Preference updated",
      description: "This type of content may appear more often.",
    });
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`text-white hover:bg-white/20 ${className}`}
        >
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {!isDisliked ? (
          <DropdownMenuItem onClick={handleDislike} className="flex items-center gap-2">
            <ThumbsDown size={16} />
            Not interested
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleUndislike} className="flex items-center gap-2">
            <Undo size={16} />
            Undo not interested
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {!isBlocked ? (
          <DropdownMenuItem onClick={handleBlock} className="flex items-center gap-2 text-red-600">
            <EyeOff size={16} />
            Block this content
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleUnblock} className="flex items-center gap-2 text-green-600">
            <Eye size={16} />
            Unblock this content
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContentFilterControls;