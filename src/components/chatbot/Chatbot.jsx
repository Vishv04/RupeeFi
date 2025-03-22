/* eslint-disable no-confusing-arrow */
import { useEffect, useRef, useState } from 'react';
import { Button, Widget, Typography, Avatar, TextInput } from '@neo4j-ndl/react';
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
    <div className="n-bg-palette-neutral-bg-default flex flex-col justify-between min-h-screen max-h-full overflow-hidden">
      {/* Chat messages */}
      <div className="flex overflow-y-auto pb-12 min-w-full">
        <Widget className="n-bg-palette-neutral-bg-default w-full h-full" header="RupeeSpin Help Bot" isElevated={false}>
          <div className="flex flex-col gap-3 p-3">
            {listMessages.length === 0 && (
              <div className="flex gap-2.5 items-end">
                <Avatar
                  className="-ml-4"
                  hasStatus
                  name="RS"
                  shape="square"
                  size="x-large"
                  source={ChatBotAvatar}
                  status="online"
                  type="image"
                />
                <Widget className="p-4 self-start max-w-[55%] n-bg-palette-neutral-bg-weak">
                  <Typography variant="body-medium">
                    Hi! I'm the RupeeSpin Help Bot. Ask me about e-Rupee, payments, rewards, or merchant setup—try "How do I use RupeeSpin?"
                  </Typography>
                </Widget>
              </div>
            )}
            {listMessages.map((chat) => (
              <div
                key={chat.id}
                className={`flex gap-2.5 items-end ${chat.user === 'chatbot' ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="w-8 h-8">
                  {chat.user === 'chatbot' ? (
                    <Avatar
                      className="-ml-4"
                      hasStatus
                      name="RS"
                      shape="square"
                      size="x-large"
                      source={ChatBotAvatar}
                      status="online"
                      type="image"
                    />
                  ) : (
                    <Avatar
                      className=""
                      hasStatus
                      name="User"
                      shape="square"
                      size="x-large"
                      source={ChatBotUserAvatar}
                      status="online"
                      type="image"
                    />
                  )}
                </div>
                <Widget
                  header=""
                  isElevated={true}
                  className={`p-4 self-start max-w-[55%] ${
                    chat.user === 'chatbot' ? 'n-bg-palette-neutral-bg-weak' : 'n-bg-palette-primary-bg-weak'
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
                    <Typography variant="body-small">{chat.datetime}</Typography>
                  </div>
                </Widget>
              </div>
            ))}
            {/* Typing indicator */}
            {isWaitingForResponse && (
              <div className="flex gap-2.5 items-end">
                <Avatar
                  className="-ml-4"
                  hasStatus
                  name="RS"
                  shape="square"
                  size="x-large"
                  source={ChatBotAvatar}
                  status="online"
                  type="image"
                />
                <Widget className="p-4 self-start max-w-[55%] n-bg-palette-neutral-bg-weak">
                  <Typography variant="body-medium">RupeeSpin Bot is typing...</Typography>
                </Widget>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Widget>
      </div>

      {/* Input form */}
      <div className="n-bg-palette-neutral-bg-default flex gap-2.5 bottom-0 p-2.5 w-full">
        <form onSubmit={handleSubmit} className="flex gap-2.5 w-full">
          <TextInput
            className="n-bg-palette-neutral-bg-default flex-grow-7 w-full"
            type="text"
            value={inputMessage}
            fluid
            placeholder="Ask about e-Rupee or RupeeSpin..."
            onChange={handleInputChange}
          />
          <Button type="submit" disabled={isWaitingForResponse}>
            Send
          </Button>
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