import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ProductImage } from '../utils/ProductSVGs';

const MIN_QTY = 3;

export default function ProductCarousel({ title, subtitle, badge, badgeColor, products }) {
  if (!products?.length) return null;

  return (
    <section className="pcarousel">
      <div className="pcar-header">
        <div className="pcar-hdr-left">
          {badge && (
            <span className="pcar-badge" style={badgeColor ? { background: badgeColor } : {}}>
              {badge}
            </span>
          )}
          <div>
            <h2 className="pcar-title">{title}</h2>
            {subtitle && <p className="pcar-sub">{subtitle}</p>}
          </div>
        </div>
        <Link to="/products" className="pcar-see-all">View All →</Link>
      </div>

      {/* Always use CSS grid — fills full width, wraps on mobile */}
      <div className="pcar-grid">
        {products.map(p => <CarCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

function CarCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const minQty = product.min_qty || MIN_QTY;
  const [qty, setQty] = useState(minQty);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    addToCart(product, qty);
    setAdded(true);
    toast.success(`${qty} × ${product.name} added!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const CAT_COLOR = { fresh: '#1b5e20', oil: '#5d4037', bulk: '#6a1b9a' };
  const CAT_LABEL = { fresh: '🌿 FRESH', oil: '🫙 OIL', bulk: '🎊 BULK' };

  return (
    <div className="pcc">
      <div className="pcc-imgbox">
        <div className="pcc-svg-wrap">
          <ProductImage imageUrl={product.image_url} size={180} />
        </div>
        <span className="pcc-cat" style={{ background: CAT_COLOR[product.category] || '#1b5e20' }}>
          {CAT_LABEL[product.category] || '🌿 FRESH'}
        </span>
        <div className="pcc-qty-bar">
          <button className="pcc-qbtn" onClick={e => { e.preventDefault(); setQty(q => Math.max(minQty, q - 1)); }}>−</button>
          <span className="pcc-qval">{qty}</span>
          <button className="pcc-qbtn" onClick={e => { e.preventDefault(); setQty(q => q + 1); }}>+</button>
        </div>
      </div>
      <div className="pcc-body">
        <p className="pcc-name">{product.name}</p>
        <div className="pcc-stars">★★★★★ <span>(128)</span></div>
        <div className="pcc-price-row">
          <span className="pcc-price">₹{product.price}</span>
          <span className="pcc-unit">/{product.unit}</span>
        </div>
        {product.bulk_price && (
          <span className="pcc-bulk-badge">Bulk ₹{product.bulk_price}</span>
        )}
        <p className="pcc-min">Min. {minQty} units</p>
        <button className={`pcc-add${added ? ' done' : ''}`} onClick={handleAdd}>
          {added ? '✓ Added to Cart' : `Add ${qty} to Cart`}
        </button>
      </div>
    </div>
  );
}
