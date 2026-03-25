import { useState } from 'react';
import { fmt, Badge, Card, CardHeader, DataTable, FilterRow, MiniStat, ExportBtn } from '../components/UI';
import { TRANSACTIONS } from '../lib/mock';

const COLS = [
  { key:'id',       label:'ID',           render:v=><span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--gold)',fontWeight:600}}>#{v}</span> },
  { key:'customer', label:'Customer',     render:(v,r)=><div><div style={{fontFamily:'var(--body)',fontSize:13,color:'var(--black)',fontWeight:500}}>{v}</div><div style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)',marginTop:1}}>{r.email}</div></div> },
  { key:'bank',     label:'Bank',         render:v=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text2)',background:'var(--surface2)',padding:'3px 8px',borderRadius:4}}>{v}</span> },
  { key:'amount',   label:'Amount',       render:v=><span style={{fontFamily:'var(--display)',fontSize:14,fontWeight:600,color:'var(--black)'}}>{fmt(v)}</span> },
  { key:'status',   label:'Status',       render:v=><Badge status={v}/> },
  { key:'phone',    label:'Phone',        render:v=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)'}}>{v}</span> },
  { key:'date',     label:'Date',         render:v=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)'}}>{v}</span> },
];

export default function Transactions() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const rows = TRANSACTIONS.filter(t => {
    const ok = !search || t.customer.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search) || t.email.includes(search);
    return ok && (filter === 'all' || t.status === filter);
  });

  return (
    <div style={{ padding:32 }} className="fade-up">
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <MiniStat label="Total (Today)"  value={fmt(TRANSACTIONS.reduce((a,b)=>a+b.amount,0))} />
        <MiniStat label="Completed"      value={TRANSACTIONS.filter(t=>t.status==='completed').length} />
        <MiniStat label="Pending"        value={TRANSACTIONS.filter(t=>t.status==='pending').length} />
        <MiniStat label="Failed"         value={TRANSACTIONS.filter(t=>t.status==='failed').length} />
      </div>
      <FilterRow search={search} onSearch={setSearch} filters={['all','completed','pending','failed','refunded','on_hold']} active={filter} onFilter={setFilter} />
      <Card>
        <CardHeader title="All Transactions" subtitle={`${rows.length} result${rows.length!==1?'s':''}`} action={<ExportBtn/>} />
        <DataTable columns={COLS} rows={rows} empty="No transactions match your search." />
      </Card>
    </div>
  );
}
