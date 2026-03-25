import { useState } from "react";
import {
  C, FONTS, fmt, fmtShort,
  Badge, StatCard, Card, CardHeader, DataTable, PageWrapper,
  MOCK_TRANSACTIONS, MOCK_REVENUE, MOCK_DAYS, MOCK_BANKS,
} from "./theme";

function RevenueChart({ data, labels }) {
  const [hovered, setHovered] = useState(null);
  const [period, setPeriod]   = useState("14D");
  const days = period === "7D" ? 7 : period === "30D" ? 30 : 14;
  const d = data.slice(-days);
  const l = labels.slice(-days);
  const max = Math.max(...d);

  return (
    <Card>
      <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 600, color: C.black }}>Revenue Trend</div>
          <div style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text3, marginTop: 2 }}>Daily performance across selected period</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["7D","14D","30D"].map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "5px 12px", borderRadius: 6, cursor: "pointer",
              border: `1px solid ${period === p ? C.goldBorder : C.border}`,
              background: period === p ? C.goldDim : "transparent",
              color: period === p ? C.goldDeep : C.text2,
              fontFamily: FONTS.body, fontSize: 11, fontWeight: period === p ? 500 : 400,
            }}>{p}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 24px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 150, position: "relative", paddingBottom: 24 }}>
          {/* Gridlines */}
          {[0.33, 0.66, 1].map((pct) => (
            <div key={pct} style={{
              position: "absolute", left: 0, right: 0,
              bottom: 24 + (150 - 24) * pct,
              borderTop: `1px dashed ${C.border}`,
            }}>
              <span style={{
                position: "absolute", right: 0,
                fontFamily: FONTS.body, fontSize: 9, color: C.text3,
                transform: "translateY(-50%)",
              }}>{fmtShort(max * pct)}</span>
            </div>
          ))}

          {d.map((v, i) => {
            const h = Math.max((v / max) * (150 - 24), 4);
            const isToday = i === d.length - 1;
            const isHov   = hovered === i;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", cursor: "pointer", position: "relative" }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                {isHov && (
                  <div style={{
                    position: "absolute", bottom: h + 28,
                    background: C.black, color: "#F9F7F3",
                    padding: "4px 8px", borderRadius: 5,
                    fontFamily: FONTS.body, fontSize: 10, whiteSpace: "nowrap", zIndex: 5,
                  }}>{fmtShort(v)}</div>
                )}
                <div style={{
                  width: "100%", height: h,
                  borderRadius: "4px 4px 0 0",
                  background: isToday ? C.gold : isHov ? C.goldDeep : C.goldDim,
                  border: `1px solid ${isToday ? C.goldDeep : isHov ? C.goldBorder : C.border}`,
                  transition: "all 0.15s",
                }} />
                <div style={{
                  fontFamily: FONTS.body, fontSize: 8,
                  color: isToday ? C.goldDeep : C.text3,
                  marginTop: 4, transform: "rotate(-40deg)",
                  transformOrigin: "top center", whiteSpace: "nowrap",
                }}>{l[i]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function BankBreakdown({ banks }) {
  return (
    <Card style={{ padding: 24 }}>
      <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 600, color: C.black, marginBottom: 20 }}>By Bank</div>
      {banks.map((b, i) => {
        const pct = Math.round((b.volume / banks[0].volume) * 100);
        return (
          <div key={i} style={{ marginBottom: i < banks.length - 1 ? 14 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontFamily: FONTS.body, fontSize: 12, color: C.black, fontWeight: 500 }}>{b.name}</span>
              <span style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text3 }}>{fmtShort(b.volume)}</span>
            </div>
            <div style={{ height: 5, background: C.surface2, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: C.gold, borderRadius: 3 }} />
            </div>
          </div>
        );
      })}
    </Card>
  );
}

const TXN_COLUMNS = [
  {
    key: "id", label: "Transaction ID",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 12, color: C.gold, fontWeight: 600 }}>#{v}</span>,
  },
  {
    key: "customer", label: "Customer",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 13, color: C.black }}>{v}</span>,
  },
  {
    key: "bank", label: "Bank",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text2, background: C.surface2, padding: "3px 8px", borderRadius: 4 }}>{v}</span>,
  },
  {
    key: "amount", label: "Amount",
    render: (v) => <span style={{ fontFamily: FONTS.display, fontSize: 14, fontWeight: 600, color: C.black }}>{fmt(v)}</span>,
  },
  {
    key: "status", label: "Status",
    render: (v) => <Badge status={v} />,
  },
  {
    key: "time", label: "Time",
    render: (v) => <span style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text3 }}>{v}</span>,
  },
];

export default function Home() {
  return (
    <PageWrapper>
      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Today's Revenue" value={fmt(167000)} accent trend={12.4} sub="vs yesterday" />
        <StatCard label="Transactions"    value="42"          sub="processed today" />
        <StatCard label="Success Rate"    value="98.2%"       trend={4.1} sub="industry avg 94.1%" />
        <StatCard label="Avg Order Value" value={fmtShort(3976)} sub="last 30 days" />
      </div>

      {/* Chart + banks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 24 }}>
        <RevenueChart data={MOCK_REVENUE} labels={MOCK_DAYS} />
        <BankBreakdown banks={MOCK_BANKS} />
      </div>

      {/* Recent transactions */}
      <Card>
        <CardHeader
          title="Recent Transactions"
          subtitle="Real-time settlement activity"
        />
        <DataTable columns={TXN_COLUMNS} rows={MOCK_TRANSACTIONS.slice(0, 6)} />
      </Card>
    </PageWrapper>
  );
}
