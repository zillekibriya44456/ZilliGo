import { useState, useEffect } from 'react';
import { Info, Sparkles, X } from 'lucide-react';

// This is a simulated AI Explainer component that would listen to a WebRTC audio transcription stream.
// When specific cultural terms are detected in the transcript, it fetches context from an LLM and displays it.

export default function AILiveExplainer({ currentTranscript = "" }) {
  const [activeExplanation, setActiveExplanation] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mock dictionary of AI-generated cultural context. 
  // In production, this would call `POST /api/ai/explain` passing the term.
  const CULTURAL_KNOWLEDGE_BASE = {
    'sakura': {
      title: 'Sakura (Cherry Blossom)',
      text: 'Sakura represents the fragile beauty of life in Japanese culture. The blooming season is celebrated with Hanami (flower viewing) parties.',
      image: '🌸'
    },
    'diwali': {
      title: 'Diwali',
      text: 'Known as the Festival of Lights, Diwali symbolizes the spiritual victory of light over darkness, good over evil, and knowledge over ignorance in India.',
      image: '🪔'
    },
    'samba': {
      title: 'Samba',
      text: 'A Brazilian music genre and dance style with its roots in Africa via the West African slave trade and African religious traditions.',
      image: '💃'
    }
  };

  useEffect(() => {
    if (!currentTranscript) return;

    const lowerTranscript = currentTranscript.toLowerCase();
    
    // Simulate natural language processing keyword detection
    for (const [term, data] of Object.entries(CULTURAL_KNOWLEDGE_BASE)) {
      if (lowerTranscript.includes(term) && activeExplanation?.title !== data.title) {
        setActiveExplanation(data);
        setIsVisible(true);
        
        // Auto-hide after 10 seconds
        const timer = setTimeout(() => setIsVisible(false), 10000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentTranscript]);

  if (!activeExplanation) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '80px', // Right above video controls
      right: '20px',
      maxWidth: '300px',
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 212, 170, 0.4)',
      borderRadius: '16px',
      padding: '16px',
      color: '#fff',
      transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      pointerEvents: isVisible ? 'auto' : 'none',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(0, 212, 170, 0.1)',
      zIndex: 100
    }}>
      <div style={{ position: 'absolute', top: -12, left: -12, background: 'var(--accent-teal)', color: '#000', borderRadius: '50%', padding: '6px' }}>
        <Sparkles size={16} />
      </div>
      
      <button 
        onClick={() => setIsVisible(false)}
        style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
      >
        <X size={14} />
      </button>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '2rem' }}>{activeExplanation.image}</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-teal)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>AI Context</span>
            <Info size={12} style={{ color: 'var(--accent-teal)' }} />
          </div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem' }}>{activeExplanation.title}</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {activeExplanation.text}
          </p>
        </div>
      </div>
    </div>
  );
}
