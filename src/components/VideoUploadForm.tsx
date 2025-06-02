import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Upload, Video } from "lucide-react";

interface VideoSubmission {
  platform: string;
  videoUrl?: string;
  videoFile?: File;
  title: string;
  description: string;
  category: string;
}

const VideoUploadForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<VideoSubmission>({
    defaultValues: {
      platform: "",
      videoUrl: "",
      title: "",
      description: "",
      category: "",
    },
  });

  const watchedPlatform = form.watch("platform");

  const onSubmit = async (data: VideoSubmission) => {
    setIsSubmitting(true);
    
    try {
      // Prepare submission data
      const submissionData = {
        ...data,
        videoFile: selectedFile,
        fileSize: selectedFile ? Math.round(selectedFile.size / 1024 / 1024 * 100) / 100 : null, // Size in MB
      };

      console.log("Submitting video for approval:", submissionData);
      
      // In a real app, this would send to your backend/Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Video submitted for approval! You'll be notified once it's reviewed.");
      form.reset();
      setSelectedFile(null);
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to submit video. Please try again.");
      console.error("Error submitting video:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateUrl = (url: string, platform: string) => {
    const patterns = {
      youtube: /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
      instagram: /^(https?\:\/\/)?(www\.)?instagram\.com\/.+/,
      tiktok: /^(https?\:\/\/)?(www\.)?tiktok\.com\/.+/,
      facebook: /^(https?\:\/\/)?(www\.)?facebook\.com\/.+/,
    };
    
    return patterns[platform as keyof typeof patterns]?.test(url) || false;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('video/')) {
        toast.error("Please select a valid video file");
        return;
      }
      
      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        toast.error("File size must be less than 50MB");
        return;
      }
      
      setSelectedFile(file);
      toast.success(`File "${file.name}" selected successfully`);
    }
  };

  const isFileUpload = watchedPlatform === "mp4";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold border-bee-blue hover:bg-bee-blue/10 py-6">
          <div className="rounded-full bg-gradient-to-br from-red-400 to-red-600 p-4 mb-2">
            <Video size={48} className="text-white" />
          </div>
          <span className="text-2xl font-extrabold text-[#DC2626] tracking-wide">Video Upload</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Video for Approval</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              rules={{ required: "Please select a category" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platform"
              rules={{ required: "Please select a platform" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="mp4">Upload MP4 File</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isFileUpload ? (
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
            ) : (
              <FormField
                control={form.control}
                name="videoUrl"
                rules={{ 
                  required: watchedPlatform ? "Video URL is required" : false,
                  validate: (value) => {
                    if (!watchedPlatform || isFileUpload) return true;
                    if (watchedPlatform && !validateUrl(value, watchedPlatform)) {
                      return `Please enter a valid ${watchedPlatform} URL`;
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Paste your video URL here..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter video title..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a description..." 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || (isFileUpload && !selectedFile)}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit for Approval"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadForm;
