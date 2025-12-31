'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { getGeminiResponse } from '../app/actions'; // Import the Server Action

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hello! I am the JobLink AI. How can I help?" }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    // --- CALL SERVER ACTION ---
    const response = await getGeminiResponse(userText);

    if (response.error) {
      setMessages(prev => [...prev, { role: 'model', text: "⚠️ " + response.error }]);
    } else {
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    }
    
    setIsLoading(false);
  };

  return (
    // ... (Keep your JSX exactly the same as before, no changes needed below this line) ...
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={floatBtnStyle}>
          <MessageCircle size={30} />
        </button>
      )}

      {isOpen && (
        <div style={chatWindowStyle}>
          {/* Header */}
          <div style={headerStyle}>
             <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
               <Bot size={20} /> <b>JobLink AI</b>
             </div>
             <button onClick={() => setIsOpen(false)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}><X /></button>
          </div>

          {/* Messages */}
          <div style={messageAreaStyle}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                ...msgBubbleStyle,
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? '#2563eb' : 'white',
                color: msg.role === 'user' ? 'white' : '#333',
              }}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div style={{color:'#666', fontSize:'0.8rem', marginLeft:'10px'}}>Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={inputAreaStyle}>
            <input 
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me..." style={inputStyle} 
            />
            <button onClick={handleSend} disabled={isLoading} style={sendBtnStyle}><Send size={18} /></button>
          </div>
        </div>
      )}
    </>
  );
}

// Simple Styles to save space
const floatBtnStyle = { position: 'fixed', bottom: '90px', right: '20px', width: '60px', height: '60px', borderRadius: '50%', background: '#2563eb', color: 'white', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 };
const chatWindowStyle = { position: 'fixed', bottom: '90px', right: '20px', width: '320px', height: '450px', background: '#f8fafc', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #ccc' };
const headerStyle = { background: '#2563eb', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between' };
const messageAreaStyle = { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' };
const msgBubbleStyle = { padding: '10px 14px', borderRadius: '12px', maxWidth: '80%', fontSize: '0.9rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };
const inputAreaStyle = { padding: '10px', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '8px' };
const inputStyle = { flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none' };
const sendBtnStyle = { background: '#2563eb', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
