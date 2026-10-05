import React, { useState } from "react";
import { STATUS_LABELS } from "../lib/constants.js";
import { ratingStars } from "../lib/helpers.js";
import { CSV_COLUMNS, parseCSV, downloadTemplate } from "../lib/csv.js";
import { closeBtnStyle, cancelBtnStyle } from "../lib/styles.js";

/* ─── CSV Import Modal ─────────────────────────────────────────── */
export default function CsvImportModal({ onImport, onClose, existingBooks }) {
  const [stage,setStage]=useState("guide");
  const [parsed,setParsed]=useState({rows:[],errors:[]});
  const [mode,setMode]=useState("skip");
  const [dragging,setDragging]=useState(false);
  const mono={fontFamily:"'DM Mono',monospace"};

  function handleFile(file) {
    if(!file)return;
    const r=new FileReader();
    r.onload=e=>{setParsed(parseCSV(e.target.result));setStage("preview");};
    r.readAsText(file,"UTF-8");
  }
  function doImport() {
    const existing=new Set(existingBooks.map(b=>b.title.toLowerCase()+"||"+b.author.toLowerCase()));
    let added=0,skipped=0;
    const newBooks=[...existingBooks];
    parsed.rows.forEach(row=>{
      const key=row.title.toLowerCase()+"||"+row.author.toLowerCase();
      if(existing.has(key)){
        if(mode==="overwrite"){
          const idx=newBooks.findIndex(b=>b.title.toLowerCase()===row.title.toLowerCase()&&b.author.toLowerCase()===row.author.toLowerCase());
          if(idx>=0){newBooks[idx]={...newBooks[idx],...row,id:newBooks[idx].id};added++;}
        } else skipped++;
      } else {newBooks.push(row);existing.add(key);added++;}
    });
    onImport(newBooks,added,skipped);
  }


  if(stage==="guide") return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem",marginTop:"0.25rem"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:700,color:"var(--ink)"}}>Importa CSV</h2>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",
          color:"var(--muted)",fontSize:"1.3rem",lineHeight:1,padding:"0.2rem"}}>✕</button>
      </div>

      <div style={{background:"var(--card-bg)",borderRadius:14,overflow:"hidden",
        boxShadow:"0 1px 4px rgba(28,22,17,0.07)",marginBottom:"1rem"}}>
        <div style={{padding:"0.6rem 1rem",background:"var(--ink)",display:"grid",
          gridTemplateColumns:"1fr 0.5fr 2fr",gap:"0.5rem"}}>
          {["Colonna","Obbl.","Valori accettati"].map(h=>(
            <span key={h} style={{...mono,fontSize:"0.6rem",color:"rgba(255,255,255,0.6)",
              textTransform:"uppercase",letterSpacing:"0.08em"}}>{h}</span>
          ))}
        </div>
        {CSV_COLUMNS.map((c,i)=>(
          <div key={c.key} style={{padding:"0.55rem 1rem",display:"grid",gridTemplateColumns:"1fr 0.5fr 2fr",
            gap:"0.5rem",alignItems:"start",
            background:i%2===0?"var(--card-bg)":"rgba(242,237,228,0.5)",
            borderTop:"1px solid var(--border)"}}>
            <code style={{...mono,fontSize:"0.78rem",color:"var(--burgundy)",fontWeight:500}}>{c.key}</code>
            <span style={{...mono,fontSize:"0.7rem",color:c.required?"#4CAF50":"var(--muted)"}}>{c.required?"Sì":"—"}</span>
            <span style={{fontSize:"0.75rem",color:"var(--muted)",lineHeight:1.4}}>{c.desc}</span>
          </div>
        ))}
      </div>

      <button onClick={downloadTemplate} style={{width:"100%",padding:"0.75rem",marginBottom:"1rem",
        background:"var(--card-bg)",border:"1.5px dashed var(--border)",borderRadius:12,cursor:"pointer",
        fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"var(--muted)"}}>
        ⬇ Scarica file CSV di esempio
      </button>

      <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}
        style={{border:`2px dashed ${dragging?"var(--burgundy)":"var(--border)"}`,borderRadius:14,
          padding:"2rem 1rem",textAlign:"center",cursor:"pointer",marginBottom:"1.25rem",
          background:dragging?"rgba(122,34,51,0.05)":"var(--card-bg)",transition:"all 0.2s"}}
        onClick={()=>document.getElementById("csv-input").click()}>
        <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>📂</div>
        <div style={{fontFamily:"'Lora',serif",fontSize:"0.9rem",color:"var(--muted)"}}>
          Trascina il CSV qui, o <span style={{color:"var(--burgundy)",textDecoration:"underline"}}>selezionalo</span>
        </div>
        <input id="csv-input" type="file" accept=".csv,text/csv" style={{display:"none"}}
          onChange={e=>handleFile(e.target.files[0])}/>
      </div>

      <button onClick={onClose} style={{width:"100%",padding:"0.9rem",background:"none",
        border:"1.5px solid var(--border)",borderRadius:14,cursor:"pointer",
        fontFamily:"'Lora',serif",fontSize:"0.95rem",color:"var(--muted)"}}>Annulla</button>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem",marginTop:"0.25rem"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:700,color:"var(--ink)"}}>Anteprima</h2>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",
          color:"var(--muted)",fontSize:"1.3rem",lineHeight:1,padding:"0.2rem"}}>✕</button>
      </div>
      <p style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:"1rem",fontStyle:"italic"}}>
        {parsed.rows.length} libro/i pronti · {parsed.errors.length} errore/i
      </p>

      {parsed.errors.length>0&&(
        <div style={{background:"rgba(122,34,51,0.07)",border:"1px solid rgba(122,34,51,0.3)",borderRadius:12,
          padding:"0.85rem 1rem",marginBottom:"1rem",fontSize:"0.78rem",color:"var(--burgundy)",lineHeight:1.7,...mono}}>
          {parsed.errors.map((e,i)=><div key={i}>⚠ {e}</div>)}
        </div>
      )}

      {parsed.rows.length>0&&(
        <>
          <div style={{marginBottom:"1rem"}}>
            <span style={labelStyle}>Se il libro esiste già</span>
            <div style={{display:"flex",gap:"0.5rem"}}>
              {[["skip","Salta duplicato"],["overwrite","Sovrascrivi"]].map(([v,l])=>(
                <button key={v} onClick={()=>setMode(v)} style={{
                  padding:"0.5rem 1rem",borderRadius:20,cursor:"pointer",...mono,fontSize:"0.72rem",
                  textTransform:"uppercase",letterSpacing:"0.05em",border:"none",
                  background:mode===v?"var(--burgundy)":"var(--card-bg)",
                  color:mode===v?"#fff":"var(--muted)",fontWeight:mode===v?600:400,
                }}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{maxHeight:220,overflowY:"auto",borderRadius:12,marginBottom:"1.25rem",
            border:"1px solid var(--border)"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.78rem"}}>
              <thead>
                <tr style={{background:"var(--ink)"}}>
                  {["Titolo","Autore","Stato","Val."].map(h=>(
                    <th key={h} style={{...mono,padding:"0.5rem 0.75rem",textAlign:"left",
                      color:"rgba(255,255,255,0.7)",fontSize:"0.62rem",
                      textTransform:"uppercase",letterSpacing:"0.07em",fontWeight:500}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsed.rows.map((r,i)=>{
                  const dup=existingBooks.some(b=>b.title.toLowerCase()===r.title.toLowerCase()&&b.author.toLowerCase()===r.author.toLowerCase());
                  return (
                    <tr key={r.id} style={{background:i%2===0?"var(--card-bg)":"rgba(242,237,228,0.5)",borderTop:"1px solid var(--border)"}}>
                      <td style={{padding:"0.5rem 0.75rem",fontFamily:"'Lora',serif",maxWidth:130,
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {dup&&<span style={{color:"var(--amber)",marginRight:3}}>⚠</span>}{r.title}
                      </td>
                      <td style={{padding:"0.5rem 0.75rem",color:"var(--muted)",fontStyle:"italic",
                        maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.author}</td>
                      <td style={{padding:"0.5rem 0.75rem",...mono,fontSize:"0.68rem",color:"var(--muted)"}}>{STATUS_LABELS[r.status]}</td>
                      <td style={{padding:"0.5rem 0.75rem",color:"var(--amber)",letterSpacing:"-1px"}}>{r.rating>0?ratingStars(r.rating):"—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
        {parsed.rows.length>0&&(
          <button onClick={doImport} style={{width:"100%",padding:"1rem",
            background:"var(--burgundy)",color:"#fff",border:"none",borderRadius:14,
            cursor:"pointer",fontFamily:"'Lora',serif",fontSize:"1rem",fontWeight:600}}>
            Importa {parsed.rows.length} libro/i
          </button>
        )}
        <div style={{display:"flex",gap:"0.6rem"}}>
          <button onClick={()=>setStage("guide")} style={{flex:1,padding:"0.75rem",background:"none",
            border:"1.5px solid var(--border)",borderRadius:14,cursor:"pointer",
            fontFamily:"'Lora',serif",color:"var(--muted)",fontSize:"0.88rem"}}>← Indietro</button>
          <button onClick={onClose} style={{flex:1,padding:"0.75rem",background:"none",
            border:"1.5px solid var(--border)",borderRadius:14,cursor:"pointer",
            fontFamily:"'Lora',serif",color:"var(--muted)",fontSize:"0.88rem"}}>Annulla</button>
        </div>
      </div>
    </div>
  );
}

