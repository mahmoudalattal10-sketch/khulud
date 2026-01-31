
import { GoogleGenAI } from "@google/genai";

// Cache to prevent redundant API calls
const insightCache: Record<string, string> = {};

// Semaphore to limit concurrent requests
let isProcessing = false;

/**
 * Utility for exponential backoff retries
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  initialDelay: number = 3000
): Promise<T> {
  let delay = initialDelay;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRateLimit = error?.message?.includes('429') || error?.status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED');

      if (i === maxRetries || !isRateLimit) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 1000));
      delay *= 2;
    }
  }
  throw new Error("Max retries exceeded");
}

export const getSmartHotelInsight = async (hotelName: string, location: string): Promise<string> => {
  const cacheKey = `${hotelName}-${location}`;

  if (insightCache[cacheKey]) return insightCache[cacheKey];

  // Wait if another request is in progress to avoid 429
  while (isProcessing) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  try {
    isProcessing = true;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const result = await retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `لماذا يجب حجز ${hotelName} في ${location}؟ جملة واحدة فخمة وقصيرة (10 كلمات).`,
        config: {
          temperature: 0.6,
        }
      });
      return response.text;
    });

    const insight = result?.trim() || "اكتشف الرفاهية بأسلوب ضيافة خلود.";
    insightCache[cacheKey] = insight;
    return insight;

  } catch (error: any) {
    console.warn("Gemini Service: Handled quota or network error gracefully.");
    return "تجربة فريدة تنتظرك في قلب مكة والمدينة.";
  } finally {
    isProcessing = false;
  }
};

export const generateTripDescription = async (destination: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك خبير تسويق سياحي، اكتب وصفاً جذاباً ومختصراً (حوالي 3 جمل) لرحلة سياحية إلى ${destination}. ركز على الجمال والمعالم والأنشطة المتاحة باللغة العربية.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating description:", error);
    return "عذراً، حدث خطأ أثناء توليد الوصف الذكي.";
  }
};

export const analyzeMarketTrends = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "حلل اتجاهات السياحة العالمية الحالية لعام 2024 و2025 باختصار شديد في نقاط (باللغة العربية).",
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing trends:", error);
    return "لا يمكن الوصول للتحليلات الحالية.";
  }
};
