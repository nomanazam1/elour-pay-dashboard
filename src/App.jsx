import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login        from './pages/Login';
import Home         from './pages/Home';
import Transactions from './pages/Transactions';
import Orders       from './pages/Orders';
import Analytics    from './pages/Analytics';
import Refunds      from './pages/Refunds';
import Settings     from './pages/Settings';

// ── Nav config ────────────────────────────────────────────────────────────────
const NAV = [
  { to:'/',             label:'Dashboard',    end:true,
    d:'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { to:'/transactions', label:'Transactions',
    d:'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { to:'/orders',       label:'Orders',
    d:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { to:'/analytics',    label:'Analytics',
    d:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { to:'/refunds',      label:'Refunds',
    d:'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' },
  { to:'/settings',     label:'Settings',
    d:'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const initial = user?.email?.[0]?.toUpperCase() || 'N';

  return (
    <aside style={{
      width:240, minWidth:240,
      background:'var(--surface)',
      borderRight:'1px solid var(--border)',
      display:'flex', flexDirection:'column',
      height:'100vh', position:'sticky', top:0, overflow:'hidden',
    }}>
      {/* Brand */}
      <div style={{ padding:'26px 22px 20px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ fontFamily:'var(--display)', fontSize:19, fontWeight:700, color:'var(--black)', letterSpacing:'0.08em' }}>
          ÉLOUR <span style={{ color:'var(--gold)' }}>PAY</span>
        </div>
        <div style={{ fontFamily:'var(--body)', fontSize:9, color:'var(--text3)', letterSpacing:'0.15em', marginTop:3, textTransform:'uppercase' }}>
          The Private Atelier
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex:1, padding:'14px 10px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
        {NAV.map(({ to, label, d, end }) => (
          <NavLink key={to} to={to} end={end}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:11,
              padding:'10px 12px', borderRadius:8, textDecoration:'none',
              border:`1px solid ${isActive ? 'var(--gold-bdr)' : 'transparent'}`,
              background: isActive ? 'var(--gold-dim)' : 'transparent',
              color: isActive ? 'var(--gold-deep)' : 'var(--text2)',
              fontFamily:'var(--body)', fontSize:13,
              fontWeight: isActive ? 500 : 400,
              transition:'all 0.15s',
            })}>
            {({ isActive }) => (
              <>
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
                  stroke={isActive ? 'var(--gold)' : 'var(--text3)'}
                  strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d={d} />
                </svg>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding:'14px 14px 18px', borderTop:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <div style={{
            width:32, height:32, borderRadius:'50%',
            background:'var(--gold-dim)', border:'1px solid var(--gold-bdr)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'var(--display)', fontSize:13, fontWeight:600, color:'var(--gold)',
          }}>{initial}</div>
          <div style={{ overflow:'hidden', flex:1 }}>
            <div style={{ fontFamily:'var(--body)', fontSize:12, color:'var(--black)', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {user?.email}
            </div>
            <div style={{ fontFamily:'var(--body)', fontSize:10, color:'var(--text3)', marginTop:1 }}>Administrator</div>
          </div>
        </div>
        <div style={{ background:'var(--gold-dim)', border:'1px solid var(--gold-bdr)', borderRadius:6, padding:'5px 10px', display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--success)' }} />
          <span style={{ fontFamily:'var(--body)', fontSize:9, color:'var(--gold-deep)', fontWeight:500, letterSpacing:'0.08em' }}>LIVE · SANDBOX MODE</span>
        </div>
      </div>
    </aside>
  );
}

// ── Topbar ────────────────────────────────────────────────────────────────────
function Topbar() {
  const location = useLocation();
  const page = NAV.find(n => n.to === location.pathname) || NAV[0];
  const today = new Date().toLocaleDateString('en-PK', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <div style={{
      padding:'18px 32px 16px',
      borderBottom:'1px solid var(--border)',
      background:'var(--surface)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      position:'sticky', top:0, zIndex:10,
    }}>
      <div>
        <h1 style={{ fontFamily:'var(--display)', fontSize:21, fontWeight:600, color:'var(--black)', margin:0 }}>{page.label}</h1>
        <p style={{ fontFamily:'var(--body)', fontSize:11, color:'var(--text3)', margin:'3px 0 0' }}>{today}</p>
      </div>
      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
        <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 14px', display:'flex', alignItems:'center', gap:8 }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth={2} strokeLinecap="round">
            <circle cx={11} cy={11} r={8}/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span style={{ fontFamily:'var(--body)', fontSize:12, color:'var(--text3)' }}>Search transactions…</span>
        </div>
        <button style={{ background:'var(--black)', color:'#F9F7F3', border:'none', borderRadius:8, padding:'9px 16px', fontFamily:'var(--body)', fontSize:12, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Export CSV
        </button>
      </div>
    </div>
  );
}

// ── Protected layout ──────────────────────────────────────────────────────────
function Layout() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ width:24, height:24, border:'2px solid var(--border)', borderTopColor:'var(--gold)', borderRadius:'50%', animation:'spin 0.65s linear infinite' }} />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div style={{ display:'flex', height:'100vh', background:'var(--bg)', overflow:'hidden' }}>
      <Sidebar />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <Topbar />
        <div style={{ flex:1, overflowY:'auto' }}>
          <Routes>
            <Route index             element={<Home />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="orders"       element={<Orders />} />
            <Route path="analytics"    element={<Analytics />} />
            <Route path="refunds"      element={<Refunds />} />
            <Route path="settings"     element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*"     element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
