// Orders.jsx
import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../lib/api.js';
import './Home.css';

function fmt(n) { return 'Rs ' + parseFloat(n||0).toLocaleString('en-PK'); }

export function Orders() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page, limit: 20 });
    if (search) p.set('search', search);
    if (status) p.set('status', status);
    apiFetch(`/api/orders?${p}`)
      .then(r => { setData(r.data||[]); setMeta(r.meta||{}); })
      .catch(console.error).finally(() => setLoading(false));
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-title">Orders</div>
        <div className="page-subtitle">WooCommerce orders synced to Élour Pay</div>
      </div>
      <div className="filter-bar">
        <input className="filter-input" placeholder="Search orders…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <select className="filter-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="card">
        {loading ? <div className="empty-state"><div className="spinner"/></div>
        : data.length === 0 ? <div className="empty-state">No orders found.</div>
        : (
          <table className="data-table">
            <thead><tr><th>Order</th><th>Customer</th><th>City</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {data.map(o => (
                <tr key={o.id}>
                  <td className="text-gold">#{o.wc_order_number || o.wc_order_id}</td>
                  <td>
                    <div>{o.customer_name||'—'}</div>
                    <div style={{fontSize:'11px',color:'var(--text-3)'}}>{o.customer_email||''}</div>
                  </td>
                  <td className="text-muted">{o.customer_city||'—'}</td>
                  <td className="amount">{fmt(o.total)}</td>
                  <td><span className="badge badge-neutral">{o.status}</span></td>
                  <td className="text-muted">{new Date(o.created_at).toLocaleDateString('en-PK')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {meta.total > 0 && (
        <div className="pagination">
          <span>{meta.total} total · page {page}</span>
          <div className="pagination-btns">
            <button className="page-btn" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>← Prev</button>
            <button className="page-btn" disabled={page*20>=meta.total} onClick={()=>setPage(p=>p+1)}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
