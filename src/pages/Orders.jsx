import { useState } from "react";
import {
  C, FONTS, fmt,
  Badge, Card, CardHeader, DataTable, FilterBar, PageWrapper,
  MOCK_TRANSACTIONS,
} from "./theme";

// Map transactions to orders for display
const ORDERS = MOCK_TRANSACTIONS.map((tx, i) => ({
  orderId:  `WC-${2400 + i}`,
  txId:     tx.id,
  customer: tx.customer,
  email:    tx.email,
  city:     ["Karachi", "Lahore", "Islamabad", "Multan", "Faisalabad", "Peshawar", "Quetta", "Sialkot", "Rawalpindi", "Gujranwala"][i % 10],
  items:    `${(i % 3) + 1} item${(i % 3) + 1 > 1 ? "s" : ""}`,
  total:    tx.amount,
  status:   tx.status,
  date:     tx.date,
}));

const COLUMNS = [
  {
    key: "orderId", label: "Order",
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
    key: "city", label: "City",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 12, color: C.text2 }}>{v}</span>,
  },
  {
    key: "items", label: "Items",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 12, color: C.text3 }}>{v}</span>,
  },
  {
    key: "total", label: "Total",
    render: (v) => <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600, color: C.black }}>{fmt(v)}</span>,
  },
  {
    key: "txId", label: "Transaction",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text2, background: C.surface2, padding: "3px 8px", borderRadius: 4 }}>#{v}</span>,
  },
  {
    key: "status", label: "Status",
    render: (v) => <Badge status={v} />,
  },
  {
    key: "date", label: "Date",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text3 }}>{v}</span>,
  },
];

const STATUS_FILTERS = ["all", "completed", "pending", "failed", "refunded"];

export default function Orders() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = ORDERS.filter((o) => {
    const matchSearch =
      !search ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <PageWrapper>
      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Total Orders",    value: ORDERS.length },
          { label: "Completed",       value: ORDERS.filter((o) => o.status === "completed").length },
          { label: "Pending",         value: ORDERS.filter((o) => o.status === "pending" || o.status === "on_hold").length },
          { label: "Cities Reached",  value: new Set(ORDERS.map((o) => o.city)).size },
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

      <FilterBar
        search={search} onSearch={setSearch}
        filters={STATUS_FILTERS} activeFilter={filter} onFilter={setFilter}
      />

      <Card>
        <CardHeader
          title="All Orders"
          subtitle={`${filtered.length} orders · synced from WooCommerce`}
        />
        <DataTable
          columns={COLUMNS}
          rows={filtered}
          emptyMessage="No orders found."
        />
      </Card>
    </PageWrapper>
  );
}
