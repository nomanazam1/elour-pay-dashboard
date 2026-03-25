import { useState, useEffect } from 'react';
import { fmt, fmtS, Badge, StatCard, Card, CardHeader, DataTable, RevenueChart } from '../components/UI';
import { getSummary, getRevenue, getBanks, getTransactions } from '../lib/data';

const TXN_COLS = [
  { key:'id',       label:'Transaction ID', render:v=><span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--gold)',fontWeight:600}}>#{v}</span> },
  { key:'customer', label:'Customer',       render:v=><span style={{fontFamily:'var(--body)',fontSize:13,color:'var(--black)'}}>{v}</span> },
  { key:'bank',     label:'Bank',           render:(v,r)=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text2)',background:'var(--surface2)',padding:'3px 8px',borderRadius:4}}>{v||r.bank_code||'—'}</span> },
  { key:'amount',   label:'Amount',         render:v=><span style={{fontFamily:'var(--display)',fontSize:14,fontWeight:600,color:'var(--black)'}}>{fmt(v)}</span> },
  { key:'status',   label:'Status',         render:v=><Badge status={v}/> },
  { key:'time',     label:'Time',           render:(v,r)=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)'}}>{v||r.created_at?.slice(0,10)||'—'}</span> },
];

function Spinner() {
  return <div style={{width:20,height:20,border:'2px solid var(--border)',borderTopColor:'var(--gold)',borderRadius:'50%',animation:'spin 0.65s linear infinite',display:'inline-block'}}/>;
}

function MockNotice() {
  return (
    <div style={{background:'var(--warning-bg)',border:'1px solid rgba(138,98,0,0.2)',borderRadius:8,padding:'10px 16px',marginBottom:20,display:'flex',alignItems:'center',gap:8,fontFamily:'var(--body)',fontSize:12,color:'var(--warning)'}}>
      <div style={{width:6,height:6,borderRadius:'50%',background:'var(--warning)',flexShrink:0}}/>
      Showing demo data — your first real transaction will replace this automatically.
    </div>
  );
}

function BankBars({ banks }) {
  if (!banks?.length) return null;
  return (
    <Card style={{padding:24}}>
      <div style={{fontFamily:'var(--display)',fontSize:16,fontWeight:600,color:'var(--black)',marginBottom:20}}>By Bank</div>
      {banks.map((b,i) => {
        const pct = Math.round((b.volume/banks[0].volume)*100);
        return (
          <div key={i} style={{marginBottom:i<banks.length-1?13:0}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
              <span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--black)',fontWeight:500}}>{b.name||b.bank_code||'—'}</span>
              <span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)'}}>{fmtS(b.volume)}</span>
            </div>
            <div style={{height:5,background:'var(--surface2)',borderRadius:3,overflow:'hidden'}}>
              <div style={{width:`${pct}%`,height:'100%',background:'var(--gold)',borderRadius:3}}/>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

export default function Home() {
  const [period,  setPeriod]  = useState('14D');
  const [summary, setSummary] = useState(null);
  const [chart,   setChart]   = useState({data:[],labels:[]});
  const [banks,   setBanks]   = useState([]);
  const [txns,    setTxns]    = useState([]);
  const [isMock,  setIsMock]  = useState(false);
  const [loading, setLoading] = useState(true);
  const days = period==='7D'?7:period==='30D'?30:14;

  useEffect(() => {
    setLoading(true);
    Promise.all([getSummary(), getRevenue(days), getBanks(), getTransactions({limit:6})])
      .then(([s,r,b,t]) => {
        setSummary(s.data); setChart({data:r.data,labels:r.labels});
        setBanks(b.data); setTxns(t.data);
        setIsMock(s.isMock||t.isMock);
      }).finally(()=>setLoading(false));
  }, [days]);

  const today = summary?.today || {};
  const yest  = summary?.yesterday || {};
  const diff  = today.revenue&&yest.revenue ? Math.round(((today.revenue-yest.revenue)/yest.revenue)*100) : 12.4;

  return (
    <div style={{padding:32}} className="fade-up">
      {isMock && !loading && <MockNotice/>}
      <div style={{display:'flex',gap:14,marginBottom:24,flexWrap:'wrap'}}>
        <StatCard label="Today's Revenue" value={loading?'…':fmt(today.revenue||0)}            accent trend={diff} sub="vs yesterday"/>
        <StatCard label="Transactions"    value={loading?'…':(today.orders||0)}                sub="processed today"/>
        <StatCard label="Successful"      value={loading?'…':(today.successful_txns||0)}       sub="payments confirmed"/>
        <StatCard label="Pending"         value={loading?'…':(today.pending||0)}               sub="awaiting confirmation"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 290px',gap:16,marginBottom:24}}>
        <Card>
          <div style={{padding:'20px 24px 0',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
            <div>
              <div style={{fontFamily:'var(--display)',fontSize:16,fontWeight:600,color:'var(--black)'}}>Revenue Trend</div>
              <div style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)',marginTop:2}}>Daily performance</div>
            </div>
            <div style={{display:'flex',gap:6}}>
              {['7D','14D','30D'].map(p=>(
                <button key={p} onClick={()=>setPeriod(p)} style={{padding:'5px 12px',borderRadius:6,border:`1px solid ${period===p?'var(--gold-bdr)':'var(--border)'}`,background:period===p?'var(--gold-dim)':'transparent',color:period===p?'var(--gold-deep)':'var(--text2)',fontFamily:'var(--body)',fontSize:11,fontWeight:period===p?500:400}}>{p}</button>
              ))}
            </div>
          </div>
          {loading ? <div style={{height:150,display:'flex',alignItems:'center',justifyContent:'center'}}><Spinner/></div> : <RevenueChart data={chart.data} labels={chart.labels} height={150}/>}
        </Card>
        <BankBars banks={banks}/>
      </div>
      <Card>
        <CardHeader title="Recent Transactions" subtitle={isMock?'Demo data — real transactions appear here':'Real-time settlement activity'}/>
        {loading ? <div style={{padding:40,textAlign:'center'}}><Spinner/></div> : <DataTable columns={TXN_COLS} rows={txns} empty="No transactions yet — place your first order to see data here."/>}
      </Card>
    </div>
  );
}
