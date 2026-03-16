import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import ProductCarousel from '../components/ProductCarousel';
import CategoryBanner from '../components/CategoryBanner';
import PromoStrip from '../components/PromoStrip';
import API from '../utils/api';

const TESTIMONIALS = [
  { name:'Priya S.', loc:'Chennai',     text:'Best coconut oil I have ever used! Pure and fragrant. My family loves it for cooking daily.',    rating:5, av:'P' },
  { name:'Rajan M.', loc:'Coimbatore',  text:'Fresh tender coconuts delivered to my door. Saved a trip to the market. Very sweet and fresh!',  rating:5, av:'R' },
  { name:'Deepa K.', loc:'Madurai',     text:'Ordered bulk pack for my daughter\'s wedding. Excellent service and on-time delivery. 5 stars!',  rating:5, av:'D' },
  { name:'Arjun V.', loc:'Trichy',      text:'The coconut oil aroma is so natural. You can tell it is wood-pressed. Highly recommended!',       rating:5, av:'A' },
];

// Coconut oil SVG illustration - guaranteed correct, no network needed
const OilIllustration = () => (
  <div className="mb-oil-illo">
    <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:320,height:'auto'}}>
      <defs>
        <radialGradient id="mbbg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fff8e1"/><stop offset="100%" stopColor="#ffecb3"/>
        </radialGradient>
        <linearGradient id="mbjar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,.97)"/>
          <stop offset="35%" stopColor="rgba(255,250,220,.88)"/>
          <stop offset="70%" stopColor="rgba(255,235,160,.80)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,.93)"/>
        </linearGradient>
        <linearGradient id="mboil" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,250,180,.85)"/>
          <stop offset="100%" stopColor="rgba(255,195,40,.72)"/>
        </linearGradient>
      </defs>
      <rect width="320" height="280" fill="url(#mbbg)" rx="16"/>
      <ellipse cx="160" cy="268" rx="88" ry="14" fill="rgba(0,0,0,.12)"/>
      {/* Jar body */}
      <rect x="62" y="108" width="140" height="148" rx="20" fill="url(#mbjar)" stroke="rgba(255,255,255,.85)" strokeWidth="2"/>
      {/* Oil fill */}
      <rect x="70" y="155" width="124" height="94" rx="10" fill="url(#mboil)" opacity=".72"/>
      {/* Lid */}
      <rect x="50" y="74" width="164" height="40" rx="14" fill="#2e7d32"/>
      <rect x="44" y="83" width="176" height="22" rx="11" fill="#388e3c"/>
      <rect x="62" y="87" width="72" height="9" rx="4.5" fill="rgba(255,255,255,.22)"/>
      {/* Label */}
      <rect x="76" y="168" width="112" height="70" rx="9" fill="rgba(255,255,255,.93)" stroke="#f9a825" strokeWidth="1.5"/>
      <text x="132" y="190" textAnchor="middle" fontFamily="Arial" fontSize="9.5" fontWeight="bold" fill="#1b5e20">COLD PRESSED</text>
      <text x="132" y="206" textAnchor="middle" fontFamily="Arial" fontSize="13" fontWeight="900" fill="#1b5e20">VIRGIN</text>
      <text x="132" y="221" textAnchor="middle" fontFamily="Arial" fontSize="12" fontWeight="900" fill="#1b5e20">COCONUT OIL</text>
      <text x="132" y="233" textAnchor="middle" fontFamily="Arial" fontSize="8.5" fill="#888">100% Pure · No Chemicals</text>
      {/* Shine */}
      <rect x="62" y="118" width="10" height="90" rx="5" fill="rgba(255,255,255,.40)"/>
      {/* Coconut sprig decoration */}
      <circle cx="255" cy="148" r="30" fill="#4caf50"/>
      <circle cx="255" cy="136" r="20" fill="#a5d6a7"/>
      <circle cx="255" cy="128" r="12" fill="#e8f5e9"/>
      <path d="M238,132 Q255,120 272,132" stroke="#2e7d32" strokeWidth="2" fill="none"/>
      <rect x="250" y="112" width="10" height="16" rx="5" fill="#2e7d32"/>
      <path d="M255,114 Q244,100 234,94" stroke="#1b5e20" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M255,114 Q266,100 276,94" stroke="#1b5e20" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Small drips */}
      <ellipse cx="110" cy="152" rx="5" ry="8" fill="rgba(255,195,40,.55)" transform="rotate(-15,110,152)"/>
      <ellipse cx="154" cy="150" rx="5" ry="8" fill="rgba(255,195,40,.55)" transform="rotate(10,154,150)"/>
    </svg>
  </div>
);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeT, setActiveT] = useState(0);

  useEffect(() => {
    API.get('/products').then(r => { setProducts(r.data); setLoading(false); }).catch(() => setLoading(false));
    const t = setInterval(() => setActiveT(i => (i + 1) % TESTIMONIALS.length), 4200);
    return () => clearInterval(t);
  }, []);

  const freshProds = products.filter(p => p.category === 'fresh');
  const oilProds   = products.filter(p => p.category === 'oil');
  const bulkProds  = products.filter(p => p.category === 'bulk');

  return (
    <div className="home-v2">
      <HeroSlider />
      <PromoStrip />
      <CategoryBanner />

      {!loading && freshProds.length > 0 && (
        <ProductCarousel title="Fresh Coconut Products" subtitle="Harvested this week from Tamil Nadu farms" badge="🌿 FRESH" badgeColor="#16a34a" products={freshProds}/>
      )}

      {/* Mid banner - coconut oil, SVG illustration, NO external image */}
      <section className="mid-banner">
        <div className="mid-banner-inner">
          <div className="mid-banner-left">
            <OilIllustration />
          </div>
          <div className="mid-banner-right">
            <span className="mid-banner-eyebrow">Traditional Chekku Method</span>
            <h2 className="mid-banner-title">Cold-Pressed<br />Virgin Coconut Oil</h2>
            <p className="mid-banner-body">Our coconut oil is extracted using the traditional wood-press (chekku) method. Zero heat, zero chemicals - just pure coconut oil that retains every nutrient. Available in 500ml, 1 litre, and 2 litre packs for family use.</p>
            <ul className="mid-banner-list">
              <li>Wood-pressed, first cold extraction</li>
              <li>No preservatives or additives</li>
              <li>Rich natural coconut aroma</li>
              <li>FSSAI certified quality</li>
            </ul>
            <Link to="/products?category=oil" className="mid-banner-cta">Shop Coconut Oil →</Link>
          </div>
        </div>
      </section>

      {!loading && oilProds.length > 0 && (
        <ProductCarousel title="Premium Coconut Oils" subtitle="Cold-pressed in 500ml, 1L and 2L packs" badge="🫙 BESTSELLER" badgeColor="#d97706" products={oilProds}/>
      )}

      {/* Bulk / Marriage banner */}
      {!loading && bulkProds.length > 0 && (
        <section className="bulk-banner">
          <div className="bulk-banner-inner">
            <div className="bulk-banner-text">
              <span className="bulk-banner-eyebrow">🎊 Weddings · Temple Events · Corporate Functions</span>
              <h2 className="bulk-banner-title">Bulk Coconut Orders<br /><span>for Marriages &amp; Functions</span></h2>
              <p className="bulk-banner-body">Special pricing for 50+ pieces. Coordinated delivery with advance booking. We supply tender coconuts for weddings, temple events, corporate gatherings and festivals across all 38 Tamil Nadu districts.</p>
              <div className="bulk-banner-features">
                <div className="bbf-item"><span>🥥</span> Min. 50 pieces</div>
                <div className="bbf-item"><span>💰</span> ₹32 / piece (bulk rate)</div>
                <div className="bbf-item"><span>📅</span> Advance booking available</div>
                <div className="bbf-item"><span>🚚</span> Coordinated delivery</div>
              </div>
              <Link to="/products?category=bulk" className="bulk-banner-cta">View Bulk Packs →</Link>
            </div>
            <div className="bulk-banner-visual">
              <svg viewBox="0 0 280 220" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:280}}>
                <defs><radialGradient id="bbc1" cx="38%" cy="33%" r="62%"><stop offset="0%" stopColor="#c8e6c9"/><stop offset="55%" stopColor="#4caf50"/><stop offset="100%" stopColor="#1b5e20"/></radialGradient></defs>
                {/* 3 coconuts back row */}
                <ellipse cx="70"  cy="148" rx="44" ry="45" fill="#2e7d32" opacity=".6"/>
                <ellipse cx="140" cy="142" rx="44" ry="45" fill="#33691e" opacity=".6"/>
                <ellipse cx="210" cy="148" rx="44" ry="45" fill="#1b5e20" opacity=".6"/>
                {/* 3 coconuts front row */}
                <ellipse cx="50"  cy="178" rx="50" ry="50" fill="url(#bbc1)"/>
                <ellipse cx="32"  cy="162" rx="17" ry="15" fill="rgba(255,255,255,.27)"/>
                <ellipse cx="140" cy="170" rx="50" ry="50" fill="url(#bbc1)"/>
                <ellipse cx="122" cy="154" rx="17" ry="15" fill="rgba(255,255,255,.27)"/>
                <ellipse cx="230" cy="178" rx="50" ry="50" fill="url(#bbc1)"/>
                <ellipse cx="212" cy="162" rx="17" ry="15" fill="rgba(255,255,255,.27)"/>
                {/* Festive banner */}
                <rect x="10" y="8" width="260" height="48" rx="10" fill="rgba(123,31,162,.88)"/>
                <text x="140" y="28" textAnchor="middle" fontFamily="Arial" fontSize="10" fontWeight="bold" fill="#e1bee7" letterSpacing="0.5">BULK / MARRIAGE ORDERS</text>
                <text x="140" y="47" textAnchor="middle" fontFamily="Arial" fontSize="12" fontWeight="900" fill="#f0c040">50+ pieces · Special pricing</text>
                {/* Garland */}
                <path d="M10,68 Q70,58 140,66 Q210,74 270,62" stroke="#f0c040" strokeWidth="2.5" fill="none" strokeDasharray="5,3"/>
              </svg>
            </div>
          </div>
        </section>
      )}

      {/* Districts */}
      <section className="districts-section">
        <div className="districts-inner">
          <div className="districts-text">
            <span className="districts-eyebrow">Delivery Coverage</span>
            <h2 className="districts-title">Delivering to<br/><span>All 38 Tamil Nadu Districts</span></h2>
            <p className="districts-body">From the hills of Nilgiris to the shores of Kanyakumari - we deliver fresh coconut products to every corner of Tamil Nadu via trusted courier partners.</p>
            <div className="districts-couriers">
              <span>India Post</span><span>DTDC</span><span>BlueDart</span><span>Delhivery</span>
            </div>
            <Link to="/register" className="districts-cta">Create Account & Order</Link>
          </div>
          <div className="districts-map-visual">
            {['Chennai','Coimbatore','Madurai','Trichy','Salem','Tirunelveli','Vellore','Erode','Thanjavur','Dindigul','Kanchipuram','Nagapattinam','Cuddalore','Namakkal','Karur','Nilgiris','Theni','Tenkasi','Virudhunagar','Sivaganga'].map(d=>(
              <span key={d} className="district-chip">{d}</span>
            ))}
            <span className="district-chip more">+18 more</span>
          </div>
        </div>
      </section>

      {/* All products carousel */}


      {/* Testimonials */}
      <section className="testimonials-section">
        <h2 className="testimonials-title">Loved by Customers Across Tamil Nadu</h2>
        <p className="testimonials-sub">Real reviews from real customers</p>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} className={`testimonial-card ${i===activeT?'spotlight':''}`}>
              <div className="t-stars">{'★'.repeat(t.rating)}</div>
              <p className="t-text">"{t.text}"</p>
              <div className="t-author">
                <div className="t-avatar">{t.av}</div>
                <div><div className="t-name">{t.name}</div><div className="t-location">📍 {t.loc}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section">
        <div className="final-cta-content">
          <div className="final-cta-emoji">🥥</div>
          <h2>Ready to taste the difference?</h2>
          <p>Join 500+ families across Tamil Nadu getting fresh coconut products delivered to their door.</p>
          <div className="final-cta-actions">
            <Link to="/products" className="btn-final-cta-primary">Shop Now</Link>
            <Link to="/register" className="btn-final-cta-secondary">Create Free Account</Link>
          </div>
        </div>
      </section>

      <footer className="footer-v2">
        <div className="footer-v2-inner">
          <div className="footer-brand">
            <span className="footer-logo">🥥 NatuCoconut</span>
            <p>Tamil Nadu's trusted source for pure coconut products. Farm to door, no compromise.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col"><h4>Products</h4><Link to="/products?category=fresh">Tender Coconut</Link><Link to="/products?category=fresh">Coconut Water</Link><Link to="/products?category=oil">Coconut Oil</Link><Link to="/products?category=bulk">Bulk Orders</Link></div>
            <div className="footer-col"><h4>Account</h4><Link to="/register">Register Free</Link><Link to="/login">Login</Link><Link to="/my-orders">My Orders</Link></div>
            <div className="footer-col"><h4>Delivery</h4><p>All 38 TN districts</p><p>India Post · DTDC</p><p>BlueDart · Delhivery</p></div>
          </div>
        </div>
        <div className="footer-v2-bottom">
          <p>© 2024 NatuCoconut - Delivery only within Tamil Nadu | Pure · Natural · Farm-Fresh</p>
        </div>
      </footer>
    </div>
  );
}
