import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onOptimize: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export const PromptInput = ({ 
  value, 
  onChange, 
  onOptimize, 
  isLoading, 
  placeholder = "Enter your prompt here..." 
}: PromptInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="relative">
        <motion.div
          className={cn(
            "relative rounded-xl transition-all duration-normal",
            isFocused 
              ? "ring-2 ring-primary/50 shadow-glow" 
              : "ring-1 ring-border"
          )}
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={cn(
              "min-h-[120px] resize-none border-0 bg-background/50 backdrop-blur-sm",
              "text-base leading-relaxed p-4 rounded-xl",
              "placeholder:text-muted-foreground/60",
              "focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
          />
          
          {/* Animated border gradient */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 -z-10"
            animate={{
              opacity: isFocused ? 0.1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Character count */}
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground/60">
          {value.length} characters
        </div>
      </div>

      <motion.div
        className="flex justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={onOptimize}
          disabled={!value.trim() || isLoading}
          size="lg"
          className={cn(
            "bg-gradient-primary hover:bg-gradient-primary text-primary-foreground",
            "px-8 py-3 rounded-xl font-medium transition-all duration-normal",
            "shadow-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed",
            "border-0 relative overflow-hidden"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Optimize Prompt
            </>
          )}
          
          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        </Button>
      </motion.div>
    </motion.div>
  );
};