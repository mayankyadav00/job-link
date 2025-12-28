'use client';
import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial History: System Prompt + Welcome Message
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: "Namaste! 🙏 I am the JobLink Assistant. I can help you find jobs, write descriptions, or use the app. Ask me anything!" 
    }
  ]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput(''); // Clear input
    setIsLoading(true);

    // 1. Add User Message to UI
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      // 2. Initialize Gemini
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // 3. Construct the prompt with "Context"
      // We give it a persona so it behaves correctly.
      const prompt = `
        You are a helpful AI support assistant for an app called "JobLink" based in Patna, India. 
        JobLink connects blue-collar workers (Seekers) with Job Providers.
        
        Rules:
        - Keep answers short, encouraging, and simple (easy English).
        - If asked about jobs, tell them to check the "Search" tab.
        - If asked about posting, tell them to go to "Post Job".
        - Be polite and use emojis occasionally.
        
        User said: ${userMessage}
      `;

      // 4. Get Response
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // 5. Add AI Message to UI
      setMessages(prev => [...prev, { role: 'model', text: text }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I am having trouble connecting right now. Please check your internet or API Key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. FLOATING BUTTON (Always Visible) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '90px', right: '20px',
            width: '60px', height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
            cursor: 'pointer',
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <MessageCircle size={30} />
        </button>
      )}

      {/* 2. CHAT WINDOW (Overlay) */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '20px',
          width: '350px', height: '500px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          animation: 'slideUp 0.3s ease-out'
        }}>
          
          {/* HEADER */}
          <div style={{ background: '#2563eb', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'white', padding: '5px', borderRadius: '50%' }}>
                <Bot size={20} color="#2563eb" />
              </div>
              <span style={{ fontWeight: 'bold' }}>JobLink AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
          </div>

          {/* MESSAGES AREA */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}>
                <div style={{ 
                  padding: '12px 16px', 
                  borderRadius: '16px',
                  borderTopRightRadius: msg.role === 'user' ? '0' : '16px',
                  borderTopLeftRadius: msg.role === 'model' ? '0' : '16px',
                  background: msg.role === 'user' ? '#2563eb' : 'white',
                  color: msg.role === 'user' ? 'white' : '#334155',
                  boxShadow: msg.role === 'model' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                  fontSize: '0.95rem',
                  lineHeight: '1.4'
                }}>
                  {msg.text}
                </div>
                {msg.role === 'model' && <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: '5px' }}>AI Assistant</span>}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'white', padding: '10px 15px', borderRadius: '16px', color: '#666', fontSize: '0.9rem' }}>
                typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div style={{ padding: '15px', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for help..." 
              style={{ flex: 1, padding: '10px 15px', borderRadius: '25px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#2563eb', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: isLoading ? 0.7 : 1 }}
            >
              <Send size={20} />
            </button>
          </div>
          
          <style jsx>{`
            @keyframes slideUp {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
