import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { Link2, MessageCircle, Facebook, Mail, Send, MoreHorizontal, X } from 'lucide-react';

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
  const contentRef = useRef<HTMLDivElement>(null);
  
  const shareUrl = `${window.location.origin}/post/${postId}`;
  const shareText = postContent.substring(0, 100) + (postContent.length > 100 ? '...' : '');

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  const handleBackdropClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      onOpenChange(false);
    }
  };

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

  if (!open) return null;

  // Use portal to render at document root, bypassing all parent transforms
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
      onClick={handleBackdropClick}
      onTouchEnd={handleBackdropClick}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 animate-in fade-in duration-200"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
        onClick={handleBackdropClick}
        onTouchEnd={handleBackdropClick}
      />
      
      {/* Content */}
      <div 
        ref={contentRef}
        className="relative w-full max-w-lg bg-background rounded-t-3xl animate-in slide-in-from-bottom duration-300"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '32rem',
          backgroundColor: 'var(--background, #ffffff)',
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
          paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          transform: 'translateY(0)',
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div 
            className="w-12 h-1.5 rounded-full bg-muted-foreground/30"
            style={{ width: '3rem', height: '0.375rem', borderRadius: '9999px', backgroundColor: 'rgba(128,128,128,0.3)' }}
          />
        </div>
        
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors touch-manipulation"
          style={{ position: 'absolute', top: '0.75rem', right: '1rem' }}
          aria-label="Close"
        >
          <X size={18} className="text-muted-foreground" />
        </button>
        
        {/* Header */}
        <div className="text-center py-2 px-4">
          <h2 className="text-lg font-semibold text-foreground">Share to</h2>
        </div>
        
        {/* Share options - TikTok style horizontal scroll */}
        <div 
          className="flex gap-4 overflow-x-auto px-6 py-4 scrollbar-hide"
          style={{ 
            display: 'flex', 
            gap: '1rem', 
            overflowX: 'auto', 
            padding: '1rem 1.5rem',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                option.action();
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
              }}
              className="flex flex-col items-center gap-2 min-w-[72px] touch-manipulation active:scale-95 transition-transform select-none"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '0.5rem', 
                minWidth: '72px',
                touchAction: 'manipulation',
              }}
            >
              <div 
                className={`w-14 h-14 rounded-full ${option.color} flex items-center justify-center text-white shadow-lg`}
                style={{ 
                  width: '3.5rem', 
                  height: '3.5rem', 
                  borderRadius: '9999px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <option.icon className="w-6 h-6 pointer-events-none" />
              </div>
              <span 
                className="text-xs text-foreground/80 font-medium whitespace-nowrap pointer-events-none"
                style={{ fontSize: '0.75rem', fontWeight: 500, whiteSpace: 'nowrap' }}
              >
                {option.name}
              </span>
            </button>
          ))}
        </div>

        {/* Cancel button */}
        <div className="px-4 pb-2">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full py-3.5 text-center text-muted-foreground font-medium touch-manipulation active:bg-muted rounded-xl transition-colors min-h-[48px]"
            style={{ 
              width: '100%', 
              padding: '0.875rem', 
              textAlign: 'center',
              borderRadius: '0.75rem',
              minHeight: '48px',
              touchAction: 'manipulation',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ShareDialog;