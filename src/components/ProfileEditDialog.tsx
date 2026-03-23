import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Building2, User, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeText, validateImageFileSecure, rateLimit, LIMITS } from "@/utils/sanitization";
import { toast } from "sonner";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: {
    name: string;
    avatarUrl: string;
    avatarFallback: string;
    location: string;
    businessOwner: boolean;
  };
  onSave: (updatedUser: any) => void;
}

const ProfileEditDialog = ({ open, onOpenChange, currentUser, onSave }: ProfileEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: sanitizeText(currentUser.name, LIMITS.NAME_MAX),
    bio: "",
    location: sanitizeText(currentUser.location, LIMITS.LOCATION_MAX),
    avatarUrl: currentUser.avatarUrl,
    businessOwner: currentUser.businessOwner,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.name.length > LIMITS.NAME_MAX) newErrors.name = `Max ${LIMITS.NAME_MAX} characters`;
    if (formData.bio.length > LIMITS.BIO_MAX) newErrors.bio = `Max ${LIMITS.BIO_MAX} characters`;
    if (formData.location.length > LIMITS.LOCATION_MAX) newErrors.location = `Max ${LIMITS.LOCATION_MAX} characters`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!rateLimit("profile-save", 5, 60_000)) {
      toast.error("Too many save attempts. Please wait a moment.");
      return;
    }

    if (!validate()) return;
    onSave(formData);
    onOpenChange(false);
  };

  const handleChange = (field: keyof typeof formData, value: string, maxLen: number) => {
    const sanitized = sanitizeText(value, maxLen);
    setFormData(prev => ({ ...prev, [field]: sanitized }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = validateImageFileSecure(file);
    if (!result.isValid) {
      toast.error(result.error ?? "Invalid image file");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData(prev => ({ ...prev, avatarUrl: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Add a few details to help others connect with you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatarUrl} />
              <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                id="avatar-upload"
              />
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>
                    <Upload size={14} className="mr-1" />
                    Add Photo
                  </span>
                </Button>
              </Label>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value, LIMITS.NAME_MAX)}
              placeholder="Your name"
              maxLength={LIMITS.NAME_MAX}
              autoComplete="name"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={12} /> {errors.name}
              </p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {formData.name.length}/{LIMITS.NAME_MAX}
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value, LIMITS.BIO_MAX)}
              placeholder="Tell us a bit about yourself..."
              rows={2}
              maxLength={LIMITS.BIO_MAX}
              aria-invalid={!!errors.bio}
            />
            {errors.bio && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={12} /> {errors.bio}
              </p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {formData.bio.length}/{LIMITS.BIO_MAX}
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value, LIMITS.LOCATION_MAX)}
              placeholder="City, State"
              maxLength={LIMITS.LOCATION_MAX}
              autoComplete="off"
              aria-invalid={!!errors.location}
            />
            {errors.location && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={12} /> {errors.location}
              </p>
            )}
          </div>

          {/* Account Type */}
          <div className="space-y-3">
            <Label>Account Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, businessOwner: false }))}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  !formData.businessOwner
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground/50"
                )}
              >
                {!formData.businessOwner && (
                  <div className="absolute top-2 right-2 bg-primary rounded-full p-0.5">
                    <Check size={12} className="text-primary-foreground" />
                  </div>
                )}
                <div className={cn("p-3 rounded-full", !formData.businessOwner ? "bg-primary/10" : "bg-muted")}>
                  <User size={24} className={!formData.businessOwner ? "text-primary" : "text-muted-foreground"} />
                </div>
                <span className={cn("font-medium text-sm", !formData.businessOwner ? "text-primary" : "text-muted-foreground")}>
                  Personal Account
                </span>
                <span className="text-xs text-muted-foreground text-center">Share posts & connect</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, businessOwner: true }))}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  formData.businessOwner
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 ring-2 ring-amber-500/20"
                    : "border-border hover:border-muted-foreground/50"
                )}
              >
                {formData.businessOwner && (
                  <div className="absolute top-2 right-2 bg-amber-500 rounded-full p-0.5">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <div className={cn("p-3 rounded-full", formData.businessOwner ? "bg-amber-500/10" : "bg-muted")}>
                  <Building2 size={24} className={formData.businessOwner ? "text-amber-500" : "text-muted-foreground"} />
                </div>
                <span className={cn("font-medium text-sm", formData.businessOwner ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
                  Business Account
                </span>
                <span className="text-xs text-muted-foreground text-center">Promote & sell products</span>
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Skip for now
            </Button>
            <Button type="submit">Save Profile</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
