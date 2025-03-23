import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { getGeminiResponse } from "../../services/geminiService";
import ChatBotUserAvatar from "../../assets/chatbot-user.png";
import ChatBotAvatar from "../../assets/chatbot-ai.png";

// Predefined help responses for e-Rupee and RupeeFi
const helpResponses = {
  "what is e-rupee":
    "The e-Rupee is India's digital currency, launched by the RBI. It's like cash but digital, secure, and runs on blockchain. With RupeeFi, you can use it easily!",
  "how do i use RupeeFi":
    "Sign up, link your UPI or bank account, and start paying with e-Rupee via QR codes. Spin the wheel after each payment for rewards!",
  "how do i pay with e-rupee":
    "Scan a merchant's UPI QR code in RupeeFi, choose e-Rupee, and pay. It's fast and earns you spins!",
  "what rewards do i get":
    "Every e-Rupee payment lets you spin the wheel for cashback (₹5-₹50), vouchers, or bonuses. Merchants earn medals and fee cuts!",
  "how do merchants join":
    "Merchants link their UPI QR in RupeeFi's dashboard. They accept e-Rupee, earn medals, and save on fees—super simple!",
  "is it safe":
    "Yes! RupeeFi uses fingerprint login and a Privacy Shield—only the RBI sees your data. It's RBI-approved and secure.",
  "can i use it offline":
    "Yes, send \"PAY 100\" via SMS in RupeeFi's offline mode. It syncs when you're back online—great for rural areas!",
  "why use e-rupee":
    "It's fast, secure, and rewarding! Plus, you support India's digital economy and save paper cash.",
  help: 'I\'m here to assist! Ask about e-Rupee, payments, rewards, or merchant setup—try "how do I use RupeeFi?"',
  default:
    "Hmm, I'm not sure about that. Try asking about e-Rupee, rewards, or how merchants join RupeeFi!",
};

export default function Chatbot({ messages = [], onClose }) {
  const [listMessages, setListMessages] = useState(messages);
  const [inputMessage, setInputMessage] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const messagesEndRef = useRef(null);

  // Simulate typing effect for chatbot responses
  const simulateTypingEffect = (responseText, index = 0) => {
    if (index < responseText.length) {
      const nextIndex = index + 1;
      const currentTypedText = responseText.substring(0, nextIndex);

      if (index === 0) {
        const date = new Date();
        const datetime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        setListMessages((msgs) => [
          ...msgs,
          {
            id: Date.now(),
            user: "chatbot",
            message: currentTypedText,
            datetime,
            isTyping: true,
          },
        ]);
      } else {
        setListMessages((msgs) =>
          msgs.map((msg) =>
            msg.isTyping ? { ...msg, message: currentTypedText } : msg
          )
        );
      }

      setTimeout(() => simulateTypingEffect(responseText, nextIndex), 20);
    } else {
      setListMessages((msgs) =>
        msgs.map((msg) => (msg.isTyping ? { ...msg, isTyping: false } : msg))
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isWaitingForResponse) return;

    const date = new Date();
    const datetime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const userMessage = {
      id: Date.now(),
      user: "user",
      message: inputMessage,
      datetime,
    };

    setListMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
    setIsWaitingForResponse(true);

    try {
      const response = await getGeminiResponse(inputMessage);
      simulateTypingEffect(response);
    } catch (error) {
      console.error("Error getting response:", error);
      simulateTypingEffect(
        "I apologize, but I'm having trouble right now. Please try again later."
      );
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [listMessages, isWaitingForResponse]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white shadow-sm p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          RupeeFi Help Bot
        </h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome Message */}
        {listMessages.length === 0 && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 relative">
              <img
                src={ChatBotAvatar}
                alt="Bot"
                className="w-10 h-10 rounded-full"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm max-w-[80%]">
              <p className="text-gray-800">
                Hi! I'm the RupeeFi Help Bot. Ask me about e-Rupee, payments,
                rewards, or merchant setup—try "How do I use RupeeFi?"
              </p>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {listMessages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.user === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-shrink-0 relative">
              <img
                src={
                  message.user === "user" ? ChatBotUserAvatar : ChatBotAvatar
                }
                alt={message.user === "user" ? "User" : "Bot"}
                className="w-10 h-10 rounded-full"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div
              className={`p-4 rounded-lg shadow-sm max-w-[80%] ${
                message.user === "user" ? "bg-blue-50" : "bg-white"
              }`}
            >
              <p className="text-gray-800 whitespace-pre-wrap">
                {message.message}
              </p>
              <p className="text-xs text-gray-500 mt-2">{message.datetime}</p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isWaitingForResponse && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 relative">
              <img
                src={ChatBotAvatar}
                alt="Bot"
                className="w-10 h-10 rounded-full"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about e-Rupee or RupeeFi..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isWaitingForResponse}
          />
          <button
            type="submit"
            disabled={isWaitingForResponse}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

Chatbot.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      datetime: PropTypes.string.isRequired,
      isTyping: PropTypes.bool,
    })
  ),
  onClose: PropTypes.func,
};
