import { useState } from 'react';
import './CompanyPages.css';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Virtual Tourism',
  'Travel Stories',
  'Cultural Exploration',
  'Guide Spotlights',
  'Creator Stories',
  'Travel Technology',
  'AI & Translation',
  'Future of Travel'
];

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Future of Travel: Demystifying Live Virtual Tourism',
    category: 'Future of Travel',
    excerpt: 'How high-definition streaming, real-time translation, and virtual booking portals are opening cultural exploration to everyone.',
    author: 'Elena Rostova',
    date: 'June 6, 2026',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Guide Spotlight: Kyoto Hidden Temples with Yuki Tanaka',
    category: 'Guide Spotlights',
    excerpt: 'Meet Yuki Tanaka, one of ZilliGo\'s top Kyoto guides, who takes travelers on digital strolls through ancient, lesser-known bamboo forests.',
    author: 'Kenji Sato',
    date: 'June 2, 2026',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'How AI and Low-Latency Translation Remove Travel Barriers',
    category: 'AI & Translation',
    excerpt: 'An inside look at ZilliGo\'s audio processing pipeline, which translates languages on the fly for cross-border tours.',
    author: 'Marcus Vance',
    date: 'May 28, 2026',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'Digital Footprint: How Carbon-Neutral Travel Protects Cities',
    category: 'Virtual Tourism',
    excerpt: 'Exploring the positive environmental effects of shifting 15% of business and leisure sightseeing to interactive virtual channels.',
    author: 'Sarah Jenkins',
    date: 'May 15, 2026',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    title: '10 Incredible Food Stalls in Florence: A Live Culinary Tour',
    category: 'Cultural Exploration',
    excerpt: 'A review of Florentine local street markets, paninis, and gelatos hosted by our local Florence guide Mateo Rossi.',
    author: 'Mateo Rossi',
    date: 'May 8, 2026',
    image: 'https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    title: 'Monetizing Cultural Knowledge: The Creator Economy for Guides',
    category: 'Creator Stories',
    excerpt: 'How local community guides are turning historical knowledge and storytelling into a global digital micro-business.',
    author: 'Priya Sharma',
    date: 'May 1, 2026',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80'
  }
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  return (
    <div className="company-page page-wrapper">
      <div className="container">
        
        {/* Hero */}
        <div className="company-hero">
          <h1>ZilliGo Stories & Perspectives</h1>
          <p>
            Insights, guide diaries, cultural deep-dives, and tech updates shaping the future of global exploration.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '3rem' }}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveCategory(cat)}
              style={{ borderRadius: '20px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="blog-grid">
          {filteredPosts.map(post => (
            <div key={post.id} className="blog-item company-card" style={{ padding: 0 }}>
              <img src={post.image} alt={post.title} className="blog-item-img" />
              <div className="blog-item-content">
                <div>
                  <div className="blog-item-tag">{post.category}</div>
                  <h3 className="blog-item-title">{post.title}</h3>
                  <p className="blog-item-excerpt">{post.excerpt}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>{post.author}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{post.date}</span>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => alert('Article details coming soon!')} style={{ padding: '4px 8px' }}>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
