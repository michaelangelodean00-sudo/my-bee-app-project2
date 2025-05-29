
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
  hasNewBusinessVideos: boolean;
  hasNewEventsVideos: boolean;
  setHasNewBusinessVideos: (hasNew: boolean) => void;
  setHasNewEventsVideos: (hasNew: boolean) => void;
  markBusinessVideosAsViewed: () => void;
  markEventsVideosAsViewed: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [hasNewBusinessVideos, setHasNewBusinessVideos] = useState(true); // Set to true initially to show badge
  const [hasNewEventsVideos, setHasNewEventsVideos] = useState(true); // Set to true initially to show badge

  const markBusinessVideosAsViewed = () => {
    setHasNewBusinessVideos(false);
  };

  const markEventsVideosAsViewed = () => {
    setHasNewEventsVideos(false);
  };

  return (
    <NotificationContext.Provider value={{
      hasNewBusinessVideos,
      hasNewEventsVideos,
      setHasNewBusinessVideos,
      setHasNewEventsVideos,
      markBusinessVideosAsViewed,
      markEventsVideosAsViewed
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
