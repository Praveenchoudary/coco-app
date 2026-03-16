import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// ── INLINE SVG VISUALS - zero network, never fails ──────────────────────────
const TenderCoconutSVG = () => (
  <svg viewBox="0 0 200 240" className="hero-svg-illo">
    <defs>
      <radialGradient id="hc1" cx="38%" cy="32%" r="64%">
        <stop offset="0%" stopColor="#c8e6c9"/><stop offset="40%" stopColor="#66bb6a"/><stop offset="100%" stopColor="#1b5e20"/>
      </radialGradient>
      <radialGradient id="hs1" cx="28%" cy="26%" r="30%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.52)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/>
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="226" rx="78" ry="13" fill="rgba(0,0,0,0.20)"/>
    <ellipse cx="100" cy="140" rx="96" ry="97" fill="url(#hc1)"/>
    <ellipse cx="70" cy="103" rx="38" ry="34" fill="url(#hs1)"/>
    <rect x="93" y="38" width="14" height="26" rx="7" fill="#2e7d32"/>
    <ellipse cx="100" cy="46" rx="12" ry="7" fill="#1b5e20"/>
    <path d="M100,42 Q76,14 50,4" stroke="#2e7d32" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
    <path d="M100,42 Q124,12 150,2" stroke="#2e7d32" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
    <path d="M100,42 Q88,8 86,0" stroke="#43a047" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <path d="M100,42 Q112,10 116,1" stroke="#43a047" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <path d="M45,118 Q70,106 100,110 Q130,114 155,126" stroke="rgba(0,0,0,0.07)" strokeWidth="2" fill="none"/>
    <path d="M40,155 Q68,143 100,148 Q132,153 160,166" stroke="rgba(0,0,0,0.055)" strokeWidth="2" fill="none"/>
  </svg>
);

const OilSVG = () => (
  <svg viewBox="0 0 180 260" className="hero-svg-illo">
    <defs>
      <linearGradient id="hjar" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.97)"/>
        <stop offset="35%" stopColor="rgba(255,250,220,0.88)"/>
        <stop offset="70%" stopColor="rgba(255,235,160,0.80)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0.93)"/>
      </linearGradient>
      <linearGradient id="hoil" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,250,180,0.85)"/>
        <stop offset="100%" stopColor="rgba(255,195,40,0.72)"/>
      </linearGradient>
    </defs>
    <ellipse cx="90" cy="248" rx="62" ry="12" fill="rgba(0,0,0,0.18)"/>
    <rect x="42" y="106" width="96" height="132" rx="16" fill="url(#hjar)" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5"/>
    <rect x="48" y="148" width="84" height="84" rx="8" fill="url(#hoil)" opacity="0.72"/>
    <rect x="32" y="76" width="116" height="36" rx="12" fill="#2e7d32"/>
    <rect x="26" y="84" width="128" height="22" rx="10" fill="#388e3c"/>
    <rect x="42" y="88" width="55" height="8" rx="4" fill="rgba(255,255,255,0.22)"/>
    <rect x="54" y="162" width="72" height="56" rx="7" fill="rgba(255,255,255,0.93)" stroke="#f9a825" strokeWidth="1.2"/>
    <text x="90" y="180" textAnchor="middle" fontFamily="Arial" fontSize="7.5" fontWeight="bold" fill="#1b5e20">COLD PRESSED</text>
    <text x="90" y="193" textAnchor="middle" fontFamily="Arial" fontSize="10" fontWeight="900" fill="#1b5e20">VIRGIN</text>
    <text x="90" y="206" textAnchor="middle" fontFamily="Arial" fontSize="9.5" fontWeight="900" fill="#1b5e20">COCONUT OIL</text>
    <text x="90" y="216" textAnchor="middle" fontFamily="Arial" fontSize="7" fill="#888">100% Pure</text>
    <rect x="42" y="116" width="8" height="74" rx="4" fill="rgba(255,255,255,0.40)"/>
  </svg>
);

const BulkSVG = () => (
  <svg viewBox="0 0 240 240" className="hero-svg-illo">
    <defs>
      <radialGradient id="hb1" cx="38%" cy="33%" r="62%">
        <stop offset="0%" stopColor="#c8e6c9"/><stop offset="55%" stopColor="#4caf50"/><stop offset="100%" stopColor="#1b5e20"/>
      </radialGradient>
    </defs>
    {/* back row */}
    <ellipse cx="60" cy="175" rx="46" ry="47" fill="#2e7d32" opacity="0.65"/>
    <ellipse cx="120" cy="168" rx="46" ry="47" fill="#33691e" opacity="0.65"/>
    <ellipse cx="180" cy="175" rx="46" ry="47" fill="#1b5e20" opacity="0.65"/>
    {/* front row */}
    <ellipse cx="40" cy="210" rx="52" ry="53" fill="url(#hb1)"/>
    <ellipse cx="22" cy="194" rx="18" ry="16" fill="rgba(255,255,255,0.26)"/>
    <ellipse cx="120" cy="202" rx="52" ry="53" fill="url(#hb1)"/>
    <ellipse cx="102" cy="186" rx="18" ry="16" fill="rgba(255,255,255,0.26)"/>
    <ellipse cx="200" cy="210" rx="52" ry="53" fill="url(#hb1)"/>
    <ellipse cx="182" cy="194" rx="18" ry="16" fill="rgba(255,255,255,0.26)"/>
    {/* banner */}
    <rect x="10" y="14" width="220" height="50" rx="10" fill="rgba(123,31,162,0.88)"/>
    <text x="120" y="33" textAnchor="middle" fontFamily="Arial" fontSize="10" fontWeight="bold" fill="#e1bee7" letterSpacing="0.5">BULK / MARRIAGE</text>
    <text x="120" y="54" textAnchor="middle" fontFamily="Arial" fontSize="13" fontWeight="900" fill="#f0c040">ORDERS</text>
    <text x="120" y="90" textAnchor="middle" fontFamily="Arial" fontSize="9" fill="#fff" opacity="0.75">Weddings · Functions · Events</text>
    <text x="120" y="108" textAnchor="middle" fontFamily="Arial" fontSize="9" fill="#f0c040" fontWeight="bold">Min. 50 pieces</text>
  </svg>
);

const WaterSVG = () => (
  <svg viewBox="0 0 200 260" className="hero-svg-illo">
    <defs>
      <linearGradient id="hwg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.92)"/>
        <stop offset="35%" stopColor="rgba(200,245,250,0.74)"/>
        <stop offset="65%" stopColor="rgba(160,230,240,0.68)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0.88)"/>
      </linearGradient>
      <linearGradient id="hwl" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(178,235,242,0.72)"/>
        <stop offset="100%" stopColor="rgba(0,188,212,0.58)"/>
      </linearGradient>
    </defs>
    <ellipse cx="130" cy="248" rx="55" ry="11" fill="rgba(0,0,0,0.16)"/>
    {/* glass */}
    <path d="M78,78 L62,242 Q62,254 76,254 L184,254 Q198,254 198,242 L182,78Z" fill="url(#hwg)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
    <path d="M80,106 L65,242 Q65,250 77,250 L183,250 Q195,250 195,242 L180,106Z" fill="url(#hwl)" opacity="0.60"/>
    <circle cx="112" cy="188" r="5.5" fill="rgba(255,255,255,0.68)"/>
    <circle cx="148" cy="164" r="4" fill="rgba(255,255,255,0.60)"/>
    <circle cx="170" cy="210" r="5" fill="rgba(255,255,255,0.64)"/>
    <path d="M78,86 L70,216" stroke="rgba(255,255,255,0.52)" strokeWidth="8" strokeLinecap="round"/>
    {/* coconut half */}
    <ellipse cx="44" cy="138" rx="40" ry="32" fill="#4caf50"/>
    <ellipse cx="44" cy="126" rx="32" ry="23" fill="#a5d6a7"/>
    <ellipse cx="44" cy="120" rx="20" ry="14" fill="#e8f5e9"/>
    <path d="M18,122 Q44,110 70,122" stroke="#2e7d32" strokeWidth="2" fill="none"/>
    {/* straw */}
    <rect x="172" y="52" width="7" height="108" rx="3.5" fill="#ff7043" opacity="0.82"/>
  </svg>
);

const SLIDES = [
  {
    id:1,
    gradient:'linear-gradient(125deg,#020e02 0%,#0a2e0a 35%,#1b5e20 75%,#2e7d32 100%)',
    pattern:'radial-gradient(ellipse at 85% 55%, rgba(76,175,80,0.14) 0%,transparent 58%)',
    eyebrow:'🌿 Farm-fresh · Tamil Nadu',
    title:'Tender Coconut',
    accent:'Sweet Ilaneer, Delivered Fresh',
    body:'Hand-picked green tender coconuts from Tamil Nadu farms. Perfect hydration - pure, sweet, natural. Order from 3 pieces. Fast delivery to all 38 districts.',
    cta:'Order Tender Coconut',
    link:'/products',
    price:'₹45 / piece',
    tag:'FRESH TODAY',
    tagColor:'#16a34a',
    Visual: TenderCoconutSVG,
  },
  {
    id:2,
    gradient:'linear-gradient(125deg,#1a0a00 0%,#4a1800 35%,#7d3800 75%,#a05000 100%)',
    pattern:'radial-gradient(ellipse at 82% 52%, rgba(255,200,50,0.12) 0%,transparent 58%)',
    eyebrow:'🫙 Traditional Chekku Method',
    title:'Virgin Coconut Oil',
    accent:'Cold-Pressed · Zero Chemicals',
    body:'Wood-pressed, unrefined, first cold extraction. No heat, no chemicals. Pure coconut oil for cooking, hair & skin. Available in 500ml, 1L and 2L packs.',
    cta:'Shop Coconut Oil',
    link:'/products?category=oil',
    price:'From ₹285 / 500ml',
    tag:'BESTSELLER',
    tagColor:'#d97706',
    Visual: OilSVG,
  },
  {
    id:3,
    gradient:'linear-gradient(125deg,#001a1e 0%,#003d45 35%,#006064 75%,#00838f 100%)',
    pattern:'radial-gradient(ellipse at 82% 52%, rgba(0,200,220,0.12) 0%,transparent 58%)',
    eyebrow:'💧 Pure · No Sugar · No Preservatives',
    title:'Coconut Water',
    accent:'Nature\'s Best Electrolyte',
    body:'Fresh coconut water in 200ml sealed packs. No added sugar, no preservatives. Great for functions, daily health and summer hydration. Bulk packs available.',
    cta:'Order Coconut Water',
    link:'/products?category=fresh',
    price:'₹28 / 200ml pack',
    tag:'PURE',
    tagColor:'#0891b2',
    Visual: WaterSVG,
  },
  {
    id:4,
    gradient:'linear-gradient(125deg,#1a0028 0%,#3d006e 35%,#6a1b9a 75%,#8e24aa 100%)',
    pattern:'radial-gradient(ellipse at 82% 52%, rgba(200,100,255,0.14) 0%,transparent 58%)',
    eyebrow:'🎊 Weddings · Functions · Events',
    title:'Bulk Coconut Orders',
    accent:'Marriages & Special Occasions',
    body:'Tender coconuts in bulk for weddings, temple festivals, corporate events and large gatherings. Special pricing for 50+ pieces. Advance booking with coordinated delivery.',
    cta:'Place Bulk Order',
    link:'/products?category=bulk',
    price:'₹32/piece (50+ pcs)',
    tag:'SPECIAL ORDER',
    tagColor:'#7b1fa2',
    Visual: BulkSVG,
  },
];

export default function HeroSlider() {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((i) => {
    if (fading) return;
    setFading(true);
    setTimeout(() => { setCur(i); setFading(false); }, 480);
  }, [fading]);

  const next = useCallback(() => goTo((cur + 1) % SLIDES.length), [cur, goTo]);
  const prev = useCallback(() => goTo((cur - 1 + SLIDES.length) % SLIDES.length), [cur, goTo]);

  useEffect(() => { const t = setInterval(next, 5500); return () => clearInterval(t); }, [next]);

  const s = SLIDES[cur];

  return (
    <div className="hero-slider">
      {/* Pure CSS gradient backgrounds - ZERO network images */}
      {SLIDES.map((sl, i) => (
        <div key={sl.id} className={`hero-bg ${i === cur ? 'active' : ''}`}
          style={{ background: `${sl.pattern}, ${sl.gradient}` }} />
      ))}

      {/* Dot grid pattern */}
      <div className="hero-dotgrid" />

      {/* Content */}
      <div className={`hero-body ${fading ? 'fading' : 'showing'}`}>
        <div className="hero-layout">
          <div className="hero-textcol">
            <span className="hero-tag" style={{ background: s.tagColor }}>{s.tag}</span>
            <p className="hero-eyebrow">{s.eyebrow}</p>
            <h1 className="hero-title">{s.title}<br/><em className="hero-accent">{s.accent}</em></h1>
            <p className="hero-desc">{s.body}</p>
            <div className="hero-actions">
              <Link to={s.link} className="hero-cta">{s.cta} →</Link>
              <span className="hero-price">{s.price}</span>
            </div>
            <div className="hero-badges">
              <span>✓ Farm Direct</span>
              <span>✓ 38 TN Districts</span>
              <span>✓ Min. 3 Units</span>
              <span>✓ Fast Delivery</span>
            </div>
          </div>
          <div className="hero-illucol">
            <s.Visual />
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button className="hero-arrow hero-arrow-l" onClick={prev}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
      </button>
      <button className="hero-arrow hero-arrow-r" onClick={next}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9,18 15,12 9,6"/></svg>
      </button>

      {/* Dots */}
      <div className="hero-dotnav">
        {SLIDES.map((_, i) => (
          <button key={i} className={`hero-dot ${i === cur ? 'on' : ''}`} onClick={() => goTo(i)} />
        ))}
      </div>

      {/* Progress */}
      <div className="hero-progbar"><div key={cur} className="hero-progfill" /></div>

      {/* Slide counter */}
      <div className="hero-counter">{cur + 1} / {SLIDES.length}</div>
    </div>
  );
}
