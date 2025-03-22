import { GoogleGenerativeAI } from "@google/generative-ai";

// Load API key from Vite environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model:"gemini-2.0-flash", 
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
});

const SYSTEM_CONTEXT = `You are RupeeSpin's customer service AI assistant. You help users understand:
- e-Rupee digital currency and its benefits
- How to use RupeeSpin for payments
- Rewards system including spin wheel and scratch cards
- Merchant onboarding and benefits
- Security features and offline usage

Keep responses concise, friendly, and focused on RupeeSpin and e-Rupee. Always maintain a helpful and professional tone.`;

export async function getGeminiResponse(userMessage) {
  try {
    if (!API_KEY) {
      throw new Error("API key not configured");
    }

    const prompt = `${SYSTEM_CONTEXT}\n\nUser: ${userMessage}\nAssistant:`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return responseText.replace(/^Assistant:\s*/, '').trim();
  } catch (error) {
    console.error("Gemini API Error:", error);

    if (error.message.includes("API key not configured")) {
      return "I apologize, but the chatbot is not properly configured. Please contact support.";
    }

    if (error.status === 401 || error.message.includes("API key")) {
      return "I apologize, but there seems to be an authentication issue. Please check your API key.";
    }

    if (error.status === 429) {
      return "I apologize, but we've reached our API limit. Please try again later.";
    }

    if (error.message.includes("network") || error.name === "NetworkError") {
      return "I apologize, but I'm having trouble connecting to the network. Please check your internet connection.";
    }

    return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
  }
}