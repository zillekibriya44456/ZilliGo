import { useState } from 'react';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';
import './SupportWidget.css';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi there! I am the ZilliGO Support Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: 'Thanks for your message. A human support agent will connect with you shortly. If this is an emergency during a live tour, please use the amber Shield button in the Live Room.' };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className={`support-widget ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="support-fab" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} />
          <span className="support-badge">1</span>
        </button>
      )}

      {isOpen && (
        <div className="support-window glass-card">
          <div className="support-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="support-avatar"><Bot size={18} /></div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>24/7 Live Support</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)' }}>● Online</span>
              </div>
            </div>
            <button className="support-close" onClick={() => setIsOpen(false)}><X size={18} /></button>
          </div>

          <div className="support-body">
            {messages.map(m => (
              <div key={m.id} className={`support-msg ${m.sender}`}>
                <div className="support-msg-bubble">{m.text}</div>
              </div>
            ))}
          </div>

          <form className="support-input" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Type your question..." 
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" disabled={!input.trim()}><Send size={16} /></button>
          </form>
        </div>
      )}
    </div>
  );
}
