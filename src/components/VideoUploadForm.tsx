
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Video, Info } from "lucide-react";
import { VideoSubmission } from "@/types/video";
import VideoFormFields from "./video/VideoFormFields";

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
        submittedAt: new Date().toISOString(),
        status: 'pending' // All videos start as pending
      };

      console.log("Submitting video for approval:", submissionData);
      
      // In a real app, this would send to your backend/Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Video submitted successfully! It will appear in the app once approved by our admin team.");
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

  const isFileUpload = watchedPlatform === "mp4";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold border-bee-blue hover:bg-bee-blue/10 py-6">
          <div className="rounded-full bg-gradient-to-br from-red-400 to-red-600 p-4 mb-2">
            <Video size={48} className="text-white" />
          </div>
          <span className="text-2xl sm:text-2xl lg:text-2xl font-extrabold text-[#DC2626] tracking-wide">Video Upload</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Video for Approval</DialogTitle>
        </DialogHeader>
        
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            All videos are reviewed by our admin team before appearing in the BEE APP. You'll be notified once your video is approved.
          </AlertDescription>
        </Alert>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <VideoFormFields 
              control={form.control}
              watchedPlatform={watchedPlatform}
              selectedFile={selectedFile}
              onFileChange={setSelectedFile}
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
