
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
  hasNewBusinessVideos: boolean;
  setHasNewBusinessVideos: (hasNew: boolean) => void;
  markBusinessVideosAsViewed: () => void;
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

  const markBusinessVideosAsViewed = () => {
    setHasNewBusinessVideos(false);
  };

  return (
    <NotificationContext.Provider value={{
      hasNewBusinessVideos,
      setHasNewBusinessVideos,
      markBusinessVideosAsViewed
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
