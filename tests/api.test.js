/**
 * NatuCoconut — Automated API Test Suite
 * Run: node tests/api.test.js (while docker-compose is up)
 */

const http  = require('http');
const https = require('https');

const BASE = process.env.API_URL || 'http://localhost:5000/api';
let TOKEN = '';
let TEST_USER_MOBILE = '8' + Date.now().toString().slice(-9);
let ORDER_ID = null;
let passed = 0, failed = 0, total = 0;

// ── Tiny HTTP client ─────────────────────────────────────────────────────────
function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url   = new URL(BASE + path);
    const data  = body ? JSON.stringify(body) : null;
    const opts  = {
      hostname: url.hostname, port: url.port || 80,
      path: url.pathname + url.search, method,
      headers: {
        'Content-Type': 'application/json',
        ...(data   && { 'Content-Length': Buffer.byteLength(data) }),
        ...(token  && { 'Authorization': `Bearer ${token}` }),
      },
    };
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request(opts, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch(e) { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// ── Test runner ──────────────────────────────────────────────────────────────
const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

async function run() {
  console.log('\n🥥  NatuCoconut — Automated Test Suite');
  console.log('━'.repeat(56));
  console.log(`   Target: ${BASE}\n`);

  for (const t of tests) {
    total++;
    try {
      await t.fn();
      console.log(`  ✅  ${t.name}`);
      passed++;
    } catch (err) {
      console.log(`  ❌  ${t.name}`);
      console.log(`       → ${err.message}`);
      failed++;
    }
  }

  console.log('\n' + '━'.repeat(56));
  console.log(`   Total: ${total}  ✅ Passed: ${passed}  ❌ Failed: ${failed}`);
  console.log('━'.repeat(56) + '\n');
  process.exit(failed > 0 ? 1 : 0);
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg);
}

// ════════════════════════════════════════════════════════════════════════════
// 1. HEALTH CHECK
// ════════════════════════════════════════════════════════════════════════════
test('API health check returns 200', async () => {
  const r = await request('GET', '/health');
  assert(r.status === 200, `Expected 200, got ${r.status}`);
  assert(r.body.status === 'ok', 'Status should be ok');
});

// ════════════════════════════════════════════════════════════════════════════
// 2. AUTH
// ════════════════════════════════════════════════════════════════════════════
test('Register new customer', async () => {
  const r = await request('POST', '/auth/register', {
    name: 'Test User', mobile: TEST_USER_MOBILE, password: 'test123',
  });
  assert(r.status === 201 || r.status === 200, `Expected 200/201, got ${r.status}: ${JSON.stringify(r.body)}`);
  assert(r.body.token, 'Should return token');
  TOKEN = r.body.token;
});

test('Register duplicate mobile returns 400', async () => {
  const r = await request('POST', '/auth/register', {
    name: 'Dup User', mobile: TEST_USER_MOBILE, password: 'test123',
  });
  assert(r.status === 400 || r.status === 409, `Expected 400/409, got ${r.status}`);
});

test('Login with correct credentials', async () => {
  const r = await request('POST', '/auth/login', {
    mobile: TEST_USER_MOBILE, password: 'test123',
  });
  assert(r.status === 200, `Expected 200, got ${r.status}`);
  assert(r.body.token, 'Should return JWT token');
  TOKEN = r.body.token;
});

test('Login with wrong password returns 401', async () => {
  const r = await request('POST', '/auth/login', {
    mobile: TEST_USER_MOBILE, password: 'wrongpassword',
  });
  assert(r.status === 401 || r.status === 400, `Expected 401, got ${r.status}`);
});

test('Login with non-existent mobile returns error', async () => {
  const r = await request('POST', '/auth/login', {
    mobile: '9000000000', password: 'test123',
  });
  assert(r.status !== 200, `Should not succeed with unknown mobile`);
});

// ════════════════════════════════════════════════════════════════════════════
// 3. PRODUCTS
// ════════════════════════════════════════════════════════════════════════════
test('Get all products returns array', async () => {
  const r = await request('GET', '/products');
  assert(r.status === 200, `Expected 200, got ${r.status}`);
  assert(Array.isArray(r.body), 'Should return array');
  assert(r.body.length >= 5, `Expected at least 5 products, got ${r.body.length}`);
});

test('Products have required fields', async () => {
  const r = await request('GET', '/products');
  const p = r.body[0];
  assert(p.id,        'Product must have id');
  assert(p.name,      'Product must have name');
  assert(p.price,     'Product must have price');
  assert(p.category,  'Product must have category');
  assert(p.image_url, 'Product must have image_url');
});

test('Filter products by category=fresh', async () => {
  const r = await request('GET', '/products?category=fresh');
  assert(r.status === 200, `Expected 200, got ${r.status}`);
  assert(Array.isArray(r.body), 'Should return array');
  r.body.forEach(p => assert(p.category === 'fresh', `Product ${p.name} is not fresh`));
});

test('Filter products by category=oil', async () => {
  const r = await request('GET', '/products?category=oil');
  assert(r.status === 200, `Expected 200, got ${r.status}`);
  assert(r.body.length >= 3, `Expected at least 3 oil products, got ${r.body.length}`);
});

test('Search products by name', async () => {
  const r = await request('GET', '/products?search=coconut');
  assert(r.status === 200, `Expected 200, got ${r.status}`);
  assert(r.body.length > 0, 'Search should return results');
});

test('Search with no results returns empty array', async () => {
  const r = await request('GET', '/products?search=xyznotaproduct999');
  assert(r.status === 200, `Expected 200, got ${r.status}`);
  assert(Array.isArray(r.body), 'Should return array');
  assert(r.body.length === 0, 'Should return empty array for no match');
});

// ════════════════════════════════════════════════════════════════════════════
// 4. ORDERS
// ════════════════════════════════════════════════════════════════════════════
test('Place COD order successfully', async () => {
  const products = await request('GET', '/products');
  const product  = products.body[0];

  const r = await request('POST', '/orders', {
    items: [{ product_id: product.id, quantity: 3, price: product.price }],
    delivery: {
      name: 'Test Delivery', mobile: '9876543210',
      address: '123 Test Street, Test Area',
      city: 'Chennai', district: 'Chennai', pincode: '600001',
    },
    total_amount: product.price * 3 + 50,
    order_type: 'normal',
    payment: { status: 'pending', method: 'cod', ref: 'COD-TEST-' + Date.now() },
  }, TOKEN);

  assert(r.status === 200 || r.status === 201, `Expected 200/201, got ${r.status}: ${JSON.stringify(r.body)}`);
  assert(r.body.order_id, 'Should return order_id');
  ORDER_ID = r.body.order_id;
});

test('Place order without auth returns 401', async () => {
  const r = await request('POST', '/orders', {
    items: [{ product_id: 1, quantity: 3, price: 45 }],
    delivery: { name:'X', mobile:'9876543210', address:'X', city:'X', district:'Chennai', pincode:'600001' },
    total_amount: 185,
    payment: { status:'pending', method:'cod', ref:'TEST' },
  });
  assert(r.status === 401 || r.status === 403, `Expected 401/403, got ${r.status}`);
});

test('Place order with empty items returns 400', async () => {
  const r = await request('POST', '/orders', {
    items: [],
    delivery: { name:'X', mobile:'9876543210', address:'X', city:'X', district:'Chennai', pincode:'600001' },
    total_amount: 0,
    payment: { status:'pending', method:'cod', ref:'TEST' },
  }, TOKEN);
  assert(r.status === 400, `Expected 400, got ${r.status}`);
});

test('Place order with missing delivery returns 400', async () => {
  const r = await request('POST', '/orders', {
    items: [{ product_id: 1, quantity: 3, price: 45 }],
    delivery: { name: '', mobile: '', address: '', city: '', district: '', pincode: '' },
    total_amount: 185,
    payment: { status:'pending', method:'cod', ref:'TEST' },
  }, TOKEN);
  assert(r.status === 400, `Expected 400, got ${r.status}`);
});

test('Get my orders returns array with placed order', async () => {
  const r = await request('GET', '/orders/my', null, TOKEN);
  assert(r.status === 200, `Expected 200, got ${r.status}`);
  assert(Array.isArray(r.body), 'Should return array');
  assert(r.body.length > 0, 'Should have at least one order');
  const found = r.body.find(o => o.id === ORDER_ID);
  assert(found, `Order #${ORDER_ID} not found in my orders`);
});

test('Get my orders without auth returns 401', async () => {
  const r = await request('GET', '/orders/my');
  assert(r.status === 401 || r.status === 403, `Expected 401/403, got ${r.status}`);
});

// ════════════════════════════════════════════════════════════════════════════
// 5. ADMIN
// ════════════════════════════════════════════════════════════════════════════
let ADMIN_TOKEN = '';

test('Admin login succeeds', async () => {
  const r = await request('POST', '/auth/login', {
    mobile: '9999999999', password: 'admin123',
  });
  assert(r.status === 200, `Expected 200, got ${r.status}`);
  assert(r.body.token, 'Should return token');
  ADMIN_TOKEN = r.body.token;
});

test('Admin can get all orders', async () => {
  const r = await request('GET', '/admin/orders', null, ADMIN_TOKEN);
  assert(r.status === 200, `Expected 200, got ${r.status}`);
  assert(Array.isArray(r.body), 'Should return array');
});

test('Admin can get stats', async () => {
  const r = await request('GET', '/admin/stats', null, ADMIN_TOKEN);
  assert(r.status === 200, `Expected 200, got ${r.status}`);
  assert(r.body.total_orders !== undefined, 'Should have total_orders');
  assert(r.body.total_revenue !== undefined, 'Should have total_revenue');
});

test('Admin can update order status', async () => {
  if (!ORDER_ID) { throw new Error('No ORDER_ID - previous test failed'); }
  const r = await request('PATCH', `/admin/orders/${ORDER_ID}/status`, {
    status: 'processing',
  }, ADMIN_TOKEN);
  assert(r.status === 200, `Expected 200, got ${r.status}`);
});

test('Customer cannot access admin routes', async () => {
  const r = await request('GET', '/admin/orders', null, TOKEN);
  assert(r.status === 401 || r.status === 403, `Expected 401/403, got ${r.status}`);
});

// ════════════════════════════════════════════════════════════════════════════
// 6. SECURITY TESTS
// ════════════════════════════════════════════════════════════════════════════
test('SQL injection in search is safe', async () => {
  const r = await request('GET', "/products?search=' OR '1'='1");
  assert(r.status === 200, 'Should handle SQL injection safely');
  assert(Array.isArray(r.body), 'Should return array, not crash');
});

test('XSS in order fields is stored safely', async () => {
  const products = await request('GET', '/products');
  const r = await request('POST', '/orders', {
    items: [{ product_id: products.body[0].id, quantity: 3, price: products.body[0].price }],
    delivery: {
      name: '<script>alert("xss")</script>',
      mobile: '9876543210',
      address: '123 Test Street',
      city: 'Chennai', district: 'Chennai', pincode: '600001',
    },
    total_amount: products.body[0].price * 3 + 50,
    payment: { status: 'pending', method: 'cod', ref: 'XSS-TEST' },
  }, TOKEN);
  assert(r.status === 200 || r.status === 201, 'Should handle XSS input without crashing');
});

test('JWT tampered token is rejected', async () => {
  const fakeToken = TOKEN.slice(0, -10) + 'tampered00';
  const r = await request('GET', '/orders/my', null, fakeToken);
  assert(r.status === 401 || r.status === 403, `Expected 401/403, got ${r.status}`);
});

test('Missing JWT is rejected', async () => {
  const r = await request('GET', '/orders/my', null, null);
  assert(r.status === 401 || r.status === 403, `Expected 401/403, got ${r.status}`);
});

test('Expired/random JWT is rejected', async () => {
  const r = await request('GET', '/orders/my', null, 'Bearer faketoken123');
  assert(r.status === 401 || r.status === 403, `Expected 401/403, got ${r.status}`);
});

test('UPI QR endpoint requires auth', async () => {
  const r = await request('GET', '/orders/upi-qr?amount=100');
  assert(r.status === 401 || r.status === 403, `Expected 401/403, got ${r.status}`);
});

run();
