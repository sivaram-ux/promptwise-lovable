import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "./GlassCard";
import { Key, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { setApiKeys } from "@/lib/prompt-optimizer";

interface ApiKeySetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySet: () => void;
}

export const ApiKeySetup = ({ open, onOpenChange, onApiKeySet }: ApiKeySetupProps) => {
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [showKeys, setShowKeys] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!googleApiKey.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Set the API keys in the optimizer
      setApiKeys(googleApiKey, supabaseUrl || undefined, supabaseKey || undefined);
      
      // Close the dialog and notify parent
      onApiKeySet();
      onOpenChange(false);
      
      // Clear form
      setGoogleApiKey("");
      setSupabaseUrl("");
      setSupabaseKey("");
    } catch (error) {
      console.error("Error setting API keys:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-neural bg-clip-text text-transparent flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            API Configuration Required
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              To use the Neural Prompt Optimizer, you need to provide your Google AI API key. 
              Supabase credentials are optional and only needed for saving optimization history.
            </AlertDescription>
          </Alert>

          {/* Google API Key */}
          <GlassCard className="border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Key className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Google AI API Key</h4>
                  <p className="text-sm text-muted-foreground">
                    Required for prompt optimization
                  </p>
                </div>
                <Badge variant="destructive" className="ml-auto">
                  Required
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="google-api-key" className="text-sm font-medium">
                  API Key
                </Label>
                <div className="relative">
                  <Input
                    id="google-api-key"
                    type={showKeys ? "text" : "password"}
                    value={googleApiKey}
                    onChange={(e) => setGoogleApiKey(e.target.value)}
                    placeholder="AIza..."
                    className="pr-10 bg-background/50 border-border/50 focus:border-primary/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowKeys(!showKeys)}
                  >
                    {showKeys ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Supabase (Optional) */}
          <GlassCard className="border-accent/20">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Supabase Configuration</h4>
                  <p className="text-sm text-muted-foreground">
                    Optional - for saving optimization history
                  </p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  Optional
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url" className="text-sm font-medium">
                    Supabase URL
                  </Label>
                  <Input
                    id="supabase-url"
                    type={showKeys ? "text" : "password"}
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="bg-background/50 border-border/50 focus:border-accent/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supabase-key" className="text-sm font-medium">
                    Supabase Anon Key
                  </Label>
                  <Input
                    id="supabase-key"
                    type={showKeys ? "text" : "password"}
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="bg-background/50 border-border/50 focus:border-accent/50"
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Security Notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Security Notice:</strong> Your API keys are stored locally in your browser session 
              and are not sent to any external servers except for direct API calls to Google AI and Supabase.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!googleApiKey.trim() || isSubmitting}
              className="bg-gradient-primary hover:bg-gradient-primary text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Key className="w-4 h-4 mr-2" />
                  </motion.div>
                  Setting up...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};