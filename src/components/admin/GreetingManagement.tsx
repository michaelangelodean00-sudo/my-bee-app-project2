import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGreetingBanner, GreetingBanner } from "@/hooks/useGreetingBanner";
import { toast } from "sonner";
import { MessageSquare, Trash2, Save, Eye, EyeOff } from "lucide-react";

const EMOJI_PRESETS = ["🎄", "🎅", "🐣", "🎉", "🇧🇸", "🌴", "☀️", "🎊", "❤️", "🙏"];

const GreetingManagement = () => {
  const { greeting, saveGreeting, deleteGreeting, refreshGreeting } = useGreetingBanner();
  
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    if (greeting) {
      setMessage(greeting.message);
      setEmoji(greeting.emoji || "🎉");
      setIsActive(greeting.isActive);
      setExpiresAt(greeting.expiresAt ? greeting.expiresAt.split("T")[0] : "");
    }
  }, [greeting]);

  const handleSave = () => {
    if (!message.trim()) {
      toast.error("Please enter a greeting message");
      return;
    }

    saveGreeting({
      message: message.trim(),
      emoji,
      isActive,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    });

    toast.success("Greeting banner saved!", {
      description: isActive ? "Users will now see your greeting." : "Greeting is saved but not active.",
    });
  };

  const handleDelete = () => {
    deleteGreeting();
    setMessage("");
    setEmoji("🎉");
    setIsActive(true);
    setExpiresAt("");
    toast.success("Greeting banner removed");
  };

  const handlePreview = () => {
    if (!message.trim()) {
      toast.error("Enter a message to preview");
      return;
    }
    
    // Temporarily save and show
    saveGreeting({
      message: message.trim(),
      emoji,
      isActive: true,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    });
    
    toast.success("Preview active! Check the home page.", {
      action: {
        label: "Go to Home",
        onClick: () => window.location.href = "/",
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Greeting Banner
          </CardTitle>
          <CardDescription>
            Create announcements that appear at the top of the feed for all users.
            <br />
            <span className="text-xs text-amber-600 dark:text-amber-400">
              Note: Without a database, greetings are stored locally and won't sync across devices.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message">Greeting Message</Label>
            <Input
              id="message"
              placeholder="e.g., Merry Christmas from the B.E.E family!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={150}
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/150 characters
            </p>
          </div>

          {/* Emoji Selector */}
          <div className="space-y-2">
            <Label>Emoji</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_PRESETS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    emoji === e
                      ? "bg-primary/20 ring-2 ring-primary scale-110"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <Label htmlFor="expires">Expiration Date (Optional)</Label>
            <Input
              id="expires"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for no expiration
            </p>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base">Active</Label>
              <p className="text-sm text-muted-foreground">
                {isActive ? "Banner is visible to users" : "Banner is hidden"}
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          {/* Preview Box */}
          {message && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/90 via-primary to-primary/90 text-primary-foreground">
              <p className="text-center font-medium">
                {emoji} {message} {emoji}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} className="flex-1 min-w-[120px]">
              <Save className="h-4 w-4 mr-2" />
              Save Greeting
            </Button>
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={!message.trim()}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            {greeting && (
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          {greeting ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {greeting.isActive ? (
                  <Eye className="h-4 w-4 text-green-500" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={greeting.isActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                  {greeting.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm">
                <span className="text-muted-foreground">Message:</span> {greeting.emoji} {greeting.message}
              </p>
              {greeting.expiresAt && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Expires:</span>{" "}
                  {new Date(greeting.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No greeting banner configured</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GreetingManagement;
