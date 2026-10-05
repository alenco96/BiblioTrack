import React, { useState } from "react";
import { STATUS } from "../lib/constants.js";
import { bookColor } from "../lib/helpers.js";
import { sortBooks } from "../lib/sort.js";
import BookCard from "./BookCard.jsx";

/* ─── SagaAccordion ────────────────────────────────────────────── */
export default function SagaAccordion({ sagaName, books, onEdit, onDelete, onToggleFavorite, sortBy }) {
  const [open, setOpen] = useState(false);
  const color = bookColor(sagaName);
  const readCount = books.filter(b=>b.status===STATUS.READ).length;

  return (
    <div style={{background:"var(--card-bg)",borderRadius:14,
      boxShadow:"0 1px 4px rgba(28,22,17,0.07)",overflow:"visible"}}>
      <button onClick={()=>setOpen(v=>!v)} style={{
        width:"100%",display:"flex",alignItems:"center",gap:"0.85rem",
        padding:"0.9rem 1rem",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
        <div style={{width:52,height:52,borderRadius:10,background:color,flexShrink:0,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontWeight:700,color:"#fff"}}>
          {sagaName.charAt(0).toUpperCase()}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:"0.95rem",
            color:"var(--ink)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
            {sagaName}
          </div>
          <div style={{fontSize:"0.75rem",color:"var(--muted)",marginTop:"0.15rem",fontFamily:"'DM Mono',monospace"}}>
            {books.length} {books.length===1?"volume":"volumi"} · {readCount} letti
          </div>
        </div>
        <span style={{color:"var(--muted)",fontSize:"0.85rem",transition:"transform 0.2s",
          transform:open?"rotate(180deg)":"rotate(0deg)",flexShrink:0}}>▾</span>
      </button>

      {open&&(
        <div style={{borderTop:"1px solid var(--border)",padding:"0.5rem 0.75rem 0.75rem"}}>
          <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
            {sortBooks(books,sortBy).map(b=>(
              <BookCard key={b.id} book={b} onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

