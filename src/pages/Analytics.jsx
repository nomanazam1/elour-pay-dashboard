import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { apiFetch } from '../lib/api.js';
import './Home.css';
import './Analytics.css';

function fmt(n) { return 'Rs ' + parseFloat(n||0).toLocaleString('en-PK'); }

export default function Analytics() {
  const [revenue, setRevenue] = useState([]);
  const [banks,   setBanks]   = useState([]);
  const [days,    setDays]    = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch(`/api/analytics/revenue?days=${days}`),
      apiFetch('/api/analytics/banks'),
    ]).then(([r, b]) => {
      setRevenue((r.data||[]).map(d => ({
        ...d,
        date: new Date(d.stat_date).toLocaleDateString('en-PK', { month:'short', day:'numeric' }),
        revenue: parseFloat(d.total_revenue||0),
      })));
      setBanks(b.data||[]);
    }).catch(console.error).finally(() => setLoading(false));
  }, [days]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{background:'var(--surface-3)',border:'1px solid var(--border)',borderRadius:6,padding:'10px 14px',fontSize:12}}>
        <div style={{color:'var(--text-2)',marginBottom:4}}>{label}</div>
        <div style={{color:'var(--gold)',fontFamily:'var(--font-display)',fontSize:15}}>
          {fmt(payload[0]?.value)}
        </div>
      </div>
    );
  };

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-title">Analytics</div>
        <div className="page-subtitle">Revenue trends and payment breakdown</div>
      </div>

      <div className="analytics-controls">
        {[7,30,90].map(d => (
          <button key={d} className={`period-btn ${days===d?'active':''}`} onClick={() => setDays(d)}>
            {d}D
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state" style={{height:300,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div className="spinner"/>
        </div>
      ) : (
        <>
          <div className="card" style={{marginBottom:20}}>
            <div className="section-title" style={{marginBottom:20}}>Revenue — Last {days} Days</div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#C5A46D" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#C5A46D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{fill:'#5C5448',fontSize:10}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill:'#5C5448',fontSize:10}} axisLine={false} tickLine={false}
                  tickFormatter={v => 'Rs '+v.toLocaleString()} />
                <Tooltip content={<CustomTooltip/>} />
                <Area type="monotone" dataKey="revenue" stroke="#C5A46D" strokeWidth={2}
                  fill="url(#goldGrad)" dot={false} activeDot={{r:4,fill:'#C5A46D'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="section-title" style={{marginBottom:20}}>Payments by Bank</div>
            {banks.length === 0 ? (
              <div className="empty-state">No completed transactions yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={banks} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
                  <XAxis type="number" tick={{fill:'#5C5448',fontSize:10}} axisLine={false} tickLine={false}
                    tickFormatter={v => 'Rs '+v.toLocaleString()} />
                  <YAxis type="category" dataKey="bank" tick={{fill:'#A09880',fontSize:11}} axisLine={false} tickLine={false} width={80}/>
                  <Tooltip content={<CustomTooltip/>} />
                  <Bar dataKey="volume" fill="#C5A46D" fillOpacity={0.8} radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}
