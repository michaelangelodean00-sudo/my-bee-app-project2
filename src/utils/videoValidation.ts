
export const validateUrl = (url: string, platform: string) => {
  const patterns = {
    youtube: /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
    instagram: /^(https?\:\/\/)?(www\.)?instagram\.com\/.+/,
    tiktok: /^(https?\:\/\/)?(www\.)?tiktok\.com\/.+/,
    facebook: /^(https?\:\/\/)?(www\.)?facebook\.com\/.+/,
  };
  
  return patterns[platform as keyof typeof patterns]?.test(url) || false;
};

export const MAX_VIDEO_DURATION_SECONDS = 90; // 1 minute 30 seconds

export const validateVideoFile = (file: File) => {
  // Accepted video MIME types (MP4 and common formats)
  const acceptedTypes = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'video/webm'
  ];
  
  // Check file type
  if (!acceptedTypes.includes(file.type) && !file.type.startsWith('video/')) {
    return { isValid: false, error: "Please select a valid video file (MP4, MOV, AVI, MKV, WebM)" };
  }
  
  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024; // 50MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, error: "File size must be less than 50MB" };
  }
  
  return { isValid: true, error: null };
};

export const validateVideoDuration = (file: File): Promise<{ isValid: boolean; error: string | null }> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    const url = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      if (video.duration > MAX_VIDEO_DURATION_SECONDS) {
        resolve({
          isValid: false,
          error: `Video must be 1 minute 30 seconds or less. Your video is ${Math.floor(video.duration / 60)}m ${Math.round(video.duration % 60)}s.`
        });
      } else {
        resolve({ isValid: true, error: null });
      }
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ isValid: true, error: null }); // Allow if duration can't be read
    };
    video.src = url;
  });
};
