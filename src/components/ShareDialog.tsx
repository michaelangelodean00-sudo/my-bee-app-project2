import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';
import { Link2, MessageCircle, Facebook, Mail, Send, MoreHorizontal } from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  postContent: string;
  onShareComplete?: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onOpenChange,
  postId,
  postContent,
  onShareComplete
}) => {
  const { toast } = useToast();
  
  const shareUrl = `${window.location.origin}/post/${postId}`;
  const shareText = postContent.substring(0, 100) + (postContent.length > 100 ? '...' : '');

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500',
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
        onShareComplete?.();
        onOpenChange(false);
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        onShareComplete?.();
        onOpenChange(false);
      }
    },
    {
      name: 'X',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'bg-black dark:bg-white dark:text-black',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        onShareComplete?.();
        onOpenChange(false);
      }
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500',
      action: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
        onShareComplete?.();
        onOpenChange(false);
      }
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-red-500',
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent('Check this out!')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        onShareComplete?.();
        onOpenChange(false);
      }
    },
    {
      name: 'Copy Link',
      icon: Link2,
      color: 'bg-gray-600',
      action: async () => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast({
            title: "Link copied!",
            description: "The link has been copied to your clipboard.",
          });
          onShareComplete?.();
          onOpenChange(false);
        } catch (err) {
          toast({
            title: "Failed to copy",
            description: "Please try again.",
            variant: "destructive"
          });
        }
      }
    },
    {
      name: 'More',
      icon: MoreHorizontal,
      color: 'bg-purple-500',
      action: async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'B.E.E App',
              text: shareText,
              url: shareUrl,
            });
            onShareComplete?.();
            onOpenChange(false);
          } catch (err) {
            if ((err as Error).name !== 'AbortError') {
              toast({
                title: "Share failed",
                description: "Please try another method.",
                variant: "destructive"
              });
            }
          }
        } else {
          toast({
            title: "Share not supported",
            description: "Please use one of the other share options.",
          });
        }
      }
    }
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-4 pb-8">
        <DrawerHeader className="mb-4">
          <DrawerTitle className="text-center text-lg font-semibold">Share to</DrawerTitle>
        </DrawerHeader>
        
        {/* TikTok-style horizontal scroll share options */}
        <div className="flex gap-4 overflow-x-auto pb-2 px-2 -mx-2 scrollbar-hide">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className="flex flex-col items-center gap-2 min-w-[72px] touch-manipulation active:scale-95 transition-transform"
            >
              <div className={`w-14 h-14 rounded-full ${option.color} flex items-center justify-center text-white shadow-lg`}>
                <option.icon className="w-6 h-6" />
              </div>
              <span className="text-xs text-foreground/80 font-medium whitespace-nowrap">
                {option.name}
              </span>
            </button>
          ))}
        </div>

        {/* Cancel button */}
        <button
          onClick={() => onOpenChange(false)}
          className="w-full mt-6 py-3 text-center text-muted-foreground font-medium touch-manipulation active:bg-muted rounded-xl transition-colors min-h-[44px]"
        >
          Cancel
        </button>
      </DrawerContent>
    </Drawer>
  );
};

export default ShareDialog;
