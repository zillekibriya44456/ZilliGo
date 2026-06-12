import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { ShoppingBag, Download, Star, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DigitalShop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [purchasedItems, setPurchasedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getDigitalProducts(category)
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  const handlePurchase = async (product) => {
    const confirmBuy = window.confirm(`Purchase ${product.title} for $${product.price}?`);
    if (!confirmBuy) return;

    try {
      await api.purchaseProduct({ productId: product.id, price: product.price });
      alert('Purchase successful! You earned a "Digital Shopper" Passport Stamp! 🛂');
      setPurchasedItems([...purchasedItems, product.id]);
    } catch (err) {
      alert('Error completing purchase.');
    }
  };

  if (loading) return <div className="page-wrapper" style={{display:'flex', alignItems:'center', justifyContent:'center'}}><div className="spinner" /></div>;

  return (
    <div className="page-wrapper" style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>
            <ShoppingBag color="var(--accent-teal)" size={32} /> ZilliGo Digital Shop
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Premium travel templates, presets, and guides created by locals and experts.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select 
            className="form-input" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--bg-card)', color: 'white', border: '1px solid var(--border-color)' }}
          >
            <option value="">All Categories</option>
            <option value="Destination Guides">Destination Guides</option>
            <option value="Photography">Photography</option>
            <option value="Templates">Templates</option>
          </select>
          <button className="btn btn-primary" onClick={() => navigate('/academy')}>Go To Academy</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {products.map(product => {
          const isOwned = purchasedItems.includes(product.id);
          return (
            <div key={product.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', paddingTop: '60%' }}>
                <img src={product.coverImage} alt={product.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>
                  {product.category}
                </div>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{product.title}</h3>
                <p style={{ color: 'var(--accent-teal)', fontSize: '0.9rem', marginBottom: '1rem' }}>By {product.sellerName}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{product.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${product.price}</span>
                  {isOwned ? (
                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }}>
                      <Download size={16} /> Download
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => handlePurchase(product)}>
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {products.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No products found in this category.</p>}
      </div>
    </div>
  );
}
