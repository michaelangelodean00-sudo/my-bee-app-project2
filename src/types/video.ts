
export interface VideoSubmission {
  platform: string;
  videoUrl?: string;
  videoFile?: File;
  title: string;
  description: string;
  category: string;
}

export interface PendingVideo {
  id: string;
  platform: string;
  videoUrl?: string;
  videoFile?: File;
  title: string;
  description: string;
  category: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  fileSize?: number; // in MB
}
