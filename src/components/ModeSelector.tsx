import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { modes } from "@/lib/prompt-optimizer";

interface ModeSelectorProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
}

const modeCategories = {
  "Core Optimization": ["clarity", "depth", "concise", "structured"],
  "Creative & Expression": ["creative", "satirical", "contrarian"],
  "Professional": ["technical", "executive_summary", "startup_pitch", "marketing_landing_page"],
  "Educational": ["teaching", "step_by_step", "socratic", "socratic_reverse"],
  "Advanced": ["deep_research", "journalistic", "debate_ready", "devil_advocate"],
  "Specialized": ["real_world_applications", "personal_growth", "controversial"]
};

export const ModeSelector = ({ selectedMode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold bg-gradient-neural bg-clip-text text-transparent mb-2">
          Select Optimization Mode
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose how you want your prompt to be transformed
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(modeCategories).map(([category, categoryModes]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-foreground/80 px-2">
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {categoryModes.map((mode) => (
                <motion.div
                  key={mode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant={selectedMode === mode ? "default" : "secondary"}
                    className={cn(
                      "cursor-pointer transition-all duration-fast px-3 py-1.5",
                      "hover:shadow-glow border-0",
                      selectedMode === mode 
                        ? "bg-gradient-primary text-primary-foreground shadow-glow" 
                        : "bg-secondary/50 hover:bg-secondary/80 text-secondary-foreground"
                    )}
                    onClick={() => onModeChange(mode)}
                  >
                    {mode.replace(/_/g, " ")}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 rounded-lg bg-muted/50 border border-border/50"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {selectedMode.replace(/_/g, " ").toUpperCase()}:
            </span>{" "}
            {modes[selectedMode]}
          </p>
        </motion.div>
      )}
    </div>
  );
};