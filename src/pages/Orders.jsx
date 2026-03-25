import { useState } from 'react';
import { fmt, Badge, Card, CardHeader, DataTable, FilterRow, MiniStat } from '../components/UI';
import { ORDERS } from '../lib/mock';

const COLS = [
  { key:'orderId',  label:'Order',      render:v=><span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--gold)',fontWeight:600}}>#{v}</span> },
  { key:'customer', label:'Customer',   render:(v,r)=><div><div style={{fontFamily:'var(--body)',fontSize:13,color:'var(--black)',fontWeight:500}}>{v}</div><div style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)',marginTop:1}}>{r.email}</div></div> },
  { key:'city',     label:'City',       render:v=><span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--text2)'}}>{v}</span> },
  { key:'items',    label:'Items',      render:v=><span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--text3)'}}>{v}</span> },
  { key:'total',    label:'Total',      render:v=><span style={{fontFamily:'var(--display)',fontSize:14,fontWeight:600,color:'var(--black)'}}>{fmt(v)}</span> },
  { key:'txId',     label:'Transaction',render:v=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text2)',background:'var(--surface2)',padding:'3px 8px',borderRadius:4}}>#{v}</span> },
  { key:'status',   label:'Status',     render:v=><Badge status={v}/> },
  { key:'date',     label:'Date',       render:v=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)'}}>{v}</span> },
];

export default function Orders() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const rows = ORDERS.filter(o => {
    const ok = !search || o.customer.toLowerCase().includes(search.toLowerCase()) || o.orderId.includes(search) || o.city.toLowerCase().includes(search.toLowerCase());
    return ok && (filter === 'all' || o.status === filter);
  });

  const cities = new Set(ORDERS.map(o=>o.city)).size;

  return (
    <div style={{ padding:32 }} className="fade-up">
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <MiniStat label="Total Orders"   value={ORDERS.length} />
        <MiniStat label="Completed"      value={ORDERS.filter(o=>o.status==='completed').length} />
        <MiniStat label="Pending"        value={ORDERS.filter(o=>o.status==='pending'||o.status==='on_hold').length} />
        <MiniStat label="Cities Reached" value={cities} />
      </div>
      <FilterRow search={search} onSearch={setSearch} filters={['all','completed','pending','failed','refunded']} active={filter} onFilter={setFilter} />
      <Card>
        <CardHeader title="All Orders" subtitle={`${rows.length} orders · synced from WooCommerce`} />
        <DataTable columns={COLS} rows={rows} empty="No orders found." />
      </Card>
    </div>
  );
}
