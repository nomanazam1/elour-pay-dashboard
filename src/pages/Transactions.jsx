import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../lib/api.js';
import './Home.css';

function fmt(n) { return 'Rs ' + parseFloat(n||0).toLocaleString('en-PK'); }

function statusBadge(s) {
  const m = { completed:'badge-success', pending:'badge-warning', on_hold:'badge-warning', failed:'badge-danger', refunded:'badge-neutral' };
  return <span className={`badge ${m[s]||'badge-neutral'}`}>{s?.replace('_',' ')}</span>;
}

export default function Transactions() {
  const [data,    setData]    = useState([]);
  const [meta,    setMeta]    = useState({});
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set('search', search);
    if (status) params.set('status', status);

    apiFetch(`/api/transactions?${params}`)
      .then(r => { setData(r.data || []); setMeta(r.meta || {}); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-title">Transactions</div>
        <div className="page-subtitle">All payment attempts through Élour Pay</div>
      </div>

      <div className="filter-bar">
        <input
          className="filter-input"
          placeholder="Search by name, email, reference…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select className="filter-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="on_hold">On Hold</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div className="empty-state"><div className="spinner" /></div>
        ) : data.length === 0 ? (
          <div className="empty-state">No transactions found.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Bank</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reference</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map(tx => (
                <tr key={tx.id}>
                  <td className="text-gold">#{tx.order_id}</td>
                  <td>
                    <div>{tx.customer_name || '—'}</div>
                    <div style={{fontSize:'11px',color:'var(--text-3)'}}>{tx.customer_email || ''}</div>
                  </td>
                  <td>{tx.bank_code || '—'}</td>
                  <td className="amount">{fmt(tx.amount)}</td>
                  <td>{statusBadge(tx.status)}</td>
                  <td style={{fontSize:'11px',color:'var(--text-2)',fontFamily:'monospace'}}>
                    {tx.safepay_ref || '—'}
                  </td>
                  <td className="text-muted">
                    {new Date(tx.created_at).toLocaleDateString('en-PK')}
                  </td>
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
            <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p-1)}>← Prev</button>
            <button className="page-btn" disabled={page * 20 >= meta.total} onClick={() => setPage(p => p+1)}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
