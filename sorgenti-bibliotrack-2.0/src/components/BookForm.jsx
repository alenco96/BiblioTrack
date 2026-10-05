import React, { useState } from "react";
import { STATUS, GENRES } from "../lib/constants.js";
import { uid } from "../lib/helpers.js";
import { inputStyle, labelStyle, closeBtnStyle } from "../lib/styles.js";

export default function BookForm({ initial, onSave, onCancel, openLibraryData }) {
  const [form, setForm] = useState(initial || openLibraryData || {
    title:"",author:"",genre:"",pages:"",status:STATUS.WISHLIST,
    startDate:"",endDate:"",rating:0,notes:"",saga:"",favorite:false,
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));


  const STATUS_PILLS = [
    { value:STATUS.WISHLIST, label:"Da leggere" },
    { value:STATUS.READING,  label:"In lettura" },
    { value:STATUS.READ,     label:"Letto" },
    { value:STATUS.ABANDONED,label:"Abbandonato" },
  ];

  const isEditing = !!initial;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem",marginTop:"0.25rem"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:700,color:"var(--ink)"}}>
          {isEditing ? "Modifica libro" : "Aggiungi libro"}
        </h2>
        <button onClick={onCancel} style={{background:"none",border:"none",cursor:"pointer",
          color:"var(--muted)",fontSize:"1.3rem",lineHeight:1,padding:"0.2rem"}}>✕</button>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
        <div>
          <span style={labelStyle}>Titolo *</span>
          <input style={inputStyle} type="text" placeholder="Titolo del libro"
            value={form.title} onChange={e=>set("title",e.target.value)}/>
        </div>
        <div>
          <span style={labelStyle}>Autore</span>
          <input style={inputStyle} type="text" placeholder="Nome dell'autore"
            value={form.author} onChange={e=>set("author",e.target.value)}/>
        </div>
        <div>
          <span style={labelStyle}>Genere</span>
          <select style={inputStyle} value={form.genre} onChange={e=>set("genre",e.target.value)}>
            <option value="">Seleziona genere</option>
            {GENRES.map(g=><option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <span style={labelStyle}>Saga / Serie</span>
          <input style={inputStyle} type="text" placeholder="Nome della serie (opzionale)"
            value={form.saga||""} onChange={e=>set("saga",e.target.value)}/>
        </div>
        <div>
          <span style={labelStyle}>Pagine</span>
          <input style={inputStyle} type="number" placeholder="Numero di pagine"
            value={form.pages} onChange={e=>set("pages",e.target.value)}/>
        </div>
        <div>
          <span style={labelStyle}>Stato</span>
          <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
            {STATUS_PILLS.map(({value,label})=>(
              <button key={value} onClick={()=>set("status",value)} style={{
                padding:"0.55rem 1rem",borderRadius:20,cursor:"pointer",fontFamily:"'Lora',serif",
                fontSize:"0.88rem",border:`1.5px solid ${form.status===value?"var(--burgundy)":"var(--border)"}`,
                background:form.status===value?"var(--burgundy)":"var(--card-bg)",
                color:form.status===value?"#fff":"var(--muted)",fontWeight:form.status===value?600:400,
              }}>{label}</button>
            ))}
          </div>
        </div>
        {(form.status===STATUS.READING||form.status===STATUS.READ||form.status===STATUS.ABANDONED)&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
            <div>
              <span style={labelStyle}>Inizio lettura</span>
              <input style={inputStyle} type="date" value={form.startDate} onChange={e=>set("startDate",e.target.value)}/>
            </div>
            {(form.status===STATUS.READ||form.status===STATUS.ABANDONED)&&(
              <div>
                <span style={labelStyle}>Fine lettura</span>
                <input style={inputStyle} type="date" value={form.endDate} onChange={e=>set("endDate",e.target.value)}/>
              </div>
            )}
          </div>
        )}
        {(form.status===STATUS.READ||form.status===STATUS.ABANDONED)&&(
          <div>
            <span style={labelStyle}>Valutazione</span>
            <div style={{display:"flex",gap:"0.4rem",marginTop:"0.25rem"}}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} onClick={()=>set("rating",n===form.rating?0:n)} style={{
                  fontSize:"1.6rem",background:"none",border:"none",cursor:"pointer",
                  color:n<=form.rating?"var(--amber)":"var(--border)",transition:"color 0.15s",padding:0}}>★</button>
              ))}
            </div>
          </div>
        )}
        <div>
          <span style={labelStyle}>Note</span>
          <textarea style={{...inputStyle,minHeight:72,resize:"vertical"}} value={form.notes}
            placeholder="Annotazioni personali…"
            onChange={e=>set("notes",e.target.value)}/>
        </div>
      </div>

      <button onClick={()=>{if(!form.title.trim())return;onSave({...form,id:initial?.id||uid()});}}
        style={{marginTop:"1.5rem",width:"100%",padding:"1rem",
          background:"var(--burgundy)",color:"#fff",border:"none",borderRadius:14,
          cursor:"pointer",fontFamily:"'Lora',serif",fontSize:"1rem",fontWeight:600,
          letterSpacing:"0.02em"}}>
        {isEditing ? "Salva modifiche" : "Aggiungi libro"}
      </button>
    </div>
  );
}

