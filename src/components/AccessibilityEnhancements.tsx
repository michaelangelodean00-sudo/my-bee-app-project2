import React, { useEffect } from 'react';

const AccessibilityEnhancements: React.FC = () => {
  useEffect(() => {
    // Skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50';
    skipLink.setAttribute('aria-label', 'Skip navigation and go to main content');
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Focus management for modals and overlays
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key to close modals
      if (event.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"][aria-modal="true"]');
        if (activeModal) {
          const closeButton = activeModal.querySelector('[aria-label*="close"], [data-dismiss="modal"]');
          if (closeButton instanceof HTMLElement) {
            closeButton.click();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Announce page changes for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'page-announcer';
    document.body.appendChild(announcer);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink);
      }
      if (announcer.parentNode) {
        announcer.parentNode.removeChild(announcer);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default AccessibilityEnhancements;