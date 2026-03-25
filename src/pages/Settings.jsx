import { C, FONTS, Badge, PageWrapper } from "./theme";

function SettingsSection({ title, rows }) {
  return (
    <div style={{
      background: "#FFFFFF", border: `1px solid ${C.border}`,
      borderRadius: 12, marginBottom: 16, overflow: "hidden",
    }}>
      <div style={{
        padding: "14px 24px",
        borderBottom: `1px solid ${C.border}`,
        background: C.bg,
      }}>
        <span style={{ fontFamily: FONTS.display, fontSize: 13, fontWeight: 600, color: C.goldDeep }}>
          {title}
        </span>
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "13px 24px",
          borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none",
        }}>
          <span style={{ fontFamily: FONTS.body, fontSize: 13, color: C.text2 }}>{row.label}</span>
          {row.badge ? (
            <Badge status={row.badge} />
          ) : row.tag ? (
            <span style={{
              fontFamily: FONTS.body, fontSize: 11, color: C.text2,
              background: C.surface2, padding: "3px 10px", borderRadius: 4,
              fontFamily: "monospace",
            }}>{row.tag}</span>
          ) : (
            <span style={{ fontFamily: FONTS.body, fontSize: 13, color: C.black, fontWeight: 500 }}>{row.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Settings() {
  const sections = [
    {
      title: "Account",
      rows: [
        { label: "Name",    value: "Noman Azam" },
        { label: "Email",   value: "noman@eloura.com" },
        { label: "Role",    value: "Administrator" },
        { label: "Company", value: "ELOURA PERSONAL CARE PVT LTD" },
      ],
    },
    {
      title: "API Configuration",
      rows: [
        { label: "Supabase Project", tag: "rxifkkcjjgurgrutnwkm" },
        { label: "API Status",       badge: "completed" },
        { label: "Environment",      value: "Sandbox (testing)" },
        { label: "Safepay Mode",     badge: "pending" },
        { label: "Webhook URL",      tag: "/wc-api/elour_pay_webhook" },
      ],
    },
    {
      title: "Payment Settings",
      rows: [
        { label: "Currency",      value: "PKR — Pakistani Rupee" },
        { label: "Bank Debit",    badge: "completed" },
        { label: "Card Payments", value: "Disabled — future phase" },
        { label: "OTP Timeout",   value: "2 minutes" },
        { label: "Max Attempts",  value: "5 per order" },
      ],
    },
    {
      title: "Security",
      rows: [
        { label: "HMAC Verification",   badge: "completed" },
        { label: "Brute-force Lock",    badge: "completed" },
        { label: "Session Storage",     value: "WooCommerce session — server-side only" },
        { label: "Key Exposure",        value: "Zero — all calls server-side" },
      ],
    },
  ];

  return (
    <PageWrapper>
      <div style={{ maxWidth: 680 }}>
        {sections.map((s) => (
          <SettingsSection key={s.title} title={s.title} rows={s.rows} />
        ))}

        {/* Sign out */}
        <div style={{
          background: C.dangerBg,
          border: `1px solid rgba(176,48,48,0.2)`,
          borderRadius: 12, padding: "20px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: 14, color: C.danger, fontWeight: 600, marginBottom: 3 }}>Sign Out</div>
            <div style={{ fontFamily: FONTS.body, fontSize: 12, color: C.text2 }}>End your current dashboard session on this device.</div>
          </div>
          <button style={{
            background: C.danger, color: "#FFFFFF", border: "none",
            borderRadius: 8, padding: "10px 20px",
            fontFamily: FONTS.body, fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>Sign Out</button>
        </div>
      </div>
    </PageWrapper>
  );
}
