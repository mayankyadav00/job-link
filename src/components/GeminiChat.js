// src/components/GeminiChat.js
'use client'; // This component uses state (interactive)
import { useState } from 'react';

export function GeminiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your Job Assistant. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');

  // Function to handle sending a message
  const handleSend = () => {
    if (!inputText.trim()) return;

    // 1. Add User Message
    const newMessages = [...messages, { role: 'user', text: inputText }];
    setMessages(newMessages);
    setInputText('');

    // 2. Simulate Bot Response (Fake delay)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: "I'm just a demo right now, but soon I'll use the Gemini API to answer that!" }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* 1. The Floating Button */}
      <button 
        className="chat-widget-btn" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <span style={{ fontSize: '24px', color: 'white' }}>✕</span> // Close Icon
        ) : (
          <span style={{ fontSize: '24px' }}>✨</span> // Sparkle Icon
        )}
      </button>

      {/* 2. The Chat Window (Only shows if isOpen is true) */}
      {isOpen && (
        <div className="chat-window">
          
          {/* Header */}
          <div className="chat-header">
            <span>Gemini Assistant</span>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>

          {/* Messages List */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.role === 'user' ? 'message-user' : 'message-bot'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <input 
              type="text" 
              className="chat-input"
              placeholder="Ask anything..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="chat-send-btn" onClick={handleSend}>➤</button>
          </div>

        </div>
      )}
    </>
  );
}