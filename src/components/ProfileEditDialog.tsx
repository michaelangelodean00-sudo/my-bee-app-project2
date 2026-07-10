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
  Car, HeartPulse, BriefcaseBusiness, Phone,
  CheckCircle2, ImageIcon, MapPin, ChevronLeft, ChevronRight,
  Globe, Instagram, Facebook,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeText, validateImageFileSecure, rateLimit, LIMITS } from "@/utils/sanitization";
import { optimizeImage } from "@/utils/imageOptimization";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BUSINESS_CATEGORIES = [
  { id: "food-dining",           label: "Food & Dining",         icon: UtensilsCrossed },
  { id: "beauty-wellness",       label: "Beauty & Wellness",     icon: Sparkles },
  { id: "retail-shopping",       label: "Retail & Shopping",     icon: ShoppingBag },
  { id: "home-trade-services",   label: "Home & Trade Services", icon: Wrench },
  { id: "auto-transport",        label: "Auto & Transport",      icon: Car },
  { id: "health-medical",        label: "Health & Medical",      icon: HeartPulse },
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

const ProfileEditDialog = ({ open, onOpenChange, currentUser, onSave }: ProfileEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: sanitizeText(currentUser.name, LIMITS.NAME_MAX),
    bio: "",
    location: sanitizeText(currentUser.location, LIMITS.LOCATION_MAX),
    avatarUrl: currentUser.avatarUrl,
    businessOwner: currentUser.businessOwner,
    businessCategory: "" as BusinessCategoryId | "",
    businessPhone: "",
    businessWebsite: "",
    businessInstagram: "",
    businessFacebook: "",
    businessStreetAddress: "",
  });

  const [step, setStep] = useState(0); // 0..2 for business wizard
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasPhoto = !!formData.avatarUrl;

  const handleChange = (field: keyof typeof formData, value: string, maxLen: number) => {
    const sanitized = sanitizeText(value, maxLen);
    setFormData(prev => ({ ...prev, [field]: sanitized }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = validateImageFileSecure(file);
    if (!result.isValid) {
      toast.error(result.error ?? "That image didn't work. Try another one.");
      e.target.value = "";
      return;
    }
    try {
      setUploading(true);
      // Auto-resize to a friendly square logo — user doesn't need to think about size
      const optimized = await optimizeImage(file, {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.9,
        targetFormat: "webp",
      });
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({ ...prev, avatarUrl: ev.target?.result as string }));
        setUploading(false);
        toast.success("Logo ready");
      };
      reader.onerror = () => { setUploading(false); toast.error("Couldn't load that image."); };
      reader.readAsDataURL(optimized);
    } catch {
      setUploading(false);
      toast.error("Couldn't process that image. Try another.");
    }
  };

  // ── Validation per step (business) ──
  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!formData.name.trim()) e.name = "What's your business name?";
      if (!formData.businessCategory) e.businessCategory = "Pick the category that fits best.";
      if (formData.bio.trim().length < 20) e.bio = "Add a short description (at least 20 characters).";
    }
    if (s === 1) {
      if (!formData.businessPhone.trim()) e.businessPhone = "A phone number helps customers reach you.";
      if (!formData.businessStreetAddress.trim()) e.businessStreetAddress = "Add your address so people can find you.";
    }
    if (s === 2) {
      if (!hasPhoto) e.avatar = "Add a logo or photo so customers recognise your business.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePersonal = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Please enter your name.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitBusiness = async () => {
    if (!rateLimit("profile-save", 5, 60_000)) {
      toast.error("Too many save attempts. Please wait a moment.");
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({
          account_type: "business",
          business_name: formData.name,
          business_category: formData.businessCategory || null,
          phone: formData.businessPhone || null,
          address: formData.businessStreetAddress || null,
          avatar_url: formData.avatarUrl || null,
          display_name: formData.name,
        })
        .eq("id", user.id);
      if (profileErr) {
        toast.error("Couldn't submit right now. Please try again.");
        return;
      }
    }
    toast.success("Sent for review", {
      description: "We'll let you know once your business profile is approved.",
    });
    onSave({ ...formData, businessOwner: false, businessPending: true });
    onOpenChange(false);
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    if (step < 2) setStep(step + 1);
    else submitBusiness();
  };

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePersonal()) return;
    onSave(formData);
    onOpenChange(false);
  };

  const stepTitles = ["Business basics", "How customers reach you", "Add your logo"];
  const stepHints = [
    "Just the essentials — you can edit anything later.",
    "This appears on your public profile.",
    "A clear square logo works best. We'll size it for you.",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {formData.businessOwner ? stepTitles[step] : "Edit your profile"}
          </DialogTitle>
          <DialogDescription>
            {formData.businessOwner ? stepHints[step] : "A few quick details help others connect with you."}
          </DialogDescription>
        </DialogHeader>

        {/* Account type toggle — always visible at top */}
        {!currentUser.businessOwner && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setFormData(p => ({ ...p, businessOwner: false })); setStep(0); setErrors({}); }}
              className={cn(
                "relative flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
                !formData.businessOwner ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"
              )}
            >
              <User size={18} className={!formData.businessOwner ? "text-primary" : "text-muted-foreground"} />
              <span className={cn("text-sm font-medium", !formData.businessOwner ? "text-primary" : "text-muted-foreground")}>Personal</span>
              {!formData.businessOwner && <Check size={14} className="ml-auto text-primary" />}
            </button>
            <button
              type="button"
              onClick={() => { setFormData(p => ({ ...p, businessOwner: true })); setStep(0); setErrors({}); }}
              className={cn(
                "relative flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
                formData.businessOwner ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30" : "border-border hover:border-muted-foreground/40"
              )}
            >
              <Building2 size={18} className={formData.businessOwner ? "text-amber-500" : "text-muted-foreground"} />
              <span className={cn("text-sm font-medium", formData.businessOwner ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>Business</span>
              {formData.businessOwner && <Check size={14} className="ml-auto text-amber-500" />}
            </button>
          </div>
        )}

        {/* ============ BUSINESS WIZARD ============ */}
        {formData.businessOwner ? (
          <div className="space-y-5">
            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all",
                    i <= step ? "bg-amber-500" : "bg-muted"
                  )}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-2 tabular-nums">{step + 1} / 3</span>
            </div>

            {/* Step 0 — Basics */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="bname">Business name</Label>
                  <Input
                    id="bname"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value, LIMITS.NAME_MAX)}
                    placeholder="e.g. Sunrise Café"
                    maxLength={LIMITS.NAME_MAX}
                  />
                  {errors.name && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>What kind of business is this?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {BUSINESS_CATEGORIES.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, businessCategory: id }))}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left",
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
                  {errors.businessCategory && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} />{errors.businessCategory}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bio">Tell customers what you do</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value, LIMITS.BIO_MAX)}
                    placeholder="e.g. Fresh island coffee, breakfast, and free Wi-Fi in downtown Nassau."
                    rows={3}
                    maxLength={LIMITS.BIO_MAX}
                  />
                  <p className="text-xs text-muted-foreground">A sentence or two is plenty.</p>
                  {errors.bio && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} />{errors.bio}</p>}
                </div>
              </div>
            )}

            {/* Step 1 — Contact */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.businessPhone}
                      onChange={(e) => handleChange("businessPhone", e.target.value, 30)}
                      placeholder="(242) 555-1234"
                      className="pl-8"
                      inputMode="tel"
                    />
                  </div>
                  {errors.businessPhone && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} />{errors.businessPhone}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="addr">Street address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      id="addr"
                      value={formData.businessStreetAddress}
                      onChange={(e) => handleChange("businessStreetAddress", e.target.value, 120)}
                      placeholder="123 Bay Street, Nassau"
                      className="pl-8"
                    />
                  </div>
                  {errors.businessStreetAddress && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} />{errors.businessStreetAddress}</p>}
                </div>

                <details className="rounded-lg border border-border/60 bg-muted/30 p-3">
                  <summary className="cursor-pointer text-sm font-medium">Add website or social links (optional)</summary>
                  <div className="mt-3 space-y-2">
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input placeholder="Website" value={formData.businessWebsite}
                        onChange={(e) => handleChange("businessWebsite", e.target.value, 200)} className="pl-8 h-9 text-sm" />
                    </div>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input placeholder="Instagram" value={formData.businessInstagram}
                        onChange={(e) => handleChange("businessInstagram", e.target.value, 200)} className="pl-8 h-9 text-sm" />
                    </div>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input placeholder="Facebook" value={formData.businessFacebook}
                        onChange={(e) => handleChange("businessFacebook", e.target.value, 200)} className="pl-8 h-9 text-sm" />
                    </div>
                  </div>
                </details>
              </div>
            )}

            {/* Step 2 — Logo */}
            {step === 2 && (
              <div className="space-y-3">
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-6 bg-muted/20">
                  <Avatar className={cn("h-24 w-24 ring-2", errors.avatar ? "ring-destructive" : "ring-border")}>
                    <AvatarImage src={formData.avatarUrl} />
                    <AvatarFallback>
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  {hasPhoto && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Looks good</p>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm" asChild disabled={uploading}>
                      <span><Upload size={14} className="mr-1" />{uploading ? "Preparing…" : hasPhoto ? "Choose a different image" : "Choose an image"}</span>
                    </Button>
                  </Label>
                  <p className="text-[11px] text-muted-foreground text-center max-w-xs">
                    Tip: a square image works best (about 400×400). We'll automatically resize it for you.
                  </p>
                </div>
                {errors.avatar && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} />{errors.avatar}</p>}
              </div>
            )}

            {/* Nav footer */}
            <DialogFooter className="flex flex-row items-center justify-between gap-2 sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => step === 0 ? onOpenChange(false) : setStep(step - 1)}
              >
                {step === 0 ? "Cancel" : (<><ChevronLeft size={14} className="mr-1" />Back</>)}
              </Button>
              <Button type="button" onClick={handleNext} className="bg-amber-500 hover:bg-amber-600 text-white">
                {step < 2 ? (<>Next<ChevronRight size={14} className="ml-1" /></>) : "Submit for review"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* ============ PERSONAL — simple form ============ */
          <form onSubmit={handlePersonalSubmit} className="space-y-5" noValidate>
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-20 w-20 ring-2 ring-border">
                <AvatarImage src={formData.avatarUrl} />
                <AvatarFallback><ImageIcon className="h-8 w-8 text-muted-foreground" /></AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                id="avatar-upload-personal"
              />
              <Label htmlFor="avatar-upload-personal" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" asChild disabled={uploading}>
                  <span><Upload size={14} className="mr-1" />{uploading ? "Preparing…" : "Upload photo"}</span>
                </Button>
              </Label>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value, LIMITS.NAME_MAX)}
                placeholder="Your name"
                maxLength={LIMITS.NAME_MAX}
                autoComplete="name"
              />
              {errors.name && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio">A little about you (optional)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value, LIMITS.BIO_MAX)}
                placeholder="A short intro — anything you want to share."
                rows={3}
                maxLength={LIMITS.BIO_MAX}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Where are you? (optional)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value, LIMITS.LOCATION_MAX)}
                placeholder="City, Country"
                maxLength={LIMITS.LOCATION_MAX}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
