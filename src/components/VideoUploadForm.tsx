
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
  videoUrl: string;
  title: string;
  description: string;
}

const VideoUploadForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VideoSubmission>({
    defaultValues: {
      platform: "",
      videoUrl: "",
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: VideoSubmission) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call to submit video for approval
      console.log("Submitting video for approval:", data);
      
      // In a real app, this would send to your backend/Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Video submitted for approval! You'll be notified once it's reviewed.");
      form.reset();
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="videoUrl"
              rules={{ 
                required: "Video URL is required",
                validate: (value) => {
                  const platform = form.watch("platform");
                  if (platform && !validateUrl(value, platform)) {
                    return `Please enter a valid ${platform} URL`;
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
                disabled={isSubmitting}
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
