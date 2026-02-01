import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { Link2, MessageCircle, Facebook, Mail, Send, MoreHorizontal } from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number | string;
  postContent: string;
  onShareComplete?: () => void;
}

// TikTok-style share option button
const ShareOption = ({ 
  icon: Icon, 
  label, 
  onClick, 
  bgColor = 'bg-muted',
  iconColor = 'text-foreground'
}: { 
  icon: React.ElementType; 
  label: string; 
  onClick: () => void;
  bgColor?: string;
  iconColor?: string;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 min-w-[72px] touch-manipulation active:scale-95 transition-transform"
  >
    <div className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <span className="text-xs text-muted-foreground font-medium">{label}</span>
  </button>
);

// X/Twitter icon (not in lucide)
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('Check this out!')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
    onOpenChange(false);
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

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check this out!',
          text: shareText,
          url: shareUrl,
        });
        onShareComplete?.();
      } catch (err) {
        // User cancelled or error
      }
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-3xl px-4 pb-8 pt-3 max-h-[85vh] bg-background"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        {/* Drag handle indicator */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>
        
        <SheetHeader className="mb-6">
          <SheetTitle className="text-center text-lg font-semibold">Share to</SheetTitle>
        </SheetHeader>
        
        {/* TikTok-style horizontal scroll share options */}
        <div className="flex gap-4 overflow-x-auto pb-2 px-2 -mx-2 scrollbar-hide">
          <ShareOption
            icon={MessageCircle}
            label="WhatsApp"
            onClick={() => handleShare('whatsapp')}
            bgColor="bg-green-500"
            iconColor="text-white"
          />
          <ShareOption
            icon={Facebook}
            label="Facebook"
            onClick={() => handleShare('facebook')}
            bgColor="bg-blue-600"
            iconColor="text-white"
          />
          <ShareOption
            icon={XIcon}
            label="X"
            onClick={() => handleShare('twitter')}
            bgColor="bg-black dark:bg-white"
            iconColor="text-white dark:text-black"
          />
          <ShareOption
            icon={Send}
            label="Telegram"
            onClick={() => handleShare('telegram')}
            bgColor="bg-sky-500"
            iconColor="text-white"
          />
          <ShareOption
            icon={Mail}
            label="Email"
            onClick={() => handleShare('email')}
            bgColor="bg-red-500"
            iconColor="text-white"
          />
          <ShareOption
            icon={Link2}
            label="Copy Link"
            onClick={handleCopyLink}
            bgColor="bg-muted"
            iconColor="text-foreground"
          />
          {typeof navigator !== 'undefined' && navigator.share && (
            <ShareOption
              icon={MoreHorizontal}
              label="More"
              onClick={handleNativeShare}
              bgColor="bg-muted"
              iconColor="text-foreground"
            />
          )}
        </div>

        {/* Cancel button */}
        <button
          onClick={() => onOpenChange(false)}
          className="w-full mt-6 py-3 text-center text-muted-foreground font-medium touch-manipulation active:bg-muted rounded-xl transition-colors"
        >
          Cancel
        </button>
      </SheetContent>
    </Sheet>
  );
};

export default ShareDialog;
