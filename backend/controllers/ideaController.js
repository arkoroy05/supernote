import { chatModel } from '../services/aiService.js';
import { PromptTemplate } from "@langchain/core/prompts";

// UPDATED: The template string has been corrected.
// The curly braces {} inside the JSON example have been "escaped" by doubling them to {{ and }}.
// This tells LangChain to treat them as literal text, not as template variables.
const ideaAnalysisTemplate = `You are an expert startup and product analyst with deep industry experience. A user has submitted the following project idea: "{idea}".

Your job is to provide a detailed analysis and creative variations for this idea.

*1. A Critical Analysis:*
Evaluate the idea with brutal honesty. If it's flawed, explain why. Your analysis must be in well-structured Markdown and consider:
- *Market Demand:* Is there a real, pressing need for this?
- *Feasibility:* Is it technically and financially viable to build, scale, and monetize?
- *Competitive Landscape:* Does this already exist? Is it just a copy of something else?
- *Potential Issues:* Are there any significant legal, ethical, or social hurdles?

*2. 5 Creative Variations:*
Generate five distinct and imaginative variations on the core concept. Each variation must be a single string in the format: 'Title: Description'.
- The *Title* must be a short, catchy name without any colons.
- The *Description* must be in plain text NO markdown formatting string explaining the new concept.

*Crucial Formatting Instructions:*

You MUST respond with ONLY a single, valid JSON object. Do not include any text or formatting before or after the JSON object.

- The JSON object must have two keys: "analysis" and "variations".
- The value for "analysis" must be a single JSON string, with all Markdown content properly escaped.
- The value for "variations" must be a JSON array of 5 strings.
- *VERY IMPORTANT:* Inside the JSON strings, all double quotes (") must be escaped with a backslash (\\"). For example, a phrase like "a "quoted" word" must be written as "a \\"quoted\\" word" within the JSON string.

*Example of the required EXACT output format:*

\`\`\`json
{{
  "analysis": "### Critical Analysis of [Original Idea Name]\\n\\n*Market Demand:\\nThere appears to be a *moderate demand for this type of solution. However, research indicates the target audience might perceive it as a \\"nice-to-have\\" rather than a necessity.\\n\\n*Feasibility:*\\nTechnically, the project is feasible with current technology. The primary business challenge will be customer acquisition cost.",
  "variations": [
    "Variation Title One: ### A New Direction\\n\\nThis version focuses exclusively on the B2B market, offering a subscription-based service with features like *team collaboration* and *advanced analytics*.",
    "Variation Title Two: ### The Gamified Approach\\n\\nTransforms the original idea into an engaging mobile game. Users earn points and rewards for completing tasks, making the experience more \\"addictive\\" and shareable.",
    "Variation Title Three: ### Hyper-Local Focus\\n\\nInstead of a global platform, this variation targets a specific niche community or geographical area, providing a highly tailored and localized experience.",
    "Variation Title Four: ### The AI-Powered Assistant\\n\\nThis take integrates a sophisticated AI to automate the core tasks, positioning it as an intelligent assistant that saves users significant time and effort.",
    "Variation Title Five: ### The Open-Source Alternative\\n\\nBuilds the core technology as an open-source project. Monetization would come from paid hosting, premium support, and enterprise-grade features."
  ]
}}
\`\`\`
`;

export const analyzeIdea = async (req, res) => {
    const { idea } = req.body;
    console.log('Received idea for analysis:', idea);
    if (!idea) {
        return res.status(400).json({ message: 'Idea text is required.' });
    }

    try {
        console.log('Creating prompt with idea:', idea);
        const prompt = await PromptTemplate.fromTemplate(ideaAnalysisTemplate).format({ idea });
        console.log('Formatted prompt correctly.');

        const result = await chatModel.invoke(prompt);
        console.log('Raw AI Response:', result.content);

        // --- UPDATED & ROBUST JSON PARSING ---
        // This logic finds the JSON block without destroying the internal newlines (\n)
        // that are needed for your Markdown formatting.
        let jsonString = result.content;
        const firstBraceIndex = jsonString.indexOf('{');
        const lastBraceIndex = jsonString.lastIndexOf('}');

        if (firstBraceIndex === -1 || lastBraceIndex === -1) {
            throw new Error("AI response did not contain a valid JSON object.");
        }
        
        // Extract the clean JSON string
        jsonString = jsonString.substring(firstBraceIndex, lastBraceIndex + 1);
        
        const parsedResult = JSON.parse(jsonString);
        console.log('Parsed JSON object successfully:', parsedResult);

        res.status(200).json(parsedResult);
    } catch (error) {
        console.error('Error in analyzeIdea:', error); // Log the full error
        res.status(500).json({ message: 'Failed to analyze idea. The AI may have returned a malformed response.' });
    }
};