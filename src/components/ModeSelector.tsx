import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { modes } from "@/lib/prompt-optimizer";

interface ModeSelectorProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
}

const quickModes = ["clarity", "controversial", "deep_research"];

const allModes = [
  "depth", "concise", "structured", "creative", "satirical", "technical",
  "executive_summary", "startup_pitch", "marketing_landing_page", "teaching",
  "step_by_step", "socratic", "socratic_reverse", "journalistic", "debate_ready",
  "devil_advocate", "real_world_applications", "personal_growth"
];

export const ModeSelector = ({ selectedMode, onModeChange }: ModeSelectorProps) => {
  const [customMode, setCustomMode] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleCustomModeSubmit = () => {
    if (customMode.trim()) {
      onModeChange(customMode.trim());
      setIsCustomMode(true);
    }
  };

  const handleQuickModeSelect = (mode: string) => {
    onModeChange(mode);
    setIsCustomMode(false);
    setCustomMode("");
  };

  const handleAdvancedModeSelect = (mode: string) => {
    onModeChange(mode);
    setIsCustomMode(false);
    setCustomMode("");
    setShowAdvanced(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-6"
    >
      {/* Custom Optimization Mode Input */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300"
          whileHover={{ scale: 1.005 }}
        >
          <div className="p-6">
            <label htmlFor="custom-mode" className="block text-sm font-medium text-foreground mb-3">
              Customize your own optimization style
            </label>
            <Input
              id="custom-mode"
              value={customMode}
              onChange={(e) => {
                setCustomMode(e.target.value);
                onModeChange(e.target.value);
              }}
              placeholder="Make it sound poetic"
              className="border-0 bg-background/60 backdrop-blur-sm rounded-xl text-base p-4 placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <p className="text-xs text-muted-foreground/70 mt-2">
              This is where pros define how they want their prompts transformed
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Mode Pills */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground/80">Quick Modes</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {quickModes.map((mode, index) => (
            <motion.button
              key={mode}
              onClick={() => {
                setCustomMode(mode);
                onModeChange(mode);
              }}
              className={cn(
                "px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border backdrop-blur-sm",
                selectedMode === mode 
                  ? "bg-primary/10 border-primary/30 text-primary shadow-sm" 
                  : "border-border/40 bg-card/60 text-foreground/70 hover:bg-card/80 hover:border-border/60"
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: 0.4 + index * 0.1,
                type: "spring",
                damping: 20
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mode.toUpperCase()}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Advanced Modes Expandable Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={{ rotate: showAdvanced ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
          More Styles
          <Sparkles className="w-3 h-3 opacity-50 group-hover:opacity-70 transition-opacity" />
        </motion.button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="mt-4 overflow-hidden"
            >
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 rounded-xl bg-muted/30 border border-border/30"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {allModes.map((mode, index) => (
                  <motion.button
                    key={mode}
                    onClick={() => {
                      setCustomMode(mode);
                      onModeChange(mode);
                    }}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150",
                      selectedMode === mode 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-muted-foreground hover:text-foreground bg-background/60 hover:bg-background/80"
                    )}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {mode}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};