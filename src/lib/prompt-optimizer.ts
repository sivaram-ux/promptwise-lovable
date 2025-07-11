// prompt-optimizer.ts

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerativeModel } from "@google/generative-ai";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Secure API Key Input - Browser environment compatible
const GOOGLE_API_KEY: string | undefined = import.meta.env.VITE_GOOGLE_API_KEY;
const SUPABASE_URL: string | undefined = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY: string | undefined = import.meta.env.VITE_SUPABASE_KEY;

// For development/demo purposes, we'll make these optional and provide UI for manual input
let runtimeApiKey: string | undefined = GOOGLE_API_KEY;
let runtimeSupabaseUrl: string | undefined = SUPABASE_URL;
let runtimeSupabaseKey: string | undefined = SUPABASE_KEY;

// Dynamic API key setters for runtime configuration
export const setApiKeys = (googleApiKey: string, supabaseUrl?: string, supabaseKey?: string) => {
    runtimeApiKey = googleApiKey;
    if (supabaseUrl) runtimeSupabaseUrl = supabaseUrl;
    if (supabaseKey) runtimeSupabaseKey = supabaseKey;
};

// Initialize Google Generative AI model dynamically
const getModel = (): GenerativeModel => {
    if (!runtimeApiKey) {
        throw new Error("Google API Key is required. Please provide it through the UI or environment variables.");
    }
    const genAI = new GoogleGenerativeAI(runtimeApiKey);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

// Safety settings (optional, but good practice)
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const modes: { [key: string]: string } = {
    "deep_research": "the prompt will be used by deep researching agent, it should enhance the quality such I get best research report covering each and every detail",
    "clarity": "Rewrite the prompt so that the LLM will produce an extremely clear and unambiguous response. Eliminate vagueness, add specific details, and enforce a logical structure.",
    "depth": "Rewrite the prompt to guide the LLM toward a thoughtful, multi-layered response. Encourage analysis, rationale, and contextual depth.",
    "creative": "Rewrite the prompt so the LLM delivers a highly imaginative and expressive response. Encourage the use of vivid examples, analogies, metaphors, and creative language.",
    "technical": "Rewrite the prompt so that the LLM generates precise, technically accurate content using domain-specific terminology, clear step-by-step logic, and relevant technical context.",
    "concise": "Rewrite the prompt to guide the LLM toward a brief, direct, and efficient response that retains clarity while reducing unnecessary verbosity.",
    "structured": "Rewrite the prompt to instruct the LLM to format the response cleanly, using bullet points, markdown tables, hierarchical sections, and clear headings.",
    "teaching": "Rewrite the prompt so that the LLM explains the topic progressively, with simple analogies, examples, and concepts tailored for a learning audience, including beginners.",
    "executive_summary": "Rewrite the prompt to elicit a high-level summary optimized for decision-makers. Prioritize key takeaways, actionable insights, and strategic framing.",
    "contrarian": "Rewrite the prompt to guide the LLM toward challenging conventional thinking. Encourage it to provide counterpoints, critique assumptions, and present alternative perspectives.",
    "step_by_step": "Rewrite the prompt to instruct the LLM to break down the response into clear, ordered steps or phases, with detailed explanations for each.",
    "journalistic": "Rewrite the prompt to elicit a response in the tone and structure of investigative or analytical journalism, including critical analysis, source-based reasoning, and consideration of bias.",
    "socratic": "Rewrite the prompt to instruct the LLM to ask probing, thought-provoking questions instead of providing direct answers—encouraging reflective or critical thinking from the user.",
    "controversial": "Rewrite the prompt to provoke the most controversial, unconventional, or polarizing response the LLM can generate. Push against mainstream assumptions while maintaining logical structure and factual support. Do not avoid sensitive or taboo perspectives unless ethically restricted.",
    "devil_advocate": "Rewrite the prompt to make the LLM take a strong opposing stance or play devil's advocate. Encourage it to argue against popular opinion or the user's assumed position using logic, evidence, or satire.",
    "debate_ready": "Rewrite the prompt so that the LLM structures its answer like a formal argument — clearly outlining opposing viewpoints, rebuttals, and conclusion. Suitable for use in debates or persuasive writing.",
    "startup_pitch": "Rewrite the prompt to generate a polished, concise startup pitch. Include value proposition, problem/solution, market fit, and potential differentiation. Use persuasive, high-conviction tone.",
    "real_world_applications": "Rewrite the prompt to guide the LLM toward output that maps theoretical ideas to real-world use cases, industries, or everyday scenarios.",
    "personal_growth": "Rewrite the prompt so the LLM provides actionable advice, reflection prompts, and behavioral frameworks for improving mindset, habits, or emotional resilience.",
    "marketing_landing_page": "Rewrite the prompt to produce marketing copy suitable for a product or service landing page. Include headline, problem/solution framing, benefits, CTA, and testimonials if applicable.",
    "socratic_reverse": "Rewrite the prompt to make the LLM ask a sequence of layered, increasingly specific questions back to the user in order to clarify the problem or uncover blind spots.",
    "satirical": "Rewrite the prompt so that the LLM responds with sarcasm, exaggeration, or parody — in the style of satirical commentary or mockery of the topic.",
};

/**
 * Optimizes a raw prompt based on the specified mode.
 * @param rawPrompt The original user query.
 * @param mode The optimization mode (e.g., "clarity", "deep_research").
 * @returns An async iterable of strings (chunks of the optimized prompt).
 */
async function* optimizePrompt(rawPrompt: string, mode: string = "clarity"): AsyncIterable<string> {
    let systemMessageContent: string;

    if (mode === "deep_research") {
        systemMessageContent = `
Act as a world-class prompt engineering expert.

Your task is to transform a raw, basic user query into a fully optimized, detailed, and highly effective prompt designed for use with deep researching agents from gemini or chatgpt.

🎯 Your optimized prompt must retain the original intent.

⚠️ CRITICAL INSTRUCTION: Do NOT output any commentary, apologies, or explanations. Output ONLY the **final refined prompt** as plain text.
`.trim();
    } else if (modes[mode]) {
        systemMessageContent = `
Act as a world-class prompt engineering expert.

Your task is to transform a raw, basic user query into a fully optimized, detailed, and highly effective prompt designed for use with advanced LLMs like Gemini 1.5 Pro or Claude 3 Opus.

🎯 Your optimized prompt must retain the original intent.

🧠 Apply the following techniques if they are appropiate(not necessary to use each and everyone):

1. Role & Persona — Assign an expert identity to the AI (e.g., "You are a veteran data scientist with 15 years of industry experience.")
2. Context — Add background info or assumptions to frame the task meaningfully.
3. Audience — Define who the output is intended for (e.g., beginner, developer, executive).
4. Structure & Format — Specify how the answer should be organized (e.g., "Use a three-part breakdown with bullets and a markdown table").
5. Goals & Intent — State what the user wants to achieve (e.g., "The goal is to create a step-by-step learning plan...").
6. Key Elements — Include concepts, examples, analogies, pitfalls, comparisons, and optional depth levels.
7. Constraints — Add exclusions if appropriate (e.g., "Do not include political commentary").

🎯 MOST IMPORTANT INSTRUCTION: **${modes[mode]}**

⚠️ CRITICAL INSTRUCTION: Do NOT output any commentary, apologies, or explanations. Output ONLY the **final refined prompt** as plain text.
`.trim();
    } else {
        systemMessageContent = `
Act as a world-class prompt engineering expert.

Your task is to transform a raw, basic user query into a fully optimized, detailed, and highly effective prompt designed for use with advanced LLMs like Gemini 1.5 Pro or Claude 3 Opus.

🎯 Your optimized prompt must retain the original intent.

🧠 Apply the following techniques if they are appropiate(not necessary to follow each and everyone):

1. Role & Persona — Assign an expert identity to the AI (e.g., "You are a veteran data scientist with 15 years of industry experience.")
2. Context — Add background info or assumptions to frame the task meaningfully.
3. Audience — Define who the output is intended for (e.g., beginner, developer, executive).
4. Structure & Format — Specify how the answer should be organized (e.g., "Use a three-part breakdown with bullets and a markdown table").
5. Goals & Intent — State what the user wants to achieve (e.g., "The goal is to create a step-by-step learning plan...").
6. Key Elements — Include concepts, examples, analogies, pitfalls, comparisons, and optional depth levels.
7. Constraints — Add exclusions if appropriate (e.g., "Do not include political commentary").

🎯 MOST IMPORTANT INSTRUCTION: **${mode}**

⚠️ CRITICAL INSTRUCTION: Do NOT output any commentary, apologies, or explanations. Output ONLY the **final refined prompt** as plain text.
`.trim();
    }

    const model = getModel();
    const messages = [
        { role: "user", parts: [{ text: systemMessageContent }] },
        { role: "user", parts: [{ text: `Optimise this: ${rawPrompt}` }] }
    ];

    const result = await model.generateContentStream({
        contents: messages,
        safetySettings: safetySettings,
    });

    for await (const chunk of result.stream) {
        yield chunk.text(); // Yielding the text content of each chunk
    }
}

interface ExplanationFeedback {
    original_prompt: {
        strengths: string[];
        weaknesses: string[];
    };
    llm_understanding_improvements: string[];
    tips_for_future_prompts: string[];
}

/**
 * Explains the differences and improvements between an original and an optimized prompt.
 * @param originalPrompt The initial user prompt.
 * @param optimizedPrompt The LLM-optimized prompt.
 * @param mode The optimization mode used.
 * @returns An async iterable of strings (chunks of the explanation in JSON format).
 */
async function* explainPrompt(originalPrompt: string, optimizedPrompt: string, mode: string = "clarity"): AsyncIterable<string> {
    const modeDescription = modes[mode] || mode;

    const explanationRequestContent = `
Act as a world-class prompt engineering expert.

Compare the following two prompts and return a structured analysis in **valid JSON format** using the schema below.

📌 Original Prompt:
"${originalPrompt}"

🎯Final Goal of optimized prompt:
"${modeDescription}"

✨ Optimized Prompt:
"${optimizedPrompt}"

Return exactly this JSON object structure:

{{
  "original_prompt": {{
    "strengths": ["..."],
    "weaknesses": ["..."]
  }},
  "llm_understanding_improvements": ["..."],
  "tips_for_future_prompts": ["..."]
}}

🧠 Section Guidance:
👍 Original Prompt Strengths 
• (State what the user's original prompt did well.) 
• (Be generous but honest.)

👎 Original Prompt Weaknesses 
• (Point out key missing elements or flaws in the original.) 
• (Explain the impact of those weaknesses.)

🧠 What LLMs Understand Better Now 
• (Explain how the refined prompt improves LLM comprehension.) 
• (Focus on structure, role, clarity, and specificity.)

💡 Tips for Future Prompts 
• (Give practical suggestions to improve prompt writing skills.) 
• (Focus on what to try next time — structure, constraints, or specificity.)

⚠️ Important Instructions:
- Do NOT output anything other than the JSON object.
- Make sure the response is valid JSON and not a markdown code block.
`.trim();

    const model = getModel();
    const messages = [
        { role: "user", parts: [{ text: "You are a prompt engineer. You need to explain your own work." }] },
        { role: "user", parts: [{ text: explanationRequestContent }] }
    ];

    const result = await model.generateContentStream({
        contents: messages,
        safetySettings: safetySettings,
    });

    for await (const chunk of result.stream) {
        yield chunk.text();
    }
}

/**
 * Generates answers to deep research questions based on user preferences.
 * @param originalPrompt The original user prompt.
 * @param optimisedPrompt The optimized prompt used for deep research.
 * @param questionsAsked Questions asked by the model for the report.
 * @param preferences Optional user preferences/answers to the questions.
 * @returns An async iterable of strings (chunks of the answers).
 */
async function* deepResearchQuestions(originalPrompt: string, optimisedPrompt: string, questionsAsked: string, preferences: string = ""): AsyncIterable<string> {
    let newHttpMessageContent: string;
    if (preferences) {
        newHttpMessageContent = `The model has asked the following questions:${questionsAsked}
My preferences:${preferences}
Please answer them generally
⚠️ CRITICAL INSTRUCTION: Do NOT output any commentary, apologies, or explanations. Output ONLY the answers as plain text.
`.trim();
    } else {
        newHttpMessageContent = `The model has asked the following questions to prepare the report:${questionsAsked}
Please answer them generally
⚠️ CRITICAL INSTRUCTION: Do NOT output any commentary, apologies, or explanations. Output ONLY the answers to questions asked by model as plain text.
`.trim();
    }

    const systemMessageContent = `
Act as a world-class prompt engineering expert.

Your task is to transform a raw, basic user query into a fully optimized, detailed, and highly effective prompt designed for use with deep researching agents from gemini or chatgpt.

🎯 Your optimized prompt must retain the original intent but dramatically expand its scope, specificity, and structure.

⚠️ CRITICAL INSTRUCTION: Do NOT output any commentary, apologies, or explanations. Output ONLY the **final refined prompt** as plain text.
`.trim();

    const model = getModel();
    const messages = [
        { role: "user", parts: [{ text: systemMessageContent }] },
        { role: "user", parts: [{ text: `Optimise this: ${originalPrompt}` }] },
        { role: "model", parts: [{ text: optimisedPrompt }] },
        { role: "user", parts: [{ text: newHttpMessageContent }] }
    ];

    const result = await model.generateContentStream({
        contents: messages,
        safetySettings: safetySettings,
    });

    for await (const chunk of result.stream) {
        yield chunk.text();
    }
}

/**
 * Extracts a JSON object from a given string, handling markdown code blocks.
 * @param responseText The text potentially containing a JSON string.
 * @returns The parsed JSON object or null if parsing fails.
 */
function extractJsonFromResponse(responseText: string): ExplanationFeedback | null {
    const jsonMatch = responseText.match(/```json\s+([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
        try {
            return JSON.parse(jsonMatch[1]) as ExplanationFeedback;
        } catch (e) {
            console.error(`⚠️ JSON decode error: ${e}`);
        }
    } else {
        // If no code block, try to parse the entire text as JSON
        try {
            return JSON.parse(responseText) as ExplanationFeedback;
        } catch (e) {
            console.error(`⚠️ JSON decode error: ${e}. No JSON block found, attempting raw parse failed.`);
            console.log(`Raw response text (first 200 chars): ${responseText.substring(0, 200)}...`);
        }
    }
    return null;
}

// Initialize Supabase client dynamically
const getSupabaseClient = (): SupabaseClient => {
    if (!runtimeSupabaseUrl || !runtimeSupabaseKey) {
        throw new Error("Supabase URL and Key are required for database operations.");
    }
    return createClient(runtimeSupabaseUrl, runtimeSupabaseKey);
};

/**
 * Logs prompt optimization details to Supabase.
 * @returns The prompt ID if successful, otherwise null.
 */
async function logPromptToSupabase(
    originalPrompt: string,
    optimizedPrompt: string,
    mode: string,
    modelUsed: string = "gemini-1.5-flash",
    userLocation: string = "global",
    sessionId: string | null = null
): Promise<string | null> {
    sessionId = sessionId || uuidv4();
    const timestamp = new Date().toISOString();

    const data = {
        original_prompt: originalPrompt,
        optimized_prompt: optimizedPrompt,
        mode: mode,
        model_used: modelUsed,
        timestamp: timestamp,
        session_id: sessionId,
        user_location: userLocation,
    };

    try {
        const supabase = getSupabaseClient();
        const { data: responseData, error } = await supabase.from("optimized_prompts").insert([data]).select();
        if (error) {
            console.error(`❌ Failed to insert prompt: ${error.message}`);
            return null;
        }
        if (responseData && responseData.length > 0) {
            const promptId = responseData[0].id;
            console.log("✅ Prompt logged to Supabase.");
            return promptId;
        } else {
            console.log("❌ No data returned from Supabase insertion.");
            return null;
        }
    } catch (e: any) {
        console.error(`❌ Failed to insert prompt: ${e.message}`);
        return null;
    }
}

/**
 * Saves deep research questions and answers to Supabase.
 */
async function saveDeepResearchQuestionsSeparately(promptId: string, questionsAsked: string, answers: string, preferences: string | null = null): Promise<void> {
    try {
        const supabase = getSupabaseClient();
        const { error } = await supabase.from("deep_research_questions").insert({
            prompt_id: promptId,
            questions_asked: questionsAsked,
            preferences: preferences,
            answers: answers,
        });
        if (error) {
            console.error(`❌ Deep research questions save failed: ${error.message}`);
        } else {
            console.log("🧠 Deep research questions saved to Supabase.");
        }
    } catch (e: any) {
        console.error(`❌ Error saving deep research questions: ${e.message}`);
    }
}

/**
 * Saves the prompt explanation to Supabase.
 */
async function saveExplanationSeparately(promptId: string, explanationDict: ExplanationFeedback): Promise<void> {
    try {
        const supabase = getSupabaseClient();
        const { error } = await supabase.from("prompt_explanations").insert({
            prompt_id: promptId,
            explanation_json: explanationDict,
        });
        if (error) {
            console.error(`❌ Explanation save failed: ${error.message}`);
        } else {
            console.log("🧠 Explanation saved to Supabase.");
        }
    } catch (e: any) {
        console.error(`❌ Error saving explanation: ${e.message}`);
    }
}

// Export the functions for web use
export {
    optimizePrompt,
    explainPrompt,
    deepResearchQuestions,
    extractJsonFromResponse,
    logPromptToSupabase,
    saveDeepResearchQuestionsSeparately,
    saveExplanationSeparately,
    modes,
    type ExplanationFeedback
};