import { useState } from 'react';
import { fmt, fmtS, Badge, StatCard, Card, CardHeader, DataTable, RevenueChart } from '../components/UI';
import { TRANSACTIONS, REVENUE, DAYS, BANKS } from '../lib/mock';

const TXN_COLS = [
  { key:'id',       label:'Transaction ID', render:v=><span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--gold)',fontWeight:600}}>#{v}</span> },
  { key:'customer', label:'Customer',       render:v=><span style={{fontFamily:'var(--body)',fontSize:13,color:'var(--black)'}}>{v}</span> },
  { key:'bank',     label:'Bank',           render:v=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text2)',background:'var(--surface2)',padding:'3px 8px',borderRadius:4}}>{v}</span> },
  { key:'amount',   label:'Amount',         render:v=><span style={{fontFamily:'var(--display)',fontSize:14,fontWeight:600,color:'var(--black)'}}>{fmt(v)}</span> },
  { key:'status',   label:'Status',         render:v=><Badge status={v}/> },
  { key:'time',     label:'Time',           render:v=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)'}}>{v}</span> },
];

function BankBars({ banks }) {
  return (
    <Card style={{ padding:24 }}>
      <div style={{ fontFamily:'var(--display)', fontSize:16, fontWeight:600, color:'var(--black)', marginBottom:20 }}>By Bank</div>
      {banks.map((b,i) => {
        const pct = Math.round((b.volume / banks[0].volume) * 100);
        return (
          <div key={i} style={{ marginBottom: i < banks.length-1 ? 13 : 0 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontFamily:'var(--body)', fontSize:12, color:'var(--black)', fontWeight:500 }}>{b.name}</span>
              <span style={{ fontFamily:'var(--body)', fontSize:11, color:'var(--text3)' }}>{fmtS(b.volume)}</span>
            </div>
            <div style={{ height:5, background:'var(--surface2)', borderRadius:3, overflow:'hidden' }}>
              <div style={{ width:`${pct}%`, height:'100%', background:'var(--gold)', borderRadius:3 }} />
            </div>
          </div>
        );
      })}
    </Card>
  );
}

export default function Home() {
  const [period, setPeriod] = useState('14D');
  const days  = period === '7D' ? 7 : period === '30D' ? 30 : 14;
  const data  = REVENUE.slice(-days);
  const labels = DAYS.slice(-days);

  return (
    <div style={{ padding:32 }} className="fade-up">
      {/* Stats */}
      <div style={{ display:'flex', gap:14, marginBottom:24, flexWrap:'wrap' }}>
        <StatCard label="Today's Revenue" value={fmt(167000)} accent trend={12.4} sub="vs yesterday" />
        <StatCard label="Transactions"    value="42"          sub="processed today" />
        <StatCard label="Success Rate"    value="98.2%"       trend={4.1} sub="industry avg 94.1%" />
        <StatCard label="Avg Order"       value={fmtS(3976)}  sub="last 30 days" />
      </div>

      {/* Chart + banks */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 290px', gap:16, marginBottom:24 }}>
        <Card>
          <div style={{ padding:'20px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <div style={{ fontFamily:'var(--display)', fontSize:16, fontWeight:600, color:'var(--black)' }}>Revenue Trend</div>
              <div style={{ fontFamily:'var(--body)', fontSize:11, color:'var(--text3)', marginTop:2 }}>Daily performance</div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {['7D','14D','30D'].map(p => (
                <button key={p} onClick={()=>setPeriod(p)} style={{ padding:'5px 12px', borderRadius:6, border:`1px solid ${period===p?'var(--gold-bdr)':'var(--border)'}`, background:period===p?'var(--gold-dim)':'transparent', color:period===p?'var(--gold-deep)':'var(--text2)', fontFamily:'var(--body)', fontSize:11, fontWeight:period===p?500:400 }}>{p}</button>
              ))}
            </div>
          </div>
          <RevenueChart data={data} labels={labels} height={150} />
        </Card>
        <BankBars banks={BANKS} />
      </div>

      {/* Recent transactions */}
      <Card>
        <CardHeader title="Recent Transactions" subtitle="Real-time settlement activity" />
        <DataTable columns={TXN_COLS} rows={TRANSACTIONS.slice(0,6)} empty="No transactions yet." />
      </Card>
    </div>
  );
}
