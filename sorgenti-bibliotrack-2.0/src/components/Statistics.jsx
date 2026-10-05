import React, { useMemo } from "react";
import { STATUS } from "../lib/constants.js";
import { bookColor, ratingStars } from "../lib/helpers.js";

export default function Statistics({ books }) {
  const {read,thisYear,readThisYear,totalPages,avgRating,sortedGenres,favGenre,maxGenre,avgPages,MONTH_LABELS,byMonth,maxMonth,favorites} = useMemo(()=>{
  const read = books.filter(b => b.status === STATUS.READ);
  const thisYear = new Date().getFullYear();
  const readThisYear = read.filter(b => b.endDate && Number(b.endDate.slice(0,4)) === thisYear);
  const totalPages = read.reduce((s, b) => s + (parseInt(b.pages) || 0), 0);
  const avgRating = read.filter(b=>b.rating>0).length
    ? (read.filter(b=>b.rating>0).reduce((s,b)=>s+b.rating,0)/read.filter(b=>b.rating>0).length).toFixed(1)
    : null;

  const genreCounts = {};
  read.forEach(b => { genreCounts[b.genre] = (genreCounts[b.genre]||0)+1; });
  const sortedGenres = Object.entries(genreCounts).sort((a,b)=>b[1]-a[1]);
  const favGenre = sortedGenres[0]?.[0] || null;
  const maxGenre = sortedGenres[0]?.[1] || 1;

  // Media pagine per libro letto (con pagine inserite)
  const booksWithPages = read.filter(b=>parseInt(b.pages)>0);
  const avgPages = booksWithPages.length
    ? Math.round(booksWithPages.reduce((s,b)=>s+(parseInt(b.pages)||0),0)/booksWithPages.length)
    : null;

  const MONTH_LABELS = ["G","F","M","A","M","G","L","A","S","O","N","D"];
  const byMonth = Array(12).fill(0);
  readThisYear.forEach(b => {
    if(b.endDate) byMonth[Number(b.endDate.slice(5,7))-1]++;
  });
  const maxMonth = Math.max(...byMonth, 1);

  // Preferiti
  const favorites = read.filter(b=>b.favorite);
    return {read,thisYear,readThisYear,totalPages,avgRating,sortedGenres,favGenre,maxGenre,avgPages,MONTH_LABELS,byMonth,maxMonth,favorites};
  },[books]);

  const cardBase = {
    background:"#fff", border:"1px solid rgba(200,187,168,0.5)",
    borderRadius:16, padding:"1.1rem 1rem",
    display:"flex", flexDirection:"column", gap:"0.3rem",
  };
  const cardHighlight = { ...cardBase, background:"var(--burgundy)", border:"none" };
  const labelStyle = { fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", color:"var(--muted)",
    textTransform:"uppercase", letterSpacing:"0.06em" };
  const labelStyleLight = { ...labelStyle, color:"rgba(255,255,255,0.75)" };
  const valueStyle = { fontFamily:"'Playfair Display',serif", fontSize:"1.9rem", fontWeight:700,
    color:"var(--ink)", lineHeight:1.1 };
  const valueStyleLight = { ...valueStyle, color:"#fff" };
  const sectionCard = { background:"#fff", border:"1px solid rgba(200,187,168,0.5)", borderRadius:16, padding:"1.25rem" };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
        <div style={cardHighlight}>
          <div style={valueStyleLight}>{read.length}</div>
          <div style={labelStyleLight}>Libri letti</div>
        </div>
        <div style={cardBase}>
          <div style={valueStyle}>{readThisYear.length}</div>
          <div style={labelStyle}>Quest'anno</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
        <div style={cardBase}>
          <div style={{...valueStyle,fontSize:"1.5rem"}}>{totalPages>0?totalPages.toLocaleString("it"):"—"}</div>
          <div style={labelStyle}>Pagine lette</div>
        </div>
        <div style={cardBase}>
          <div style={{...valueStyle,fontSize:"1.5rem"}}>{avgRating||"—"}</div>
          <div style={labelStyle}>Voto medio</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
        <div style={cardBase}>
          <div style={{...valueStyle,fontSize:favGenre&&favGenre.length>8?"1.1rem":"1.5rem"}}>{favGenre||"—"}</div>
          <div style={labelStyle}>Genere fav.</div>
        </div>
        <div style={cardBase}>
          <div style={{...valueStyle,fontSize:"1.5rem"}}>{avgPages?avgPages.toLocaleString("it"):"—"}</div>
          <div style={labelStyle}>Pag. medie</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.6rem"}}>
        {[
          { value:books.filter(b=>b.status===STATUS.READING).length, label:"In lettura" },
          { value:books.filter(b=>b.status===STATUS.WISHLIST).length, label:"Da leggere" },
          { value:books.length, label:"Totale" },
        ].map(({value,label})=>(
          <div key={label} style={{...cardBase,alignItems:"center",textAlign:"center",padding:"0.9rem 0.5rem"}}>
            <div style={{...valueStyle,fontSize:"1.5rem"}}>{value}</div>
            <div style={labelStyle}>{label}</div>
          </div>
        ))}
      </div>

      <div style={sectionCard}>
        <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,marginBottom:"1rem"}}>
          Libri al mese ({thisYear})
        </h4>
        <div style={{display:"flex",alignItems:"flex-end",gap:"4px",height:80}}>
          {byMonth.map((count,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:"100%",height:count>0?`${Math.max(8,(count/maxMonth)*64)}px`:"0px",
                background:"var(--burgundy)",borderRadius:"3px 3px 0 0",transition:"height 0.3s"}}/>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",color:"var(--muted)",marginTop:2}}>
                {MONTH_LABELS[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {sortedGenres.length>0&&(
        <div style={sectionCard}>
          <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,marginBottom:"1rem"}}>Per genere</h4>
          {sortedGenres.map(([g,c])=>(
            <div key={g} style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.6rem"}}>
              <span style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",minWidth:80,color:"var(--ink)"}}>{g}</span>
              <div style={{flex:1,height:6,background:"rgba(200,187,168,0.3)",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(c/maxGenre)*100}%`,background:"var(--burgundy)",borderRadius:3}}/>
              </div>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.72rem",color:"var(--muted)",minWidth:12,textAlign:"right"}}>{c}</span>
            </div>
          ))}
        </div>
      )}

      <div style={sectionCard}>
        <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,marginBottom:"1rem"}}>
          ★ Preferiti
        </h4>
        {favorites.length===0?(
          <div style={{textAlign:"center",color:"var(--muted)",fontStyle:"italic",fontSize:"0.85rem",padding:"0.5rem 0"}}>
            Nessun preferito ancora — usa il menu ⋮ su un libro letto per aggiungerlo.
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
            {favorites.map(b=>(
              <div key={b.id} style={{display:"flex",alignItems:"center",gap:"0.75rem",
                padding:"0.6rem 0",borderBottom:"1px solid rgba(200,187,168,0.3)"}}>
                <div style={{width:36,height:36,borderRadius:7,background:bookColor(b.title),flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,color:"#fff"}}>
                  {b.title.charAt(0).toUpperCase()}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Lora',serif",fontWeight:600,fontSize:"0.88rem",
                    color:"var(--ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {b.title}
                  </div>
                  <div style={{fontSize:"0.75rem",color:"var(--muted)"}}>{b.author}</div>
                </div>
                {b.rating>0&&(
                  <div style={{fontSize:"0.72rem",color:"var(--amber)",letterSpacing:"-0.5px",flexShrink:0}}>
                    {ratingStars(b.rating)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {books.length===0&&(
        <div style={{textAlign:"center",color:"var(--muted)",fontStyle:"italic",padding:"2.5rem",
          background:"#fff",borderRadius:16,border:"1px solid rgba(200,187,168,0.5)"}}>
          Le statistiche appariranno man mano che aggiungi libri letti
        </div>
      )}
    </div>
  );
}

