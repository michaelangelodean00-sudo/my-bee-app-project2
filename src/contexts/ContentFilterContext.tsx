import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContentFilterContextType {
  blockedBusinessVideos: Set<string>;
  blockedEventVideos: Set<string>;
  dislikedBusinessVideos: Set<string>;
  dislikedEventVideos: Set<string>;
  blockBusinessVideo: (videoId: string) => void;
  blockEventVideo: (videoId: string) => void;
  unblockBusinessVideo: (videoId: string) => void;
  unblockEventVideo: (videoId: string) => void;
  dislikeBusinessVideo: (videoId: string) => void;
  dislikeEventVideo: (videoId: string) => void;
  undislikeBusinessVideo: (videoId: string) => void;
  undislikeEventVideo: (videoId: string) => void;
  isBusinessVideoBlocked: (videoId: string) => boolean;
  isEventVideoBlocked: (videoId: string) => boolean;
  isBusinessVideoDisliked: (videoId: string) => boolean;
  isEventVideoDisliked: (videoId: string) => boolean;
}

const ContentFilterContext = createContext<ContentFilterContextType | undefined>(undefined);

export const useContentFilter = () => {
  const context = useContext(ContentFilterContext);
  if (!context) {
    throw new Error('useContentFilter must be used within a ContentFilterProvider');
  }
  return context;
};

interface ContentFilterProviderProps {
  children: ReactNode;
}

export const ContentFilterProvider = ({ children }: ContentFilterProviderProps) => {
  const [blockedBusinessVideos, setBlockedBusinessVideos] = useState<Set<string>>(new Set());
  const [blockedEventVideos, setBlockedEventVideos] = useState<Set<string>>(new Set());
  const [dislikedBusinessVideos, setDislikedBusinessVideos] = useState<Set<string>>(new Set());
  const [dislikedEventVideos, setDislikedEventVideos] = useState<Set<string>>(new Set());

  const blockBusinessVideo = (videoId: string) => {
    setBlockedBusinessVideos(prev => new Set([...prev, videoId]));
  };

  const blockEventVideo = (videoId: string) => {
    setBlockedEventVideos(prev => new Set([...prev, videoId]));
  };

  const unblockBusinessVideo = (videoId: string) => {
    setBlockedBusinessVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(videoId);
      return newSet;
    });
  };

  const unblockEventVideo = (videoId: string) => {
    setBlockedEventVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(videoId);
      return newSet;
    });
  };

  const dislikeBusinessVideo = (videoId: string) => {
    setDislikedBusinessVideos(prev => new Set([...prev, videoId]));
  };

  const dislikeEventVideo = (videoId: string) => {
    setDislikedEventVideos(prev => new Set([...prev, videoId]));
  };

  const undislikeBusinessVideo = (videoId: string) => {
    setDislikedBusinessVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(videoId);
      return newSet;
    });
  };

  const undislikeEventVideo = (videoId: string) => {
    setDislikedEventVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(videoId);
      return newSet;
    });
  };

  const isBusinessVideoBlocked = (videoId: string) => blockedBusinessVideos.has(videoId);
  const isEventVideoBlocked = (videoId: string) => blockedEventVideos.has(videoId);
  const isBusinessVideoDisliked = (videoId: string) => dislikedBusinessVideos.has(videoId);
  const isEventVideoDisliked = (videoId: string) => dislikedEventVideos.has(videoId);

  return (
    <ContentFilterContext.Provider value={{
      blockedBusinessVideos,
      blockedEventVideos,
      dislikedBusinessVideos,
      dislikedEventVideos,
      blockBusinessVideo,
      blockEventVideo,
      unblockBusinessVideo,
      unblockEventVideo,
      dislikeBusinessVideo,
      dislikeEventVideo,
      undislikeBusinessVideo,
      undislikeEventVideo,
      isBusinessVideoBlocked,
      isEventVideoBlocked,
      isBusinessVideoDisliked,
      isEventVideoDisliked
    }}>
      {children}
    </ContentFilterContext.Provider>
  );
};