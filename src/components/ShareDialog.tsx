import React, { useEffect, useState } from 'react';
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
  const [mounted, setMounted] = useState(false);
  
  const shareUrl = `${window.location.origin}/post/${postId}`;
  const shareText = postContent.substring(0, 100) + (postContent.length > 100 ? '...' : '');

  // Ensure component is mounted before rendering portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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

  const handleClose = () => {
    onOpenChange(false);
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      bgColor: '#25D366',
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
        onShareComplete?.();
        handleClose();
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      bgColor: '#1877F2',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        onShareComplete?.();
        handleClose();
      }
    },
    {
      name: 'X',
      icon: () => (
        <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, fill: 'white' }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      bgColor: '#000000',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        onShareComplete?.();
        handleClose();
      }
    },
    {
      name: 'Telegram',
      icon: Send,
      bgColor: '#0088CC',
      action: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
        onShareComplete?.();
        handleClose();
      }
    },
    {
      name: 'Email',
      icon: Mail,
      bgColor: '#EA4335',
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent('Check this out!')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        onShareComplete?.();
        handleClose();
      }
    },
    {
      name: 'Copy Link',
      icon: Link2,
      bgColor: '#6B7280',
      action: async () => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast({
            title: "Link copied!",
            description: "The link has been copied to your clipboard.",
          });
          onShareComplete?.();
          handleClose();
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
      bgColor: '#8B5CF6',
      action: async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'B.E.E App',
              text: shareText,
              url: shareUrl,
            });
            onShareComplete?.();
            handleClose();
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

  if (!open || !mounted) return null;

  const dialogContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={handleClose}
    >
      {/* Dark backdrop */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        }}
      />
      
      {/* White bottom sheet */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 500,
          backgroundColor: '#ffffff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8 }}>
          <div
            style={{
              width: 48,
              height: 5,
              borderRadius: 999,
              backgroundColor: '#D1D5DB',
            }}
          />
        </div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 999,
            backgroundColor: '#F3F4F6',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          <X size={18} color="#6B7280" />
        </button>
        
        {/* Header */}
        <div style={{ textAlign: 'center', paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>Share to</h2>
        </div>
        
        {/* Share options - horizontal scroll */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            padding: '16px 24px',
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
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                minWidth: 72,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  backgroundColor: option.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              >
                <option.icon style={{ width: 24, height: 24, color: 'white' }} color="white" />
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#374151',
                  whiteSpace: 'nowrap',
                }}
              >
                {option.name}
              </span>
            </button>
          ))}
        </div>

        {/* Cancel button */}
        <div style={{ padding: '8px 16px 8px 16px' }}>
          <button
            onClick={handleClose}
            style={{
              width: '100%',
              padding: 14,
              textAlign: 'center',
              color: '#6B7280',
              fontWeight: 500,
              background: 'none',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              minHeight: 48,
              fontSize: 16,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      
      {/* Inline keyframes animation */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );

  // Render to document.body to escape all parent stacking contexts
  return createPortal(dialogContent, document.body);
};

export default ShareDialog;