import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Zap } from "lucide-react";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-6 py-12"
    >
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
        <h1 className="text-5xl font-bold bg-gradient-neural bg-clip-text text-transparent">
          Neural Prompt Optimizer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Transform your basic prompts into powerful, precisely engineered instructions 
          that unlock the full potential of AI language models
        </p>
      </motion.div>

      {/* Feature badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <Badge variant="outline" className="bg-gradient-glass border-primary/30 text-primary px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          22 Optimization Modes
        </Badge>
        <Badge variant="outline" className="bg-gradient-glass border-accent/30 text-accent px-4 py-2">
          <Zap className="w-4 h-4 mr-2" />
          Real-time Analysis
        </Badge>
        <Badge variant="outline" className="bg-gradient-glass border-success/30 text-success px-4 py-2">
          <Brain className="w-4 h-4 mr-2" />
          AI-Powered Insights
        </Badge>
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