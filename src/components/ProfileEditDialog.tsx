import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload, Building2, User, Check, AlertCircle,
  UtensilsCrossed, Sparkles, ShoppingBag, Wrench,
  Car, CalendarDays, BriefcaseBusiness, Phone, Globe,
  Instagram, CheckCircle2, ImageIcon, MapPin, Navigation,
  Facebook, Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeText, validateImageFileSecure, rateLimit, LIMITS } from "@/utils/sanitization";
import { submitBusinessApproval } from "@/utils/businessApprovals";
import { toast } from "sonner";

const BUSINESS_CATEGORIES = [
  { id: "food-dining",           label: "Food & Dining",         icon: UtensilsCrossed },
  { id: "beauty-wellness",       label: "Beauty & Wellness",     icon: Sparkles },
  { id: "retail-shopping",       label: "Retail & Shopping",     icon: ShoppingBag },
  { id: "home-trade-services",   label: "Home & Trade Services", icon: Wrench },
  { id: "auto-transport",        label: "Auto & Transport",      icon: Car },
  { id: "events",                label: "Events",                icon: CalendarDays },
  { id: "professional-services", label: "Professional Services", icon: BriefcaseBusiness },
] as const;

type BusinessCategoryId = typeof BUSINESS_CATEGORIES[number]["id"];

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

// Count sentences naively (split by . ! ?)
const countSentences = (text: string) =>
  (text.match(/[^.!?]*[.!?]+/g) ?? []).filter(s => s.trim().length > 3).length;

const ProfileEditDialog = ({ open, onOpenChange, currentUser, onSave }: ProfileEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: sanitizeText(currentUser.name, LIMITS.NAME_MAX),
    bio: "",
    location: sanitizeText(currentUser.location, LIMITS.LOCATION_MAX),
    avatarUrl: currentUser.avatarUrl,
    businessOwner: currentUser.businessOwner,
    // Business-specific
    businessCategory: "" as BusinessCategoryId | "",
    businessPhone: "",
    businessWebsite: "",
    businessInstagram: "",
    businessFacebook: "",
    businessTwitter: "",
    businessTiktok: "",
    businessStreetAddress: "",
    businessGoogleMapUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasPhoto = !!formData.avatarUrl;
  const sentenceCount = countSentences(formData.bio);
  const hasContact = !!(formData.businessPhone || formData.businessWebsite || formData.businessSocial);

  // Business requirement checklist
  const bizRequirements = [
    { key: "photo",   label: "Photo or logo uploaded",       met: hasPhoto },
    { key: "desc",    label: "Two-sentence description",     met: sentenceCount >= 2 },
    { key: "contact", label: "Phone, website or social link",met: hasContact },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.name.length > LIMITS.NAME_MAX) newErrors.name = `Max ${LIMITS.NAME_MAX} characters`;
    if (formData.bio.length > LIMITS.BIO_MAX) newErrors.bio = `Max ${LIMITS.BIO_MAX} characters`;
    if (formData.location.length > LIMITS.LOCATION_MAX) newErrors.location = `Max ${LIMITS.LOCATION_MAX} characters`;

    if (formData.businessOwner) {
      if (!hasPhoto) newErrors.avatar = "A photo or logo is required for business accounts";
      if (sentenceCount < 2) newErrors.bio = "Please write at least two sentences describing your business";
      if (!hasContact) newErrors.contact = "Please provide a phone number, website, or social media link";
      if (!formData.businessCategory) newErrors.businessCategory = "Please select a business category";
    }

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

    // Business submissions go through admin approval.
    // The user's account is NOT flipped to business until an admin approves.
    if (formData.businessOwner && !currentUser.businessOwner) {
      submitBusinessApproval({
        ownerKey: currentUser.name || "current-user",
        name: formData.name,
        avatarUrl: formData.avatarUrl,
        bio: formData.bio,
        location: formData.location,
        businessCategory: formData.businessCategory || "",
        businessPhone: formData.businessPhone,
        businessWebsite: formData.businessWebsite,
        businessSocial: formData.businessSocial,
      });
      toast.success("Submitted for review", {
        description: "Your business profile is pending admin approval.",
      });
      onSave({ ...formData, businessOwner: false, businessPending: true });
      onOpenChange(false);
      return;
    }

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
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Add a few details to help others connect with you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <Avatar className={cn("h-20 w-20 ring-2", errors.avatar ? "ring-destructive" : "ring-border")}>
                <AvatarImage src={formData.avatarUrl} />
                <AvatarFallback>
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              {hasPhoto && (
                <CheckCircle2 className="absolute -bottom-1 -right-1 h-5 w-5 text-emerald-500 bg-background rounded-full" />
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
              id="avatar-upload"
            />
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Button type="button" variant="outline" size="sm" asChild>
                <span><Upload size={14} className="mr-1" />Upload Photo / Logo</span>
              </Button>
            </Label>
            {errors.avatar && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={12} /> {errors.avatar}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value, LIMITS.NAME_MAX)}
              placeholder="Your name"
              maxLength={LIMITS.NAME_MAX}
              autoComplete="name"
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.name}</p>}
          </div>

          {/* Bio / Description */}
          <div className="space-y-1.5">
            <Label htmlFor="bio">
              {formData.businessOwner ? (
                <>Description <span className="text-destructive">*</span> <span className="text-xs text-muted-foreground font-normal">(2 sentences required)</span></>
              ) : "Bio"}
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value, LIMITS.BIO_MAX)}
              placeholder={
                formData.businessOwner
                  ? "Tell customers what your business offers. Keep it clear and inviting."
                  : "Tell us a bit about yourself..."
              }
              rows={3}
              maxLength={LIMITS.BIO_MAX}
              aria-invalid={!!errors.bio}
            />
            {formData.businessOwner && (
              <p className={cn("text-xs", sentenceCount >= 2 ? "text-emerald-600" : "text-muted-foreground")}>
                {sentenceCount >= 2 ? "✓ " : ""}{sentenceCount}/2 sentences
              </p>
            )}
            {errors.bio && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.bio}</p>}
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value, LIMITS.LOCATION_MAX)}
              placeholder="City, Country"
              maxLength={LIMITS.LOCATION_MAX}
              autoComplete="off"
            />
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, businessOwner: false }))}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  !formData.businessOwner ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/50"
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
                <span className={cn("font-medium text-sm", !formData.businessOwner ? "text-primary" : "text-muted-foreground")}>Personal</span>
                <span className="text-xs text-muted-foreground text-center">Share posts & connect</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, businessOwner: true }))}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  formData.businessOwner ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 ring-2 ring-amber-500/20" : "border-border hover:border-muted-foreground/50"
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
                <span className={cn("font-medium text-sm", formData.businessOwner ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>Business</span>
                <span className="text-xs text-muted-foreground text-center">Promote & sell</span>
              </button>
            </div>
          </div>

          {/* ── Business-only fields ── */}
          {formData.businessOwner && (
            <div className="space-y-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                Business Requirements
              </p>

              {/* Requirement checklist */}
              <div className="space-y-1.5">
                {bizRequirements.map(r => (
                  <div key={r.key} className="flex items-center gap-2 text-xs">
                    <CheckCircle2
                      className={cn("h-4 w-4 flex-shrink-0", r.met ? "text-emerald-500" : "text-muted-foreground/40")}
                    />
                    <span className={r.met ? "text-foreground" : "text-muted-foreground"}>{r.label}</span>
                  </div>
                ))}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label>Business Category <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 gap-2">
                  {BUSINESS_CATEGORIES.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, businessCategory: id }))}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                        formData.businessCategory === id
                          ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : "border-border bg-background text-muted-foreground hover:border-amber-300"
                      )}
                    >
                      <Icon size={14} className="flex-shrink-0" />
                      <span className="line-clamp-1">{label}</span>
                    </button>
                  ))}
                </div>
                {errors.businessCategory && (
                  <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.businessCategory}</p>
                )}
              </div>

              {/* Contact fields */}
              <div className="space-y-2">
                <Label>Contact <span className="text-destructive">*</span> <span className="text-xs text-muted-foreground font-normal">(at least one)</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Phone number"
                    value={formData.businessPhone}
                    onChange={(e) => handleChange("businessPhone", e.target.value, 30)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Website (https://...)"
                    value={formData.businessWebsite}
                    onChange={(e) => handleChange("businessWebsite", e.target.value, 200)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Social media link"
                    value={formData.businessSocial}
                    onChange={(e) => handleChange("businessSocial", e.target.value, 200)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
                {errors.contact && (
                  <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.contact}</p>
                )}
              </div>
            </div>
          )}

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
