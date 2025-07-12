import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  scrollReveal?: boolean;
}

export const GlassCard = ({ children, className, animated = true, scrollReveal = false }: GlassCardProps) => {
  const { ref, isInView } = useScrollReveal();
  
  const shouldAnimate = scrollReveal ? isInView : animated;
  
  return (
    <motion.div
      ref={scrollReveal ? ref : undefined}
      initial={animated ? { opacity: 0, y: 30, scale: 0.95 } : {}}
      animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : animated ? {} : { opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6,
        type: "spring",
        damping: 30,
        stiffness: 100
      }}
      className={cn(
        "backdrop-blur-sm bg-card/80 border border-border/50",
        "rounded-2xl p-6 shadow-lg",
        "hover:shadow-xl hover:border-border/70 transition-all duration-300",
        "relative overflow-hidden",
        className
      )}
    >
      {/* Subtle hover glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-primary/2 opacity-0 -z-10"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {children}
    </motion.div>
  );
};