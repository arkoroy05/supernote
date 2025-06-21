import { chatModel } from '../services/aiService.js';
import { PromptTemplate } from "@langchain/core/prompts";



const ideaAnalysisTemplate = `You are an expert startup and product analyst with deep industry experience. A user has submitted the following project idea: \"{idea}\".\n\nYour job is to provide:\n\n1. *A Critical Analysis: Evaluate this idea thoroughly. Be brutally realistic. If the idea is fundamentally flawed, say so. Do not assume the idea is good by default. Consider:\n  - Market demand: Is this something people or businesses genuinely need?\n  - Legal, ethical, or social issues: Could this idea raise red flags?\n  - Technical or business feasibility: Can this realistically be built, scaled, and monetized?\n  - Competitors: Does this idea already exist? Is it just a clone?\nAvoid sugarcoating. If the idea is impractical, call it out. Be blunt but helpful.\n\n2. **5 Creative Variations*: Generate five significantly different takes on the core idea. Don't just tweak the same thing slightly. Each variation should:\n  - Offer a distinct use case, target audience, or delivery method.\n  - Add unique or imaginative features.\n  - Explore unusual or unconventional implementations.\nAvoid repetitive suggestions or generic pivots.\n\nRespond ONLY as a valid JSON object with the following keys:\n- 'analysis': a string containing the critical analysis.\n- 'variations': an array of 5 strings, each representing a unique, creative variation on the original idea.`;

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