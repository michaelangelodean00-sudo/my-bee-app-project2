
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VideoSubmission } from "@/types/video";
import { validateUrl } from "@/utils/videoValidation";
import VideoFileUpload from "./VideoFileUpload";

interface VideoFormFieldsProps {
  control: Control<VideoSubmission>;
  watchedPlatform: string;
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
}

const VideoFormFields = ({ control, watchedPlatform, selectedFile, onFileChange }: VideoFormFieldsProps) => {
  const isFileUpload = watchedPlatform === "mp4";

  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
              <SelectContent className="max-h-48 overflow-y-auto">
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter / X</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="snapchat">Snapchat</SelectItem>
                <SelectItem value="twitch">Twitch</SelectItem>
                <SelectItem value="vimeo">Vimeo</SelectItem>
                <SelectItem value="pinterest">Pinterest</SelectItem>
                <SelectItem value="reddit">Reddit</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="mp4">Upload MP4 File</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {isFileUpload ? (
        <VideoFileUpload selectedFile={selectedFile} onFileChange={onFileChange} />
      ) : (
        <FormField
          control={control}
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
        control={control}
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
        control={control}
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
    </>
  );
};

export default VideoFormFields;
