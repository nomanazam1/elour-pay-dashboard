import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.js';
import './Home.css';

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`stat-card ${accent ? 'accent' : ''}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function statusBadge(status) {
  const map = {
    completed: 'badge-success',
    pending:   'badge-warning',
    on_hold:   'badge-warning',
    failed:    'badge-danger',
    refunded:  'badge-neutral',
  };
  return <span className={`badge ${map[status] || 'badge-neutral'}`}>{status}</span>;
}

function fmt(n) {
  return 'Rs ' + parseFloat(n || 0).toLocaleString('en-PK', { minimumFractionDigits: 0 });
}

export default function Home() {
  const [summary, setSummary] = useState(null);
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch('/api/analytics/summary'),
      apiFetch('/api/transactions?limit=8'),
    ]).then(([s, t]) => {
      setSummary(s.data);
      setRecent(t.data || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-loading"><div className="spinner" /></div>
  );

  const t = summary?.today || {};
  const y = summary?.yesterday || {};
  const revDiff = t.revenue - y.revenue;

  return (
    <div className="home-page fade-up">
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-subtitle">
          {new Date().toLocaleDateString('en-PK', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <StatCard
          label="Today's Revenue"
          value={fmt(t.revenue)}
          sub={revDiff >= 0
            ? `+${fmt(revDiff)} vs yesterday`
            : `${fmt(revDiff)} vs yesterday`}
          accent
        />
        <StatCard label="Orders Today"      value={t.orders || 0}          sub="total placed" />
        <StatCard label="Successful"        value={t.successful_txns || 0} sub="payments confirmed" />
        <StatCard label="Failed"            value={t.failed_txns || 0}     sub="payment attempts" />
        <StatCard label="Pending"           value={t.pending || 0}         sub="awaiting confirmation" />
        <StatCard label="Refunds Issued"    value={fmt(t.refund_amount)}   sub="today" />
      </div>

      {/* Recent transactions */}
      <div className="section-header">
        <div className="section-title">Recent Transactions</div>
      </div>

      <div className="card">
        {recent.length === 0 ? (
          <div className="empty-state">No transactions yet.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Bank</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(tx => (
                <tr key={tx.id}>
                  <td className="text-gold">#{tx.order_id}</td>
                  <td>{tx.customer_name || '—'}</td>
                  <td>{tx.bank_code || '—'}</td>
                  <td className="amount">{fmt(tx.amount)}</td>
                  <td>{statusBadge(tx.status)}</td>
                  <td className="text-muted">
                    {new Date(tx.created_at).toLocaleTimeString('en-PK', { hour:'2-digit', minute:'2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
