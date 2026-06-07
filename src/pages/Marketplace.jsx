import { useState } from 'react';
import { ShoppingBasket, Search, Tag, Star, Package, ShoppingCart, X, CheckCircle } from 'lucide-react';
import './Marketplace.css';

const ITEMS = [
  { id: 1, name: 'Handcrafted Sandalwood Box', price: 45, category: 'Handicrafts', image: 'https://images.unsplash.com/photo-1590642916589-592bca10dfbf?w=400', rating: 4.8, reviews: 24, description: 'Traditional Indian sandalwood carving from Mysore.' },
  { id: 2, name: 'Organic Darjeeling Tea (Set of 3)', price: 28, category: 'Food', image: 'https://images.unsplash.com/photo-1594631252845-29fc45865157?w=400', rating: 4.9, reviews: 156, description: 'Premium first flush tea from the Himalayan foothills.' },
  { id: 3, name: 'Hand-Painted Japanese Fan', price: 32, category: 'Art', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400', rating: 4.7, reviews: 42, description: 'Authentic silk fan painted with traditional cherry blossom motifs.' },
  { id: 4, name: 'Italian Leather Journal', price: 55, category: 'Stationery', image: 'https://images.unsplash.com/photo-1512486133939-0c44c0c6229c?w=400', rating: 5.0, reviews: 89, description: 'Genuine Florentine leather, hand-bound with acid-free paper.' },
  { id: 5, name: 'Turkish Ceramic Coffee Set', price: 65, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1578939662863-5cd416d45a69?w=400', rating: 4.8, reviews: 31, description: 'Intricately designed ceramic cups for the perfect Ottoman coffee experience.' },
  { id: 6, name: 'Alpaca Wool Scarf', price: 40, category: 'Fashion', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400', rating: 4.9, reviews: 210, description: 'Incredibly soft and warm scarf made from ethically sourced Peruvian alpaca wool.' },
];

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filtered = ITEMS.filter(item =>
    (category === 'All' || item.category === category) &&
    (item.name.toLowerCase().includes(search.toLowerCase()))
  );

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setShowCart(false);
      setOrderPlaced(false);
    }, 3000);
  };

  return (
    <div className="page-wrapper marketplace-page">
      <div className="marketplace-header">
        <div className="container">
          <div className="marketplace-badge">
            <Tag size={14} />
            <span>Exclusive Global Goods</span>
          </div>
          <h1>ZilliGO <span className="gradient-text">Marketplace</span></h1>
          <p>Authentic products sourced directly from our local guides around the world.</p>

          <div className="marketplace-search" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search products, crafts, spices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setShowCart(true)}
              style={{ position: 'relative', flexShrink: 0 }}
            >
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -8, right: -8, background: 'var(--accent-rose)', color: '#fff', borderRadius: '50%', width: 20, height: 20, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="marketplace-categories">
          {['All', 'Handicrafts', 'Food', 'Art', 'Stationery', 'Kitchen', 'Fashion'].map(cat => (
            <button
              key={cat}
              className={`cat-chip ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="marketplace-grid">
          {filtered.map(item => (
            <div key={item.id} className="product-card glass-card">
              <div className="product-image">
                <img src={item.image} alt={item.name} />
                <button className="add-to-cart-btn" onClick={() => addToCart(item)} title="Add to cart">
                  <ShoppingBasket size={18} />
                </button>
              </div>
              <div className="product-content">
                <div className="product-meta">
                  <span className="product-category">{item.category}</span>
                  <div className="product-rating">
                    <Star size={12} fill="var(--accent-amber)" stroke="none" />
                    <span>{item.rating} ({item.reviews})</span>
                  </div>
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="product-footer">
                  <span className="product-price">${item.price}</span>
                  <button className="btn btn-primary btn-sm" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="dashboard-empty">
            <Package size={48} />
            <h3>No products found</h3>
            <p>Try a different search term or category.</p>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div className="cart-overlay" onClick={(e) => e.target === e.currentTarget && setShowCart(false)}>
          <div className="cart-drawer glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3><ShoppingCart size={20} style={{ marginRight: 8 }} />Your Cart ({cartCount})</h3>
              <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {orderPlaced ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: 64, height: 64, background: 'var(--accent-teal-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <CheckCircle size={32} style={{ color: 'var(--accent-teal)' }} />
                </div>
                <h3>Order Placed! 🎉</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Your order has been submitted. You'll receive a confirmation email shortly.
                </p>
              </div>
            ) : cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <ShoppingBasket size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, overflow: 'auto' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
                      <img src={item.image} alt={item.name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</div>
                        <div style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>${item.price} × {item.qty}</div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--accent-teal)' }}>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
                    Checkout — ${cartTotal.toFixed(2)}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
