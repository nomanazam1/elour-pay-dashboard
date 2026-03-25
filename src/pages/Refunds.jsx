import { useState, useEffect } from 'react';
import { fmt, Badge, Card, CardHeader, DataTable, MiniStat } from '../components/UI';
import { getRefunds, createRefund } from '../lib/data';

const COLS = [
  { key:'id',       label:'Refund ID',   render:(v,r)=><span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--info)',fontWeight:600}}>#{v||r.id}</span> },
  { key:'txId',     label:'Transaction', render:(v,r)=><span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--gold)'}}>#{v||r.transaction_id}</span> },
  { key:'customer', label:'Customer',    render:v=><span style={{fontFamily:'var(--body)',fontSize:13,color:'var(--black)'}}>{v||'—'}</span> },
  { key:'amount',   label:'Amount',      render:v=><span style={{fontFamily:'var(--display)',fontSize:14,fontWeight:600,color:'var(--black)'}}>{fmt(v)}</span> },
  { key:'reason',   label:'Reason',      render:v=><span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--text2)'}}>{v||'—'}</span> },
  { key:'status',   label:'Status',      render:v=><Badge status={v||'refunded'}/> },
  { key:'ref',      label:'Safepay Ref', render:(v,r)=><span style={{fontFamily:'monospace',fontSize:11,color:'var(--text3)'}}>{v||r.safepay_ref||'—'}</span> },
  { key:'date',     label:'Date',        render:(v,r)=><span style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)'}}>{v||r.created_at?.slice(0,10)||'—'}</span> },
];

function RefundModal({ onClose, onSubmit, isReal }) {
  const [form,    setForm]    = useState({transaction_id:'',amount:'',reason:''});
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');

  async function submit() {
    if (!form.transaction_id||!form.amount){setErr('Transaction ID and amount are required.');return;}
    setErr(''); setLoading(true);
    try {
      if (isReal) {
        const res = await createRefund({transaction_id:form.transaction_id,amount:parseFloat(form.amount),reason:form.reason});
        onSubmit(res.data);
      } else {
        await new Promise(r=>setTimeout(r,700));
        onSubmit({id:`REF-${Math.floor(Math.random()*900+100)}`,txId:form.transaction_id,customer:'Manual Entry',amount:parseFloat(form.amount),reason:form.reason||'No reason',status:'refunded',date:new Date().toISOString().split('T')[0],ref:`SP-REF-${Date.now().toString().slice(-5)}`});
      }
    } catch(e) { setErr(e.message||'Refund failed.'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(5,5,5,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={onClose}>
      <div style={{background:'var(--surface)',borderRadius:14,padding:32,width:420,maxWidth:'90vw',border:'1px solid var(--border)',boxShadow:'0 20px 60px rgba(5,5,5,0.18)'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
          <div>
            <div style={{fontFamily:'var(--display)',fontSize:20,fontWeight:600,color:'var(--black)'}}>New Refund</div>
            <div style={{fontFamily:'var(--body)',fontSize:12,color:'var(--text3)',marginTop:3}}>Auto-tagged to the transaction record</div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',color:'var(--text3)',fontSize:22,lineHeight:1,cursor:'pointer'}}>&times;</button>
        </div>
        {err&&<div style={{background:'var(--danger-bg)',border:'1px solid rgba(176,48,48,0.2)',borderRadius:7,padding:'10px 14px',marginBottom:16,fontFamily:'var(--body)',fontSize:13,color:'var(--danger)'}}>{err}</div>}
        {[{label:'Transaction ID',key:'transaction_id',ph:'UUID from transactions list',type:'text'},{label:'Refund Amount (PKR)',key:'amount',ph:'e.g. 12000',type:'number'},{label:'Reason (optional)',key:'reason',ph:'Customer request, damaged item…',type:'text'}].map(f=>(
          <div key={f.key} style={{marginBottom:16}}>
            <label style={{display:'block',fontFamily:'var(--display)',fontSize:10,fontWeight:600,color:'var(--text2)',letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6}}>{f.label}</label>
            <input type={f.type} placeholder={f.ph} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} style={{width:'100%',padding:'11px 13px',boxSizing:'border-box',background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:8,fontFamily:'var(--body)',fontSize:13,color:'var(--black)'}}/>
          </div>
        ))}
        <div style={{display:'flex',gap:10,marginTop:8}}>
          <button onClick={onClose} style={{flex:1,padding:12,background:'var(--bg)',border:'1px solid var(--border)',borderRadius:8,fontFamily:'var(--body)',fontSize:13,cursor:'pointer',color:'var(--text2)'}}>Cancel</button>
          <button onClick={submit} disabled={loading} style={{flex:1,padding:12,background:loading?'var(--text3)':'var(--black)',border:'none',borderRadius:8,fontFamily:'var(--body)',fontSize:13,fontWeight:500,cursor:loading?'not-allowed':'pointer',color:'#F9F7F3'}}>{loading?'Processing…':'Confirm Refund'}</button>
        </div>
      </div>
    </div>
  );
}

export default function Refunds() {
  const [refunds,   setRefunds]   = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [success,   setSuccess]   = useState('');
  const [isMock,    setIsMock]    = useState(false);
  const [loading,   setLoading]   = useState(true);

  useEffect(()=>{
    getRefunds().then(r=>{setRefunds(r.data);setIsMock(r.isMock);}).finally(()=>setLoading(false));
  },[]);

  function handleNew(r){
    setRefunds(p=>[r,...p]); setShowModal(false);
    setSuccess(`Refund initiated — tagged to transaction.`);
    setTimeout(()=>setSuccess(''),5000);
  }

  const total = refunds.reduce((a,b)=>a+parseFloat(b.amount||0),0);
  const avg   = refunds.length ? total/refunds.length : 0;

  return (
    <div style={{padding:32}} className="fade-up">
      {isMock&&!loading&&<div style={{background:'var(--warning-bg)',border:'1px solid rgba(138,98,0,0.2)',borderRadius:8,padding:'10px 16px',marginBottom:20,display:'flex',alignItems:'center',gap:8,fontFamily:'var(--body)',fontSize:12,color:'var(--warning)'}}><div style={{width:6,height:6,borderRadius:'50%',background:'var(--warning)',flexShrink:0}}/>Showing demo refunds — real refunds appear here automatically.</div>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24,gap:16,flexWrap:'wrap'}}>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <MiniStat label="Total Refunded" value={`Rs ${Math.round(total/1000)}K`}/>
          <MiniStat label="Refund Count"   value={refunds.length}/>
          <MiniStat label="Avg Refund"     value={`Rs ${Math.round(avg/1000)}K`}/>
        </div>
        <button onClick={()=>setShowModal(true)} style={{background:'var(--black)',color:'#F9F7F3',border:'none',borderRadius:8,padding:'11px 20px',fontFamily:'var(--body)',fontSize:13,fontWeight:500,cursor:'pointer',whiteSpace:'nowrap'}}>+ New Refund</button>
      </div>
      {success&&<div style={{background:'var(--success-bg)',border:'1px solid rgba(42,110,71,0.2)',borderRadius:8,padding:'11px 16px',marginBottom:20,fontFamily:'var(--body)',fontSize:13,color:'var(--success)'}}>{success}</div>}
      <div style={{background:'var(--info-bg)',border:'1px solid rgba(47,95,154,0.18)',borderRadius:8,padding:'11px 16px',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:6,height:6,borderRadius:'50%',background:'var(--info)',flexShrink:0}}/>
        <span style={{fontFamily:'var(--body)',fontSize:12,color:'var(--info)'}}>All refunds are automatically tagged to their original transaction record in real time.</span>
      </div>
      <Card>
        <CardHeader title="Refund History" subtitle="Full audit log of all refund actions"/>
        {loading ? <div style={{padding:40,textAlign:'center'}}><div style={{width:20,height:20,border:'2px solid var(--border)',borderTopColor:'var(--gold)',borderRadius:'50%',animation:'spin 0.65s linear infinite',display:'inline-block'}}/></div> : <DataTable columns={COLS} rows={refunds} empty="No refunds issued yet."/>}
      </Card>
      {showModal&&<RefundModal onClose={()=>setShowModal(false)} onSubmit={handleNew} isReal={!isMock}/>}
    </div>
  );
}
