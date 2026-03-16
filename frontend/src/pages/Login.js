import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [searchParams] = (typeof window !== 'undefined' && window.URLSearchParams)
    ? [new URLSearchParams(window.location.search)]
    : [{ get: () => null }];
  
  React.useEffect(() => {
    const msg = searchParams.get ? searchParams.get('msg') : null;
    if (msg) toast.error(msg);
  }, []); // eslint-disable-line
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mobile || !password) { toast.error('Please enter mobile and password'); return; }
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { mobile, password });
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}! 🥥`);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid mobile number or password');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-inner">

        {/* Left panel */}
        <div className="auth-panel-left">
          <div className="auth-panel-left-content">
            <Link to="/" className="auth-panel-logo">🥥 NatuCoconut</Link>
            <h2 className="auth-panel-heading">Fresh Coconuts<br/>& Pure Oils<br/><span>Delivered to You</span></h2>
            <p className="auth-panel-subtext">Tamil Nadu's trusted coconut store. Farm-fresh products delivered to all 38 districts.</p>
            <div className="auth-panel-features">
              <div className="auth-panel-feat"><span className="apf-icon">🌿</span><span>Farm-fresh tender coconuts</span></div>
              <div className="auth-panel-feat"><span className="apf-icon">🫙</span><span>Cold-pressed coconut oil</span></div>
              <div className="auth-panel-feat"><span className="apf-icon">🎊</span><span>Bulk orders for marriages & functions</span></div>
              <div className="auth-panel-feat"><span className="apf-icon">🚚</span><span>All 38 Tamil Nadu districts</span></div>
            </div>
            <div className="auth-panel-coconut">
              <svg viewBox="0 0 180 200" style={{width:140,height:'auto',filter:'drop-shadow(0 12px 24px rgba(0,0,0,.4))',animation:'acFloat 4s ease-in-out infinite'}}>
                <defs>
                  <radialGradient id="lpc1" cx="38%" cy="32%" r="65%"><stop offset="0%" stopColor="#a5d6a7"/><stop offset="45%" stopColor="#4caf50"/><stop offset="100%" stopColor="#1b5e20"/></radialGradient>
                </defs>
                <ellipse cx="90" cy="185" rx="68" ry="11" fill="rgba(0,0,0,0.18)"/>
                <ellipse cx="90" cy="115" rx="84" ry="86" fill="url(#lpc1)"/>
                <ellipse cx="62" cy="84" rx="34" ry="30" fill="rgba(255,255,255,0.32)"/>
                <path d="M90,34 Q68,8 44,0" stroke="#2e7d32" strokeWidth="5" fill="none" strokeLinecap="round"/>
                <path d="M90,34 Q112,6 136,0" stroke="#2e7d32" strokeWidth="5" fill="none" strokeLinecap="round"/>
                <rect x="84" y="22" width="12" height="22" rx="6" fill="#33691e"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-panel-right">
          <div className="auth-form-wrap">
            <Link to="/" className="auth-back-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
              Back to Home
            </Link>
            <div className="auth-form-header">
              <h1 className="auth-form-title">Login</h1>
              <p className="auth-form-subtitle">Welcome back! Enter your details to continue.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="af-field">
                <label className="af-label">Mobile Number</label>
                <div className="af-input-group">
                  <span className="af-prefix">+91</span>
                  <input type="tel" placeholder="10-digit mobile number" value={mobile}
                    onChange={e => setMobile(e.target.value)} maxLength={10} required
                    className="af-input af-input-with-prefix"/>
                </div>
              </div>
              <div className="af-field">
                <label className="af-label">Password</label>
                <div className="af-input-group">
                  <input type={showPwd ? 'text' : 'password'} placeholder="Enter your password"
                    value={password} onChange={e => setPassword(e.target.value)} required className="af-input"/>
                  <button type="button" className="af-eye-btn" onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button type="submit" className="af-submit-btn" disabled={loading}>
                {loading ? <span className="af-spinner"/> : 'Login to Account'}
              </button>
            </form>

            <div className="auth-divider"><span>OR</span></div>
            <div className="auth-switch">
              New to NatuCoconut? <Link to="/register" className="auth-switch-link">Create free account →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
