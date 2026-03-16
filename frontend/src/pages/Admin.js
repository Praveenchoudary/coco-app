import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = { placed: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' };

export default function Admin() {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        API.get('/admin/orders', { params: filterStatus ? { status: filterStatus } : {} }),
        API.get('/admin/stats'),
      ]);
      setOrders(ordersRes.data);
      setStats(statsRes.data);
    } catch (e) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filterStatus]);

  const updateStatus = async (orderId, status) => {
    try {
      await API.patch(`/admin/orders/${orderId}/status`, { status });
      toast.success(`Order #${orderId} → ${status}`);
      fetchData();
    } catch (e) { toast.error('Failed to update status'); }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🥥 Admin Dashboard</h1>
        <p>NatuCoconut - Order Management</p>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {[
          { label: 'Total Orders', value: stats.total_orders || 0, icon: '📦', color: '#3b82f6' },
          { label: 'Pending Orders', value: stats.pending_orders || 0, icon: '⏳', color: '#f59e0b' },
          { label: 'Total Revenue', value: `₹${parseFloat(stats.total_revenue || 0).toFixed(0)}`, icon: '💰', color: '#10b981' },
          { label: 'Customers', value: stats.total_customers || 0, icon: '👥', color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
            <div className="stat-card-icon">{s.icon}</div>
            <div>
              <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="admin-filters">
        <span>Filter by status:</span>
        {['', ...STATUS_OPTIONS].map(s => (
          <button key={s} className={`filter-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <button className="btn-refresh" onClick={fetchData}>🔄 Refresh</button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="page-loading"><div className="spinner" /><p>Loading orders...</p></div>
      ) : orders.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📦</div><h3>No orders found</h3></div>
      ) : (
        <div className="admin-orders">
          {orders.map(order => (
            <div key={order.id} className="admin-order-card">
              <div className="admin-order-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="admin-order-meta">
                  <span className="admin-order-id">Order #{order.id}</span>
                  <span className="admin-order-date">{new Date(order.created_at).toLocaleString('en-IN')}</span>
                </div>
                <div className="admin-order-customer">
                  <strong>{order.customer_name}</strong>
                  <span>📱 {order.customer_mobile}</span>
                </div>
                <div className="admin-order-amount">₹{parseFloat(order.total_amount).toFixed(2)}</div>
                <div className="admin-status-control">
                  <select
                    value={order.order_status}
                    onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value); }}
                    style={{ color: STATUS_COLORS[order.order_status] }}
                    onClick={e => e.stopPropagation()}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
                <span className="expand-icon">{expanded === order.id ? '▲' : '▼'}</span>
              </div>

              {expanded === order.id && (
                <div className="admin-order-detail">
                  <div className="admin-detail-cols">
                    <div className="admin-delivery-detail">
                      <h4>🏠 Delivery Address</h4>
                      <p><strong>{order.delivery_name}</strong></p>
                      <p>📱 {order.delivery_mobile}</p>
                      <p>{order.delivery_address}</p>
                      <p>{order.delivery_city}, {order.delivery_district} - {order.delivery_pincode}</p>
                      <p>Tamil Nadu</p>
                    </div>
                    <div className="admin-items-detail">
                      <h4>📦 Items Ordered</h4>
                      {order.items?.map(item => (
                        <div key={item.id} className="admin-item-row">
                          <span>{item.name}</span>
                          <span>{item.unit}</span>
                          <span className="admin-item-qty">× {item.quantity}</span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="admin-order-total-row">
                        <span>Total Amount</span>
                        <strong>₹{parseFloat(order.total_amount).toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="admin-delivery-actions">
                    <h4>📮 Courier Arrangement</h4>
                    <div className="courier-info">
                      <div className="courier-badge">India Post</div>
                      <div className="courier-badge">DTDC</div>
                      <div className="courier-badge">BlueDart</div>
                      <div className="courier-badge">Delhivery</div>
                    </div>
                    <p className="courier-note">Use the customer's address above to book shipment with your preferred courier partner. Update order status after booking.</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
