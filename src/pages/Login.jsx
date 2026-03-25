import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [err,     setErr]     = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault(); setErr(''); setLoading(true);
    const { error } = await signIn(email.trim(), pass);
    if (error) { setErr('Invalid email or password.'); setLoading(false); return; }
    nav('/');
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:20, backgroundImage:'radial-gradient(ellipse at 50% 0%, rgba(197,164,109,0.07) 0%, transparent 60%)' }}>
      <div style={{ width:'100%', maxWidth:380, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:'38px 34px 30px', boxShadow:'0 8px 32px rgba(5,5,5,0.10)' }} className="fade-up">

        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontFamily:'var(--display)', fontSize:28, fontWeight:700, color:'var(--black)', letterSpacing:'0.1em' }}>ÉLOUR <span style={{ color:'var(--gold)' }}>PAY</span></div>
          <div style={{ fontFamily:'var(--body)', fontSize:10, color:'var(--text3)', letterSpacing:'0.2em', marginTop:5, textTransform:'uppercase' }}>Merchant Dashboard</div>
          <div style={{ width:36, height:1.5, background:'var(--gold)', margin:'14px auto 0', borderRadius:2 }} />
        </div>

        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {err && (
            <div style={{ background:'var(--danger-bg)', border:'1px solid rgba(176,48,48,0.2)', borderRadius:7, padding:'10px 14px', fontFamily:'var(--body)', fontSize:13, color:'var(--danger)' }}>{err}</div>
          )}
          {[
            { label:'Email',    type:'email',    val:email, set:setEmail, ph:'your@email.com' },
            { label:'Password', type:'password', val:pass,  set:setPass,  ph:'••••••••'       },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display:'block', fontFamily:'var(--display)', fontSize:10, fontWeight:600, color:'var(--text2)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:6 }}>{f.label}</label>
              <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} required
                style={{ width:'100%', padding:'12px 14px', boxSizing:'border-box', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:8, fontFamily:'var(--body)', fontSize:14, color:'var(--black)' }} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width:'100%', padding:13, background:loading?'var(--text3)':'var(--gold)', color:'var(--black)', border:'none', borderRadius:8, fontFamily:'var(--body)', fontSize:13, fontWeight:600, marginTop:4, cursor:loading?'not-allowed':'pointer' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign:'center', fontFamily:'var(--body)', fontSize:10, color:'var(--text3)', marginTop:24, letterSpacing:'0.05em' }}>
          ELOURA PERSONAL CARE PVT LTD — Internal Use Only
        </div>
      </div>
    </div>
  );
}
