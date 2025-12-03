
export const validateUrl = (url: string, platform: string) => {
  const patterns = {
    youtube: /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
    instagram: /^(https?\:\/\/)?(www\.)?instagram\.com\/.+/,
    tiktok: /^(https?\:\/\/)?(www\.)?tiktok\.com\/.+/,
    facebook: /^(https?\:\/\/)?(www\.)?facebook\.com\/.+/,
  };
  
  return patterns[platform as keyof typeof patterns]?.test(url) || false;
};

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
