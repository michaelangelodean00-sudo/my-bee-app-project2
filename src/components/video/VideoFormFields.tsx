import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VideoSubmission } from "@/types/video";
import { validateUrl } from "@/utils/videoValidation";
import { sanitizeText, sanitizeUrl, LIMITS } from "@/utils/sanitization";
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
        <VideoFileUpload selectedFile={selectedFile} onFileChange={onFileChange} />
      ) : (
        <FormField
          control={control}
          name="videoUrl"
          rules={{
            required: watchedPlatform ? "Video URL is required" : false,
            validate: (value) => {
              if (!watchedPlatform || isFileUpload) return true;
              // URL must sanitize (protocol check) AND match platform pattern
              const safe = sanitizeUrl(value ?? "");
              if (!safe) return "URL must use https://";
              if (!validateUrl(safe, watchedPlatform)) {
                return `Please enter a valid ${watchedPlatform} URL`;
              }
              return true;
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Paste your video URL here..."
                  maxLength={LIMITS.URL_MAX}
                  autoComplete="off"
                  {...field}
                  onChange={(e) => {
                    // Strip dangerous characters while typing
                    const val = e.target.value.replace(/[<>"']/g, "");
                    field.onChange(val);
                  }}
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
        rules={{
          required: isFileUpload ? "Title is required for MP4 uploads" : false,
          maxLength: { value: LIMITS.TITLE_MAX, message: `Max ${LIMITS.TITLE_MAX} characters` },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Video Title {!isFileUpload && <span className="text-muted-foreground text-xs">(Optional)</span>}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={isFileUpload ? "Enter video title..." : "Custom title (optional)..."}
                maxLength={LIMITS.TITLE_MAX}
                {...field}
                onChange={(e) => field.onChange(sanitizeText(e.target.value, LIMITS.TITLE_MAX))}
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
            <FormLabel>
              Description <span className="text-muted-foreground text-xs">(Optional)</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={isFileUpload ? "Add a description..." : "Custom description (optional)..."}
                className="resize-none"
                maxLength={LIMITS.DESCRIPTION_MAX}
                {...field}
                onChange={(e) => field.onChange(sanitizeText(e.target.value, LIMITS.DESCRIPTION_MAX))}
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
