import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "./GlassCard";
import { Copy, Check, Eye, BookOpen, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface OptimizedOutputProps {
  originalPrompt: string;
  optimizedPrompt: string;
  mode: string;
  onExplain: () => void;
  onDeepResearch: () => void;
  isExplaining: boolean;
  isDeepResearching: boolean;
}

export const OptimizedOutput = ({
  originalPrompt,
  optimizedPrompt,
  mode,
  onExplain,
  onDeepResearch,
  isExplaining,
  isDeepResearching
}: OptimizedOutputProps) => {
  const [copied, setCopied] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Optimized prompt has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Mode indicator */}
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="px-4 py-2 bg-gradient-primary rounded-full text-primary-foreground text-sm font-medium"
        >
          Optimized with: {mode.replace(/_/g, " ").toUpperCase()}
        </motion.div>
      </div>

      {/* Optimized prompt display */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Optimized Prompt
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
              className="border-border/50 bg-background/50"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showComparison ? "Hide" : "Compare"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className={cn(
                "border-border/50 bg-background/50 transition-all duration-fast",
                copied && "bg-success/10 border-success/50 text-success"
              )}
            >
              {copied ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {optimizedPrompt}
            </p>
          </div>
          
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-primary rounded-lg opacity-20 -z-10 blur-sm" />
        </div>
      </GlassCard>

      {/* Comparison view */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Before & After Comparison
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Original Prompt
                  </h4>
                  <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <p className="text-sm leading-relaxed">
                      {originalPrompt}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Optimized Prompt
                  </h4>
                  <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                    <p className="text-sm leading-relaxed">
                      {optimizedPrompt.substring(0, 200)}...
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onExplain}
            disabled={isExplaining}
            variant="outline"
            className="border-border/50 bg-background/50 hover:bg-accent/10"
          >
            {isExplaining ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <BookOpen className="w-4 h-4 mr-2" />
              </motion.div>
            ) : (
              <BookOpen className="w-4 h-4 mr-2" />
            )}
            {isExplaining ? "Analyzing..." : "Explain Changes"}
          </Button>
        </motion.div>

        {mode === "deep_research" && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onDeepResearch}
              disabled={isDeepResearching}
              variant="outline"
              className="border-border/50 bg-background/50 hover:bg-primary/10"
            >
              {isDeepResearching ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                </motion.div>
              ) : (
                <MessageSquare className="w-4 h-4 mr-2" />
              )}
              {isDeepResearching ? "Processing..." : "Deep Research Questions"}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};