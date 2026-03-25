// ── Élour Pay Design System ───────────────────────────────────────────────────
// Shared across all dashboard pages

export const C = {
  bg:          "#F9F7F3",
  surface:     "#FFFFFF",
  surface2:    "#F4F1EC",
  border:      "#E8E2D9",
  borderMid:   "#D4CBBF",
  black:       "#050505",
  gold:        "#C5A46D",
  goldDeep:    "#A8844A",
  goldDim:     "rgba(197,164,109,0.10)",
  goldBorder:  "rgba(197,164,109,0.30)",
  text1:       "#050505",
  text2:       "#6B6356",
  text3:       "#B0A898",
  success:     "#2A6E47",
  successBg:   "rgba(42,110,71,0.09)",
  warning:     "#8A6200",
  warningBg:   "rgba(138,98,0,0.09)",
  danger:      "#B03030",
  dangerBg:    "rgba(176,48,48,0.09)",
  info:        "#2F5F9A",
  infoBg:      "rgba(47,95,154,0.09)",
};

export const FONTS = {
  display: "'Playfair Display', serif",
  body:    "'Poppins', sans-serif",
};

export const SHADOW = {
  sm: "0 1px 4px rgba(5,5,5,0.06)",
  md: "0 4px 16px rgba(5,5,5,0.08)",
  lg: "0 8px 32px rgba(5,5,5,0.12)",
};

// ── Formatters ────────────────────────────────────────────────────────────────
export const fmt = (n) =>
  "Rs " + parseFloat(n || 0).toLocaleString("en-PK", { maximumFractionDigits: 0 });

export const fmtShort = (n) => {
  const v = parseFloat(n || 0);
  if (v >= 1000000) return "Rs " + (v / 1000000).toFixed(1) + "M";
  if (v >= 1000)    return "Rs " + (v / 1000).toFixed(1) + "K";
  return "Rs " + v.toFixed(0);
};

// ── Shared components ─────────────────────────────────────────────────────────
import React from "react";

export function Badge({ status }) {
  const map = {
    completed: { bg: C.successBg, color: C.success,  label: "Completed" },
    settled:   { bg: C.successBg, color: C.success,  label: "Settled"   },
    pending:   { bg: C.warningBg, color: C.warning,  label: "Pending"   },
    on_hold:   { bg: C.warningBg, color: C.warning,  label: "On Hold"   },
    failed:    { bg: C.dangerBg,  color: C.danger,   label: "Failed"    },
    refunded:  { bg: C.infoBg,    color: C.info,     label: "Refunded"  },
    processing:{ bg: C.infoBg,    color: C.info,     label: "Processing"},
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
      fontFamily: FONTS.body, textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>{s.label}</span>
  );
}

export function StatCard({ label, value, sub, accent, trend }) {
  return (
    <div style={{
      background: accent ? C.black : C.surface,
      border: `1px solid ${accent ? "transparent" : C.border}`,
      borderRadius: 12, padding: "20px 22px",
      flex: 1, minWidth: 180,
      boxShadow: accent ? SHADOW.md : "none",
    }}>
      <div style={{
        fontFamily: FONTS.body, fontSize: 9,
        color: accent ? "rgba(197,164,109,0.65)" : C.text3,
        letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10,
      }}>{label}</div>
      <div style={{
        fontFamily: FONTS.display, fontSize: accent ? 28 : 22,
        fontWeight: 700, color: accent ? C.gold : C.black,
        lineHeight: 1, marginBottom: 8,
      }}>{value}</div>
      {(sub || trend) && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {trend !== undefined && (
            <span style={{
              background: trend > 0 ? C.successBg : C.dangerBg,
              color: trend > 0 ? C.success : C.danger,
              fontSize: 10, fontWeight: 600,
              padding: "2px 7px", borderRadius: 20, fontFamily: FONTS.body,
            }}>{trend > 0 ? "+" : ""}{trend}%</span>
          )}
          {sub && (
            <span style={{
              fontFamily: FONTS.body, fontSize: 11,
              color: accent ? "rgba(197,164,109,0.45)" : C.text3,
            }}>{sub}</span>
          )}
        </div>
      )}
    </div>
  );
}

export function PageWrapper({ children }) {
  return (
    <div style={{ padding: 32 }}>
      {children}
    </div>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      ...style,
    }}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div style={{
      padding: "18px 24px 16px",
      borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div>
        <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 600, color: C.black }}>{title}</div>
        {subtitle && <div style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text3, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

export function DataTable({ columns, rows, emptyMessage = "No data found." }) {
  if (!rows || rows.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: FONTS.body, fontSize: 13, color: C.text3 }}>
        {emptyMessage}
      </div>
    );
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={{
              padding: "11px 16px", textAlign: "left",
              fontFamily: FONTS.body, fontSize: 10, fontWeight: 600,
              color: C.text3, letterSpacing: "0.08em", textTransform: "uppercase",
              borderBottom: `1px solid ${C.border}`,
            }}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : C.bg }}>
            {columns.map((col) => (
              <td key={col.key} style={{
                padding: "12px 16px",
                borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none",
                ...(col.style || {}),
              }}>
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function FilterBar({ search, onSearch, filters, activeFilter, onFilter }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={C.text3}
          strokeWidth={2} strokeLinecap="round"
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
          <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search…"
          style={{
            width: "100%", padding: "10px 14px 10px 34px", boxSizing: "border-box",
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
            fontFamily: FONTS.body, fontSize: 13, color: C.black, outline: "none",
          }}
        />
      </div>
      {filters && filters.map((f) => (
        <button key={f} onClick={() => onFilter(f)} style={{
          padding: "9px 16px", borderRadius: 8, cursor: "pointer", textTransform: "capitalize",
          border: `1px solid ${activeFilter === f ? C.goldBorder : C.border}`,
          background: activeFilter === f ? C.goldDim : C.surface,
          color: activeFilter === f ? C.goldDeep : C.text2,
          fontFamily: FONTS.body, fontSize: 12,
          fontWeight: activeFilter === f ? 500 : 400,
        }}>{f}</button>
      ))}
    </div>
  );
}

export function ActionButton({ children, onClick, variant = "primary", small = false }) {
  const styles = {
    primary: { background: C.black, color: "#F9F7F3", border: "none" },
    ghost:   { background: C.surface, color: C.text2, border: `1px solid ${C.border}` },
    danger:  { background: C.dangerBg, color: C.danger, border: `1px solid rgba(176,48,48,0.2)` },
    gold:    { background: C.gold, color: C.black, border: "none" },
  };
  return (
    <button onClick={onClick} style={{
      ...styles[variant],
      borderRadius: 8, cursor: "pointer",
      padding: small ? "7px 14px" : "10px 18px",
      fontFamily: FONTS.body, fontSize: small ? 11 : 13,
      fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6,
      transition: "opacity 0.15s",
    }}>{children}</button>
  );
}

// ── Mock data ─────────────────────────────────────────────────────────────────
export const MOCK_TRANSACTIONS = [
  { id: "EL-98214", customer: "Ayesha Malik",     amount: 124000, status: "completed",  bank: "HBL",     time: "2 min ago",   date: "2026-03-24", email: "ayesha@mail.com",  phone: "0300-1234567" },
  { id: "EL-98213", customer: "Usman Tariq",      amount: 48200,  status: "completed",  bank: "Meezan",  time: "14 min ago",  date: "2026-03-24", email: "usman@mail.com",   phone: "0321-7654321" },
  { id: "EL-98212", customer: "Fatima Chaudhry",  amount: 9500,   status: "pending",    bank: "Alfalah", time: "28 min ago",  date: "2026-03-24", email: "fatima@mail.com",  phone: "0333-9876543" },
  { id: "EL-98211", customer: "Bilal Hassan",     amount: 21000,  status: "completed",  bank: "MCB",     time: "1 hr ago",    date: "2026-03-24", email: "bilal@mail.com",   phone: "0345-1112233" },
  { id: "EL-98210", customer: "Sara Ahmed",       amount: 33400,  status: "completed",  bank: "UBL",     time: "3 hrs ago",   date: "2026-03-24", email: "sara@mail.com",    phone: "0311-4455667" },
  { id: "EL-98209", customer: "Kamran Raza",      amount: 7800,   status: "failed",     bank: "ABL",     time: "5 hrs ago",   date: "2026-03-23", email: "kamran@mail.com",  phone: "0322-8899001" },
  { id: "EL-98208", customer: "Nadia Siddiqui",   amount: 15600,  status: "refunded",   bank: "HBL",     time: "8 hrs ago",   date: "2026-03-23", email: "nadia@mail.com",   phone: "0301-2233445" },
  { id: "EL-98207", customer: "Tariq Mahmood",    amount: 28900,  status: "completed",  bank: "Faysal",  time: "1 day ago",   date: "2026-03-23", email: "tariq@mail.com",   phone: "0312-5566778" },
  { id: "EL-98206", customer: "Hira Khan",        amount: 42000,  status: "completed",  bank: "Meezan",  time: "1 day ago",   date: "2026-03-23", email: "hira@mail.com",    phone: "0344-6677889" },
  { id: "EL-98205", customer: "Zainab Ali",       amount: 18500,  status: "on_hold",    bank: "HBL",     time: "2 days ago",  date: "2026-03-22", email: "zainab@mail.com",  phone: "0323-7788990" },
];

export const MOCK_REVENUE = [42000,65000,38000,91000,74000,110000,88000,95000,72000,130000,108000,145000,92000,167000];
export const MOCK_DAYS    = ["Mar 11","Mar 12","Mar 13","Mar 14","Mar 15","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 21","Mar 22","Mar 23","Mar 24"];

export const MOCK_BANKS = [
  { name: "HBL",     volume: 245000, count: 32 },
  { name: "Meezan",  volume: 198000, count: 27 },
  { name: "MCB",     volume: 154000, count: 21 },
  { name: "Alfalah", volume: 132000, count: 18 },
  { name: "UBL",     volume: 98000,  count: 14 },
  { name: "Faysal",  volume: 76000,  count: 11 },
];
