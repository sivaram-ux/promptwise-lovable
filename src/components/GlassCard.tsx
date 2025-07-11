import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}

export const GlassCard = ({ children, className, animated = true }: GlassCardProps) => {
  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative backdrop-blur-glass border border-white/10",
        "bg-gradient-glass rounded-xl p-6",
        "shadow-glass hover:shadow-neural transition-all duration-normal",
        "before:absolute before:inset-0 before:rounded-xl before:p-[1px]",
        "before:bg-gradient-primary before:mask-composite-subtract before:-z-10",
        className
      )}
    >
      {children}
    </motion.div>
  );
};