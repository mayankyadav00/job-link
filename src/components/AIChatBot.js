'use client';
import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: "Namaste! 🙏 I am the JobLink Assistant. Ask me anything!" 
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key is missing in Vercel/Env settings.");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      
      // FIX: Switched to 'gemini-pro' for better compatibility with your SDK version
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `You are a helpful assistant for JobLink. Keep answers short. User said: ${userMessage}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'model', text: text }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: `⚠️ Error: ${error.message || "Connection failed"}. Please check your API key.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '90px', right: '20px',
            width: '60px', height: '60px', borderRadius: '50%',
            background: '#2563eb', color: 'white', border: 'none',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)', cursor: 'pointer', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <MessageCircle size={30} />
        </button>
      )}

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '20px',
          width: '350px', height: '500px', background: 'white',
          borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          zIndex: 9999, display: 'flex', flexDirection: 'column',
          overflow: 'hidden', border: '1px solid #e2e8f0'
        }}>
          <div style={{ background: '#2563eb', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot size={20} /> <span style={{ fontWeight: 'bold' }}>JobLink AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
          </div>

          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%', padding: '12px 16px', borderRadius: '16px',
                background: msg.role === 'user' ? '#2563eb' : 'white',
                color: msg.role === 'user' ? 'white' : '#334155',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
              }}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: '#eee', padding: '8px 12px', borderRadius: '12px', fontSize: '0.8rem', color: '#666' }}>
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '15px', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
            <input 
              type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for help..." 
              style={{ flex: 1, padding: '10px 15px', borderRadius: '25px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
            <button onClick={handleSend} disabled={isLoading} style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#2563eb', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
