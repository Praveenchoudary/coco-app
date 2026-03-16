import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { getImg, FALLBACK } from '../utils/images';

const STATUS_CONFIG = {
  placed:      { color:'#f59e0b', bg:'#fff8e1', icon:'📦', label:'Order Placed' },
  processing:  { color:'#3b82f6', bg:'#eff6ff', icon:'⚙️', label:'Processing' },
  shipped:     { color:'#8b5cf6', bg:'#f5f3ff', icon:'🚚', label:'Shipped' },
  delivered:   { color:'#16a34a', bg:'#f0fdf4', icon:'✅', label:'Delivered' },
  cancelled:   { color:'#ef4444', bg:'#fef2f2', icon:'❌', label:'Cancelled' },
};

const STEPS = ['placed','processing','shipped','delivered'];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    API.get('/orders/my')
      .then(r => { setOrders(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="orders-loading">
      <div className="ol-spinner"/>
      <p>Loading your orders...</p>
    </div>
  );

  if (orders.length === 0) return (
    <div className="orders-empty">
      <div className="oe-icon">📦</div>
      <h2>No orders yet</h2>
      <p>Start shopping for fresh coconut products!</p>
      <Link to="/products" className="oe-cta">Shop Now 🥥</Link>
    </div>
  );

  return (
    <div className="orders-pg">
      <div className="orders-pg-inner">
        <div className="orders-pg-hdr">
          <h1>My Orders</h1>
          <p>{orders.length} order{orders.length > 1 ? 's' : ''} placed</p>
        </div>

        <div className="orders-list">
          {orders.map(order => {
            const cfg = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.placed;
            const isExpanded = expanded === order.id;
            const stepIdx = STEPS.indexOf(order.order_status);

            return (
              <div key={order.id} className={`order-card ${isExpanded ? 'expanded' : ''}`}>
                {/* Card header */}
                <div className="oc-header" onClick={() => setExpanded(isExpanded ? null : order.id)}>
                  <div className="oc-header-left">
                    <div className="oc-id-block">
                      <span className="oc-id">Order #{order.id}</span>
                      <span className="oc-date">{new Date(order.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                    </div>
                    <div className="oc-status-badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }}>
                      {cfg.icon} {cfg.label}
                    </div>
                  </div>
                  <div className="oc-header-right">
                    <span className="oc-total">₹{parseFloat(order.total_amount).toFixed(0)}</span>
                    <span className="oc-items-count">{order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}</span>
                    <span className="oc-expand-icon">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Items preview (collapsed) */}
                {!isExpanded && (
                  <div className="oc-items-preview">
                    {order.items?.slice(0, 2).map(item => (
                      <div key={item.id} className="oc-item-thumb">
                        <img src={getImg(item.image_url)} alt={item.name} className="oc-item-img"
                          onError={e => { e.target.onerror=null; e.target.src=FALLBACK; }}/>
                        <span>{item.name} × {item.quantity}</span>
                      </div>
                    ))}
                    {(order.items?.length || 0) > 2 && (
                      <span className="oc-more-items">+{order.items.length - 2} more</span>
                    )}
                  </div>
                )}

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="oc-detail">
                    {/* Tracker - only show if not cancelled */}
                    {order.order_status !== 'cancelled' && (
                      <div className="oc-tracker">
                        {STEPS.map((step, idx) => {
                          const stepCfg = STATUS_CONFIG[step];
                          const done = idx <= stepIdx;
                          return (
                            <React.Fragment key={step}>
                              <div className={`oct-step ${done ? 'done' : ''} ${idx === stepIdx ? 'current' : ''}`}>
                                <div className="oct-circle">{done ? '✓' : idx + 1}</div>
                                <span className="oct-label">{stepCfg.label}</span>
                              </div>
                              {idx < STEPS.length - 1 && (
                                <div className={`oct-line ${idx < stepIdx ? 'done' : ''}`}/>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}

                    <div className="oc-detail-cols">
                      {/* Items */}
                      <div className="oc-detail-items">
                        <h4>Items Ordered</h4>
                        {order.items?.map(item => (
                          <div key={item.id} className="oc-detail-item">
                            <img src={getImg(item.image_url)} alt={item.name} className="oc-detail-img"
                              onError={e => { e.target.onerror=null; e.target.src=FALLBACK; }}/>
                            <div className="oc-detail-item-info">
                              <span className="oc-detail-item-name">{item.name}</span>
                              <span className="oc-detail-item-unit">{item.unit}</span>
                            </div>
                            <span className="oc-detail-item-qty">× {item.quantity}</span>
                            <span className="oc-detail-item-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                        <div className="oc-detail-total">
                          <span>Total</span>
                          <span>₹{parseFloat(order.total_amount).toFixed(0)}</span>
                        </div>
                      </div>

                      {/* Delivery address */}
                      <div className="oc-detail-address">
                        <h4>Delivery Address</h4>
                        <div className="oc-address-box">
                          <div className="oc-addr-name">{order.delivery_name}</div>
                          <div className="oc-addr-mobile">📱 +91 {order.delivery_mobile}</div>
                          <div className="oc-addr-line">{order.delivery_address}</div>
                          <div className="oc-addr-line">{order.delivery_city}, {order.delivery_district}</div>
                          <div className="oc-addr-line">Tamil Nadu - {order.delivery_pincode}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
