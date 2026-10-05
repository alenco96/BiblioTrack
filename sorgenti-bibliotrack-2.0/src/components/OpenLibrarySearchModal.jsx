import React, { useState } from "react";
import { inputStyle, labelStyle, closeBtnStyle, cancelBtnStyle } from "../lib/styles.js";

/* ─── OpenLibrary Search Modal ─────────────────────────────────── */
export default function OpenLibrarySearchModal({ onSelectBook, onClose }) {
  const [query, setQuery] = useState("");
  const [risultati, setRisultati] = useState([]);
  const [caricamento, setCaricamento] = useState(false);
  const [cercato, setCercato] = useState(false);

  function mapGenre(subjects) {
    if (!subjects || subjects.length === 0) return "";
    const map = {
      "narrativa":"Narrativa","fiction":"Narrativa","novel":"Narrativa","romanzo":"Narrativa",
      "saggistica":"Saggistica","nonfiction":"Saggistica","non-fiction":"Saggistica","essay":"Saggistica","saggio":"Saggistica",
      "fantasy":"Fantasy","magic":"Fantasy","dragons":"Fantasy","wizards":"Fantasy",
      "science fiction":"Sci-Fi","sci-fi":"Sci-Fi","space":"Sci-Fi","dystopia":"Sci-Fi","futuristic":"Sci-Fi",
      "thriller":"Thriller","suspense":"Thriller","spy":"Thriller","crime":"Thriller",
      "horror":"Horror","ghost":"Horror","supernatural":"Horror",
      "historical":"Storico","history":"Storico","storico":"Storico","ancient":"Storico","medieval":"Storico",
      "romance":"Romanzo","love":"Romanzo","romantic":"Romanzo",
      "biography":"Biografia","autobiography":"Biografia","memoir":"Biografia","biograph":"Biografia",
      "poetry":"Poesia","poems":"Poesia","poesia":"Poesia","verse":"Poesia",
      "comics":"Fumetti","graphic novel":"Fumetti","manga":"Fumetti","comic":"Fumetti",
    };
    for (const subject of subjects) {
      const s = subject.toLowerCase();
      for (const [key, val] of Object.entries(map)) {
        if (s.includes(key)) return val;
      }
    }
    return "";
  }

  async function cercaLibri(searchQuery) {
    if (!searchQuery.trim()) return;
    setCaricamento(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=10&fields=title,author_name,number_of_pages_median,subject,cover_i,isbn,key`
      );
      const data = await response.json();
      const libri = (data.docs || [])
        .filter(libro => libro.title)
        .map(libro => ({
          title:    libro.title || "",
          author:   (libro.author_name || [])[0] || "",
          genre:    mapGenre(libro.subject || []),
          pages:    libro.number_of_pages_median ? String(libro.number_of_pages_median) : "",
          isbn:     (libro.isbn || [])[0] || "",
          copertina: libro.cover_i
            ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`
            : null,
        }));
      setRisultati(libri);
      setCercato(true);
    } catch (error) {
      console.error("Errore ricerca:", error);
      setRisultati([]);
    } finally {
      setCaricamento(false);
    }
  }

  const handleCerca = (e) => {
    e.preventDefault();
    cercaLibri(query);
  };


  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem",marginTop:"0.25rem"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:700,color:"var(--ink)"}}>
          Cerca su Open Library
        </h2>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:"1.3rem",lineHeight:1,padding:"0.2rem"}}>✕</button>
      </div>

      <form onSubmit={handleCerca} style={{marginBottom:"1.5rem",display:"flex",gap:"0.5rem"}}>
        <div style={{flex:1}}>
          <span style={labelStyle}>Titolo o autore</span>
          <input style={inputStyle} type="text"
            placeholder="Es: Fourth Wing, Rebecca Yarros..."
            value={query} onChange={(e)=>setQuery(e.target.value)}/>
        </div>
        <button type="submit" disabled={caricamento} style={{
          alignSelf:"flex-end",padding:"0.85rem 1.2rem",
          background:"var(--burgundy)",color:"#fff",border:"none",borderRadius:12,
          cursor:caricamento?"default":"pointer",fontFamily:"'Lora',serif",
          fontSize:"0.95rem",fontWeight:600,opacity:caricamento?0.7:1,
        }}>
          {caricamento?"...":"Cerca"}
        </button>
      </form>

      {cercato&&risultati.length===0&&(
        <div style={{textAlign:"center",color:"var(--muted)",fontStyle:"italic",padding:"1.5rem"}}>
          Nessun risultato trovato. Prova un'altra ricerca.
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",maxHeight:"320px",overflowY:"auto",marginBottom:"1rem"}}>
        {risultati.map((libro,idx)=>(
          <div key={idx} onClick={()=>onSelectBook(libro)} style={{
            background:"var(--card-bg)",borderRadius:12,padding:"0.9rem",
            display:"flex",gap:"0.85rem",alignItems:"flex-start",
            border:"1px solid var(--border)",cursor:"pointer",
          }}>
            {libro.copertina&&(
              <img src={libro.copertina} alt={libro.title}
                style={{width:40,height:56,borderRadius:6,objectFit:"cover",flexShrink:0}}/>
            )}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:"0.95rem",color:"var(--ink)",marginBottom:"0.2rem",
                whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {libro.title}
              </div>
              {libro.author&&(
                <div style={{fontSize:"0.8rem",color:"var(--muted)",marginBottom:"0.25rem",
                  whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                  {libro.author}
                </div>
              )}
              <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
                {libro.genre&&(
                  <span style={{fontSize:"0.65rem",fontFamily:"'DM Mono',monospace",
                    padding:"0.1rem 0.45rem",background:"rgba(122,34,51,0.08)",
                    borderRadius:20,color:"var(--burgundy)"}}>
                    {libro.genre}
                  </span>
                )}
                {libro.pages&&(
                  <span style={{fontSize:"0.65rem",fontFamily:"'DM Mono',monospace",
                    padding:"0.1rem 0.45rem",background:"rgba(28,22,17,0.06)",
                    borderRadius:20,color:"var(--muted)"}}>
                    {libro.pages} pag.
                  </span>
                )}
              </div>
            </div>
            <div style={{fontSize:"1.2rem",color:"var(--muted)",flexShrink:0}}>→</div>
          </div>
        ))}
      </div>

      <button onClick={onClose} style={{width:"100%",padding:"0.9rem",background:"none",
        border:"1.5px solid var(--border)",borderRadius:14,cursor:"pointer",
        fontFamily:"'Lora',serif",fontSize:"0.95rem",color:"var(--muted)"}}>
        Annulla
      </button>
    </div>
  );
}

