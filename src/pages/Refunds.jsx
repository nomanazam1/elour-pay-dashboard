import { useState } from "react";
import {
  C, FONTS, fmt,
  Badge, Card, CardHeader, DataTable, PageWrapper,
  ActionButton,
} from "./theme";
import { apiFetch } from "../lib/api";

const INITIAL_REFUNDS = [
  { id: "REF-001", txId: "EL-98208", customer: "Nadia Siddiqui", amount: 15600, reason: "Customer request",     status: "refunded", date: "2026-03-23", ref: "SP-REF-001" },
  { id: "REF-002", txId: "EL-98201", customer: "Ali Khan",       amount: 8900,  reason: "Damaged item",         status: "refunded", date: "2026-03-22", ref: "SP-REF-002" },
  { id: "REF-003", txId: "EL-98196", customer: "Sana Mirza",     amount: 22000, reason: "Wrong item delivered",  status: "refunded", date: "2026-03-21", ref: "SP-REF-003" },
];

const COLUMNS = [
  {
    key: "id", label: "Refund ID",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 12, color: C.info, fontWeight: 600 }}>#{v}</span>,
  },
  {
    key: "txId", label: "Transaction",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 12, color: C.gold }}>#{v}</span>,
  },
  {
    key: "customer", label: "Customer",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 13, color: C.black }}>{v}</span>,
  },
  {
    key: "amount", label: "Amount",
    render: (v) => <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600, color: C.black }}>{fmt(v)}</span>,
  },
  {
    key: "reason", label: "Reason",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 12, color: C.text2 }}>{v}</span>,
  },
  {
    key: "status", label: "Status",
    render: (v) => <Badge status={v} />,
  },
  {
    key: "ref", label: "Safepay Ref",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text3, fontFamily: "monospace" }}>{v}</span>,
  },
  {
    key: "date", label: "Date",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text3 }}>{v}</span>,
  },
];

function RefundModal({ onClose, onSubmit }) {
  const [form, setForm]       = useState({ txId: "", amount: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit() {
    if (!form.txId || !form.amount) { setError("Transaction ID and amount are required."); return; }
    setError(""); setLoading(true);
    try {
      // In production: await apiFetch('/api/refunds', { method: 'POST', body: JSON.stringify(form) });
      await new Promise((r) => setTimeout(r, 800)); // simulate API
      onSubmit({
        id:       `REF-00${Math.floor(Math.random() * 900 + 100)}`,
        txId:     form.txId,
        customer: "Manual Entry",
        amount:   parseFloat(form.amount),
        reason:   form.reason || "No reason provided",
        status:   "refunded",
        date:     new Date().toISOString().split("T")[0],
        ref:      `SP-REF-${Date.now().toString().slice(-6)}`,
      });
    } catch (e) {
      setError(e.message || "Refund failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(5,5,5,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: C.surface, borderRadius: 14,
        padding: 32, width: 420, maxWidth: "90vw",
        border: `1px solid ${C.border}`,
        boxShadow: "0 20px 60px rgba(5,5,5,0.2)",
      }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 600, color: C.black }}>New Refund</div>
            <div style={{ fontFamily: FONTS.body, fontSize: 12, color: C.text3, marginTop: 3 }}>
              Automatically tagged to the transaction record
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.text3, fontSize: 20, lineHeight: 1 }}>&times;</button>
        </div>

        {error && (
          <div style={{ background: C.dangerBg, border: `1px solid rgba(176,48,48,0.2)`, borderRadius: 7, padding: "10px 14px", marginBottom: 16, fontFamily: FONTS.body, fontSize: 13, color: C.danger }}>
            {error}
          </div>
        )}

        {[
          { label: "Transaction ID", key: "txId",   placeholder: "e.g. EL-98214",               type: "text"   },
          { label: "Refund Amount (PKR)", key: "amount", placeholder: "e.g. 12000",              type: "number" },
          { label: "Reason (optional)", key: "reason", placeholder: "Customer request, damaged item…", type: "text" },
        ].map((f) => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{
              display: "block", fontFamily: FONTS.display,
              fontSize: 10, fontWeight: 600, color: C.text2,
              letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
            }}>{f.label}</label>
            <input
              type={f.type} placeholder={f.placeholder} value={form[f.key]}
              onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
              style={{
                width: "100%", padding: "11px 13px", boxSizing: "border-box",
                background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 8,
                fontFamily: FONTS.body, fontSize: 13, color: C.black, outline: "none",
              }}
            />
          </div>
        ))}

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: 12, background: C.bg,
            border: `1px solid ${C.border}`, borderRadius: 8,
            fontFamily: FONTS.body, fontSize: 13, cursor: "pointer", color: C.text2,
          }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{
            flex: 1, padding: 12, background: loading ? C.text3 : C.black,
            border: "none", borderRadius: 8,
            fontFamily: FONTS.body, fontSize: 13, fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer", color: "#F9F7F3",
          }}>
            {loading ? "Processing…" : "Confirm Refund"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Refunds() {
  const [refunds,   setRefunds]   = useState(INITIAL_REFUNDS);
  const [showModal, setShowModal] = useState(false);
  const [success,   setSuccess]   = useState("");

  function handleNewRefund(refund) {
    setRefunds((prev) => [refund, ...prev]);
    setShowModal(false);
    setSuccess(`Refund #${refund.id} initiated and tagged to transaction #${refund.txId}.`);
    setTimeout(() => setSuccess(""), 5000);
  }

  return (
    <PageWrapper>
      {/* Header action */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Total Refunded",  value: fmt(refunds.reduce((a, b) => a + b.amount, 0)) },
            { label: "Refund Count",    value: refunds.length },
            { label: "Avg Refund",      value: fmt(refunds.reduce((a, b) => a + b.amount, 0) / refunds.length) },
          ].map((s) => (
            <div key={s.label} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 10, padding: "14px 20px", minWidth: 150,
            }}>
              <div style={{ fontFamily: FONTS.body, fontSize: 9, color: C.text3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.black }}>{s.value}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} style={{
          background: C.black, color: "#F9F7F3", border: "none",
          borderRadius: 8, padding: "11px 20px",
          fontFamily: FONTS.body, fontSize: 13, fontWeight: 500,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          whiteSpace: "nowrap",
        }}>+ New Refund</button>
      </div>

      {/* Success message */}
      {success && (
        <div style={{
          background: C.successBg, border: `1px solid rgba(42,110,71,0.2)`,
          borderRadius: 8, padding: "12px 16px", marginBottom: 20,
          fontFamily: FONTS.body, fontSize: 13, color: C.success,
        }}>{success}</div>
      )}

      {/* Info note */}
      <div style={{
        background: C.infoBg, border: `1px solid rgba(47,95,154,0.2)`,
        borderRadius: 8, padding: "12px 16px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.info, flexShrink: 0 }} />
        <span style={{ fontFamily: FONTS.body, fontSize: 12, color: C.info }}>
          All refunds are automatically tagged to their original transaction record in real time. No manual linking required.
        </span>
      </div>

      <Card>
        <CardHeader title="Refund History" subtitle="Full audit log of all refund actions" />
        <DataTable columns={COLUMNS} rows={refunds} emptyMessage="No refunds issued yet." />
      </Card>

      {showModal && (
        <RefundModal onClose={() => setShowModal(false)} onSubmit={handleNewRefund} />
      )}
    </PageWrapper>
  );
}
