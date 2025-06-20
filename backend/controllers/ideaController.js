import { chatModel } from '../services/aiService.js';
import { PromptTemplate } from "@langchain/core/prompts";



const ideaAnalysisTemplate = `
You are an expert project analyst. Analyze the project idea: "{idea}".
First, provide a critical analysis. Then, generate 5 creative variations.
Return ONLY a valid JSON object with keys "analysis" (string) and "variations" (array of strings).
`;

export const analyzeIdea = async (req, res) => {
  const { idea } = req.body;
  if (!idea) {
    return res.status(400).json({ message: 'Idea text is required.' });
  }

  try {
    const prompt = await PromptTemplate.fromTemplate(ideaAnalysisTemplate).format({ idea });


    const result = await chatModel.invoke(prompt);
    
    
    const jsonResponse = result.content.replace(/```json\n|\n```/g, '').trim();
    const parsedResult = JSON.parse(jsonResponse);

    res.status(200).json(parsedResult);
  } catch (error) {
    res.status(500).json({ message: 'Failed to analyze idea.' });
  }
};