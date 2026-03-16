import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', mobile: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const pwdStrength = !form.password ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const pwdLabel = ['', 'Weak', 'Good', 'Strong'];
  const pwdColor = ['', '#ef4444', '#f59e0b', '#22c55e'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (!/^[6-9]\d{9}$/.test(form.mobile)) { toast.error('Enter valid Indian mobile number (starts with 6-9)'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name: form.name, mobile: form.mobile, password: form.password });
      login(res.data.token, res.data.user);
      toast.success(`Welcome, ${res.data.user.name}! Start shopping 🥥`);
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="auth-page">
      <div className="auth-page-inner">
        {/* Left panel */}
        <div className="auth-panel-left auth-panel-left-reg">
          <div className="auth-panel-left-content">
            <Link to="/" className="auth-panel-logo">🥥 NatuCoconut</Link>
            <h2 className="auth-panel-heading">Join 500+<br/>Happy Customers<br/><span>Across Tamil Nadu</span></h2>
            <p className="auth-panel-subtext">Create your free account in 30 seconds and start ordering farm-fresh coconut products delivered to your door.</p>
            <div className="auth-steps-list">
              <div className="auth-step-item">
                <div className="auth-step-num">1</div>
                <div className="auth-step-text"><strong>Create account</strong><span>Name, mobile & password</span></div>
              </div>
              <div className="auth-step-item">
                <div className="auth-step-num">2</div>
                <div className="auth-step-text"><strong>Browse & add to cart</strong><span>Min. 3 units per product</span></div>
              </div>
              <div className="auth-step-item">
                <div className="auth-step-num">3</div>
                <div className="auth-step-text"><strong>Place order</strong><span>Give TN delivery address</span></div>
              </div>
              <div className="auth-step-item">
                <div className="auth-step-num">4</div>
                <div className="auth-step-text"><strong>Receive delivery</strong><span>Via India Post / DTDC / BlueDart</span></div>
              </div>
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
              <h1 className="auth-form-title">Create Account</h1>
              <p className="auth-form-subtitle">Free forever. No subscription. No hidden charges.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="af-field">
                <label className="af-label">Full Name</label>
                <input type="text" placeholder="Your full name" value={form.name} onChange={set('name')} required className="af-input"/>
              </div>

              <div className="af-field">
                <label className="af-label">Mobile Number</label>
                <div className="af-input-group">
                  <span className="af-prefix">+91</span>
                  <input type="tel" placeholder="10-digit mobile" value={form.mobile} onChange={set('mobile')} maxLength={10} required className="af-input af-input-with-prefix"/>
                </div>
                <span className="af-hint">Used for login and delivery updates</span>
              </div>

              <div className="af-field">
                <label className="af-label">Password</label>
                <div className="af-input-group">
                  <input type={showPwd ? 'text' : 'password'} placeholder="Minimum 6 characters" value={form.password} onChange={set('password')} required className="af-input"/>
                  <button type="button" className="af-eye-btn" onClick={() => setShowPwd(!showPwd)}>{showPwd ? '🙈' : '👁️'}</button>
                </div>
                {form.password && (
                  <div className="af-strength">
                    <div className="af-strength-bar">
                      <div style={{ width: `${pwdStrength * 33.3}%`, background: pwdColor[pwdStrength] }}/>
                    </div>
                    <span style={{ color: pwdColor[pwdStrength] }}>{pwdLabel[pwdStrength]}</span>
                  </div>
                )}
              </div>

              <div className="af-field">
                <label className="af-label">Confirm Password</label>
                <div className="af-input-group">
                  <input type="password" placeholder="Repeat your password" value={form.confirm} onChange={set('confirm')} required className="af-input"/>
                  {form.confirm && (
                    <span className={`af-match ${form.password === form.confirm ? 'match-ok' : 'match-fail'}`}>
                      {form.password === form.confirm ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              </div>

              <button type="submit" className="af-submit-btn" disabled={loading}>
                {loading ? <span className="af-spinner"/> : 'Create Free Account'}
              </button>
            </form>

            <div className="auth-divider"><span>OR</span></div>
            <div className="auth-switch">
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">Login →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
