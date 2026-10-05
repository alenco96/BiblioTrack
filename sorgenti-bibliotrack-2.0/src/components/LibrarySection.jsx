import React, { useState } from "react";
import { STATUS } from "../lib/constants.js";
import { sortBooks } from "../lib/sort.js";
import BookCard from "./BookCard.jsx";
import SagaAccordion from "./SagaAccordion.jsx";

const SectionHeader=({label,count})=>(
  <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.6rem",marginTop:"0.2rem"}}>
    <span style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:"1rem",color:"var(--ink)"}}>{label}</span>
    <span style={{background:"rgba(122,34,51,0.12)",color:"var(--burgundy)",
      fontFamily:"'DM Mono',monospace",fontSize:"0.68rem",
      borderRadius:20,padding:"0.05rem 0.5rem",fontWeight:600}}>{count}</span>
  </div>
);

const EmptyRow=({label})=>(
  <div style={{background:"var(--card-bg)",borderRadius:14,padding:"1.1rem",
    textAlign:"center",color:"var(--muted)",fontStyle:"italic",fontSize:"0.85rem",
    boxShadow:"0 1px 4px rgba(28,22,17,0.06)"}}>
    {label}
  </div>
);

const SORT_PILLS = [
  ["title_asc","Titolo"],["author_asc","Autore"],["genre","Genere"],["date_desc","Data"],
];

export default function LibrarySection({ books, onEdit, onDelete, onToggleFavorite, onCsvImport, onBackup, backupText, backupUrgent }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title_asc");

    const baseBooks = books.filter(b=>b.status!==STATUS.WISHLIST);
  const filtered = search
    ? baseBooks.filter(b=>
        b.title.toLowerCase().includes(search.toLowerCase())||
        b.author.toLowerCase().includes(search.toLowerCase())||
        b.genre.toLowerCase().includes(search.toLowerCase()))
    : baseBooks;

  const reading   = filtered.filter(b=>b.status===STATUS.READING);
  const read      = filtered.filter(b=>b.status===STATUS.READ);
  const abandoned = filtered.filter(b=>b.status===STATUS.ABANDONED);

  // Saga grouping for "Letti"
  const readWithSaga    = read.filter(b=>b.saga);
  const readWithoutSaga = read.filter(b=>!b.saga);
  const sagaMap = {};
  readWithSaga.forEach(b=>{
    if(!sagaMap[b.saga]) sagaMap[b.saga]=[];
    sagaMap[b.saga].push(b);
  });
  const sagas = Object.entries(sagaMap).sort(([a],[b])=>a.localeCompare(b,"it"));

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.9rem",fontWeight:700,color:"var(--ink)"}}>Libreria</h1>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
          <button onClick={onCsvImport} title="Importa CSV"
            style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",padding:"0.2rem",lineHeight:0,fontSize:"1.3rem"}}>⬆</button>
          <button onClick={onBackup} title={backupText}
            style={{background:"none",border:"none",cursor:"pointer",
              color:backupUrgent?"var(--amber)":"var(--muted)",padding:"0.2rem",lineHeight:0,fontSize:"1.3rem"}}>⬇</button>
        </div>
      </div>

      <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.68rem",
        color:backupUrgent?"var(--amber)":"var(--muted)",display:"flex",alignItems:"center",gap:"0.35rem",marginTop:"-0.4rem"}}>
        <span style={{width:6,height:6,borderRadius:"50%",flexShrink:0,
          background:backupUrgent?"var(--amber)":"#4CAF50",
          boxShadow:backupUrgent?"0 0 4px rgba(196,134,26,0.7)":"0 0 4px rgba(76,175,80,0.5)"}}/>
        {backupText}
      </div>

      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:"0.85rem",top:"50%",transform:"translateY(-50%)",
          color:"var(--muted)",fontSize:"0.9rem",pointerEvents:"none"}}>🔍</span>
        <input placeholder="Cerca per titolo, autore, genere…" value={search} onChange={e=>setSearch(e.target.value)}
          style={{width:"100%",padding:"0.65rem 0.85rem 0.65rem 2.2rem",
            border:"none",borderRadius:12,background:"var(--card-bg)",
            fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"var(--ink)",outline:"none",
            boxShadow:"0 1px 4px rgba(28,22,17,0.07)"}}/>
      </div>

      <div style={{display:"flex",gap:"0.4rem",alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.68rem",color:"var(--muted)",
          textTransform:"uppercase",letterSpacing:"0.05em",marginRight:"0.2rem"}}>Ordina</span>
        {SORT_PILLS.map(([v,l])=>(
          <button key={v} onClick={()=>setSortBy(v)} style={{
            padding:"0.3rem 0.85rem",border:"none",borderRadius:20,cursor:"pointer",
            fontFamily:"'DM Mono',monospace",fontSize:"0.72rem",
            background:sortBy===v?"var(--burgundy)":"var(--card-bg)",
            color:sortBy===v?"#fff":"var(--muted)",
            boxShadow:sortBy===v?"none":"0 1px 3px rgba(28,22,17,0.08)",
            fontWeight:sortBy===v?600:400,
          }}>{l}</button>
        ))}
      </div>

      {reading.length>0&&(
        <div>
          <SectionHeader label="In lettura" count={reading.length}/>
          <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
            {sortBooks(reading,sortBy).map(b=><BookCard key={b.id} book={b} onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite}/>)}
          </div>
        </div>
      )}

      <div>
        <SectionHeader label="Letti" count={read.length}/>
        {read.length===0
          ?<EmptyRow label="Nessun libro letto"/>
          :<div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
            {sagas.map(([sagaName,sagaBooks])=>(
              <SagaAccordion key={sagaName} sagaName={sagaName} books={sagaBooks}
                onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite} sortBy={sortBy}/>
            ))}
            {sortBooks(readWithoutSaga,sortBy).map(b=>(
              <BookCard key={b.id} book={b} onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite}/>
            ))}
          </div>
        }
      </div>

      {abandoned.length>0&&(
        <div>
          <SectionHeader label="Abbandonati" count={abandoned.length}/>
          <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
            {sortBooks(abandoned,sortBy).map(b=><BookCard key={b.id} book={b} onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

