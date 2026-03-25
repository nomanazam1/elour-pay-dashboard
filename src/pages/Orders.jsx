import { useState, useEffect, useCallback } from 'react';
import { fmt, Badge, Card, CardHeader, DataTable, FilterRow, MiniStat } from '../components/UI';
import { getOrders } from '../lib/data';

const COLS = [
  { key:'orderId',  label:'Order',       render:(v,r)=><span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--gold)',fontWeight:600}}>#{v||r.wc_order_id||r.wc_order_number}</span> },
  { key:'customer', label:'Customer',    render:(v,r)=><div><div style={{fontFamily:'var(--body)',fontSize:13,color:'var(--black)',fontWeight:500}}>{v||r.customer_name||'—'}</div><div style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)',marginTop:1}}>{r.email||r.customer_email||''}</div></div> },
  { key:'city',     label:'City',        render:(v,r)=><span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--text2)'}}>{v||r.customer_city||'—'}</span> },
  { key:'items',    label:'Items',       render:v=><span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--text3)'}}>{v||'—'}</span> },
  { key:'total',    label:'Total',       render:v=><span style={{fontFamily:'var(--display)',fontSize:14,fontWeight:600,color:'var(--black)'}}>{fmt(v)}</span> },
  { key:'txId',     label:'Transaction', render:(v,r)=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text2)',background:'var(--surface2)',padding:'3px 8px',borderRadius:4}}>#{v||r.transaction_id||'—'}</span> },
  { key:'status',   label:'Status',      render:v=><Badge status={v}/> },
  { key:'date',     label:'Date',        render:(v,r)=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)'}}>{v||r.created_at?.slice(0,10)||'—'}</span> },
];

export default function Orders() {
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [rows,    setRows]    = useState([]);
  const [meta,    setMeta]    = useState({total:0});
  const [isMock,  setIsMock]  = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getOrders({search,status:filter,limit:30})
      .then(r=>{setRows(r.data);setMeta(r.meta);setIsMock(r.isMock);})
      .finally(()=>setLoading(false));
  }, [search,filter]);

  useEffect(()=>{load();},[load]);

  const cities = new Set(rows.map(o=>o.city||o.customer_city).filter(Boolean)).size;

  return (
    <div style={{padding:32}} className="fade-up">
      {isMock && !loading && (
        <div style={{background:'var(--warning-bg)',border:'1px solid rgba(138,98,0,0.2)',borderRadius:8,padding:'10px 16px',marginBottom:20,display:'flex',alignItems:'center',gap:8,fontFamily:'var(--body)',fontSize:12,color:'var(--warning)'}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:'var(--warning)',flexShrink:0}}/>
          Showing demo data — WooCommerce orders sync here automatically after each payment.
        </div>
      )}
      <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}}>
        <MiniStat label="Total Orders"   value={rows.length}/>
        <MiniStat label="Completed"      value={rows.filter(o=>o.status==='completed').length}/>
        <MiniStat label="Pending"        value={rows.filter(o=>o.status==='pending'||o.status==='on_hold').length}/>
        <MiniStat label="Cities Reached" value={cities||'—'}/>
      </div>
      <FilterRow search={search} onSearch={setSearch} filters={['all','completed','pending','failed','refunded']} active={filter} onFilter={setFilter}/>
      <Card>
        <CardHeader title="All Orders" subtitle={`${meta.total||rows.length} orders · synced from WooCommerce`}/>
        {loading
          ? <div style={{padding:40,textAlign:'center'}}><div style={{width:20,height:20,border:'2px solid var(--border)',borderTopColor:'var(--gold)',borderRadius:'50%',animation:'spin 0.65s linear infinite',display:'inline-block'}}/></div>
          : <DataTable columns={COLS} rows={rows} empty="No orders yet — orders appear here after each payment."/>
        }
      </Card>
    </div>
  );
}
