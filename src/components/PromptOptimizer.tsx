import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Components
import { Header } from "./Header";
import { NeuralBackground } from "./NeuralBackground";
import { GlassCard } from "./GlassCard";
import { PromptInput } from "./PromptInput";
import { ModeSelector } from "./ModeSelector";
import { OptimizedOutput } from "./OptimizedOutput";
import { ExplanationDisplay } from "./ExplanationDisplay";
import { ApiKeySetup } from "./ApiKeySetup";
import { DeepResearchDialog } from "./DeepResearchDialog";

// Optimizer functions
import {
  optimizePrompt,
  explainPrompt,
  deepResearchQuestions,
  extractJsonFromResponse,
  logPromptToSupabase,
  saveDeepResearchQuestionsSeparately,
  saveExplanationSeparately,
  type ExplanationFeedback
} from "@/lib/prompt-optimizer";

interface OptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  mode: string;
  promptId?: string;
}

export const PromptOptimizer = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedMode, setSelectedMode] = useState("clarity");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isDeepResearching, setIsDeepResearching] = useState(false);
  const [showDeepResearchDialog, setShowDeepResearchDialog] = useState(false);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const [apiKeysConfigured, setApiKeysConfigured] = useState(false);
  
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [explanation, setExplanation] = useState<ExplanationFeedback | null>(null);
  const [deepResearchAnswers, setDeepResearchAnswers] = useState<string | null>(null);

  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!prompt.trim()) return;

    // Check if API keys are configured
    if (!apiKeysConfigured) {
      setShowApiKeySetup(true);
      return;
    }

    setIsOptimizing(true);
    setOptimizationResult(null);
    setExplanation(null);
    setDeepResearchAnswers(null);

    try {
      let optimizedText = "";
      
      // Stream the optimization
      for await (const chunk of optimizePrompt(prompt, selectedMode)) {
        optimizedText += chunk;
      }

      // Log to Supabase
      const promptId = await logPromptToSupabase(
        prompt,
        optimizedText,
        selectedMode,
        "gemini-1.5-flash"
      );

      setOptimizationResult({
        originalPrompt: prompt,
        optimizedPrompt: optimizedText,
        mode: selectedMode,
        promptId: promptId || undefined
      });

      toast({
        title: "Optimization Complete!",
        description: "Your prompt has been successfully optimized.",
      });

    } catch (error: any) {
      console.error("Optimization error:", error);
      
      // If the error is related to missing API keys, show setup dialog
      if (error.message?.includes("API Key") || error.message?.includes("process")) {
        setShowApiKeySetup(true);
        toast({
          title: "API Configuration Required",
          description: "Please configure your Google AI API key to continue.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Optimization Failed",
          description: "An error occurred while optimizing your prompt. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleExplain = async () => {
    if (!optimizationResult) return;

    setIsExplaining(true);
    
    try {
      let explanationText = "";
      
      for await (const chunk of explainPrompt(
        optimizationResult.originalPrompt,
        optimizationResult.optimizedPrompt,
        optimizationResult.mode
      )) {
        explanationText += chunk;
      }

      const explanationData = extractJsonFromResponse(explanationText);
      
      if (explanationData) {
        setExplanation(explanationData);
        
        // Save to Supabase if we have a promptId
        if (optimizationResult.promptId) {
          await saveExplanationSeparately(optimizationResult.promptId, explanationData);
        }

        toast({
          title: "Analysis Complete!",
          description: "Detailed explanation of the optimization has been generated.",
        });
      } else {
        throw new Error("Failed to parse explanation");
      }

    } catch (error) {
      console.error("Explanation error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not generate explanation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExplaining(false);
    }
  };

  const handleDeepResearch = () => {
    setShowDeepResearchDialog(true);
  };

  const handleDeepResearchSubmit = async (questionsAsked: string, preferences?: string) => {
    if (!optimizationResult) return;

    setIsDeepResearching(true);
    setShowDeepResearchDialog(false);

    try {
      let answersText = "";
      
      for await (const chunk of deepResearchQuestions(
        optimizationResult.originalPrompt,
        optimizationResult.optimizedPrompt,
        questionsAsked,
        preferences
      )) {
        answersText += chunk;
      }

      setDeepResearchAnswers(answersText);

      // Save to Supabase if we have a promptId
      if (optimizationResult.promptId) {
        await saveDeepResearchQuestionsSeparately(
          optimizationResult.promptId,
          questionsAsked,
          answersText,
          preferences || null
        );
      }

      toast({
        title: "Deep Research Complete!",
        description: "Research questions have been answered successfully.",
      });

    } catch (error) {
      console.error("Deep research error:", error);
      toast({
        title: "Deep Research Failed",
        description: "Could not process deep research questions. Please try again.",
        variant: "destructive",
      });
     } finally {
      setIsDeepResearching(false);
    }
  };

  const handleApiKeySet = () => {
    setApiKeysConfigured(true);
    toast({
      title: "Configuration Complete!",
      description: "Your API keys have been configured. You can now optimize prompts.",
    });
  };

  return (
    <div className="min-h-screen relative">
      <NeuralBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <Header />

        <div className="space-y-8">
          {/* Input Section */}
          <GlassCard scrollReveal>
            <div className="space-y-6">
              <ModeSelector 
                selectedMode={selectedMode}
                onModeChange={setSelectedMode}
              />
              
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                onOptimize={handleOptimize}
                isLoading={isOptimizing}
                placeholder="Enter your raw prompt here. For example: 'Explain machine learning'"
              />
            </div>
          </GlassCard>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {optimizationResult && (
              <motion.div
                key="optimization-result"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ 
                  duration: 0.6,
                  type: "spring",
                  damping: 25,
                  stiffness: 120
                }}
                className="space-y-6"
              >
                <OptimizedOutput
                  originalPrompt={optimizationResult.originalPrompt}
                  optimizedPrompt={optimizationResult.optimizedPrompt}
                  mode={optimizationResult.mode}
                  onExplain={handleExplain}
                  onDeepResearch={handleDeepResearch}
                  isExplaining={isExplaining}
                  isDeepResearching={isDeepResearching}
                />

                {/* Explanation */}
                {explanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6,
                      type: "spring",
                      damping: 20,
                      stiffness: 100,
                      delay: 0.2
                    }}
                  >
                    <ExplanationDisplay explanation={explanation} />
                  </motion.div>
                )}

                {/* Deep Research Answers */}
                {deepResearchAnswers && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6,
                      type: "spring",
                      damping: 20,
                      stiffness: 100,
                      delay: 0.4
                    }}
                  >
                    <GlassCard>
                      <motion.h3 
                        className="text-lg font-semibold text-foreground mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        Deep Research Answers
                      </motion.h3>
                      <motion.div 
                        className="p-4 rounded-lg bg-muted/30 border border-border/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {deepResearchAnswers}
                        </p>
                      </motion.div>
                    </GlassCard>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading state overlay */}
        <AnimatePresence>
          {isOptimizing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-card p-8 rounded-xl shadow-neural border border-border/50"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mx-auto w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
                  />
                  <div>
                    <h4 className="text-lg font-medium text-foreground">
                      Optimizing Your Prompt
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Neural networks are analyzing and enhancing your prompt...
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API Key Setup Dialog */}
        <ApiKeySetup
          open={showApiKeySetup}
          onOpenChange={setShowApiKeySetup}
          onApiKeySet={handleApiKeySet}
        />

        {/* Deep Research Dialog */}
        <DeepResearchDialog
          open={showDeepResearchDialog}
          onOpenChange={setShowDeepResearchDialog}
          onSubmit={handleDeepResearchSubmit}
          isLoading={isDeepResearching}
        />
      </div>
    </div>
  );
};