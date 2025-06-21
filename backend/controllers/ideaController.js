import { chatModel } from '../services/aiService.js';
import { PromptTemplate } from "@langchain/core/prompts";

/**
 * FINAL FIX:
 * The LangChain PromptTemplate was misinterpreting the curly braces `{}` in the
 * example JSON as input variables.
 * To fix this, we must "escape" them by doubling them to `{{` and `}}`.
 * The only variable LangChain should see is the actual `{idea}` placeholder.
 */
const ideaAnalysisTemplate = `You are an expert startup and product analyst. A user has submitted the following project idea: "{idea}".

Your job is to provide a critical analysis and creative variations.

**1. A Critical Analysis:**
Provide a brutally honest evaluation in well-structured Markdown. Consider:
- **Market Demand:** Is this a real need or a gimmick?
- **Feasibility:** Is it technically and financially viable?
- **Competitive Landscape:** Does this already exist in some form?
- **Potential Issues:** What are the legal, ethical, or social red flags?

**2. 5 Creative Variations:**
Generate five distinct variations. Each must be a single string with the format 'Title: Description'.
- The **Title** must be short and contain no colons.
- The **Description** must be imaginative and formatted in valid Markdown.

**Response Format Rules (Follow Strictly):**
You MUST respond with ONLY a single, valid JSON object. Do not output any text, notes, or explanations before or after the JSON object.

- The JSON MUST have two keys: \`"analysis"\` and \`"variations"\`.
- All string values within the JSON must be properly escaped. Specifically, any double quotes (") inside a string must be escaped with a backslash (\\").
- Do not use any non-standard or invisible whitespace characters.

**Example of the Required EXACT Output Format:**
{{
  "analysis": "### Critical Analysis of Fridge Matching App\\n\\n**Market Demand:**\\nThe core premise is fundamentally flawed. While novel, matching by fridge contents is a gimmick that fails to address the real drivers of compatibility like values, interests, and personality. User retention would likely be very low after the initial curiosity wears off. It's a \\"funny idea\\" but not a viable business concept.",
  "variations": [
    "PantryPal Connect: ### A Social App for Home Cooks\\n\\nThis variation drops the dating angle and focuses on building a community for food enthusiasts. Users connect based on shared pantry items and culinary interests to swap recipes, share surplus ingredients, and organize local cook-offs.",
    "The Foodie Finder: ### A Dating App for Culinary Personalities\\n\\nUsers create detailed **food profiles** covering favorite cuisines, dining habits, and cooking skills. Instead of a raw fridge photo, users share a curated \\"foodie mood board\\" to express their culinary identity.",
    "Leftovers Love: ### A Food Waste Reduction Platform\\n\\nA community app to combat food waste. Users post surplus ingredients or meals for neighbors to claim. This builds local connections based on sustainability, with social profiles being secondary.",
    "DineMatch AI: ### An Intelligent Meal Planner\\n\\nAn AI-powered app that suggests recipes based on a user's dietary preferences and photos of their current pantry items. The social feature is based on \\"cooking challenges\\", not dating.",
    "FridgeFollies: ### A Social Entertainment App\\n\\nA purely humorous platform where users share funny or bizarre photos of their fridges. It's a social media concept based on light-hearted content and community voting, with no dating component."
  ]
}}
`;

export const analyzeIdea = async (req, res) => {
    const { idea } = req.body;
    if (!idea) {
        return res.status(400).json({ message: 'Idea text is required.' });
    }

    let result;

    try {
        console.log('Received idea for analysis:', idea);
        const prompt = await PromptTemplate.fromTemplate(ideaAnalysisTemplate).format({ idea });
        console.log('Formatted prompt correctly.');

        result = await chatModel.invoke(prompt);
        console.log('Raw AI Response:', result.content);

        let rawContent = result.content;
        const firstBraceIndex = rawContent.indexOf('{');
        const lastBraceIndex = rawContent.lastIndexOf('}');

        if (firstBraceIndex === -1 || lastBraceIndex === -1) {
            throw new Error("AI response did not contain a valid JSON object.");
        }
        
        let jsonString = rawContent.substring(firstBraceIndex, lastBraceIndex + 1);
        
        jsonString = jsonString.replace(/[\u0000-\u001F\u007F-\u009F\u00A0]/g, "");

        const parsedResult = JSON.parse(jsonString);
        console.log('Parsed JSON object successfully.');

        res.status(200).json(parsedResult);
        
    } catch (error) {
        console.error('Error in analyzeIdea:', {
            errorMessage: error.message,
            errorStack: error.stack,
            rawAIResponse: result ? result.content : 'AI response not received'
        });
        
        res.status(500).json({ 
            message: 'Failed to analyze idea. The AI may have returned a malformed response.',
            error: error.message 
        });
    }
};