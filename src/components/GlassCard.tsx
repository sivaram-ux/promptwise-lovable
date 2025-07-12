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
      initial={animated ? { opacity: 0, y: 20, scale: 0.95 } : {}}
      animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : animated ? {} : { opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        type: "spring",
        damping: 25,
        stiffness: 120
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className={cn(
        "relative backdrop-blur-glass border border-white/10 dark:border-primary/20",
        "bg-gradient-glass rounded-xl p-6",
        "shadow-glass hover:shadow-neural transition-all duration-normal",
        "before:absolute before:inset-0 before:rounded-xl before:p-[1px]",
        "before:bg-gradient-primary before:mask-composite-subtract before:-z-10",
        "hover:before:opacity-60 before:transition-opacity before:duration-300",
        className
      )}
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 blur-md -z-20"
        animate={{
          opacity: [0, 0.1, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {children}
    </motion.div>
  );
};