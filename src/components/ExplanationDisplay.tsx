import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Lightbulb, Brain } from "lucide-react";
import { ExplanationFeedback } from "@/lib/prompt-optimizer";

interface ExplanationDisplayProps {
  explanation: ExplanationFeedback;
}

export const ExplanationDisplay = ({ explanation }: ExplanationDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-semibold bg-gradient-neural bg-clip-text text-transparent mb-2">
          Prompt Analysis & Insights
        </h3>
        <p className="text-muted-foreground">
          Understanding what made your prompt better
        </p>
      </div>

      <div className="grid gap-6">
        {/* Strengths */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <h4 className="text-lg font-medium text-foreground">
              Original Prompt Strengths
            </h4>
          </div>
          
          {explanation.original_prompt.strengths.length > 0 ? (
            <div className="space-y-2">
              {explanation.original_prompt.strengths.map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/20"
                >
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">{strength}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No specific strengths identified in the original prompt
            </p>
          )}
        </GlassCard>

        {/* Weaknesses */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-warning/10">
              <XCircle className="w-5 h-5 text-warning" />
            </div>
            <h4 className="text-lg font-medium text-foreground">
              Areas for Improvement
            </h4>
          </div>
          
          {explanation.original_prompt.weaknesses.length > 0 ? (
            <div className="space-y-2">
              {explanation.original_prompt.weaknesses.map((weakness, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20"
                >
                  <XCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">{weakness}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No significant weaknesses identified
            </p>
          )}
        </GlassCard>

        {/* LLM Understanding Improvements */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-lg font-medium text-foreground">
              What LLMs Understand Better Now
            </h4>
          </div>
          
          {explanation.llm_understanding_improvements.length > 0 ? (
            <div className="space-y-2">
              {explanation.llm_understanding_improvements.map((improvement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <Brain className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">{improvement}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No specific improvements listed
            </p>
          )}
        </GlassCard>

        {/* Tips for Future */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent/10">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            <h4 className="text-lg font-medium text-foreground">
              Tips for Future Prompts
            </h4>
          </div>
          
          {explanation.tips_for_future_prompts.length > 0 ? (
            <div className="space-y-2">
              {explanation.tips_for_future_prompts.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20"
                >
                  <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">{tip}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No specific tips available
            </p>
          )}
        </GlassCard>
      </div>

      {/* Summary badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="flex justify-center"
      >
        <Badge
          variant="outline"
          className="bg-gradient-glass border-primary/30 text-primary px-4 py-2"
        >
          Analysis Complete ✨
        </Badge>
      </motion.div>
    </motion.div>
  );
};