import React from 'react';

// ── ALL SVGs use square 300×300 viewBox for perfect display ─────────────────

// Tender Coconut — green whole coconut, realistic
export const TenderCoconutSVG = ({ size = 200 }) => (
  <svg viewBox="0 0 300 300" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="tc_bg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#e8f5e9"/>
        <stop offset="100%" stopColor="#c8e6c9"/>
      </radialGradient>
      <radialGradient id="tc_body" cx="36%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#b9e4bc"/>
        <stop offset="30%" stopColor="#66bb6a"/>
        <stop offset="65%" stopColor="#388e3c"/>
        <stop offset="100%" stopColor="#1b5e20"/>
      </radialGradient>
      <radialGradient id="tc_shine" cx="28%" cy="24%" r="28%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.60)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
      </radialGradient>
    </defs>
    {/* Background circle */}
    <circle cx="150" cy="150" r="145" fill="url(#tc_bg)"/>
    {/* Shadow under coconut */}
    <ellipse cx="150" cy="265" rx="90" ry="14" fill="rgba(0,0,0,0.13)"/>
    {/* Main coconut body */}
    <circle cx="150" cy="162" r="110" fill="url(#tc_body)"/>
    {/* Shine */}
    <ellipse cx="108" cy="118" rx="42" ry="38" fill="url(#tc_shine)"/>
    {/* Stem */}
    <rect x="141" y="44" width="18" height="30" rx="9" fill="#2e7d32"/>
    <ellipse cx="150" cy="50" rx="14" ry="9" fill="#1b5e20"/>
    {/* Crown leaves */}
    <path d="M150,46 Q122,14 88,4"   stroke="#2e7d32" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <path d="M150,46 Q178,12 212,2"  stroke="#2e7d32" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <path d="M150,46 Q136,8 132,0"   stroke="#43a047" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M150,46 Q164,7 170,0"   stroke="#43a047" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M150,46 Q96,30 70,22"   stroke="#388e3c" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M150,46 Q204,32 230,24" stroke="#388e3c" strokeWidth="4" fill="none" strokeLinecap="round"/>
    {/* Subtle surface texture */}
    <path d="M58,148 Q96,132 150,136 Q204,140 242,152" stroke="rgba(0,0,0,0.07)" strokeWidth="2.5" fill="none"/>
    <path d="M52,185 Q92,170 150,174 Q208,178 248,192" stroke="rgba(0,0,0,0.055)" strokeWidth="2" fill="none"/>
    <path d="M60,222 Q96,208 150,212 Q204,216 240,228" stroke="rgba(0,0,0,0.04)"  strokeWidth="2" fill="none"/>
    {/* Bottom navel */}
    <ellipse cx="150" cy="268" rx="12" ry="8" fill="rgba(0,0,0,0.12)"/>
    <ellipse cx="150" cy="266" rx="8" ry="5" fill="#1b5e20" opacity="0.6"/>
  </svg>
);

// Coconut Water — tetra pack / sealed bottle, realistic
export const CoconutWaterSVG = ({ size = 200 }) => (
  <svg viewBox="0 0 300 300" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="cw_bg" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#e0f7fa"/>
        <stop offset="100%" stopColor="#b2ebf2"/>
      </radialGradient>
      <linearGradient id="cw_pack" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#006064"/>
        <stop offset="30%" stopColor="#00838f"/>
        <stop offset="70%" stopColor="#26c6da"/>
        <stop offset="100%" stopColor="#00838f"/>
      </linearGradient>
      <linearGradient id="cw_label" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#e0f7fa"/>
      </linearGradient>
    </defs>
    {/* Background */}
    <circle cx="150" cy="150" r="145" fill="url(#cw_bg)"/>
    {/* Shadow */}
    <ellipse cx="150" cy="268" rx="70" ry="11" fill="rgba(0,0,0,0.12)"/>
    {/* Tetra pack body */}
    <rect x="90" y="60" width="120" height="200" rx="10" fill="url(#cw_pack)"/>
    {/* Top fold */}
    <polygon points="90,60 150,40 210,60" fill="#004d55"/>
    <polygon points="90,60 150,50 210,60 150,68" fill="#00696f"/>
    {/* Shine on pack */}
    <rect x="96" y="70" width="14" height="140" rx="7" fill="rgba(255,255,255,0.18)"/>
    {/* White label area */}
    <rect x="100" y="110" width="100" height="110" rx="8" fill="url(#cw_label)"/>
    {/* Green coconut on label */}
    <circle cx="150" cy="138" r="22" fill="#4caf50"/>
    <circle cx="150" cy="130" r="14" fill="#a5d6a7"/>
    <circle cx="150" cy="124" r="8" fill="#e8f5e9"/>
    <path d="M136,126 Q150,116 164,126" stroke="#2e7d32" strokeWidth="2" fill="none"/>
    <rect x="145" y="112" width="10" height="12" rx="5" fill="#2e7d32"/>
    <path d="M150,114 Q140,104 130,98" stroke="#1b5e20" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M150,114 Q160,104 170,98" stroke="#1b5e20" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Label text */}
    <text x="150" y="178" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="10" fontWeight="900" fill="#006064">COCONUT</text>
    <text x="150" y="193" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="10" fontWeight="900" fill="#006064">WATER</text>
    <text x="150" y="208" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="8.5" fill="#888">No Sugar Added</text>
    {/* Straw */}
    <rect x="192" y="28" width="9" height="90" rx="4.5" fill="#ff7043"/>
    <ellipse cx="196.5" cy="30" rx="8" ry="5" fill="#f4511e"/>
    {/* 200ml badge */}
    <rect x="92" y="242" width="116" height="18" rx="6" fill="#006064"/>
    <text x="150" y="255" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="10" fontWeight="bold" fill="white">200ml Pack</text>
  </svg>
);

// Coconut Oil — beautiful glass jar with label, realistic
export const CoconutOilSVG = ({ size = 200 }) => (
  <svg viewBox="0 0 300 300" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="co_bg" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#fff8e1"/>
        <stop offset="100%" stopColor="#ffecb3"/>
      </radialGradient>
      <linearGradient id="co_glass" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="rgba(255,255,255,0.97)"/>
        <stop offset="22%"  stopColor="rgba(255,252,230,0.90)"/>
        <stop offset="68%"  stopColor="rgba(255,238,168,0.82)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0.95)"/>
      </linearGradient>
      <linearGradient id="co_oil" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="rgba(255,252,200,0.88)"/>
        <stop offset="100%" stopColor="rgba(255,193,36,0.74)"/>
      </linearGradient>
      <linearGradient id="co_lid" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#43a047"/>
        <stop offset="100%" stopColor="#1b5e20"/>
      </linearGradient>
    </defs>
    {/* Background */}
    <circle cx="150" cy="150" r="145" fill="url(#co_bg)"/>
    {/* Jar shadow */}
    <ellipse cx="150" cy="268" rx="78" ry="13" fill="rgba(0,0,0,0.13)"/>
    {/* Jar body — wide, short */}
    <rect x="68" y="112" width="164" height="148" rx="22" fill="url(#co_glass)" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
    {/* Oil content */}
    <rect x="77" y="155" width="146" height="97" rx="12" fill="url(#co_oil)" opacity="0.76"/>
    {/* Lid */}
    <rect x="56" y="78" width="188" height="40" rx="14" fill="url(#co_lid)"/>
    <rect x="48" y="88" width="204" height="24" rx="12" fill="#2e7d32"/>
    {/* Lid shine */}
    <rect x="68" y="92" width="80" height="9" rx="4.5" fill="rgba(255,255,255,0.24)"/>
    {/* White label on jar */}
    <rect x="80" y="164" width="140" height="88" rx="12" fill="rgba(255,255,255,0.95)" stroke="#f9a825" strokeWidth="1.5"/>
    {/* Coconut icon on label */}
    <circle cx="150" cy="186" r="14" fill="#4caf50"/>
    <circle cx="150" cy="180" r="9" fill="#a5d6a7"/>
    <circle cx="150" cy="176" r="5" fill="#e8f5e9"/>
    <path d="M140,179 Q150,173 160,179" stroke="#2e7d32" strokeWidth="1.5" fill="none"/>
    {/* Label text */}
    <text x="150" y="210" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="8.5" fontWeight="bold" fill="#1b5e20" letterSpacing="0.5">COLD PRESSED</text>
    <text x="150" y="223" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="12"   fontWeight="900" fill="#1b5e20">VIRGIN</text>
    <text x="150" y="237" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="11.5" fontWeight="900" fill="#1b5e20">COCONUT OIL</text>
    <text x="150" y="247" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="8"    fill="#888">100% Pure</text>
    {/* Jar shine */}
    <rect x="68" y="122" width="10" height="106" rx="5" fill="rgba(255,255,255,0.44)"/>
    {/* Oil drop decoration */}
    <ellipse cx="108" cy="152" rx="6" ry="9" fill="rgba(255,193,36,0.55)" transform="rotate(-15,108,152)"/>
    <ellipse cx="152" cy="150" rx="5" ry="8" fill="rgba(255,193,36,0.50)" transform="rotate(10,152,150)"/>
  </svg>
);

// Bulk/Marriage Pack — many coconuts with festive decoration
export const BulkCoconutSVG = ({ size = 200 }) => (
  <svg viewBox="0 0 300 300" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bk_bg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f3e5f5"/>
        <stop offset="100%" stopColor="#e8f5e9"/>
      </radialGradient>
      <radialGradient id="bk_c1" cx="36%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#c8e6c9"/>
        <stop offset="40%" stopColor="#66bb6a"/>
        <stop offset="100%" stopColor="#1b5e20"/>
      </radialGradient>
    </defs>
    {/* Background */}
    <circle cx="150" cy="150" r="145" fill="url(#bk_bg)"/>
    {/* Back row coconuts */}
    <circle cx="88"  cy="168" r="48" fill="#2e7d32" opacity="0.55"/>
    <circle cx="150" cy="160" r="48" fill="#33691e" opacity="0.55"/>
    <circle cx="212" cy="168" r="48" fill="#1b5e20" opacity="0.55"/>
    {/* Front row coconuts */}
    <circle cx="72"  cy="200" r="55" fill="url(#bk_c1)"/>
    <ellipse cx="50" cy="182" rx="19" ry="17" fill="rgba(255,255,255,0.28)"/>
    <circle cx="150" cy="193" r="55" fill="url(#bk_c1)"/>
    <ellipse cx="128" cy="175" rx="19" ry="17" fill="rgba(255,255,255,0.28)"/>
    <circle cx="228" cy="200" r="55" fill="url(#bk_c1)"/>
    <ellipse cx="206" cy="182" rx="19" ry="17" fill="rgba(255,255,255,0.28)"/>
    {/* Banner */}
    <rect x="18" y="16" width="264" height="58" rx="12" fill="rgba(106,27,154,0.92)"/>
    <text x="150" y="36" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="bold" fill="#e1bee7" letterSpacing="0.6">BULK / MARRIAGE</text>
    <text x="150" y="62" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="15" fontWeight="900" fill="#f0c040">COCONUT ORDERS</text>
    {/* Decorative garland */}
    <path d="M18,86 Q75,76 150,84 Q225,92 282,80" stroke="#f0c040" strokeWidth="2.5" fill="none" strokeDasharray="6,3"/>
    {/* Stars/flowers decoration */}
    <text x="150" y="112" textAnchor="middle" fontSize="14">🪔</text>
    <text x="100" y="116" textAnchor="middle" fontSize="11">✦</text>
    <text x="200" y="116" textAnchor="middle" fontSize="11">✦</text>
    {/* Info text at bottom */}
    <rect x="25" y="258" width="250" height="30" rx="8" fill="rgba(106,27,154,0.85)"/>
    <text x="150" y="272" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="9.5" fontWeight="bold" fill="#f0c040">Min. 50 pieces  ·  Special pricing</text>
    <text x="150" y="284" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="8.5" fill="#e1bee7">Weddings · Temples · Events</text>
  </svg>
);

// ── Router: picks SVG based on image_url ─────────────────────────────────────
export function ProductImage({ imageUrl, size = 180 }) {
  const key = (imageUrl || '').toLowerCase();
  if (key.includes('bulk') || key.includes('marriage')) return <BulkCoconutSVG size={size} />;
  if (key.includes('water'))                             return <CoconutWaterSVG size={size} />;
  if (key.includes('oil'))                               return <CoconutOilSVG size={size} />;
  return <TenderCoconutSVG size={size} />;  // default: tender coconut
}

export default ProductImage;
