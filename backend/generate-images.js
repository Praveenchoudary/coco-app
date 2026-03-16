const fs = require('fs');
const path = require('path');

const dir = '/home/claude/coconut-store/backend/public/images';

// Fresh Coconut SVG
const coconutSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#e8f5e9"/>
      <stop offset="100%" stop-color="#c8e6c9"/>
    </radialGradient>
    <radialGradient id="coco1" cx="40%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#8d6e63"/>
      <stop offset="60%" stop-color="#5d4037"/>
      <stop offset="100%" stop-color="#3e2723"/>
    </radialGradient>
    <radialGradient id="coco2" cx="45%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#795548"/>
      <stop offset="60%" stop-color="#4e342e"/>
      <stop offset="100%" stop-color="#3e2723"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg)"/>
  <!-- Leaves background -->
  <ellipse cx="60" cy="40" rx="120" ry="18" fill="#388e3c" transform="rotate(-30,60,40)" opacity="0.7"/>
  <ellipse cx="340" cy="50" rx="110" ry="16" fill="#2e7d32" transform="rotate(25,340,50)" opacity="0.6"/>
  <ellipse cx="200" cy="20" rx="130" ry="14" fill="#43a047" transform="rotate(-10,200,20)" opacity="0.5"/>
  <!-- Shadow -->
  <ellipse cx="200" cy="248" rx="90" ry="14" fill="rgba(0,0,0,0.15)"/>
  <!-- Main coconut left -->
  <ellipse cx="150" cy="185" rx="72" ry="70" fill="url(#coco1)"/>
  <!-- Fiber texture lines -->
  <path d="M100,155 Q150,140 200,158" stroke="#6d4c41" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M95,170 Q150,155 205,173" stroke="#6d4c41" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M98,185 Q150,170 202,188" stroke="#6d4c41" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M100,200 Q150,186 200,203" stroke="#6d4c41" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M105,215 Q150,202 195,218" stroke="#6d4c41" stroke-width="1.5" fill="none" opacity="0.5"/>
  <!-- Eye spots -->
  <circle cx="138" cy="158" r="7" fill="#2c1a0e"/>
  <circle cx="157" cy="153" r="7" fill="#2c1a0e"/>
  <circle cx="148" cy="168" r="7" fill="#2c1a0e"/>
  <!-- Main coconut right -->
  <ellipse cx="255" cy="190" rx="68" ry="66" fill="url(#coco2)"/>
  <path d="M205,162 Q255,148 305,165" stroke="#6d4c41" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M200,178 Q255,163 310,180" stroke="#6d4c41" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M202,194 Q255,179 308,196" stroke="#6d4c41" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M205,210 Q255,196 305,212" stroke="#6d4c41" stroke-width="1.5" fill="none" opacity="0.5"/>
  <circle cx="244" cy="163" r="6" fill="#2c1a0e"/>
  <circle cx="262" cy="158" r="6" fill="#2c1a0e"/>
  <circle cx="253" cy="172" r="6" fill="#2c1a0e"/>
  <!-- Label -->
  <rect x="100" y="258" width="200" height="32" rx="16" fill="#2d7a2d"/>
  <text x="200" y="279" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="white">🥥 Fresh Coconut</text>
</svg>`;

// Tender Coconut SVG
const tenderSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <radialGradient id="bg2" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#f1f8e9"/>
      <stop offset="100%" stop-color="#dcedc8"/>
    </radialGradient>
    <radialGradient id="tender" cx="40%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#aed581"/>
      <stop offset="50%" stop-color="#7cb342"/>
      <stop offset="100%" stop-color="#558b2f"/>
    </radialGradient>
    <radialGradient id="topcut" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f5f5f5"/>
      <stop offset="100%" stop-color="#e0e0e0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg2)"/>
  <!-- Background leaves -->
  <ellipse cx="50" cy="30" rx="130" ry="15" fill="#66bb6a" transform="rotate(-25,50,30)" opacity="0.5"/>
  <ellipse cx="360" cy="45" rx="120" ry="14" fill="#4caf50" transform="rotate(20,360,45)" opacity="0.5"/>
  <!-- Wooden board -->
  <rect x="60" y="220" width="280" height="55" rx="8" fill="#a1887f"/>
  <rect x="60" y="220" width="280" height="8" rx="4" fill="#bcaaa4"/>
  <line x1="80" y1="228" x2="80" y2="275" stroke="#8d6e63" stroke-width="1" opacity="0.4"/>
  <line x1="140" y1="228" x2="140" y2="275" stroke="#8d6e63" stroke-width="1" opacity="0.4"/>
  <line x1="200" y1="228" x2="200" y2="275" stroke="#8d6e63" stroke-width="1" opacity="0.4"/>
  <line x1="260" y1="228" x2="260" y2="275" stroke="#8d6e63" stroke-width="1" opacity="0.4"/>
  <line x1="320" y1="228" x2="320" y2="275" stroke="#8d6e63" stroke-width="1" opacity="0.4"/>
  <!-- Shadow -->
  <ellipse cx="200" cy="228" rx="75" ry="10" fill="rgba(0,0,0,0.2)"/>
  <!-- Tender coconut body -->
  <ellipse cx="200" cy="155" rx="78" ry="88" fill="url(#tender)"/>
  <!-- Texture shading -->
  <ellipse cx="175" cy="130" rx="30" ry="40" fill="rgba(255,255,255,0.15)"/>
  <!-- Cut top (flat) -->
  <ellipse cx="200" cy="80" rx="38" ry="15" fill="url(#topcut)"/>
  <ellipse cx="200" cy="80" rx="30" ry="10" fill="#f0f0f0"/>
  <!-- Straw hole -->
  <circle cx="200" cy="80" r="6" fill="#bdbdbd"/>
  <rect x="196" y="20" width="8" height="65" rx="4" fill="#e0e0e0" opacity="0.8"/>
  <!-- Straw -->
  <rect x="197" y="15" width="6" height="70" rx="3" fill="#ffe082"/>
  <rect x="197" y="15" width="6" height="4" rx="2" fill="#ffca28"/>
  <!-- Label -->
  <rect x="85" y="235" width="230" height="28" rx="14" fill="#388e3c"/>
  <text x="200" y="254" text-anchor="middle" font-family="Arial" font-size="13" font-weight="bold" fill="white">🌿 Tender Coconut (Ilaneer)</text>
</svg>`;

// Coconut Oil SVG
const oilSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <radialGradient id="bg3" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#fffde7"/>
      <stop offset="100%" stop-color="#fff8e1"/>
    </radialGradient>
    <linearGradient id="bottle" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e0e0e0"/>
      <stop offset="20%" stop-color="#fafafa"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="80%" stop-color="#f5f5f5"/>
      <stop offset="100%" stop-color="#bdbdbd"/>
    </linearGradient>
    <linearGradient id="oil" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff9c4"/>
      <stop offset="50%" stop-color="#fff176"/>
      <stop offset="100%" stop-color="#f9a825"/>
    </linearGradient>
    <linearGradient id="cap" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4caf50"/>
      <stop offset="100%" stop-color="#1b5e20"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg3)"/>
  <!-- Coconuts in background -->
  <circle cx="80" cy="220" r="45" fill="#8d6e63" opacity="0.3"/>
  <circle cx="320" cy="210" r="40" fill="#8d6e63" opacity="0.25"/>
  <!-- Leaves -->
  <ellipse cx="30" cy="60" rx="100" ry="12" fill="#66bb6a" transform="rotate(-20,30,60)" opacity="0.35"/>
  <ellipse cx="370" cy="70" rx="95" ry="12" fill="#4caf50" transform="rotate(18,370,70)" opacity="0.35"/>
  <!-- Shadow -->
  <ellipse cx="200" cy="263" rx="55" ry="10" fill="rgba(0,0,0,0.15)"/>
  <!-- Bottle body -->
  <rect x="155" y="105" width="90" height="150" rx="12" fill="url(#bottle)"/>
  <!-- Oil inside bottle -->
  <rect x="160" y="140" width="80" height="112" rx="8" fill="url(#oil)" opacity="0.85"/>
  <!-- Oil level shine -->
  <ellipse cx="200" cy="140" rx="40" ry="5" fill="rgba(255,255,255,0.6)"/>
  <!-- Bottle shine -->
  <rect x="165" y="115" width="12" height="130" rx="6" fill="rgba(255,255,255,0.4)"/>
  <!-- Neck -->
  <rect x="172" y="75" width="56" height="35" rx="8" fill="url(#bottle)"/>
  <!-- Cap -->
  <rect x="168" y="58" width="64" height="22" rx="8" fill="url(#cap)"/>
  <rect x="172" y="62" width="56" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
  <!-- Label on bottle -->
  <rect x="162" y="148" width="76" height="88" rx="6" fill="white" opacity="0.9"/>
  <rect x="162" y="148" width="76" height="6" rx="3" fill="#2d7a2d"/>
  <text x="200" y="167" text-anchor="middle" font-family="Arial" font-size="9" font-weight="bold" fill="#1b5e20">COCONUT</text>
  <text x="200" y="178" text-anchor="middle" font-family="Arial" font-size="9" font-weight="bold" fill="#1b5e20">OIL</text>
  <text x="200" y="193" text-anchor="middle" font-family="Arial" font-size="8" fill="#555">Cold Pressed</text>
  <text x="200" y="205" text-anchor="middle" font-family="Arial" font-size="8" fill="#555">Virgin Grade</text>
  <circle cx="200" cy="220" r="14" fill="#e8f5e9"/>
  <text x="200" y="224" text-anchor="middle" font-family="Arial" font-size="10">🥥</text>
  <!-- Label -->
  <rect x="95" y="270" width="210" height="24" rx="12" fill="#f9a825"/>
  <text x="200" y="286" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#1b5e20">🫙 Pure Coconut Oil</text>
</svg>`;

// Coconut Oil 1L SVG (larger bottle)
const oil1lSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <radialGradient id="bg4" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#fffde7"/>
      <stop offset="100%" stop-color="#fff3e0"/>
    </radialGradient>
    <linearGradient id="bottle2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d6d6d6"/>
      <stop offset="25%" stop-color="#fafafa"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="75%" stop-color="#f5f5f5"/>
      <stop offset="100%" stop-color="#bdbdbd"/>
    </linearGradient>
    <linearGradient id="oil2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff9c4"/>
      <stop offset="50%" stop-color="#ffe57f"/>
      <stop offset="100%" stop-color="#f57f17"/>
    </linearGradient>
    <linearGradient id="cap2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6d3a1f"/>
      <stop offset="100%" stop-color="#3e2723"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg4)"/>
  <ellipse cx="70" cy="230" r="40" fill="#8d6e63" opacity="0.25"/>
  <ellipse cx="330" cy="220" r="38" fill="#8d6e63" opacity="0.2"/>
  <ellipse cx="40" cy="55" rx="105" ry="13" fill="#66bb6a" transform="rotate(-22,40,55)" opacity="0.3"/>
  <ellipse cx="360" cy="65" rx="100" ry="12" fill="#4caf50" transform="rotate(16,360,65)" opacity="0.3"/>
  <!-- Shadow -->
  <ellipse cx="200" cy="263" rx="62" ry="10" fill="rgba(0,0,0,0.15)"/>
  <!-- 1L bottle — taller and wider -->
  <rect x="145" y="95" width="110" height="162" rx="14" fill="url(#bottle2)"/>
  <rect x="152" y="128" width="96" height="126" rx="9" fill="url(#oil2)" opacity="0.88"/>
  <ellipse cx="200" cy="128" rx="48" ry="6" fill="rgba(255,255,255,0.55)"/>
  <rect x="156" y="105" width="14" height="148" rx="7" fill="rgba(255,255,255,0.35)"/>
  <!-- Neck -->
  <rect x="164" y="65" width="72" height="36" rx="10" fill="url(#bottle2)"/>
  <!-- Brown Cap (1L style) -->
  <rect x="158" y="46" width="84" height="24" rx="10" fill="url(#cap2)"/>
  <rect x="164" y="50" width="72" height="7" rx="4" fill="rgba(255,255,255,0.15)"/>
  <!-- Label -->
  <rect x="152" y="136" width="96" height="100" rx="8" fill="white" opacity="0.92"/>
  <rect x="152" y="136" width="96" height="8" rx="4" fill="#6d3a1f"/>
  <text x="200" y="158" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="#3e2723">COCONUT</text>
  <text x="200" y="171" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="#3e2723">OIL</text>
  <text x="200" y="184" text-anchor="middle" font-family="Arial" font-size="9" fill="#555">Wood Pressed</text>
  <text x="200" y="196" text-anchor="middle" font-family="Arial" font-size="9" fill="#555">1 Litre</text>
  <circle cx="200" cy="216" r="14" fill="#fff8e1"/>
  <text x="200" y="220" text-anchor="middle" font-family="Arial" font-size="10">🥥</text>
  <!-- Bottom label -->
  <rect x="100" y="270" width="200" height="24" rx="12" fill="#f57f17"/>
  <text x="200" y="286" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="white">🫙 Coconut Oil — 1 Litre</text>
</svg>`;

// Coconut Shell Charcoal SVG
const charcoalSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <radialGradient id="bg5" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#efebe9"/>
      <stop offset="100%" stop-color="#d7ccc8"/>
    </radialGradient>
    <radialGradient id="coal1" cx="35%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#616161"/>
      <stop offset="60%" stop-color="#212121"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <radialGradient id="coal2" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#757575"/>
      <stop offset="60%" stop-color="#424242"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <radialGradient id="coal3" cx="45%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#546e7a"/>
      <stop offset="60%" stop-color="#263238"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg5)"/>
  <!-- Coconut tree hint -->
  <ellipse cx="50" cy="35" rx="110" ry="13" fill="#388e3c" transform="rotate(-25,50,35)" opacity="0.35"/>
  <ellipse cx="355" cy="40" rx="105" ry="12" fill="#2e7d32" transform="rotate(20,355,40)" opacity="0.3"/>
  <!-- Heat glow background -->
  <radialGradient id="glow" cx="50%" cy="80%" r="40%">
    <stop offset="0%" stop-color="#ff6f00" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="#ff6f00" stop-opacity="0"/>
  </radialGradient>
  <ellipse cx="200" cy="240" rx="160" ry="60" fill="url(#glow)"/>
  <!-- Shadow -->
  <ellipse cx="200" cy="250" rx="130" ry="16" fill="rgba(0,0,0,0.25)"/>
  <!-- Charcoal pieces pile -->
  <!-- Back row -->
  <ellipse cx="140" cy="195" rx="52" ry="44" fill="url(#coal1)" transform="rotate(-15,140,195)"/>
  <ellipse cx="260" cy="192" rx="48" ry="42" fill="url(#coal2)" transform="rotate(12,260,192)"/>
  <!-- Middle row -->
  <ellipse cx="195" cy="185" rx="56" ry="46" fill="url(#coal3)" transform="rotate(-5,195,185)"/>
  <!-- Front piece -->
  <ellipse cx="200" cy="215" rx="62" ry="38" fill="url(#coal1)" transform="rotate(3,200,215)"/>
  <!-- Shine/texture on charcoal -->
  <ellipse cx="185" cy="200" rx="18" ry="12" fill="rgba(255,255,255,0.07)" transform="rotate(-10,185,200)"/>
  <ellipse cx="230" cy="192" rx="14" ry="9" fill="rgba(255,255,255,0.05)" transform="rotate(8,230,192)"/>
  <!-- Ember glow dots -->
  <circle cx="175" cy="220" r="4" fill="#ff6f00" opacity="0.8"/>
  <circle cx="220" cy="224" r="3" fill="#ff8f00" opacity="0.7"/>
  <circle cx="197" cy="228" r="2.5" fill="#ffa000" opacity="0.9"/>
  <circle cx="240" cy="210" r="3" fill="#ff6f00" opacity="0.6"/>
  <!-- Coconut shell texture lines -->
  <path d="M155,195 Q180,185 205,195" stroke="rgba(255,255,255,0.08)" stroke-width="2" fill="none"/>
  <path d="M190,178 Q215,170 238,180" stroke="rgba(255,255,255,0.06)" stroke-width="2" fill="none"/>
  <!-- Label -->
  <rect x="90" y="258" width="220" height="30" rx="15" fill="#37474f"/>
  <text x="200" y="277" text-anchor="middle" font-family="Arial" font-size="13" font-weight="bold" fill="white">🔥 Coconut Shell Charcoal</text>
</svg>`;

// Write all SVG files
const images = {
  'coconut.svg': coconutSVG,
  'tender-coconut.svg': tenderSVG,
  'coconut-oil.svg': oilSVG,
  'coconut-oil-1l.svg': oil1lSVG,
  'charcoal.svg': charcoalSVG,
};

for (const [filename, content] of Object.entries(images)) {
  fs.writeFileSync(path.join(dir, filename), content);
  console.log(`✅ Created ${filename}`);
}

console.log('\n✅ All product images generated successfully!');
