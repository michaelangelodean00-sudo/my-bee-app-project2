import { useState, useEffect, useCallback } from "react";

export interface GreetingBanner {
  id: string;
  message: string;
  emoji?: string;
  backgroundColor?: string;
  textColor?: string;
  isActive: boolean;
  expiresAt?: string; // ISO date string
  createdAt: string;
}

const GREETING_STORAGE_KEY = "bee_greeting_banner";
const DISMISSED_GREETINGS_KEY = "bee_dismissed_greetings";

export const useGreetingBanner = () => {
  const [greeting, setGreeting] = useState<GreetingBanner | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  const loadGreeting = useCallback(() => {
    try {
      const stored = localStorage.getItem(GREETING_STORAGE_KEY);
      if (stored) {
        const parsed: GreetingBanner = JSON.parse(stored);
        
        // Check if expired
        if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
          return null;
        }
        
        // Check if active
        if (!parsed.isActive) {
          return null;
        }
        
        return parsed;
      }
    } catch (error) {
      console.error("Error loading greeting:", error);
    }
    return null;
  }, []);

  const checkDismissed = useCallback((greetingId: string) => {
    try {
      const dismissed = localStorage.getItem(DISMISSED_GREETINGS_KEY);
      if (dismissed) {
        const dismissedIds: string[] = JSON.parse(dismissed);
        return dismissedIds.includes(greetingId);
      }
    } catch (error) {
      console.error("Error checking dismissed:", error);
    }
    return false;
  }, []);

  useEffect(() => {
    const loadedGreeting = loadGreeting();
    setGreeting(loadedGreeting);
    
    if (loadedGreeting) {
      setIsDismissed(checkDismissed(loadedGreeting.id));
    }
  }, [loadGreeting, checkDismissed]);

  const dismissGreeting = useCallback(() => {
    if (!greeting) return;
    
    try {
      const dismissed = localStorage.getItem(DISMISSED_GREETINGS_KEY);
      const dismissedIds: string[] = dismissed ? JSON.parse(dismissed) : [];
      
      if (!dismissedIds.includes(greeting.id)) {
        dismissedIds.push(greeting.id);
        localStorage.setItem(DISMISSED_GREETINGS_KEY, JSON.stringify(dismissedIds));
      }
      
      setIsDismissed(true);
    } catch (error) {
      console.error("Error dismissing greeting:", error);
    }
  }, [greeting]);

  const saveGreeting = useCallback((newGreeting: Omit<GreetingBanner, "id" | "createdAt">) => {
    const fullGreeting: GreetingBanner = {
      ...newGreeting,
      id: `greeting_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem(GREETING_STORAGE_KEY, JSON.stringify(fullGreeting));
    setGreeting(fullGreeting);
    setIsDismissed(false);
    
    // Clear dismissed state for new greeting
    localStorage.removeItem(DISMISSED_GREETINGS_KEY);
    
    return fullGreeting;
  }, []);

  const deleteGreeting = useCallback(() => {
    localStorage.removeItem(GREETING_STORAGE_KEY);
    setGreeting(null);
  }, []);

  const refreshGreeting = useCallback(() => {
    const loadedGreeting = loadGreeting();
    setGreeting(loadedGreeting);
    if (loadedGreeting) {
      setIsDismissed(checkDismissed(loadedGreeting.id));
    }
  }, [loadGreeting, checkDismissed]);

  return {
    greeting,
    isDismissed,
    dismissGreeting,
    saveGreeting,
    deleteGreeting,
    refreshGreeting,
    showBanner: greeting && greeting.isActive && !isDismissed,
  };
};
