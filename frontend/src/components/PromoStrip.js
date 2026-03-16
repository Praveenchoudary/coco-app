import React from 'react';

const ITEMS = [
  { icon:'🌿', title:'Farm Fresh', sub:'Direct from TN farms' },
  { icon:'🚚', title:'Free Delivery', sub:'Orders above ₹500' },
  { icon:'💯', title:'100% Natural', sub:'No chemicals added' },
  { icon:'📦', title:'Min. 3 Units', sub:'Per product' },
  { icon:'🔒', title:'Secure Pay', sub:'Safe checkout' },
  { icon:'⭐', title:'4.9 Rating', sub:'500+ customers' },
  { icon:'↩️', title:'Easy Return', sub:'Hassle-free policy' },
  { icon:'📱', title:'Order Tracking', sub:'Real-time updates' },
];

export default function PromoStrip() {
  return (
    <div className="promo-strip">
      {ITEMS.map((it, i) => (
        <div key={i} className="ps-item">
          <span className="ps-icon">{it.icon}</span>
          <div className="ps-text">
            <span className="ps-title">{it.title}</span>
            <span className="ps-sub">{it.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
