import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface FeedbackAnalysis {
  aiCategory: 'PAYMENT' | 'PRODUCT' | 'WEBSITE' | 'DELIVERY';
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  aiSummary: string;
  urgencyScore: number;
}

export async function analyzeFeedback(rawComment: string): Promise<FeedbackAnalysis> {
  // Try gemini-1.5-flash-latest which is more widely available
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Act as a CRM Intelligence Agent for Follicia Hair Care. Analyze the following feedback: '${rawComment}'.

You must output a JSON object matching these specific schema requirements:
- aiCategory: Must be exactly one of: PAYMENT, PRODUCT, WEBSITE, or DELIVERY.
- sentiment: Must be exactly one of: POSITIVE, NEUTRAL, or NEGATIVE.
- aiSummary: A concise, 1-sentence executive summary.
- urgencyScore: An integer from 1-10. (Assign 9-10 for payment failures or delivery loss, 1-3 for general praise).

Return ONLY JSON: { "aiCategory": "...", "sentiment": "...", "aiSummary": "...", "urgencyScore": ... }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to extract JSON from Gemini response');
  }

  const analysis: FeedbackAnalysis = JSON.parse(jsonMatch[0]);

  // Validate the response
  if (!['PAYMENT', 'PRODUCT', 'WEBSITE', 'DELIVERY'].includes(analysis.aiCategory)) {
    throw new Error('Invalid aiCategory from Gemini');
  }
  if (!['POSITIVE', 'NEUTRAL', 'NEGATIVE'].includes(analysis.sentiment)) {
    throw new Error('Invalid sentiment from Gemini');
  }
  if (typeof analysis.urgencyScore !== 'number' || analysis.urgencyScore < 1 || analysis.urgencyScore > 10) {
    throw new Error('Invalid urgencyScore from Gemini');
  }

  return analysis;
}
