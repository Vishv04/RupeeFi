import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API);

// Context for the AI to understand its role
const SYSTEM_CONTEXT = `You are RupeeSpin's customer service AI assistant. You help users understand:
- e-Rupee digital currency and its benefits
- How to use RupeeSpin for payments
- Rewards system including spin wheel and scratch cards
- Merchant onboarding and benefits
- Security features and offline usage

Keep responses concise, friendly, and focused on RupeeSpin and e-Rupee. Always maintain a helpful and professional tone.`;

export async function getGeminiResponse(userMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: "What is your role?",
        },
        {
          role: "model",
          parts: SYSTEM_CONTEXT,
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
  }
} 