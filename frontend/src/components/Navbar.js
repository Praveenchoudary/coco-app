import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count, total } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => setMobileOpen(false), [location]);

  useEffect(() => {
    const handler = (e) => { if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?search=${encodeURIComponent(search.trim())}`); setSearch(''); }
  };

  return (
    <>
      <header className="nk-header">
        {/* Top strip */}
        <div className="nk-top">
          <div className="nk-top-inner">
            {/* Brand */}
            <Link to="/" className="nk-brand">
              <span className="nk-brand-icon">🥥</span>
              <div>
                <div className="nk-brand-name">NatuCoconut</div>
                <div className="nk-brand-sub">Tamil Nadu's Finest</div>
              </div>
            </Link>

            {/* Search */}
            <form className="nk-search" onSubmit={handleSearch}>
              <select className="nk-search-cat" defaultValue="all">
                <option value="all">All</option>
                <option value="fresh">Fresh</option>
                <option value="oil">Oils</option>
              </select>
              <input
                type="text"
                className="nk-search-input"
                placeholder="Search tender coconut, coconut oil..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="nk-search-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </form>

            {/* Right actions */}
            <div className="nk-actions">
              {user ? (
                <div className="nk-account" ref={accountRef}>
                  <button className="nk-account-btn" onClick={() => setAccountOpen(!accountOpen)}>
                    <div className="nk-account-avatar">{user.name[0].toUpperCase()}</div>
                    <div className="nk-account-info">
                      <span className="nk-account-hi">Hello, {user.name.split(' ')[0]}</span>
                      <span className="nk-account-label">Account ▾</span>
                    </div>
                  </button>
                  {accountOpen && (
                    <div className="nk-dropdown">
                      <div className="nk-dropdown-header">
                        <div className="nk-dropdown-avatar">{user.name[0].toUpperCase()}</div>
                        <div>
                          <div className="nk-dropdown-name">{user.name}</div>
                          <div className="nk-dropdown-mobile">+91 {user.mobile}</div>
                        </div>
                      </div>
                      {!isAdmin && <Link to="/my-orders" className="nk-dropdown-item" onClick={() => setAccountOpen(false)}>
                        <span>📦</span> My Orders
                      </Link>}
                      {isAdmin && <Link to="/admin" className="nk-dropdown-item" onClick={() => setAccountOpen(false)}>
                        <span>⚙️</span> Admin Panel
                      </Link>}
                      <button className="nk-dropdown-item nk-dropdown-logout" onClick={() => { logout(); navigate('/'); setAccountOpen(false); }}>
                        <span>🚪</span> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="nk-auth-btns">
                  <Link to="/login" className="nk-login-btn">Login</Link>
                  <Link to="/register" className="nk-register-btn">Sign Up Free</Link>
                </div>
              )}

              {user && !isAdmin && (
                <Link to="/cart" className="nk-cart-btn">
                  <div className="nk-cart-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    {count > 0 && <span className="nk-cart-badge">{count}</span>}
                  </div>
                  <div className="nk-cart-text">
                    <span className="nk-cart-top">Cart</span>
                    {count > 0 && <span className="nk-cart-val">₹{total.toFixed(0)}</span>}
                  </div>
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button className="nk-burger" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Sub nav */}
        <nav className="nk-subnav">
          <div className="nk-subnav-inner">
            <Link to="/products" className={location.pathname === '/products' && !location.search ? 'active' : ''}>🥥 All Products</Link>
            <Link to="/products?category=fresh" className={location.search === '?category=fresh' ? 'active' : ''}>🌿 Tender Coconut</Link>
            <Link to="/products?category=fresh&type=water" className="">💧 Coconut Water</Link>
            <Link to="/products?category=oil" className={location.search === '?category=oil' ? 'active' : ''}>🫙 Coconut Oil</Link>
            <span className="nk-subnav-delivery">🚚 Free delivery above ₹500 · All 38 TN Districts · Min. 3 units</span>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="nk-mobile-menu">
            <form className="nk-mobile-search" onSubmit={handleSearch}>
              <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
              <button type="submit">🔍</button>
            </form>
            <Link to="/products">🥥 All Products</Link>
            <Link to="/products?category=fresh">🌿 Tender Coconut</Link>
            <Link to="/products?category=oil">🫙 Coconut Oil</Link>
            {user && !isAdmin && <Link to="/cart">🛒 Cart ({count}) - ₹{total.toFixed(0)}</Link>}
            {user && !isAdmin && <Link to="/my-orders">📦 My Orders</Link>}
            {isAdmin && <Link to="/admin">⚙️ Admin Panel</Link>}
            {user ? (
              <button className="nk-mobile-logout" onClick={() => { logout(); navigate('/'); }}>🚪 Logout ({user.name})</button>
            ) : (
              <><Link to="/login">Login</Link><Link to="/register">Register Free</Link></>
            )}
          </div>
        )}
      </header>
    </>
  );
}
