import { useState, useEffect, useCallback } from "react";

const C = {
  bg:         "#F9F7F3",
  surface:    "#FFFFFF",
  surface2:   "#F4F1EC",
  border:     "#E8E2D9",
  borderMid:  "#D4CBBF",
  black:      "#050505",
  gold:       "#C5A46D",
  goldDeep:   "#A8844A",
  goldDim:    "rgba(197,164,109,0.10)",
  goldBorder: "rgba(197,164,109,0.30)",
  text1:      "#050505",
  text2:      "#6B6356",
  text3:      "#B0A898",
  success:    "#2A6E47",
  successBg:  "rgba(42,110,71,0.09)",
  warning:    "#8A6200",
  warningBg:  "rgba(138,98,0,0.09)",
  danger:     "#B03030",
  dangerBg:   "rgba(176,48,48,0.09)",
  info:       "#2F5F9A",
  infoBg:     "rgba(47,95,154,0.09)",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => "Rs " + parseFloat(n || 0).toLocaleString("en-PK", { maximumFractionDigits: 0 });
const fmtShort = (n) => {
  const v = parseFloat(n || 0);
  if (v >= 1000000) return "Rs " + (v / 1000000).toFixed(1) + "M";
  if (v >= 1000)    return "Rs " + (v / 1000).toFixed(1) + "K";
  return "Rs " + v.toFixed(0);
};

function Badge({ status }) {
  const map = {
    completed: { bg: C.successBg, color: C.success, label: "Completed" },
    settled:   { bg: C.successBg, color: C.success, label: "Settled" },
    pending:   { bg: C.warningBg, color: C.warning, label: "Pending" },
    on_hold:   { bg: C.warningBg, color: C.warning, label: "On Hold" },
    failed:    { bg: C.dangerBg,  color: C.danger,  label: "Failed" },
    refunded:  { bg: C.infoBg,    color: C.info,    label: "Refunded" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
      fontFamily: "'Poppins', sans-serif", textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>{s.label}</span>
  );
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_TRANSACTIONS = [
  { id: "EL-98214", customer: "Ayesha Malik",    amount: 12400, status: "completed", bank: "HBL",     time: "2 min ago",   date: "2026-03-24" },
  { id: "EL-98213", customer: "Usman Tariq",     amount: 48200, status: "completed", bank: "Meezan",  time: "14 min ago",  date: "2026-03-24" },
  { id: "EL-98212", customer: "Fatima Chaudhry", amount: 9500,  status: "pending",   bank: "Alfalah", time: "28 min ago",  date: "2026-03-24" },
  { id: "EL-98211", customer: "Bilal Hassan",    amount: 21000, status: "completed", bank: "MCB",     time: "1 hr ago",    date: "2026-03-24" },
  { id: "EL-98210", customer: "Sara Ahmed",      amount: 33400, status: "completed", bank: "UBL",     time: "3 hrs ago",   date: "2026-03-24" },
  { id: "EL-98209", customer: "Kamran Raza",     amount: 7800,  status: "failed",    bank: "ABL",     time: "5 hrs ago",   date: "2026-03-23" },
  { id: "EL-98208", customer: "Nadia Siddiqui",  amount: 15600, status: "refunded",  bank: "HBL",     time: "8 hrs ago",   date: "2026-03-23" },
  { id: "EL-98207", customer: "Tariq Mahmood",   amount: 28900, status: "completed", bank: "Faysal",  time: "1 day ago",   date: "2026-03-23" },
];

const MOCK_REVENUE = [42000, 65000, 38000, 91000, 74000, 110000, 88000, 95000, 72000, 130000, 108000, 145000, 92000, 167000];
const MOCK_DAYS = ["Mar 11","Mar 12","Mar 13","Mar 14","Mar 15","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 21","Mar 22","Mar 23","Mar 24"];

const MOCK_BANKS = [
  { name: "HBL",     volume: 245000, count: 32 },
  { name: "Meezan",  volume: 198000, count: 27 },
  { name: "MCB",     volume: 154000, count: 21 },
  { name: "Alfalah", volume: 132000, count: 18 },
  { name: "UBL",     volume: 98000,  count: 14 },
  { name: "Faysal",  volume: 76000,  count: 11 },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",     label: "Dashboard",     icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
  { id: "transactions",  label: "Transactions",  icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
  { id: "orders",        label: "Orders",        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { id: "analytics",     label: "Analytics",     icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "refunds",       label: "Refunds",       icon: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" },
  { id: "settings",      label: "Settings",      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

function Sidebar({ active, onNav }) {
  return (
    <aside style={{
      width: 240, minWidth: 240,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
    }}>
      {/* Brand */}
      <div style={{
        padding: "28px 24px 22px",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.black, letterSpacing: "0.08em" }}>
          ÉLOUR <span style={{ color: C.gold }}>PAY</span>
        </div>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, color: C.text3, letterSpacing: "0.15em", marginTop: 3, textTransform: "uppercase" }}>
          The Private Atelier
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
        {NAV.map(({ id, label, icon }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => onNav(id)} style={{
              display: "flex", alignItems: "center", gap: 11,
              padding: "10px 12px", borderRadius: 8,
              border: isActive ? `1px solid ${C.goldBorder}` : "1px solid transparent",
              background: isActive ? C.goldDim : "transparent",
              color: isActive ? C.goldDeep : C.text2,
              fontFamily: "'Poppins', sans-serif", fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              cursor: "pointer", textAlign: "left",
              transition: "all 0.15s",
            }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                stroke={isActive ? C.gold : C.text3} strokeWidth={1.8}
                strokeLinecap="round" strokeLinejoin="round">
                <path d={icon} />
              </svg>
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px 16px 20px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: C.goldDim, border: `1px solid ${C.goldBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 600, color: C.gold,
          }}>N</div>
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.black, fontWeight: 500 }}>Noman Azam</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, color: C.text3, marginTop: 1 }}>Administrator</div>
          </div>
        </div>
        <div style={{
          background: C.goldDim, border: `1px solid ${C.goldBorder}`,
          borderRadius: 6, padding: "6px 10px",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.success }} />
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, color: C.goldDeep, fontWeight: 500 }}>LIVE · SANDBOX MODE</span>
        </div>
      </div>
    </aside>
  );
}

// ── Topbar ────────────────────────────────────────────────────────────────────
function Topbar({ title, subtitle }) {
  return (
    <div style={{
      padding: "22px 32px 18px",
      borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: C.surface, position: "sticky", top: 0, zIndex: 10,
    }}>
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: C.black, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.text3, margin: "3px 0 0" }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
          padding: "8px 14px", display: "flex", alignItems: "center", gap: 8,
        }}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth={2} strokeLinecap="round">
            <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" />
          </svg>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.text3 }}>Search transactions…</span>
        </div>
        <button style={{
          background: C.black, color: C.goldLight || "#F9F7F3",
          border: "none", borderRadius: 8, padding: "9px 16px",
          fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 500,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        }}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export CSV
        </button>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent, trend }) {
  return (
    <div style={{
      background: accent ? C.black : C.surface,
      border: `1px solid ${accent ? "transparent" : C.border}`,
      borderRadius: 12, padding: "22px 24px",
      flex: 1, minWidth: 180,
      transition: "box-shadow 0.2s",
    }}>
      <div style={{
        fontFamily: "'Poppins', sans-serif", fontSize: 10,
        color: accent ? "rgba(197,164,109,0.7)" : C.text3,
        letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10,
      }}>{label}</div>
      <div style={{
        fontFamily: "'Playfair Display', serif", fontSize: accent ? 30 : 24,
        fontWeight: 700, color: accent ? C.gold : C.black,
        lineHeight: 1, marginBottom: 8,
      }}>{value}</div>
      {(sub || trend) && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {trend && (
            <span style={{
              background: trend > 0 ? C.successBg : C.dangerBg,
              color: trend > 0 ? C.success : C.danger,
              fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20,
              fontFamily: "'Poppins', sans-serif",
            }}>{trend > 0 ? "+" : ""}{trend}%</span>
          )}
          {sub && <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, color: accent ? "rgba(197,164,109,0.5)" : C.text3 }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}

// ── Revenue Chart ─────────────────────────────────────────────────────────────
function RevenueChart({ data, labels, period, onPeriod }) {
  const max = Math.max(...data);
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: C.black }}>Revenue Trend</div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, color: C.text3, marginTop: 2 }}>Daily performance over selected period</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["7D","14D","30D"].map(p => (
            <button key={p} onClick={() => onPeriod(p)} style={{
              padding: "5px 12px", borderRadius: 6,
              border: `1px solid ${period === p ? C.goldBorder : C.border}`,
              background: period === p ? C.goldDim : "transparent",
              color: period === p ? C.goldDeep : C.text2,
              fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 500,
              cursor: "pointer",
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Chart bars */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140, paddingBottom: 28, position: "relative" }}>
        {/* Y gridlines */}
        {[0.25, 0.5, 0.75, 1].map(pct => (
          <div key={pct} style={{
            position: "absolute", left: 0, right: 0,
            bottom: 28 + (140 - 28) * pct,
            borderTop: `1px dashed ${C.border}`,
            display: "flex", alignItems: "center",
          }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 9, color: C.text3, marginLeft: 0, position: "absolute", left: -2, transform: "translateY(-50%)" }}>
              {fmtShort(max * pct)}
            </span>
          </div>
        ))}

        {data.map((v, i) => {
          const h = Math.max((v / max) * (140 - 28), 4);
          const isHov = hovered === i;
          const isToday = i === data.length - 1;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", cursor: "pointer" }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              {isHov && (
                <div style={{
                  position: "absolute", bottom: 28 + h + 6,
                  background: C.black, color: "#F9F7F3",
                  padding: "4px 8px", borderRadius: 5,
                  fontFamily: "'Poppins', sans-serif", fontSize: 10, whiteSpace: "nowrap",
                  pointerEvents: "none", zIndex: 5,
                }}>{fmtShort(v)}</div>
              )}
              <div style={{
                width: "100%", height: h, borderRadius: "4px 4px 0 0",
                background: isToday ? C.gold : isHov ? C.goldDeep : C.goldDim,
                border: `1px solid ${isToday ? C.goldDeep : isHov ? C.goldBorder : C.border}`,
                transition: "all 0.15s",
              }} />
              <div style={{
                fontFamily: "'Poppins', sans-serif", fontSize: 8,
                color: isToday ? C.goldDeep : C.text3, marginTop: 5,
                transform: "rotate(-45deg)", transformOrigin: "top center",
                whiteSpace: "nowrap",
              }}>{labels[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────
function DashboardPage() {
  const [period, setPeriod] = useState("14D");
  const days = period === "7D" ? 7 : period === "14D" ? 14 : 30;
  const revenueData = MOCK_REVENUE.slice(-days);
  const labelData   = MOCK_DAYS.slice(-days);

  return (
    <div style={{ padding: 32 }}>
      {/* Stats row */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Today's Revenue"    value={fmt(167000)} accent trend={12.4} sub="vs yesterday" />
        <StatCard label="Transactions"       value="42"          sub="processed today" />
        <StatCard label="Success Rate"       value="98.2%"       sub="industry avg 94.1%" trend={4.1} />
        <StatCard label="Avg Order Value"    value={fmt(3976)}   sub="last 30 days" />
      </div>

      {/* Chart + breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 24 }}>
        <RevenueChart data={revenueData} labels={labelData} period={period} onPeriod={setPeriod} />

        {/* Bank breakdown */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: C.black, marginBottom: 20 }}>By Bank</div>
          {MOCK_BANKS.map((b, i) => {
            const pct = Math.round((b.volume / MOCK_BANKS[0].volume) * 100);
            return (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.black, fontWeight: 500 }}>{b.name}</span>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, color: C.text3 }}>{fmtShort(b.volume)}</span>
                </div>
                <div style={{ height: 5, background: C.surface2, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: C.gold, borderRadius: 3 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
        <div style={{ padding: "20px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: C.black }}>Recent Transactions</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, color: C.text3, marginTop: 2 }}>Real-time settlement activity</div>
          </div>
        </div>
        <TransactionTable rows={MOCK_TRANSACTIONS.slice(0, 6)} />
      </div>
    </div>
  );
}

// ── Transaction Table ─────────────────────────────────────────────────────────
function TransactionTable({ rows }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["Transaction ID","Customer","Bank","Amount","Status","Date"].map(h => (
            <th key={h} style={{
              padding: "11px 16px", textAlign: "left",
              fontFamily: "'Poppins', sans-serif", fontSize: 10, fontWeight: 600,
              color: C.text3, letterSpacing: "0.08em", textTransform: "uppercase",
              borderBottom: `1px solid ${C.border}`,
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((tx, i) => (
          <tr key={tx.id} style={{ background: i % 2 === 0 ? "transparent" : C.bg }}>
            <td style={{ padding: "13px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.gold, fontWeight: 600 }}>#{tx.id}</td>
            <td style={{ padding: "13px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 13, color: C.black }}>{tx.customer}</td>
            <td style={{ padding: "13px 16px" }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, color: C.text2, background: C.surface2, padding: "3px 8px", borderRadius: 4 }}>{tx.bank}</span>
            </td>
            <td style={{ padding: "13px 16px", fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600, color: C.black }}>{fmt(tx.amount)}</td>
            <td style={{ padding: "13px 16px" }}><Badge status={tx.status} /></td>
            <td style={{ padding: "13px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 11, color: C.text3 }}>{tx.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Transactions Page ─────────────────────────────────────────────────────────
function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = MOCK_TRANSACTIONS.filter(tx => {
    const matchSearch = !search || tx.customer.toLowerCase().includes(search.toLowerCase()) || tx.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || tx.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth={2} strokeLinecap="round"
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID, bank…"
            style={{
              width: "100%", padding: "10px 14px 10px 36px", boxSizing: "border-box",
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
              fontFamily: "'Poppins', sans-serif", fontSize: 13, color: C.black, outline: "none",
            }} />
        </div>
        {["all","completed","pending","failed","refunded"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "9px 16px", borderRadius: 8,
            border: `1px solid ${filter === f ? C.goldBorder : C.border}`,
            background: filter === f ? C.goldDim : C.surface,
            color: filter === f ? C.goldDeep : C.text2,
            fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: filter === f ? 500 : 400,
            cursor: "pointer", textTransform: "capitalize",
          }}>{f}</button>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: C.black }}>All Transactions</span>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.text3 }}>{filtered.length} results</span>
        </div>
        {filtered.length === 0
          ? <div style={{ padding: 40, textAlign: "center", fontFamily: "'Poppins', sans-serif", fontSize: 13, color: C.text3 }}>No transactions found.</div>
          : <TransactionTable rows={filtered} />
        }
      </div>
    </div>
  );
}

// ── Analytics Page ────────────────────────────────────────────────────────────
function AnalyticsPage() {
  const [period, setPeriod] = useState("14D");
  const days = period === "7D" ? 7 : period === "14D" ? 14 : 30;

  const totalRevenue = MOCK_REVENUE.slice(-days).reduce((a, b) => a + b, 0);
  const avgDaily = totalRevenue / days;

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        <StatCard label="Period Revenue" value={fmtShort(totalRevenue)} sub={`last ${days} days`} accent />
        <StatCard label="Daily Average"  value={fmtShort(avgDaily)}   sub="per day" />
        <StatCard label="Total Orders"   value={days * 3}              sub={`last ${days} days`} />
        <StatCard label="Success Rate"   value="98.2%"                 trend={4.1} sub="vs prev period" />
      </div>

      <div style={{ marginBottom: 20 }}>
        <RevenueChart data={MOCK_REVENUE.slice(-days)} labels={MOCK_DAYS.slice(-days)} period={period} onPeriod={setPeriod} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: C.black, marginBottom: 20 }}>Volume by Bank</div>
          {MOCK_BANKS.map((b, i) => {
            const pct = Math.round((b.volume / MOCK_BANKS[0].volume) * 100);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 56, fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.text2, fontWeight: 500 }}>{b.name}</div>
                <div style={{ flex: 1, height: 8, background: C.surface2, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: C.gold, borderRadius: 4 }} />
                </div>
                <div style={{ width: 70, fontFamily: "'Poppins', sans-serif", fontSize: 11, color: C.text3, textAlign: "right" }}>{fmtShort(b.volume)}</div>
                <div style={{ width: 30, fontFamily: "'Poppins', sans-serif", fontSize: 11, color: C.text3, textAlign: "right" }}>{b.count}x</div>
              </div>
            );
          })}
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: C.black, marginBottom: 20 }}>Status Breakdown</div>
          {[
            { label: "Completed", count: 34, pct: 81, color: C.success },
            { label: "Pending",   count: 4,  pct: 10, color: C.warning },
            { label: "Failed",    count: 2,  pct: 5,  color: C.danger },
            { label: "Refunded",  count: 2,  pct: 4,  color: C.info },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
              <div style={{ width: 70, fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.text2 }}>{s.label}</div>
              <div style={{ flex: 1, height: 8, background: C.surface2, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: 4, opacity: 0.7 }} />
              </div>
              <div style={{ width: 30, fontFamily: "'Poppins', sans-serif", fontSize: 11, color: C.text3, textAlign: "right" }}>{s.count}</div>
              <div style={{ width: 35, fontFamily: "'Poppins', sans-serif", fontSize: 11, color: C.text3, textAlign: "right" }}>{s.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Orders Page ───────────────────────────────────────────────────────────────
function OrdersPage() {
  const orders = MOCK_TRANSACTIONS.map((tx, i) => ({
    ...tx, orderId: `WC-${2400 + i}`,
    items: `${Math.ceil(Math.random() * 3)} item${Math.ceil(Math.random() * 3) > 1 ? "s" : ""}`,
    city: ["Karachi","Lahore","Islamabad","Multan","Faisalabad"][i % 5],
  }));

  return (
    <div style={{ padding: 32 }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: C.black }}>All Orders</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Order","Customer","City","Items","Total","Payment","Status"].map(h => (
                <th key={h} style={{
                  padding: "11px 16px", textAlign: "left",
                  fontFamily: "'Poppins', sans-serif", fontSize: 10, fontWeight: 600,
                  color: C.text3, letterSpacing: "0.08em", textTransform: "uppercase",
                  borderBottom: `1px solid ${C.border}`,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={o.orderId} style={{ background: i % 2 === 0 ? "transparent" : C.bg }}>
                <td style={{ padding: "12px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.gold, fontWeight: 600 }}>#{o.orderId}</td>
                <td style={{ padding: "12px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 13, color: C.black }}>{o.customer}</td>
                <td style={{ padding: "12px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.text2 }}>{o.city}</td>
                <td style={{ padding: "12px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.text3 }}>{o.items}</td>
                <td style={{ padding: "12px 16px", fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600, color: C.black }}>{fmt(o.amount)}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, color: C.text2, background: C.surface2, padding: "3px 8px", borderRadius: 4 }}>Élour Pay</span>
                </td>
                <td style={{ padding: "12px 16px" }}><Badge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Refunds Page ──────────────────────────────────────────────────────────────
function RefundsPage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ txId: "", amount: "", reason: "" });
  const [refunds, setRefunds]     = useState([
    { id: "REF-001", txId: "EL-98208", customer: "Nadia Siddiqui", amount: 15600, reason: "Customer request", status: "completed", date: "2026-03-23" },
    { id: "REF-002", txId: "EL-98201", customer: "Ali Khan",       amount: 8900,  reason: "Damaged item",    status: "completed", date: "2026-03-22" },
  ]);

  function handleRefund() {
    if (!form.txId || !form.amount) return;
    setRefunds(prev => [{
      id: `REF-00${prev.length + 3}`,
      txId: form.txId, customer: "Manual Refund",
      amount: parseFloat(form.amount), reason: form.reason || "No reason",
      status: "completed", date: new Date().toISOString().split("T")[0],
    }, ...prev]);
    setForm({ txId: "", amount: "", reason: "" });
    setShowModal(false);
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.black, fontWeight: 600 }}>Refund History</div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.text3, marginTop: 3 }}>All refunds automatically tagged to transactions</div>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          background: C.black, color: "#F9F7F3", border: "none", borderRadius: 8,
          padding: "10px 18px", fontFamily: "'Poppins', sans-serif", fontSize: 12,
          fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        }}>+ New Refund</button>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Refund ID","Transaction","Customer","Amount","Reason","Status","Date"].map(h => (
                <th key={h} style={{
                  padding: "11px 16px", textAlign: "left",
                  fontFamily: "'Poppins', sans-serif", fontSize: 10, fontWeight: 600,
                  color: C.text3, letterSpacing: "0.08em", textTransform: "uppercase",
                  borderBottom: `1px solid ${C.border}`,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {refunds.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? "transparent" : C.bg }}>
                <td style={{ padding: "12px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.info, fontWeight: 600 }}>#{r.id}</td>
                <td style={{ padding: "12px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.gold }}>#{r.txId}</td>
                <td style={{ padding: "12px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 13, color: C.black }}>{r.customer}</td>
                <td style={{ padding: "12px 16px", fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600, color: C.black }}>{fmt(r.amount)}</td>
                <td style={{ padding: "12px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.text2 }}>{r.reason}</td>
                <td style={{ padding: "12px 16px" }}><Badge status={r.status} /></td>
                <td style={{ padding: "12px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 11, color: C.text3 }}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refund Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(5,5,5,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: C.surface, borderRadius: 14, padding: 32, width: 420,
            border: `1px solid ${C.border}`, boxShadow: "0 20px 60px rgba(5,5,5,0.2)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: C.black, marginBottom: 4 }}>New Refund</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.text3, marginBottom: 24 }}>Refund will be tagged automatically in the transaction record</div>

            {[
              { label: "Transaction ID", key: "txId",   placeholder: "e.g. EL-98214" },
              { label: "Amount (PKR)",   key: "amount", placeholder: "e.g. 12000",   type: "number" },
              { label: "Reason",         key: "reason", placeholder: "Customer request, damaged item…" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontFamily: "'Playfair Display', serif", fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{f.label}</label>
                <input type={f.type || "text"} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{
                    width: "100%", padding: "11px 13px", boxSizing: "border-box",
                    background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 8,
                    fontFamily: "'Poppins', sans-serif", fontSize: 13, color: C.black, outline: "none",
                  }} />
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: 12, background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: 8, fontFamily: "'Poppins', sans-serif", fontSize: 13, cursor: "pointer", color: C.text2,
              }}>Cancel</button>
              <button onClick={handleRefund} style={{
                flex: 1, padding: 12, background: C.black, border: "none",
                borderRadius: 8, fontFamily: "'Poppins', sans-serif", fontSize: 13,
                fontWeight: 500, cursor: "pointer", color: "#F9F7F3",
              }}>Confirm Refund</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Settings Page ─────────────────────────────────────────────────────────────
function SettingsPage() {
  return (
    <div style={{ padding: 32, maxWidth: 680 }}>
      {[
        {
          title: "Account", rows: [
            { label: "Email",   value: "noman@eloura.com" },
            { label: "Role",    value: "Administrator" },
            { label: "Company", value: "ELOURA PERSONAL CARE PVT LTD" },
          ]
        },
        {
          title: "API Configuration", rows: [
            { label: "Supabase Project", value: "rxifkkcjjgurgrutnwkm" },
            { label: "API Status",       value: "Live", badge: "success" },
            { label: "Safepay Mode",     value: "Sandbox", badge: "warning" },
            { label: "API Version",      value: "v1.0.0" },
          ]
        },
        {
          title: "Payment Settings", rows: [
            { label: "Currency",         value: "PKR — Pakistani Rupee" },
            { label: "Bank Debit",       value: "Enabled", badge: "success" },
            { label: "Card Payments",    value: "Disabled (future phase)" },
            { label: "Webhook URL",      value: "wc-api/elour_pay_webhook" },
          ]
        },
      ].map(section => (
        <div key={section.title} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600, color: C.goldDeep }}>{section.title}</span>
          </div>
          {section.rows.map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 24px", borderBottom: i < section.rows.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, color: C.text2 }}>{row.label}</span>
              {row.badge
                ? <Badge status={row.badge === "success" ? "completed" : "pending"} />
                : <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, color: C.black, fontWeight: 500 }}>{row.value}</span>
              }
            </div>
          ))}
        </div>
      ))}

      <div style={{ background: C.dangerBg, border: `1px solid rgba(176,48,48,0.2)`, borderRadius: 12, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: C.danger, fontWeight: 600, marginBottom: 3 }}>Sign Out</div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.text2 }}>Sign out of the Élour Pay dashboard</div>
        </div>
        <button style={{ background: C.danger, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Sign Out</button>
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
const PAGES = {
  dashboard:    { component: DashboardPage,    title: "Dashboard",    subtitle: "Monday, March 24, 2026" },
  transactions: { component: TransactionsPage, title: "Transactions", subtitle: "All payment activity through Élour Pay" },
  orders:       { component: OrdersPage,       title: "Orders",       subtitle: "WooCommerce orders synced in real time" },
  analytics:    { component: AnalyticsPage,    title: "Analytics",    subtitle: "Revenue trends and payment breakdown" },
  refunds:      { component: RefundsPage,      title: "Refunds",      subtitle: "Full audit log — auto-tagged to transactions" },
  settings:     { component: SettingsPage,     title: "Settings",     subtitle: "Account and API configuration" },
};

export default function ElourDashboard() {
  const [page, setPage] = useState("dashboard");
  const { component: Page, title, subtitle } = PAGES[page];

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'Poppins', sans-serif", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <Sidebar active={page} onNav={setPage} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar title={title} subtitle={subtitle} />
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Page />
        </div>
      </div>
    </div>
  );
}
