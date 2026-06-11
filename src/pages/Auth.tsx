import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { Facebook, Eye, EyeOff, CheckCircle } from "lucide-react";

const emailSchema = z.string().trim().email({ message: "Invalid email" }).max(255);
const passwordSchema = z.string().min(8, { message: "Min 8 characters" }).max(72);
const nameSchema = z.string().trim().min(1, { message: "Required" }).max(80);

// Official Google "G" mark
const GoogleIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.3C29.4 35 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.3 5.3C41.2 35.6 44 30.2 44 24c0-1.2-.1-2.3-.4-3.5z"/>
  </svg>
);

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  minLength?: number;
}
const PasswordInput = ({ id, value, onChange, autoComplete, minLength }: PasswordInputProps) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        required
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);
  const [showBusinessConfirm, setShowBusinessConfirm] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  // Sign in
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Sign up
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [suAccountType, setSuAccountType] = useState<"personal" | "business">("personal");
  const [suBusinessName, setSuBusinessName] = useState("");
  const [suBusinessCategory, setSuBusinessCategory] = useState("");
  const [suBusinessPhone, setSuBusinessPhone] = useState("");

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailParsed = emailSchema.safeParse(siEmail);
    const passParsed = passwordSchema.safeParse(siPassword);
    if (!emailParsed.success) return toast.error(emailParsed.error.issues[0].message);
    if (!passParsed.success) return toast.error(passParsed.error.issues[0].message);

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: emailParsed.data,
      password: passParsed.data,
    });
    setSubmitting(false);
    if (error) {
      const msg = error.message;
      if (msg.includes("Email not confirmed") || msg.includes("not confirmed")) {
        toast.error("Please verify your email first. Check your inbox for a confirmation link.");
      } else if (msg === "Invalid login credentials") {
        toast.error("Wrong email or password");
      } else {
        toast.error(msg);
      }
      return;
    }
    toast.success("Welcome back!");
    navigate("/", { replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameParsed = nameSchema.safeParse(suName);
    const emailParsed = emailSchema.safeParse(suEmail);
    const passParsed = passwordSchema.safeParse(suPassword);
    if (!nameParsed.success) return toast.error("Display name required");
    if (!emailParsed.success) return toast.error(emailParsed.error.issues[0].message);
    if (!passParsed.success) return toast.error(passParsed.error.issues[0].message);
    if (suPassword !== suConfirm) return toast.error("Passwords do not match");
    if (suAccountType === "business") {
      if (!suBusinessName.trim()) return toast.error("Business name required");
      if (!suBusinessCategory.trim()) return toast.error("Business category required");
      if (!suBusinessPhone.trim()) return toast.error("Contact phone required");
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: emailParsed.data,
      password: passParsed.data,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          display_name: nameParsed.data,
          account_type: suAccountType,
          business_name: suAccountType === "business" ? suBusinessName.trim() : null,
          business_category: suAccountType === "business" ? suBusinessCategory.trim() : null,
          business_phone: suAccountType === "business" ? suBusinessPhone.trim() : null,
        },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message.includes("registered") ? "Email already registered" : error.message);
      return;
    }
    if (suAccountType === "business") {
      setShowBusinessConfirm(true);
    } else {
      toast.success("Account created! Check your email to confirm.");
      setTab("signin");
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "apple" | "microsoft" | "lovable") => {
    setSubmitting(true);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error.message || `${provider} sign-in failed`);
      return;
    }
    if (result.redirected) return;
    toast.success("Signed in!");
    navigate("/", { replace: true });
  };

  const GoogleButton = () => (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-2 bg-white text-[#3c4043] border-[#dadce0] hover:bg-white hover:text-[#3c4043] hover:border-[#dadce0] hover:shadow-sm font-medium"
      onClick={() => handleOAuthSignIn("google")}
      disabled={submitting}
    >
      <GoogleIcon />
      Continue with Google
    </Button>
  );

  const FacebookButton = () => (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-2 opacity-70 cursor-not-allowed justify-between"
      disabled
      aria-label="Facebook sign-in coming soon"
    >
      <span className="flex items-center gap-2">
        <Facebook className="h-4 w-4 text-[#1877F2]" />
        Facebook
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
        Coming Soon
      </span>
    </Button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Link to="/" aria-label="Home"><Logo /></Link>
          <h1 className="text-2xl font-heading font-bold text-center">
            Welcome to B.E.E
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Bahamas Business, Events & E-commerce
          </p>
        </div>

        <Card className="p-6">
          {showBusinessConfirm ? (
            <div className="flex flex-col items-center text-center space-y-5 py-4">
              <div className="rounded-full bg-amber-100 p-4">
                <CheckCircle className="h-10 w-10 text-amber-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-heading font-semibold">Account Created</h2>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Your business profile is pending review. We'll notify you once it's approved.
                </p>
              </div>
              <div className="w-full space-y-3">
                <p className="text-xs text-muted-foreground">
                  Check your email to confirm your account before signing in.
                </p>
                <Button
                  className="w-full"
                  onClick={() => {
                    setShowBusinessConfirm(false);
                    setTab("signin");
                  }}
                >
                  Got it — Sign In
                </Button>
              </div>
            </div>
          ) : (
            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="si-email">Email</Label>
                    <Input id="si-email" type="email" autoComplete="email" required
                      value={siEmail} onChange={(e) => setSiEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="si-password">Password</Label>
                    <PasswordInput id="si-password" autoComplete="current-password"
                      value={siPassword} onChange={setSiPassword} />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <GoogleButton />
                  <FacebookButton />
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="su-name">Display name</Label>
                    <Input id="su-name" required maxLength={80}
                      value={suName} onChange={(e) => setSuName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-email">Email</Label>
                    <Input id="su-email" type="email" autoComplete="email" required
                      value={suEmail} onChange={(e) => setSuEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-password">Password</Label>
                    <PasswordInput id="su-password" autoComplete="new-password" minLength={8}
                      value={suPassword} onChange={setSuPassword} />
                    <p className="text-xs text-muted-foreground">At least 8 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-confirm">Confirm password</Label>
                    <PasswordInput id="su-confirm" autoComplete="new-password" minLength={8}
                      value={suConfirm} onChange={setSuConfirm} />
                    {suConfirm && suPassword !== suConfirm && (
                      <p className="text-xs text-destructive">Passwords do not match</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Account type</Label>
                    <RadioGroup
                      value={suAccountType}
                      onValueChange={(v) => setSuAccountType(v as "personal" | "business")}
                      className="grid grid-cols-2 gap-2"
                    >
                      <Label htmlFor="at-personal"
                        className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-accent">
                        <RadioGroupItem value="personal" id="at-personal" />
                        <span>Personal</span>
                      </Label>
                      <Label htmlFor="at-business"
                        className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-accent">
                        <RadioGroupItem value="business" id="at-business" />
                        <span>Business</span>
                      </Label>
                    </RadioGroup>
                  </div>

                  {suAccountType === "business" && (
                    <div className="space-y-3 rounded-md border border-amber-200 bg-amber-50/50 p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
                        Business profile
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="su-bizname">Business name</Label>
                        <Input id="su-bizname" required maxLength={120}
                          value={suBusinessName} onChange={(e) => setSuBusinessName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="su-bizcat">Category</Label>
                        <Input id="su-bizcat" required maxLength={60} placeholder="e.g. Restaurant, Retail, Services"
                          value={suBusinessCategory} onChange={(e) => setSuBusinessCategory(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="su-bizphone">Contact phone</Label>
                        <Input id="su-bizphone" type="tel" required maxLength={30}
                          value={suBusinessPhone} onChange={(e) => setSuBusinessPhone(e.target.value)} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Business profiles require admin approval before being listed publicly.
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Account"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <GoogleButton />
                  <FacebookButton />
                </form>
              </TabsContent>
            </Tabs>
          )}
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          By continuing you agree to our <Link to="/terms" className="underline">Terms</Link>{" "}
          and <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
