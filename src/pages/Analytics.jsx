import { useState } from 'react';
import { fmtS, StatCard, Card, RevenueChart } from '../components/UI';
import { REVENUE, DAYS, BANKS } from '../lib/mock';

export default function Analytics() {
  const [period, setPeriod] = useState('14D');
  const days   = period === '7D' ? 7 : period === '30D' ? 30 : 14;
  const data   = REVENUE.slice(-days);
  const labels = DAYS.slice(-days);
  const total  = data.reduce((a,b)=>a+b,0);
  const avg    = total / days;

  return (
    <div style={{ padding:32 }} className="fade-up">
      <div style={{ display:'flex', gap:14, marginBottom:24, flexWrap:'wrap' }}>
        <StatCard label={`Revenue (${period})`} value={fmtS(total)} accent trend={12.4} sub="vs previous period" />
        <StatCard label="Daily Average"          value={fmtS(avg)}   sub="per day" />
        <StatCard label="Total Orders"           value={days*3}       sub={`last ${days} days`} />
        <StatCard label="Success Rate"           value="98.2%"        trend={4.1} sub="vs prev period" />
      </div>

      <Card style={{ marginBottom:20 }}>
        <div style={{ padding:'20px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <div style={{ fontFamily:'var(--display)', fontSize:16, fontWeight:600, color:'var(--black)' }}>Revenue — Last {period}</div>
            <div style={{ fontFamily:'var(--body)', fontSize:11, color:'var(--text3)', marginTop:2 }}>Daily totals across all transactions</div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {['7D','14D','30D'].map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} style={{ padding:'5px 12px', borderRadius:6, border:`1px solid ${period===p?'var(--gold-bdr)':'var(--border)'}`, background:period===p?'var(--gold-dim)':'transparent', color:period===p?'var(--gold-deep)':'var(--text2)', fontFamily:'var(--body)', fontSize:11, fontWeight:period===p?500:400 }}>{p}</button>
            ))}
          </div>
        </div>
        <RevenueChart data={data} labels={labels} height={180} />
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <Card style={{ padding:24 }}>
          <div style={{ fontFamily:'var(--display)', fontSize:15, fontWeight:600, color:'var(--black)', marginBottom:18 }}>Volume by Bank</div>
          {BANKS.map((b,i) => {
            const pct = Math.round((b.volume/BANKS[0].volume)*100);
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:i<BANKS.length-1?14:0 }}>
                <div style={{ width:64, fontFamily:'var(--body)', fontSize:12, color:'var(--text2)', fontWeight:500 }}>{b.name}</div>
                <div style={{ flex:1, height:7, background:'var(--surface2)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:'var(--gold)', borderRadius:4 }} />
                </div>
                <div style={{ width:64, fontFamily:'var(--body)', fontSize:11, color:'var(--text3)', textAlign:'right' }}>{fmtS(b.volume)}</div>
                <div style={{ width:28, fontFamily:'var(--body)', fontSize:11, color:'var(--text3)', textAlign:'right' }}>{b.count}x</div>
              </div>
            );
          })}
        </Card>

        <Card style={{ padding:24 }}>
          <div style={{ fontFamily:'var(--display)', fontSize:15, fontWeight:600, color:'var(--black)', marginBottom:18 }}>Status Breakdown</div>
          {[{l:'Completed',pct:81,n:34,c:'var(--success)'},{l:'Pending',pct:10,n:4,c:'var(--warning)'},{l:'Failed',pct:5,n:2,c:'var(--danger)'},{l:'Refunded',pct:4,n:2,c:'var(--info)'}].map((s,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:i<3?14:0 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:s.c, flexShrink:0 }} />
              <div style={{ width:72, fontFamily:'var(--body)', fontSize:12, color:'var(--text2)' }}>{s.l}</div>
              <div style={{ flex:1, height:7, background:'var(--surface2)', borderRadius:4, overflow:'hidden' }}>
                <div style={{ width:`${s.pct}%`, height:'100%', background:s.c, borderRadius:4, opacity:0.7 }} />
              </div>
              <div style={{ width:28, fontFamily:'var(--body)', fontSize:11, color:'var(--text3)', textAlign:'right' }}>{s.n}</div>
              <div style={{ width:36, fontFamily:'var(--body)', fontSize:11, color:'var(--text3)', textAlign:'right' }}>{s.pct}%</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
