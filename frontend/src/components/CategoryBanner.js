import React from 'react';
import { Link } from 'react-router-dom';

const CATS = [
  {
    key:'fresh', link:'/products?category=fresh',
    label:'Fresh Coconuts', desc:'Tender Coconut & Water',
    bg:'linear-gradient(135deg,#e8f5e9,#c8e6c9)',
    icon:(
      <svg viewBox="0 0 64 64" className="catb-icon-svg">
        <defs><radialGradient id="ci1" cx="38%" cy="32%" r="62%"><stop offset="0%" stopColor="#c8e6c9"/><stop offset="55%" stopColor="#4caf50"/><stop offset="100%" stopColor="#1b5e20"/></radialGradient></defs>
        <ellipse cx="32" cy="62" rx="22" ry="4" fill="rgba(0,0,0,0.12)"/>
        <ellipse cx="32" cy="37" rx="28" ry="28" fill="url(#ci1)"/>
        <ellipse cx="22" cy="27" rx="11" ry="9" fill="rgba(255,255,255,0.30)"/>
        <rect x="28" y="9" width="8" height="14" rx="4" fill="#2e7d32"/>
        <path d="M32,13 Q20,2 10,0" stroke="#1b5e20" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <path d="M32,13 Q44,2 54,0" stroke="#1b5e20" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key:'oil', link:'/products?category=oil',
    label:'Coconut Oil', desc:'500ml · 1L · 2L',
    bg:'linear-gradient(135deg,#fff8e1,#ffecb3)',
    icon:(
      <svg viewBox="0 0 64 64" className="catb-icon-svg">
        <defs><linearGradient id="ci2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="rgba(255,255,255,0.96)"/><stop offset="50%" stopColor="rgba(255,248,200,0.88)"/><stop offset="100%" stopColor="rgba(255,255,255,0.94)"/></linearGradient></defs>
        <ellipse cx="32" cy="62" rx="16" ry="4" fill="rgba(0,0,0,0.12)"/>
        <rect x="14" y="18" width="36" height="40" rx="8" fill="url(#ci2)" stroke="rgba(255,255,255,0.8)" strokeWidth="1"/>
        <rect x="16" y="30" width="32" height="26" rx="5" fill="rgba(255,200,30,0.60)"/>
        <rect x="10" y="8" width="44" height="14" rx="7" fill="#2e7d32"/>
        <rect x="8" y="11" width="48" height="9" rx="6" fill="#388e3c"/>
        <text x="32" y="46" textAnchor="middle" fontFamily="Arial" fontSize="7" fontWeight="bold" fill="#1b5e20">COCONUT OIL</text>
      </svg>
    ),
  },
  {
    key:'bulk', link:'/products?category=bulk',
    label:'Bulk / Marriage', desc:'50+ pieces · Special price',
    bg:'linear-gradient(135deg,#f3e5f5,#e1bee7)',
    icon:(
      <svg viewBox="0 0 64 64" className="catb-icon-svg">
        <defs><radialGradient id="ci3" cx="38%" cy="33%" r="62%"><stop offset="0%" stopColor="#c8e6c9"/><stop offset="55%" stopColor="#4caf50"/><stop offset="100%" stopColor="#1b5e20"/></radialGradient></defs>
        <ellipse cx="20" cy="52" rx="15" ry="15" fill="#33691e" opacity="0.7"/>
        <ellipse cx="32" cy="50" rx="15" ry="15" fill="#2e7d32" opacity="0.7"/>
        <ellipse cx="44" cy="52" rx="15" ry="15" fill="#1b5e20" opacity="0.7"/>
        <ellipse cx="16" cy="56" rx="17" ry="17" fill="url(#ci3)"/>
        <ellipse cx="32" cy="54" rx="17" ry="17" fill="url(#ci3)"/>
        <ellipse cx="48" cy="56" rx="17" ry="17" fill="url(#ci3)"/>
        <rect x="4" y="2" width="56" height="18" rx="6" fill="#7b1fa2" opacity="0.88"/>
        <text x="32" y="15" textAnchor="middle" fontFamily="Arial" fontSize="8" fontWeight="bold" fill="#f0c040">BULK ORDERS</text>
      </svg>
    ),
  },
];

export default function CategoryBanner() {
  return (
    <section className="catbanner">
      <div className="catbanner-inner">
        {CATS.map(c => (
          <Link key={c.key} to={c.link} className="catcard" style={{'--catbg': c.bg}}>
            <div className="catcard-icon-box" style={{ background: c.bg }}>
              {c.icon}
            </div>
            <div className="catcard-info">
              <span className="catcard-label">{c.label}</span>
              <span className="catcard-desc">{c.desc}</span>
            </div>
            <svg className="catcard-arr" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9,18 15,12 9,6"/></svg>
          </Link>
        ))}
      </div>
    </section>
  );
}
