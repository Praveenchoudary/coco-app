import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ProductImage } from '../utils/ProductSVGs';

const CAT_BADGE = {
  fresh: { label: '🌿 FRESH', bg: '#1b5e20' },
  oil:   { label: '🫙 OIL',   bg: '#5d4037' },
  bulk:  { label: '🎊 BULK',  bg: '#6a1b9a' },
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const minQty = product.min_qty || 3;
  const [qty, setQty] = useState(minQty);
  const [added, setAdded] = useState(false);

  const badge = CAT_BADGE[product.category] || CAT_BADGE.fresh;

  const handleAdd = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(product, qty);
    setAdded(true);
    toast.success(`${qty} × ${product.name} added! 🥥`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={`pgcard${product.category === 'bulk' ? ' pgcard-bulk' : ''}`}>
      {/* Image box - SVG always renders */}
      <div className="pgcard-imgbox">
        <div className="pgcard-svg-wrap">
          <ProductImage imageUrl={product.image_url} size={192} />
        </div>
        <span className="pgcard-cat" style={{ background: badge.bg }}>{badge.label}</span>
        <span className="pgcard-min-tag">Min. {minQty}</span>
      </div>

      {/* Body */}
      <div className="pgcard-body">
        <h3 className="pgcard-name">{product.name}</h3>
        <div className="pgcard-stars">★★★★★ <span className="pgcard-rcount">(128)</span></div>
        <p className="pgcard-desc">{product.description?.slice(0, 82)}…</p>

        {product.category === 'bulk' && (
          <div className="pgcard-bulk-info">🎊 Weddings · Functions · Events</div>
        )}

        <div className="pgcard-price-row">
          <span className="pgcard-price">₹{product.price}</span>
          <span className="pgcard-unit">/{product.unit}</span>
          {product.bulk_price && (
            <span className="pgcard-bulk-badge">Bulk: ₹{product.bulk_price}</span>
          )}
        </div>

        <div className="pgcard-delivery">🚚 Tamil Nadu delivery</div>

        <div className="pgcard-qty-row">
          <span className="pgcard-qty-lbl">Qty:</span>
          <div className="pgcard-qty-ctrl">
            <button onClick={() => setQty(q => Math.max(minQty, q - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => q + 1)}>+</button>
          </div>
          <span className="pgcard-subtotal">₹{(product.price * qty).toFixed(0)}</span>
        </div>

        <button className={`pgcard-addbtn${added ? ' done' : ''}`} onClick={handleAdd}>
          {added ? '✓ Added to Cart' : `Add ${qty} to Cart`}
        </button>
      </div>
    </div>
  );
}
