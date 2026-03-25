import { useState, useEffect, useCallback } from 'react';
import { fmt, Badge, Card, CardHeader, DataTable, FilterRow, MiniStat, ExportBtn } from '../components/UI';
import { getTransactions } from '../lib/data';

const COLS = [
  { key:'id',        label:'ID',          render:v=><span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--gold)',fontWeight:600}}>#{v}</span> },
  { key:'customer',  label:'Customer',    render:(v,r)=><div><div style={{fontFamily:'var(--body)',fontSize:13,color:'var(--black)',fontWeight:500}}>{v}</div><div style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)',marginTop:1}}>{r.customer_email||r.email||''}</div></div> },
  { key:'bank',      label:'Bank',        render:(v,r)=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text2)',background:'var(--surface2)',padding:'3px 8px',borderRadius:4}}>{v||r.bank_code||'—'}</span> },
  { key:'amount',    label:'Amount',      render:v=><span style={{fontFamily:'var(--display)',fontSize:14,fontWeight:600,color:'var(--black)'}}>{fmt(v)}</span> },
  { key:'status',    label:'Status',      render:v=><Badge status={v}/> },
  { key:'phone',     label:'Phone',       render:(v,r)=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)'}}>{v||r.customer_phone||'—'}</span> },
  { key:'date',      label:'Date',        render:(v,r)=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)'}}>{v||r.created_at?.slice(0,10)||'—'}</span> },
];

export default function Transactions() {
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [rows,    setRows]    = useState([]);
  const [meta,    setMeta]    = useState({total:0});
  const [isMock,  setIsMock]  = useState(false);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    getTransactions({search,status:filter,page,limit:20})
      .then(r=>{setRows(r.data);setMeta(r.meta);setIsMock(r.isMock);})
      .finally(()=>setLoading(false));
  }, [search, filter, page]);

  useEffect(()=>{setPage(1);},[search,filter]);
  useEffect(()=>{load();},[load]);

  const completed = rows.filter(t=>t.status==='completed').length;
  const pending   = rows.filter(t=>t.status==='pending'||t.status==='on_hold').length;
  const failed    = rows.filter(t=>t.status==='failed').length;
  const total     = rows.reduce((a,b)=>a+parseFloat(b.amount||0),0);

  return (
    <div style={{padding:32}} className="fade-up">
      {isMock && !loading && (
        <div style={{background:'var(--warning-bg)',border:'1px solid rgba(138,98,0,0.2)',borderRadius:8,padding:'10px 16px',marginBottom:20,display:'flex',alignItems:'center',gap:8,fontFamily:'var(--body)',fontSize:12,color:'var(--warning)'}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:'var(--warning)',flexShrink:0}}/>
          Showing demo data — real transactions will appear automatically once orders are placed.
        </div>
      )}
      <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}}>
        <MiniStat label="Total Amount"  value={fmt(total)}/>
        <MiniStat label="Completed"     value={completed}/>
        <MiniStat label="Pending"       value={pending}/>
        <MiniStat label="Failed"        value={failed}/>
      </div>
      <FilterRow search={search} onSearch={s=>{setSearch(s);setPage(1);}} filters={['all','completed','pending','failed','refunded','on_hold']} active={filter} onFilter={f=>{setFilter(f);setPage(1);}}/>
      <Card>
        <CardHeader title="All Transactions" subtitle={`${meta.total||rows.length} result${(meta.total||rows.length)!==1?'s':''}`} action={<ExportBtn/>}/>
        {loading
          ? <div style={{padding:40,textAlign:'center'}}><div style={{width:20,height:20,border:'2px solid var(--border)',borderTopColor:'var(--gold)',borderRadius:'50%',animation:'spin 0.65s linear infinite',display:'inline-block'}}/></div>
          : <DataTable columns={COLS} rows={rows} empty="No transactions yet."/>
        }
      </Card>
      {meta.total > 20 && (
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16,fontFamily:'var(--body)',fontSize:12,color:'var(--text2)'}}>
          <span>{meta.total} total · page {page}</span>
          <div style={{display:'flex',gap:8}}>
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} style={{padding:'7px 14px',borderRadius:7,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text2)',fontFamily:'var(--body)',fontSize:12,cursor:page<=1?'not-allowed':'pointer',opacity:page<=1?0.5:1}}>← Prev</button>
            <button disabled={page*20>=meta.total} onClick={()=>setPage(p=>p+1)} style={{padding:'7px 14px',borderRadius:7,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text2)',fontFamily:'var(--body)',fontSize:12,cursor:page*20>=meta.total?'not-allowed':'pointer',opacity:page*20>=meta.total?0.5:1}}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
