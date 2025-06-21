import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { idea } = body;

    if (!idea) {
      return NextResponse.json(
        { error: 'Missing required field: idea' },
        { status: 400 }
      );
    }

    // Generate a more personalized summary based on the idea
    const keywords = idea.toLowerCase().split(' ');
    let marketFocus = 'consumers';
    let industryFocus = 'technology';
    let innovationLevel = 'innovative';
    
    // Simple keyword detection to personalize the response
    if (keywords.some(word => ['enterprise', 'business', 'corporate', 'company'].includes(word))) {
      marketFocus = 'businesses';
    }
    
    if (keywords.some(word => ['health', 'medical', 'wellness', 'fitness'].includes(word))) {
      industryFocus = 'healthcare';
    } else if (keywords.some(word => ['finance', 'money', 'banking', 'invest'].includes(word))) {
      industryFocus = 'financial services';
    } else if (keywords.some(word => ['education', 'learning', 'teach', 'student'].includes(word))) {
      industryFocus = 'education';
    }
    
    if (keywords.some(word => ['revolutionary', 'breakthrough', 'disruptive'].includes(word))) {
      innovationLevel = 'potentially disruptive';
    }

    // Generate variations based on the idea
    const variations = [
      `${idea} with a focus on sustainability and environmental impact`,
      `${idea} targeting ${marketFocus === 'consumers' ? 'enterprise customers' : 'consumer markets'} with enhanced features`,
      `${idea} as a subscription service with tiered pricing model`,
      `${idea} with AI-powered personalization for each user`,
      `${idea} as a mobile-first platform with offline capabilities`
    ];

    // Generate a more detailed analysis response
    const analysisResult = {
      success: true,
      idea: idea,
      analysis: {
        title: "Strategic Analysis",
        summary: `Your idea "${idea}" has significant potential in today's ${industryFocus} market. The concept is ${innovationLevel} and addresses several key pain points for ${marketFocus}.\n\nBased on initial assessment, we recommend focusing on a clear value proposition and identifying your core user demographic. Market research suggests similar solutions exist, but your unique approach could differentiate you from competitors.`,
        keyPoints: [
          `Market opportunity identified in the ${industryFocus} space`,
          `Potential for scalable business model targeting ${marketFocus}`,
          "Consider technical feasibility and development timeline",
          "Early user adoption will be critical for success"
        ],
        score: Math.floor(Math.random() * 15) + 75, // Random score between 75-90
        nextSteps: [
          "Refine your core value proposition",
          `Identify target ${marketFocus} segments`,
          "Research competitors and market landscape",
          "Develop a minimum viable product roadmap"
        ],
        variations: variations
      }
    };

    console.log("Sending analysis result:", analysisResult);
    // Return the analysis result
    return NextResponse.json(analysisResult);
    
  } catch (error) {
    console.error('Error analyzing idea:', error);
    return NextResponse.json(
      { error: 'Failed to analyze idea' },
      { status: 500 }
    );
  }
} 