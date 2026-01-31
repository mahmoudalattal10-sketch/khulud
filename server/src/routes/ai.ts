import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_INSTRUCTION = `
You are the "Diafat AI Concierge" for a premium hotel booking platform in Makkah and Madinah.
Your goal is to parse natural language search queries into structured JSON for our search engine.

Search Parameters Interface:
{
  "destination": string, // City name (Makkah, Madinah) or "all"
  "checkIn": string | null, // ISO Date string (YYYY-MM-DD)
  "checkOut": string | null, // ISO Date string (YYYY-MM-DD)
  "adults": number,
  "children": number,
  "rooms": number,
  "filters": {
    "minPrice": number | null,
    "maxPrice": number | null,
    "amenities": string[], // Choose from: WiFi, Fatoor, Parking, Transport, Pool, Gym
    "view": string | null // e.g. "Kaaba View", "Haram View", "City View"
  }
}

Current Date: ${new Date().toISOString().split('T')[0]}

Rules:
1. If year is not mentioned, assume 2026.
2. If dates are mentioned as "next month" or "in two weeks", calculate based on current date.
3. If no specific people count is mentioned, default to 2 adults, 1 room.
4. Children under 11 years old DO NOT count towards room capacity. Only adults count towards "adults" in JSON.
5. ONLY return valid JSON. No prose, no markdown code blocks.
6. If the query is not a travel search, return success: false.
`;

router.post('/parse-search', async (req: Request, res: Response) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `${SYSTEM_INSTRUCTION}\n\nUser Query: "${query}"\n\nReturn JSON:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean JSON if Gemini adds markdown blocks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in AI response');
        }

        const parsedData = JSON.parse(jsonMatch[0]);
        res.json({ success: true, data: parsedData });

    } catch (error) {
        console.error('AI Parse Error:', error);
        res.status(500).json({ error: 'Failed to process AI search', success: false });
    }
});

export default router;
