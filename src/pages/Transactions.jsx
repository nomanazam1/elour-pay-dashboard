import { useState, useCallback } from "react";
import {
  C, FONTS, fmt,
  Badge, Card, CardHeader, DataTable, FilterBar, PageWrapper,
  MOCK_TRANSACTIONS,
} from "./theme";
import { apiFetch } from "../lib/api";

const STATUS_FILTERS = ["all", "completed", "pending", "failed", "refunded", "on_hold"];

const COLUMNS = [
  {
    key: "id", label: "Transaction ID",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 12, color: C.gold, fontWeight: 600 }}>#{v}</span>,
  },
  {
    key: "customer", label: "Customer",
    render: (v, row) => (
      <div>
        <div style={{ fontFamily: FONTS.body, fontSize: 13, color: C.black, fontWeight: 500 }}>{v}</div>
        <div style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text3, marginTop: 1 }}>{row.email}</div>
      </div>
    ),
  },
  {
    key: "bank", label: "Bank",
    render: (v) => (
      <span style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text2, background: C.surface2, padding: "3px 9px", borderRadius: 4 }}>{v}</span>
    ),
  },
  {
    key: "amount", label: "Amount",
    render: (v) => <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600, color: C.black }}>{fmt(v)}</span>,
  },
  {
    key: "status", label: "Status",
    render: (v) => <Badge status={v} />,
  },
  {
    key: "phone", label: "Phone",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text3 }}>{v}</span>,
  },
  {
    key: "date", label: "Date",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text3 }}>{v}</span>,
  },
];

export default function Transactions() {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");

  // Filter mock data (replace with real apiFetch in production)
  const filtered = MOCK_TRANSACTIONS.filter((tx) => {
    const matchSearch =
      !search ||
      tx.customer.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || tx.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <PageWrapper>
      {/* Summary strip */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Total Today",  value: fmt(MOCK_TRANSACTIONS.reduce((a, b) => a + b.amount, 0)) },
          { label: "Completed",    value: MOCK_TRANSACTIONS.filter((t) => t.status === "completed").length },
          { label: "Pending",      value: MOCK_TRANSACTIONS.filter((t) => t.status === "pending").length },
          { label: "Failed",       value: MOCK_TRANSACTIONS.filter((t) => t.status === "failed").length },
        ].map((s) => (
          <div key={s.label} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: "14px 20px", flex: 1, minWidth: 140,
          }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 9, color: C.text3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.black }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <FilterBar
        search={search} onSearch={setSearch}
        filters={STATUS_FILTERS} activeFilter={filter} onFilter={setFilter}
      />

      {/* Table */}
      <Card>
        <CardHeader
          title="All Transactions"
          subtitle={`${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
          action={
            <button style={{
              background: C.black, color: "#F9F7F3", border: "none",
              borderRadius: 7, padding: "8px 14px",
              fontFamily: FONTS.body, fontSize: 11, fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Export CSV
            </button>
          }
        />
        <DataTable
          columns={COLUMNS}
          rows={filtered}
          emptyMessage="No transactions match your search."
        />
      </Card>
    </PageWrapper>
  );
}
