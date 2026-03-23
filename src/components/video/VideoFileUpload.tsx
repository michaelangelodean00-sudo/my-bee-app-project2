
import { Upload } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { toast } from "sonner";
import { validateVideoFile, validateVideoDuration } from "@/utils/videoValidation";
import { validateVideoFileSecure } from "@/utils/sanitization";

interface VideoFileUploadProps {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
}

const VideoFileUpload = ({ selectedFile, onFileChange }: VideoFileUploadProps) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Layer 1: strict MIME + extension + size allowlist
    const secureCheck = validateVideoFileSecure(file);
    if (!secureCheck.isValid) {
      toast.error(secureCheck.error ?? "Invalid file");
      event.target.value = "";
      return;
    }

    // Layer 2: legacy MIME + size validation
    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      toast.error(validation.error!);
      event.target.value = "";
      return;
    }

    // Layer 3: duration check (90 seconds max)
    const durationValidation = await validateVideoDuration(file);
    if (!durationValidation.isValid) {
      toast.error(durationValidation.error!);
      event.target.value = "";
      return;
    }

    onFileChange(file);
    toast.success(`File "${file.name}" selected successfully`);
  };

  return (
    <div className="space-y-2">
      <FormLabel>Upload Video File</FormLabel>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> your video
            </p>
            <p className="text-xs text-muted-foreground">MP4, MOV, AVI, MKV, WebM (up to 50MB)</p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">Max duration: 1 min 30 sec</p>
            {selectedFile && (
              <p className="text-xs text-green-600 mt-2">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default VideoFileUpload;
