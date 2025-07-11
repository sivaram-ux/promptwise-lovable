import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Zap } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export const Header = () => {
  const { ref, isInView } = useScrollReveal();

  return (
    <motion.header
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-6 py-12 relative"
    >
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      {/* Logo/Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-20"
          />
          <div className="relative p-4 rounded-full bg-gradient-primary shadow-glow">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-4"
      >
        <motion.h1 
          className="text-5xl font-bold bg-gradient-neural bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          PromptWise
        </motion.h1>
        <motion.p 
          className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          The future of prompt engineering. Alien AI interface trained for elegance, speed, and power.
        </motion.p>
      </motion.div>

      {/* Feature badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        {[
          { icon: Sparkles, text: "22 Optimization Modes", color: "primary" },
          { icon: Zap, text: "Real-time Analysis", color: "accent" },
          { icon: Brain, text: "AI-Powered Insights", color: "success" }
        ].map((badge, index) => (
          <motion.div
            key={badge.text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge variant="outline" className={`bg-gradient-glass border-${badge.color}/30 text-${badge.color} px-4 py-2 hover:shadow-glow transition-all duration-300`}>
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: index * 0.5
                }}
              >
                <badge.icon className="w-4 h-4 mr-2" />
              </motion.div>
              {badge.text}
            </Badge>
          </motion.div>
        ))}
      </motion.div>

      {/* Subtle animation elements */}
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-8 left-1/4 w-2 h-2 bg-primary/50 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -top-4 right-1/3 w-1.5 h-1.5 bg-accent/50 rounded-full"
        />
      </div>
    </motion.header>
  );
};