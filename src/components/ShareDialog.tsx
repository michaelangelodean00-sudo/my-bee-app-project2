import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Link2, MessageCircle, Facebook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number | string;
  postContent: string;
  onShareComplete?: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onOpenChange,
  postId,
  postContent,
  onShareComplete,
}) => {
  const { toast } = useToast();
  const shareUrl = `${window.location.origin}/post/${postId}`;
  const shareText = postContent.substring(0, 100) + (postContent.length > 100 ? '...' : '');

  const handleShare = (platform: string) => {
    onShareComplete?.();
    
    let url = '';
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Link Copied!',
      description: 'Post link copied to clipboard',
    });
    onShareComplete?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Share Post</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share this post with your friends
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 py-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12"
            onClick={() => handleShare('whatsapp')}
          >
            <MessageCircle className="h-5 w-5 text-green-500" />
            <span>Share on WhatsApp</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="h-5 w-5 text-blue-500" />
            <span>Share on Facebook</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12"
            onClick={() => handleShare('twitter')}
          >
            <Share2 className="h-5 w-5 text-sky-500" />
            <span>Share on Twitter</span>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          
          <Button
            variant="secondary"
            className="w-full justify-start gap-3 h-12"
            onClick={handleCopyLink}
          >
            <Link2 className="h-5 w-5" />
            <span>Copy Link</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
