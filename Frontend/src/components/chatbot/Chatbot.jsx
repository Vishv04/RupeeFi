/* eslint-disable no-confusing-arrow */
import { useEffect, useRef, useState } from 'react';
// Remove neo4j-ndl components import
// import { Button, Widget, Typography, Avatar, TextInput } from '@neo4j-ndl/react';
import PropTypes from 'prop-types';

import ChatBotUserAvatar from '../assets/chatbot-user.png';
import ChatBotAvatar from '../assets/chatbot-ai.png';

// Predefined help responses for e-Rupee and RupeeSpin
const helpResponses = {
    "what is e-rupee": "The e-Rupee is India's digital currency, launched by the RBI. It's like cash but digital, secure, and runs on blockchain. With RupeeSpin, you can use it easily!",
    "how do i use rupeespin": "Sign up, link your UPI or bank account, and start paying with e-Rupee via QR codes. Spin the wheel after each payment for rewards!",
    "how do i pay with e-rupee": "Scan a merchant's UPI QR code in RupeeSpin, choose e-Rupee, and pay. It's fast and earns you spins!",
    "what rewards do i get": "Every e-Rupee payment lets you spin the wheel for cashback (₹5-₹50), vouchers, or bonuses. Merchants earn medals and fee cuts!",
    "how do merchants join": "Merchants link their UPI QR in RupeeSpin's dashboard. They accept e-Rupee, earn medals, and save on fees—super simple!",
    "is it safe": "Yes! RupeeSpin uses fingerprint login and a Privacy Shield—only the RBI sees your data. It's RBI-approved and secure.",
    "can i use it offline": "Yes, send \"PAY 100\" via SMS in RupeeSpin's offline mode. It syncs when you're back online—great for rural areas!",
    "why use e-rupee": "It's fast, secure, and rewarding! Plus, you support India's digital economy and save paper cash.",
    "help": "I'm here to assist! Ask about e-Rupee, payments, rewards, or merchant setup—try \"how do I use RupeeSpin?\"",
    "default": "Hmm, I'm not sure about that. Try asking about e-Rupee, rewards, or how merchants join RupeeSpin!"
  };

export default function Chatbot(props) {
  const { messages } = props;

  // State management
  const [listMessages, setListMessages] = useState(messages);
  const [inputMessage, setInputMessage] = useState('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  // Style for formatted text (e.g., code within backticks)
  const formattedTextStyle = { color: 'rgb(var(--theme-palette-discovery-bg-strong))' };

  // Ref for scrolling to the bottom of the chat
  const messagesEndRef = useRef(null);

  // Handle input change
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

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
          { id: Date.now(), user: 'chatbot', message: currentTypedText, datetime, isTyping: true },
        ]);
      } else {
        setListMessages((msgs) =>
          msgs.map((msg) => (msg.isTyping ? { ...msg, message: currentTypedText } : msg))
        );
      }

      setTimeout(() => simulateTypingEffect(responseText, nextIndex), 20);
    } else {
      setListMessages((msgs) => msgs.map((msg) => (msg.isTyping ? { ...msg, isTyping: false } : msg)));
    }
  };

  // Handle form submission and provide help response
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isWaitingForResponse) {
      return;
    }

    const date = new Date();
    const datetime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const userMessage = { id: Date.now(), user: 'user', message: inputMessage, datetime };

    // Add user message to the list and clear input
    setListMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsWaitingForResponse(true);

    // Simulate API delay and get predefined response
    setTimeout(() => {
      const query = inputMessage.toLowerCase().trim();
      const response = helpResponses[query] || helpResponses['default'];
      setIsWaitingForResponse(false);
      simulateTypingEffect(response);
    }, 1000); // 1-second delay to mimic processing
  };

  // Scroll to the bottom when messages or waiting state changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [listMessages, isWaitingForResponse]);

  return (
    <div className="bg-white flex flex-col justify-between min-h-screen max-h-full overflow-hidden">
      {/* Chat messages */}
      <div className="flex overflow-y-auto pb-12 min-w-full">
        <div className="bg-white w-full h-full shadow-md rounded-lg">
          <div className="p-3 border-b border-gray-200 font-medium">RupeeSpin Help Bot</div>
          <div className="flex flex-col gap-3 p-3">
            {listMessages.length === 0 && (
              <div className="flex gap-2.5 items-end">
                <div className="-ml-4 relative">
                  <img 
                    src={ChatBotAvatar} 
                    alt="Chatbot" 
                    className="w-10 h-10 rounded-md"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="p-4 self-start max-w-[55%] bg-gray-100 rounded-lg">
                  <p className="text-base font-medium">
                    Hi! I'm the RupeeSpin Help Bot. Ask me about e-Rupee, payments, rewards, or merchant setup—try "How do I use RupeeSpin?"
                  </p>
                </div>
              </div>
            )}
            {listMessages.map((chat) => (
              <div
                key={chat.id}
                className={`flex gap-2.5 items-end ${chat.user === 'chatbot' ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="w-8 h-8 relative">
                  {chat.user === 'chatbot' ? (
                    <div className="-ml-4 relative">
                      <img 
                        src={ChatBotAvatar} 
                        alt="Chatbot" 
                        className="w-10 h-10 rounded-md"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={ChatBotUserAvatar} 
                        alt="User" 
                        className="w-10 h-10 rounded-md"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div
                  className={`p-4 self-start max-w-[55%] rounded-lg shadow-sm ${
                    chat.user === 'chatbot' ? 'bg-gray-100' : 'bg-blue-100'
                  }`}
                >
                  <div>
                    {chat.message.split(/`(.+?)`/).map((part, index) =>
                      index % 2 === 1 ? (
                        <span key={index} style={formattedTextStyle}>
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    )}
                  </div>
                  <div className="text-right align-bottom pt-3">
                    <p className="text-xs text-gray-500">{chat.datetime}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Typing indicator */}
            {isWaitingForResponse && (
              <div className="flex gap-2.5 items-end">
                <div className="-ml-4 relative">
                  <img 
                    src={ChatBotAvatar} 
                    alt="Chatbot" 
                    className="w-10 h-10 rounded-md"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="p-4 self-start max-w-[55%] bg-gray-100 rounded-lg">
                  <p className="text-base font-medium">RupeeSpin Bot is typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input form */}
      <div className="bg-white flex gap-2.5 bottom-0 p-2.5 w-full border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2.5 w-full">
          <input
            className="bg-white flex-grow-7 w-full border border-gray-300 rounded-md px-3 py-2"
            type="text"
            value={inputMessage}
            placeholder="Ask about e-Rupee or RupeeSpin..."
            onChange={handleInputChange}
          />
          <button 
            type="submit" 
            disabled={isWaitingForResponse}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

// Add PropTypes validation
Chatbot.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      datetime: PropTypes.string.isRequired,
      isTyping: PropTypes.bool,
    })
  ).isRequired,
};