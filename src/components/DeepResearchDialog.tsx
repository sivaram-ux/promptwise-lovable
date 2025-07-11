import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "./GlassCard";
import { MessageSquare, ArrowRight, Sparkles, HelpCircle } from "lucide-react";

interface DeepResearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (questionsAsked: string, preferences?: string) => void;
  isLoading: boolean;
}

export const DeepResearchDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isLoading 
}: DeepResearchDialogProps) => {
  const [questionsAsked, setQuestionsAsked] = useState("");
  const [hasPreferences, setHasPreferences] = useState(false);
  const [preferences, setPreferences] = useState("");

  const handleSubmit = () => {
    if (questionsAsked.trim()) {
      onSubmit(questionsAsked, hasPreferences ? preferences : undefined);
    }
  };

  const handleReset = () => {
    setQuestionsAsked("");
    setPreferences("");
    setHasPreferences(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-xl border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-neural bg-clip-text text-transparent flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Deep Research Questions
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Instructions */}
          <GlassCard className="border-primary/20">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">
                  How Deep Research Mode Works
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Since you used deep research mode, the AI may have asked specific questions 
                  to create a more comprehensive research report. Please provide those questions 
                  and any preferences you have for the answers.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Questions Input */}
          <div className="space-y-3">
            <Label htmlFor="questions" className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Questions Asked by the Model
            </Label>
            <Textarea
              id="questions"
              value={questionsAsked}
              onChange={(e) => setQuestionsAsked(e.target.value)}
              placeholder="Enter the questions that the AI asked for your research report..."
              className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Preferences Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Do you have specific preferences for the answers?
              </Label>
              <div className="flex gap-2">
                <Badge
                  variant={hasPreferences ? "secondary" : "default"}
                  className="cursor-pointer"
                  onClick={() => setHasPreferences(false)}
                >
                  No
                </Badge>
                <Badge
                  variant={hasPreferences ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setHasPreferences(true)}
                >
                  Yes
                </Badge>
              </div>
            </div>

            {hasPreferences && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <Textarea
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="Describe your preferences, specific requirements, or how you'd like the questions to be answered..."
                  className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary/50"
                />
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-border/50"
            >
              Reset
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!questionsAsked.trim() || isLoading}
              className="bg-gradient-primary hover:bg-gradient-primary text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                  </motion.div>
                  Processing...
                </>
              ) : (
                <>
                  Generate Answers
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};