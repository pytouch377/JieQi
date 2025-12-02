import { GoogleGenAI, Type } from "@google/genai";
import { GeminiInsightData, SolarTerm } from "../types";

const apiKey = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateTermInsight = async (term: SolarTerm): Promise<GeminiInsightData> => {
  if (!ai) {
    // Return mock data if no API key is present to prevent crash
    return {
      poem: "请输入 API Key 以生成诗词。",
      advice: "请输入 API Key 以获取养生建议。",
      food: "暂无数据"
    };
  }

  const prompt = `
    你是一位精通中国传统文化、二十四节气和中医养生的专家。
    用户正在查询节气：${term.name}。
    
    请提供以下内容（全部使用中文）：
    1. 一首关于这个节气的简短诗词（五言或七言绝句，或者优美的短句），富有文学意境。
    2. 针对现代生活节奏的“养生”建议，切实可行。
    3. 这个节气推荐食用的一到两种时令食材或菜肴。
    
    保持语气平和、智慧且富有美感。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            poem: { type: Type.STRING },
            advice: { type: Type.STRING },
            food: { type: Type.STRING }
          },
          required: ['poem', 'advice', 'food']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeminiInsightData;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      poem: "春有百花秋有月，\n夏有凉风冬有雪。\n若无闲事挂心头，\n便是人间好时节。",
      advice: "顺应天时，早睡早起，保持心情舒畅。",
      food: "时令蔬菜与清茶。"
    };
  }
};