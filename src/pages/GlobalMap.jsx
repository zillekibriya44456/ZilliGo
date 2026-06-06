import { useState } from 'react';
import { Search, Globe, Users, Heart, MessageCircle, MapPin } from 'lucide-react';
import './GlobalMap.css';

const MAP_NODES = [
  { id: 1, name: 'Yuki', country: 'Japan', top: '35%', left: '85%', avatar: 'https://i.pravatar.cc/150?u=yuki', status: 'online', match: 96 },
  { id: 2, name: 'Mateo', country: 'Italy', top: '30%', left: '52%', avatar: 'https://i.pravatar.cc/150?u=mateo', status: 'offline', match: 88 },
  { id: 3, name: 'Priya', country: 'India', top: '45%', left: '70%', avatar: 'https://i.pravatar.cc/150?u=priya', status: 'online', match: 92 },
  { id: 4, name: 'Carlos', country: 'Brazil', top: '65%', left: '32%', avatar: 'https://i.pravatar.cc/150?u=carlos', status: 'online', match: 85 },
  { id: 5, name: 'Emma', country: 'UK', top: '25%', left: '48%', avatar: 'https://i.pravatar.cc/150?u=emma', status: 'offline', match: 81 },
  { id: 6, name: 'James', country: 'USA', top: '35%', left: '20%', avatar: 'https://i.pravatar.cc/150?u=james', status: 'online', match: 79 },
  { id: 7, name: 'Aisha', country: 'Egypt', top: '40%', left: '56%', avatar: 'https://i.pravatar.cc/150?u=aisha', status: 'online', match: 94 },
];

export default function GlobalMap() {
  const [activeNode, setActiveNode] = useState(null);
  const [filter, setFilter] = useState('all'); // all, online, high-match

  const visibleNodes = MAP_NODES.filter(node => {
    if (filter === 'online') return node.status === 'online';
    if (filter === 'high-match') return node.match >= 90;
    return true;
  });

  return (
    <div className="global-map-page">
      {/* Top Navigation Bar Overlay */}
      <div className="gm-header">
        <div className="gm-header-content container">
          <div className="gm-title-wrap">
            <Globe size={24} className="text-teal" />
            <h1 className="gm-title">Global <span className="gradient-text">Connections</span></h1>
          </div>
          
          <div className="gm-controls">
            <div className="gm-search">
              <Search size={16} color="var(--text-muted)" />
              <input type="text" placeholder="Search a country or friend..." />
            </div>
            
            <div className="gm-filters">
              <button className={`gm-filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                All Friends
              </button>
              <button className={`gm-filter-btn ${filter === 'online' ? 'active' : ''}`} onClick={() => setFilter('online')}>
                <span className="dot-online"></span> Online
              </button>
              <button className={`gm-filter-btn ${filter === 'high-match' ? 'active' : ''}`} onClick={() => setFilter('high-match')}>
                <span style={{fontSize: '14px'}}>✨</span> 90%+ Match
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Area */}
      <div className="gm-map-container">
        {/* Deep dark premium map background using a stylized map image */}
        <div className="gm-map-bg" />
        
        {/* Pulsing Grid Lines */}
        <div className="gm-map-grid" />

        {/* Dynamic Nodes */}
        {visibleNodes.map(node => (
          <div 
            key={node.id} 
            className={`gm-node ${activeNode?.id === node.id ? 'active' : ''}`}
            style={{ top: node.top, left: node.left }}
            onClick={() => setActiveNode(node)}
          >
            {/* Ping animation behind node */}
            {node.status === 'online' && <div className="gm-node-ping" />}
            
            <img src={node.avatar} alt={node.name} className="gm-node-avatar" />
            
            <div className={`gm-node-status ${node.status}`} />
            
            {/* Compact Label */}
            {!activeNode || activeNode.id !== node.id ? (
              <div className="gm-node-label">
                <span className="fw-bold">{node.name}</span>
                <span className="text-muted text-xs">{node.country}</span>
              </div>
            ) : null}

            {/* Expanded Popover */}
            {activeNode?.id === node.id && (
              <div className="gm-popover">
                <div className="gm-popover-header">
                  <div>
                    <h3 className="gm-popover-name">{node.name}</h3>
                    <div className="gm-popover-loc"><MapPin size={10} /> {node.country}</div>
                  </div>
                  <div className="gm-popover-match">
                    {node.match}% Match
                  </div>
                </div>
                
                <p className="gm-popover-bio">Looking for someone to practice English with. I can show you around my city!</p>
                
                <div className="gm-popover-actions">
                  <button className="btn btn-primary btn-sm" style={{ flex: 1, padding: '6px' }}><MessageCircle size={14} /> Chat</button>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1, padding: '6px' }}><Heart size={14} /> Connect</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Global Statistics Floating Panel */}
        <div className="gm-stats-panel">
          <h3 className="gm-stats-title">Your Network</h3>
          <div className="gm-stat-row">
            <span className="text-muted">Countries Reached</span>
            <span className="fw-bold text-teal">5</span>
          </div>
          <div className="gm-stat-row">
            <span className="text-muted">Global Friends</span>
            <span className="fw-bold">12</span>
          </div>
          <div className="gm-stat-row">
            <span className="text-muted">AI Suggestions</span>
            <span className="fw-bold text-amber">48</span>
          </div>
        </div>
      </div>
    </div>
  );
}
