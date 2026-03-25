import { useState } from "react";
import {
  C, FONTS, fmt, fmtShort,
  StatCard, Card, PageWrapper,
  MOCK_REVENUE, MOCK_DAYS, MOCK_BANKS,
} from "./theme";

function RevenueChart({ data, labels, period, onPeriod }) {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(...data);

  return (
    <Card style={{ marginBottom: 20 }}>
      <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 600, color: C.black }}>Revenue — Last {period}</div>
          <div style={{ fontFamily: FONTS.body, fontSize: 11, color: C.text3, marginTop: 2 }}>Daily totals across all transactions</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["7D","14D","30D"].map((p) => (
            <button key={p} onClick={() => onPeriod(p)} style={{
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
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 180, position: "relative", paddingBottom: 28 }}>
          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <div key={pct} style={{
              position: "absolute", left: 0, right: 0,
              bottom: 28 + (180 - 28) * pct,
              borderTop: `1px dashed ${C.border}`,
            }}>
              <span style={{ position: "absolute", right: 0, fontFamily: FONTS.body, fontSize: 9, color: C.text3, transform: "translateY(-50%)" }}>
                {fmtShort(max * pct)}
              </span>
            </div>
          ))}

          {data.map((v, i) => {
            const h = Math.max((v / max) * (180 - 28), 4);
            const isToday = i === data.length - 1;
            const isHov   = hovered === i;
            return (
              <div key={i}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", cursor: "pointer", position: "relative" }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                {isHov && (
                  <div style={{
                    position: "absolute", bottom: h + 32, background: C.black, color: "#F9F7F3",
                    padding: "4px 9px", borderRadius: 5, fontFamily: FONTS.body, fontSize: 10,
                    whiteSpace: "nowrap", zIndex: 5,
                  }}>{fmtShort(v)}</div>
                )}
                <div style={{
                  width: "100%", height: h, borderRadius: "4px 4px 0 0",
                  background: isToday ? C.gold : isHov ? C.goldDeep : C.goldDim,
                  border: `1px solid ${isToday ? C.goldDeep : isHov ? C.goldBorder : C.border}`,
                  transition: "all 0.15s",
                }} />
                <div style={{
                  fontFamily: FONTS.body, fontSize: 8,
                  color: isToday ? C.goldDeep : C.text3,
                  marginTop: 4, transform: "rotate(-40deg)",
                  transformOrigin: "top center", whiteSpace: "nowrap",
                }}>{labels[i]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default function Analytics() {
  const [period, setPeriod] = useState("14D");
  const days = period === "7D" ? 7 : period === "30D" ? 30 : 14;
  const data   = MOCK_REVENUE.slice(-days);
  const labels = MOCK_DAYS.slice(-days);
  const total  = data.reduce((a, b) => a + b, 0);
  const avg    = total / days;

  return (
    <PageWrapper>
      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label={`Revenue (${period})`} value={fmtShort(total)} accent trend={12.4} sub="vs previous period" />
        <StatCard label="Daily Average"          value={fmtShort(avg)}   sub="per day" />
        <StatCard label="Total Orders"           value={days * 3}         sub={`last ${days} days`} />
        <StatCard label="Success Rate"           value="98.2%"            trend={4.1} sub="vs prev period" />
      </div>

      <RevenueChart data={data} labels={labels} period={period} onPeriod={setPeriod} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Volume by bank */}
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 600, color: C.black, marginBottom: 18 }}>Volume by Bank</div>
          {MOCK_BANKS.map((b, i) => {
            const pct = Math.round((b.volume / MOCK_BANKS[0].volume) * 100);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < MOCK_BANKS.length - 1 ? 14 : 0 }}>
                <div style={{ width: 64, fontFamily: FONTS.body, fontSize: 12, color: C.text2, fontWeight: 500 }}>{b.name}</div>
                <div style={{ flex: 1, height: 7, background: C.surface2, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: C.gold, borderRadius: 4 }} />
                </div>
                <div style={{ width: 64, fontFamily: FONTS.body, fontSize: 11, color: C.text3, textAlign: "right" }}>{fmtShort(b.volume)}</div>
                <div style={{ width: 28, fontFamily: FONTS.body, fontSize: 11, color: C.text3, textAlign: "right" }}>{b.count}x</div>
              </div>
            );
          })}
        </Card>

        {/* Status breakdown */}
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 600, color: C.black, marginBottom: 18 }}>Status Breakdown</div>
          {[
            { label: "Completed", pct: 81, count: 34, color: C.success },
            { label: "Pending",   pct: 10, count: 4,  color: C.warning },
            { label: "Failed",    pct: 5,  count: 2,  color: C.danger  },
            { label: "Refunded",  pct: 4,  count: 2,  color: C.info    },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < 3 ? 14 : 0 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
              <div style={{ width: 72, fontFamily: FONTS.body, fontSize: 12, color: C.text2 }}>{s.label}</div>
              <div style={{ flex: 1, height: 7, background: C.surface2, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: 4, opacity: 0.7 }} />
              </div>
              <div style={{ width: 28, fontFamily: FONTS.body, fontSize: 11, color: C.text3, textAlign: "right" }}>{s.count}</div>
              <div style={{ width: 36, fontFamily: FONTS.body, fontSize: 11, color: C.text3, textAlign: "right" }}>{s.pct}%</div>
            </div>
          ))}
        </Card>

      </div>
    </PageWrapper>
  );
}
