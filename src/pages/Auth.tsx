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
import { Chrome, Facebook } from "lucide-react";

const emailSchema = z.string().trim().email({ message: "Invalid email" }).max(255);
const passwordSchema = z.string().min(8, { message: "Min 8 characters" }).max(72);
const nameSchema = z.string().trim().min(1, { message: "Required" }).max(80);

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);

  // Sign in
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Sign up
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suAccountType, setSuAccountType] = useState<"personal" | "business">("personal");
  const [suBusinessName, setSuBusinessName] = useState("");

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
      toast.error(error.message === "Invalid login credentials" ? "Wrong email or password" : error.message);
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
    if (suAccountType === "business" && !suBusinessName.trim()) {
      return toast.error("Business name required");
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
        },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message.includes("registered") ? "Email already registered" : error.message);
      return;
    }
    toast.success("Account created! Check your email to confirm.");
    setTab("signin");
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
    if (result.redirected) {
      // Browser will redirect to provider — just return
      return;
    }
    toast.success("Signed in!");
    navigate("/", { replace: true });
  };

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
                  <Input id="si-password" type="password" autoComplete="current-password" required
                    value={siPassword} onChange={(e) => setSiPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Signing in..." : "Sign In"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={submitting}
                >
                  <Chrome className="h-4 w-4" />
                  Google
                </Button>

                <div className="relative group">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2 opacity-60 cursor-not-allowed"
                    disabled
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded border border-amber-200 shadow-sm">
                      Coming Soon
                    </span>
                  </div>
                </div>
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
                  <Input id="su-password" type="password" autoComplete="new-password" required minLength={8}
                    value={suPassword} onChange={(e) => setSuPassword(e.target.value)} />
                  <p className="text-xs text-muted-foreground">At least 8 characters</p>
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
                  <div className="space-y-2">
                    <Label htmlFor="su-bizname">Business name</Label>
                    <Input id="su-bizname" required maxLength={120}
                      value={suBusinessName} onChange={(e) => setSuBusinessName(e.target.value)} />
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
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={submitting}
                >
                  <Chrome className="h-4 w-4" />
                  Google
                </Button>

                <div className="relative group">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2 opacity-60 cursor-not-allowed"
                    disabled
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded border border-amber-200 shadow-sm">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          By continuing you agree to our <Link to="/terms" className="underline">Terms</Link>{" "}
          and <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
