import React, { useState } from "react";
import { STATUS } from "../lib/constants.js";
import { bookColor, ratingStars } from "../lib/helpers.js";

/* ─── BookCard with three-dot menu + favorites ─────────────────── */
export default function BookCard({ book, onEdit, onDelete, onToggleFavorite }) {
  const [showMenu, setShowMenu] = useState(false);
  const initial = book.title.charAt(0).toUpperCase();
  const color = bookColor(book.title);
  const chips = [book.genre, book.saga].filter(Boolean);
  const canFavorite = book.status === STATUS.READ;

  return (
    <div style={{position:"relative"}}>
      <div style={{background:"var(--card-bg)",borderRadius:14,padding:"0.9rem 1rem",
        display:"flex",alignItems:"center",gap:"0.85rem",
        boxShadow:"0 1px 4px rgba(28,22,17,0.07)"}}>
        <div style={{width:52,height:52,borderRadius:10,background:color,flexShrink:0,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",fontWeight:700,color:"#fff"}}>
          {initial}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.3rem"}}>
            <div style={{fontFamily:"'Lora',serif",fontWeight:600,fontSize:"0.95rem",
              lineHeight:1.3,color:"var(--ink)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
              {book.title}
            </div>
            {book.favorite&&(
              <span style={{fontSize:"0.75rem",color:"var(--amber)",flexShrink:0}}>★</span>
            )}
          </div>
          <div style={{fontSize:"0.8rem",color:"var(--muted)",marginTop:"0.1rem",
            whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
            {book.author}
          </div>
          {chips.length>0&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem",marginTop:"0.4rem"}}>
              {chips.map(c=>(
                <span key={c} style={{fontSize:"0.68rem",fontFamily:"'DM Mono',monospace",
                  padding:"0.1rem 0.55rem",background:"rgba(28,22,17,0.06)",
                  borderRadius:20,color:"var(--muted)"}}>
                  {c}
                </span>
              ))}
            </div>
          )}
          {book.rating>0&&(
            <div style={{fontSize:"0.75rem",color:"var(--amber)",marginTop:"0.25rem",letterSpacing:"-0.5px"}}>
              {ratingStars(book.rating)}
            </div>
          )}
        </div>
        <button onClick={()=>setShowMenu(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",
          color:"var(--muted)",fontSize:"1.4rem",padding:"0.2rem 0.3rem",lineHeight:1,flexShrink:0,
          fontWeight:700}}>⋮</button>
      </div>

      {showMenu&&(
        <>
          <div onClick={()=>setShowMenu(false)}
            style={{position:"fixed",inset:0,zIndex:300}}/>
          <div style={{position:"absolute",right:0,top:"calc(100% + 4px)",zIndex:400,
            background:"var(--card-bg)",borderRadius:12,
            boxShadow:"0 4px 20px rgba(28,22,17,0.15)",
            border:"1px solid var(--border)",minWidth:170,overflow:"hidden"}}>
            <button onClick={()=>{setShowMenu(false);onEdit(book);}} style={{
              display:"flex",alignItems:"center",gap:"0.6rem",width:"100%",
              padding:"0.75rem 1rem",background:"none",border:"none",cursor:"pointer",
              fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"var(--ink)",textAlign:"left"}}>
              Modifica
            </button>
            {canFavorite&&(
              <button onClick={()=>{setShowMenu(false);onToggleFavorite(book.id);}} style={{
                display:"flex",alignItems:"center",gap:"0.6rem",width:"100%",
                padding:"0.75rem 1rem",background:"none",border:"none",cursor:"pointer",
                fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"var(--ink)",textAlign:"left",
                borderTop:"1px solid var(--border)"}}>
                {book.favorite?"☆ Rimuovi dai preferiti":"★ Aggiungi ai preferiti"}
              </button>
            )}
            <button onClick={()=>{setShowMenu(false);onDelete(book.id);}} style={{
              display:"flex",alignItems:"center",gap:"0.6rem",width:"100%",
              padding:"0.75rem 1rem",background:"none",border:"none",cursor:"pointer",
              fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"#d32f2f",textAlign:"left",
              borderTop:"1px solid var(--border)"}}>
              Elimina
            </button>
          </div>
        </>
      )}
    </div>
  );
}

