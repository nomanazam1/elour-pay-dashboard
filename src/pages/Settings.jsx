import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/UI';
import { useAuth } from '../hooks/useAuth';

function Section({ title, rows }) {
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, marginBottom:16, overflow:'hidden' }}>
      <div style={{ padding:'13px 24px', borderBottom:'1px solid var(--border)', background:'var(--bg)' }}>
        <span style={{ fontFamily:'var(--display)', fontSize:13, fontWeight:600, color:'var(--gold-deep)' }}>{title}</span>
      </div>
      {rows.map((r,i) => (
        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 24px', borderBottom: i<rows.length-1 ? '1px solid var(--border)' : 'none' }}>
          <span style={{ fontFamily:'var(--body)', fontSize:13, color:'var(--text2)' }}>{r.label}</span>
          {r.badge
            ? <Badge status={r.badge} />
            : r.mono
              ? <span style={{ fontFamily:'monospace', fontSize:12, color:'var(--text2)', background:'var(--surface2)', padding:'3px 9px', borderRadius:4 }}>{r.value}</span>
              : <span style={{ fontFamily:'var(--body)', fontSize:13, color:'var(--black)', fontWeight:500 }}>{r.value}</span>
          }
        </div>
      ))}
    </div>
  );
}

export default function Settings() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  async function handleSignOut() {
    await signOut();
    nav('/login');
  }

  return (
    <div style={{ padding:32 }} className="fade-up">
      <div style={{ maxWidth:660 }}>
        <Section title="Account" rows={[
          { label:'Name',    value:'Noman Azam' },
          { label:'Email',   value: user?.email || 'noman@eloura.com' },
          { label:'Role',    value:'Administrator' },
          { label:'Company', value:'ELOURA PERSONAL CARE PVT LTD' },
        ]} />

        <Section title="API Configuration" rows={[
          { label:'Supabase Project', value:'rxifkkcjjgurgrutnwkm', mono:true },
          { label:'API Status',       badge:'completed' },
          { label:'Environment',      value:'Sandbox (testing)' },
          { label:'Safepay Mode',     badge:'pending' },
          { label:'Webhook URL',      value:'/wc-api/elour_pay_webhook', mono:true },
        ]} />

        <Section title="Payment Settings" rows={[
          { label:'Currency',      value:'PKR — Pakistani Rupee' },
          { label:'Bank Debit',    badge:'completed' },
          { label:'Card Payments', value:'Disabled — future phase' },
          { label:'OTP Timeout',   value:'2 minutes' },
          { label:'Max Attempts',  value:'5 per order' },
        ]} />

        <Section title="Security" rows={[
          { label:'HMAC Verification', badge:'completed' },
          { label:'Brute-force Lock',  badge:'completed' },
          { label:'Key Storage',       value:'Server-side only — never exposed to browser' },
        ]} />

        <div style={{ background:'var(--danger-bg)', border:'1px solid rgba(176,48,48,0.2)', borderRadius:12, padding:'18px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontFamily:'var(--display)', fontSize:14, color:'var(--danger)', fontWeight:600, marginBottom:3 }}>Sign Out</div>
            <div style={{ fontFamily:'var(--body)', fontSize:12, color:'var(--text2)' }}>End your current dashboard session.</div>
          </div>
          <button onClick={handleSignOut} style={{ background:'var(--danger)', color:'#fff', border:'none', borderRadius:8, padding:'10px 20px', fontFamily:'var(--body)', fontSize:13, fontWeight:500, cursor:'pointer' }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
