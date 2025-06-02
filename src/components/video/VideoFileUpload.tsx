
import { Upload } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { toast } from "sonner";
import { validateVideoFile } from "@/utils/videoValidation";

interface VideoFileUploadProps {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
}

const VideoFileUpload = ({ selectedFile, onFileChange }: VideoFileUploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateVideoFile(file);
      
      if (!validation.isValid) {
        toast.error(validation.error!);
        return;
      }
      
      onFileChange(file);
      toast.success(`File "${file.name}" selected successfully`);
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>Upload Video File</FormLabel>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> your MP4 video
            </p>
            <p className="text-xs text-gray-500">MP4 files up to 50MB</p>
            {selectedFile && (
              <p className="text-xs text-green-600 mt-2">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="video/mp4,video/quicktime,video/x-msvideo"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default VideoFileUpload;
