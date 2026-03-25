import { useState } from 'react';

export const fmt = (n) => 'Rs ' + parseFloat(n||0).toLocaleString('en-PK',{maximumFractionDigits:0});
export const fmtS = (n) => { const v=parseFloat(n||0); if(v>=1000000) return 'Rs '+(v/1000000).toFixed(1)+'M'; if(v>=1000) return 'Rs '+(v/1000).toFixed(1)+'K'; return 'Rs '+v.toFixed(0); };

export function Badge({status}){
  const M={completed:{bg:'var(--success-bg)',c:'var(--success)',l:'Completed'},settled:{bg:'var(--success-bg)',c:'var(--success)',l:'Settled'},processing:{bg:'var(--info-bg)',c:'var(--info)',l:'Processing'},pending:{bg:'var(--warning-bg)',c:'var(--warning)',l:'Pending'},on_hold:{bg:'var(--warning-bg)',c:'var(--warning)',l:'On Hold'},failed:{bg:'var(--danger-bg)',c:'var(--danger)',l:'Failed'},refunded:{bg:'var(--info-bg)',c:'var(--info)',l:'Refunded'}};
  const s=M[status]||M.pending;
  return <span style={{background:s.bg,color:s.c,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:'0.04em',fontFamily:'var(--body)',textTransform:'uppercase',whiteSpace:'nowrap'}}>{s.l}</span>;
}

export function StatCard({label,value,sub,accent,trend}){
  return(
    <div style={{background:accent?'var(--black)':'var(--surface)',border:`1px solid ${accent?'transparent':'var(--border)'}`,borderRadius:12,padding:'20px 22px',flex:1,minWidth:170}}>
      <div style={{fontFamily:'var(--body)',fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10,color:accent?'rgba(197,164,109,0.6)':'var(--text3)'}}>{label}</div>
      <div style={{fontFamily:'var(--display)',fontSize:accent?28:22,fontWeight:700,color:accent?'var(--gold)':'var(--black)',lineHeight:1,marginBottom:8}}>{value}</div>
      {(sub||trend!==undefined)&&<div style={{display:'flex',alignItems:'center',gap:6}}>
        {trend!==undefined&&<span style={{background:trend>0?'var(--success-bg)':'var(--danger-bg)',color:trend>0?'var(--success)':'var(--danger)',fontSize:10,fontWeight:600,padding:'2px 7px',borderRadius:20,fontFamily:'var(--body)'}}>{trend>0?'+':''}{trend}%</span>}
        {sub&&<span style={{fontFamily:'var(--body)',fontSize:11,color:accent?'rgba(197,164,109,0.4)':'var(--text3)'}}>{sub}</span>}
      </div>}
    </div>
  );
}

export function Card({children,style={}}){return <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,...style}}>{children}</div>;}

export function CardHeader({title,subtitle,action}){
  return(
    <div style={{padding:'18px 24px 16px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div>
        <div style={{fontFamily:'var(--display)',fontSize:16,fontWeight:600,color:'var(--black)'}}>{title}</div>
        {subtitle&&<div style={{fontFamily:'var(--body)',fontSize:11,color:'var(--text3)',marginTop:2}}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

export function DataTable({columns,rows,empty='No data found.'}){
  if(!rows?.length) return <div style={{padding:40,textAlign:'center',fontFamily:'var(--body)',fontSize:13,color:'var(--text3)'}}>{empty}</div>;
  return(
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
        <thead><tr>{columns.map(c=><th key={c.key} style={{padding:'11px 16px',textAlign:'left',fontFamily:'var(--body)',fontSize:10,fontWeight:600,color:'var(--text3)',letterSpacing:'0.08em',textTransform:'uppercase',borderBottom:'1px solid var(--border)',whiteSpace:'nowrap'}}>{c.label}</th>)}</tr></thead>
        <tbody>{rows.map((row,i)=><tr key={i} style={{background:i%2?'var(--bg)':'transparent'}}>{columns.map(c=><td key={c.key} style={{padding:'12px 16px',borderBottom:i<rows.length-1?'1px solid var(--border)':'none'}}>{c.render?c.render(row[c.key],row):row[c.key]}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function FilterRow({search,onSearch,filters,active,onFilter}){
  return(
    <div style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap',alignItems:'center'}}>
      <div style={{flex:1,minWidth:200,position:'relative'}}>
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth={2} strokeLinecap="round" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}><circle cx={11} cy={11} r={8}/><path d="m21 21-4.35-4.35"/></svg>
        <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search…" style={{width:'100%',padding:'10px 14px 10px 34px',boxSizing:'border-box',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8,fontFamily:'var(--body)',fontSize:13,color:'var(--black)'}}/>
      </div>
      {filters.map(f=><button key={f} onClick={()=>onFilter(f)} style={{padding:'9px 15px',borderRadius:8,border:`1px solid ${active===f?'var(--gold-bdr)':'var(--border)'}`,background:active===f?'var(--gold-dim)':'var(--surface)',color:active===f?'var(--gold-deep)':'var(--text2)',fontFamily:'var(--body)',fontSize:12,fontWeight:active===f?500:400,textTransform:'capitalize'}}>{f}</button>)}
    </div>
  );
}

export function MiniStat({label,value}){
  return(
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:10,padding:'14px 20px',flex:1,minWidth:140}}>
      <div style={{fontFamily:'var(--body)',fontSize:9,color:'var(--text3)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:6}}>{label}</div>
      <div style={{fontFamily:'var(--display)',fontSize:20,fontWeight:700,color:'var(--black)'}}>{value}</div>
    </div>
  );
}

export function ExportBtn({label='Export CSV'}){
  return(
    <button style={{background:'var(--black)',color:'#F9F7F3',borderRadius:7,padding:'8px 14px',fontFamily:'var(--body)',fontSize:11,fontWeight:500,display:'flex',alignItems:'center',gap:5}}>
      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
      {label}
    </button>
  );
}

export function RevenueChart({data,labels,height=160}){
  const [hov,setHov]=useState(null);
  const max=Math.max(...data,1);
  return(
    <div style={{padding:'0 24px 24px'}}>
      <div style={{display:'flex',alignItems:'flex-end',gap:5,height,position:'relative',paddingBottom:26}}>
        {[0.33,0.66,1].map(p=><div key={p} style={{position:'absolute',left:0,right:0,bottom:26+(height-26)*p,borderTop:'1px dashed var(--border)'}}><span style={{position:'absolute',right:0,fontFamily:'var(--body)',fontSize:9,color:'var(--text3)',transform:'translateY(-50%)'}}>{fmtS(max*p)}</span></div>)}
        {data.map((v,i)=>{
          const h=Math.max((v/max)*(height-26),4);
          const isL=i===data.length-1,isH=hov===i;
          return(
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',height:'100%',justifyContent:'flex-end',cursor:'pointer',position:'relative'}} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
              {isH&&<div style={{position:'absolute',bottom:h+30,background:'var(--black)',color:'#F9F7F3',padding:'4px 8px',borderRadius:5,fontFamily:'var(--body)',fontSize:10,whiteSpace:'nowrap',zIndex:5}}>{fmtS(v)}</div>}
              <div style={{width:'100%',height:h,borderRadius:'4px 4px 0 0',background:isL?'var(--gold)':isH?'var(--gold-deep)':'var(--gold-dim)',border:`1px solid ${isL?'var(--gold-deep)':isH?'var(--gold-bdr)':'var(--border)'}`,transition:'all 0.15s'}}/>
              <div style={{fontFamily:'var(--body)',fontSize:8,color:isL?'var(--gold-deep)':'var(--text3)',marginTop:4,transform:'rotate(-40deg)',transformOrigin:'top center',whiteSpace:'nowrap'}}>{labels[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
