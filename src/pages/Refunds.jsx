import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.js';
import './Home.css';
import './Refunds.css';

function fmt(n) { return 'Rs ' + parseFloat(n||0).toLocaleString('en-PK'); }

export default function Refunds() {
  const [refunds,  setRefunds]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState({ transaction_id:'', amount:'', reason:'' });
  const [submitting, setSubmitting] = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  function load() {
    setLoading(true);
    apiFetch('/api/refunds')
      .then(r => setRefunds(r.data||[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      await apiFetch('/api/refunds', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setSuccess('Refund initiated successfully.');
      setModal(false);
      setForm({ transaction_id:'', amount:'', reason:'' });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fade-up">
      <div className="page-header" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div>
          <div className="page-title">Refunds</div>
          <div className="page-subtitle">Initiate and track all refund actions</div>
        </div>
        <button className="action-btn" onClick={() => { setModal(true); setError(''); setSuccess(''); }}>
          + New Refund
        </button>
      </div>

      {success && (
        <div className="refund-success">{success}</div>
      )}

      <div className="card">
        {loading ? <div className="empty-state"><div className="spinner"/></div>
        : refunds.length === 0 ? <div className="empty-state">No refunds issued yet.</div>
        : (
          <table className="data-table">
            <thead>
              <tr><th>Order</th><th>Amount</th><th>Reason</th><th>Status</th><th>Reference</th><th>Date</th></tr>
            </thead>
            <tbody>
              {refunds.map(r => (
                <tr key={r.id}>
                  <td className="text-gold">#{r.order_id}</td>
                  <td className="amount">{fmt(r.amount)}</td>
                  <td className="text-muted">{r.reason || '—'}</td>
                  <td>
                    <span className={`badge ${r.status==='completed'?'badge-success':r.status==='failed'?'badge-danger':'badge-warning'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{fontSize:'11px',color:'var(--text-2)',fontFamily:'monospace'}}>{r.safepay_ref||'—'}</td>
                  <td className="text-muted">{new Date(r.created_at).toLocaleDateString('en-PK')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Refund modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Initiate Refund</div>
              <button className="modal-close" onClick={() => setModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="modal-error">{error}</div>}
              <div className="modal-field">
                <label>Transaction ID</label>
                <input type="text" placeholder="UUID from transactions list"
                  value={form.transaction_id}
                  onChange={e => setForm(f=>({...f,transaction_id:e.target.value}))}
                  required />
              </div>
              <div className="modal-field">
                <label>Amount (PKR)</label>
                <input type="number" placeholder="0.00" step="0.01" min="1"
                  value={form.amount}
                  onChange={e => setForm(f=>({...f,amount:e.target.value}))}
                  required />
              </div>
              <div className="modal-field">
                <label>Reason</label>
                <input type="text" placeholder="Customer request, damaged item, etc."
                  value={form.reason}
                  onChange={e => setForm(f=>({...f,reason:e.target.value}))} />
              </div>
              <div className="modal-actions">
                <button type="button" className="action-btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="action-btn" disabled={submitting}>
                  {submitting ? <span className="spinner" style={{width:14,height:14}}/> : 'Confirm Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
