import { useState } from 'react';
import { Globe, Shield, Star, Award, CheckCircle } from 'lucide-react';

export default function DigitalPassport() {
  const [stamps] = useState([
    { id: 1, country: 'Japan', name: 'Sakura Festival', icon: '🌸', date: '2023-04-05', rarity: 'rare' },
    { id: 2, country: 'Italy', name: 'Roman Heritage', icon: '🏛️', date: '2023-06-12', rarity: 'common' },
    { id: 3, country: 'India', name: 'Diwali Lights', icon: '🪔', date: '2023-11-01', rarity: 'epic' },
    { id: 4, country: 'Brazil', name: 'Samba Dance', icon: '💃', date: '2024-02-15', rarity: 'common' }
  ]);

  return (
    <div className="container" style={{ padding: '6rem 0', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Digital Cultural Passport</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '1rem auto' }}>Your personal ledger of global exploration. Collect stamps by attending live events and voting in the Culture Olympics.</p>
      </div>

      <div style={{ 
        background: 'rgba(20, 20, 25, 0.8)', 
        border: '1px solid rgba(212, 175, 55, 0.3)', 
        borderRadius: '32px', 
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 0 40px rgba(212, 175, 55, 0.05)',
        backdropFilter: 'blur(20px)'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>Passport Holder</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '4px' }}>Alex Traveler</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>Stamps Collected</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#D4AF37' }}>{stamps.length}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
          {stamps.map(stamp => (
            <div key={stamp.id} style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: `1px solid ${stamp.rarity === 'epic' ? '#b794f6' : stamp.rarity === 'rare' ? '#63b3ed' : 'rgba(255,255,255,0.1)'}`, 
              borderRadius: '50%',
              aspectRatio: '1/1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{stamp.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{stamp.country}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stamp.name}</div>
              <div style={{ fontSize: '0.65rem', marginTop: '8px', color: 'rgba(255,255,255,0.4)' }}>{stamp.date}</div>
              
              <div style={{ position: 'absolute', top: '10px', right: '10px', color: stamp.rarity === 'epic' ? '#b794f6' : 'transparent' }}>
                {stamp.rarity === 'epic' && <Star fill="#b794f6" size={16} />}
              </div>
            </div>
          ))}

          {/* Empty slot */}
          <div style={{ 
            border: '2px dashed rgba(255,255,255,0.1)', 
            borderRadius: '50%',
            aspectRatio: '1/1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.2)'
          }}>
            <span>+ New Stamp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
