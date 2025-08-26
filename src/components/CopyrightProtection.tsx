import { useEffect } from 'react';
import { toast } from 'sonner';

const CopyrightProtection = () => {
  useEffect(() => {
    // Disable right-click context menu to prevent easy copying
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.error("Content is protected by copyright", {
        description: "© B.E.E App Bahamas - All rights reserved"
      });
      return false;
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        toast.warning("Developer tools disabled", {
          description: "Content protected by copyright law"
        });
        return false;
      }
    };

    // Disable text selection for copyright-sensitive content
    const handleSelectStart = (e: Event) => {
      const target = e.target as Element;
      if (target.closest('[data-copyright-protected="true"]')) {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);

    // Add copyright notice to console
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║                    COPYRIGHT NOTICE                          ║
    ║                                                              ║
    ║  © ${new Date().getFullYear()} B.E.E App Bahamas - All Rights Reserved      ║
    ║                                                              ║
    ║  This application and its contents are protected by          ║
    ║  copyright law. Unauthorized reproduction, distribution,     ║
    ║  or reverse engineering is strictly prohibited.              ║
    ║                                                              ║
    ║  Legal action will be taken against violators.              ║
    ╚══════════════════════════════════════════════════════════════╝
    `);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

  // Add periodic copyright reminders
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔒 B.E.E App - Protected by copyright © ' + new Date().getFullYear());
    }, 300000); // Every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything visible
};

export default CopyrightProtection;