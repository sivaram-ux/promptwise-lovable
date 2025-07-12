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
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h3 
          className="text-xl font-bold bg-gradient-neural bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Customize Your Optimization
        </motion.h3>
        <motion.p 
          className="text-muted-foreground max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Define how you want your prompt transformed by our AI engine
        </motion.p>
      </motion.div>

      {/* Custom Mode Input - Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          type: "spring", 
          damping: 20, 
          stiffness: 100,
          delay: 0.3 
        }}
        className="relative group"
      >
        <motion.div 
          className="absolute -inset-1 bg-gradient-primary rounded-xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <div className="relative backdrop-blur-glass bg-card/40 dark:bg-card/20 rounded-xl p-6 border border-border/20 dark:border-white/10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              <Label htmlFor="custom-mode" className="text-base font-medium text-foreground">
                Custom Optimization Style
              </Label>
            </div>
            
            <motion.div
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <Input
                id="custom-mode"
                value={customMode}
                onChange={(e) => setCustomMode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomModeSubmit()}
                placeholder="e.g., 'Make it sound like a Shakespearean scholar' or 'Convert to startup pitch format'"
                className="w-full h-12 text-base bg-background/50 dark:bg-background/20 border-border/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={handleCustomModeSubmit}
                disabled={!customMode.trim()}
                variant="neural"
                className="w-full h-11 font-medium"
              >
                Apply Custom Style
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick Modes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="space-y-4"
      >
        <div className="text-center">
          <p className="text-sm text-muted-foreground/80">
            or choose a quick optimization style
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quickModes.map((mode, index) => (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                transition: { type: "spring", damping: 25 }
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                variant={selectedMode === mode && !isCustomMode ? "default" : "ghost"}
                onClick={() => handleQuickModeSelect(mode)}
                className={cn(
                  "w-full h-12 border border-border/20 dark:border-white/10 transition-all font-medium",
                  selectedMode === mode && !isCustomMode
                    ? "bg-gradient-primary text-primary-foreground shadow-glow border-primary/30"
                    : "hover:bg-secondary/20 dark:hover:bg-white/5 hover:border-border/40"
                )}
              >
                {mode.replace(/_/g, " ").toUpperCase()}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Advanced Modes Expandable Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="space-y-4"
      >
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border/20 dark:border-white/10 hover:border-border/40"
            >
              {showAdvanced ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Advanced Styles
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  More Styles
                </>
              )}
            </Button>
          </motion.div>
        </div>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                damping: 25,
                stiffness: 120
              }}
              className="overflow-hidden"
            >
              <div className="backdrop-blur-glass bg-card/20 dark:bg-card/10 rounded-xl p-4 border border-border/20 dark:border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {allModes.map((mode, index) => (
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.03,
                        type: "spring",
                        damping: 20
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.15 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        variant={selectedMode === mode && !isCustomMode ? "default" : "secondary"}
                        className={cn(
                          "cursor-pointer transition-all duration-200 px-3 py-2 w-full justify-center text-xs",
                          "hover:shadow-sm border-0",
                          selectedMode === mode && !isCustomMode
                            ? "bg-gradient-primary text-primary-foreground shadow-md" 
                            : "bg-secondary/30 dark:bg-secondary/20 hover:bg-secondary/50 dark:hover:bg-secondary/30 text-secondary-foreground"
                        )}
                        onClick={() => handleAdvancedModeSelect(mode)}
                      >
                        {mode.replace(/_/g, " ")}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Selected Mode Description */}
      <AnimatePresence>
        {selectedMode && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              damping: 25
            }}
            className="backdrop-blur-glass bg-muted/20 dark:bg-muted/10 rounded-lg p-4 border border-border/20 dark:border-white/10"
          >
            <motion.p 
              className="text-sm text-muted-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="font-medium text-foreground">
                {isCustomMode ? "CUSTOM" : selectedMode.replace(/_/g, " ").toUpperCase()}:
              </span>{" "}
              {isCustomMode ? customMode : modes[selectedMode]}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};