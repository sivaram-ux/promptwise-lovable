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
            "relative rounded-2xl transition-all duration-normal border",
            isFocused 
              ? "border-primary/30 shadow-lg shadow-primary/5" 
              : "border-border/50"
          )}
          animate={{
            scale: isFocused ? 1.005 : 1,
          }}
          transition={{ duration: 0.2, type: "spring", damping: 20 }}
        >
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={cn(
              "min-h-[120px] resize-none border-0 bg-card/80 backdrop-blur-sm",
              "text-base leading-relaxed p-6 rounded-2xl",
              "placeholder:text-muted-foreground/70",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "transition-colors duration-200"
            )}
          />
          
          {/* Subtle glow on focus */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 -z-10"
            animate={{
              opacity: isFocused ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Character count */}
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/70 bg-background/80 px-2 py-1 rounded-md">
          {value.length}
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
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "px-8 py-3 rounded-xl font-medium transition-all duration-200",
            "shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
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
          
          {/* Subtle hover effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.8 }}
          />
        </Button>
      </motion.div>
    </motion.div>
  );
};