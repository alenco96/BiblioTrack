import React, { useState } from "react";
import { STATUS } from "../lib/constants.js";
import { bookColor, hexToRgba, dayStart } from "../lib/helpers.js";

export default function ReadingCalendar({ books }) {
  const booksWithDates = books.filter(b=>b.startDate&&
    (b.status===STATUS.READING||b.status===STATUS.READ||b.status===STATUS.ABANDONED));
  const [viewDate,setViewDate] = useState(new Date());
  const [selectedDay,setSelectedDay] = useState(null);
  const year=viewDate.getFullYear(), month=viewDate.getMonth();
  const firstDay=new Date(year,month,1).getDay();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const today=new Date();
  const todayMid=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  const MONTHS=["gennaio","febbraio","marzo","aprile","maggio","giugno",
    "luglio","agosto","settembre","ottobre","novembre","dicembre"];
  const DAYS=["Do","Lu","Ma","Me","Gi","Ve","Sa"];

  const ranges=booksWithDates.map(b=>({
    book:b, start:dayStart(b.startDate), end:b.endDate?dayStart(b.endDate):todayMid,
  }));
  const booksByDay={};
  for(let day=1;day<=daysInMonth;day++){
    const d=new Date(year,month,day);
    booksByDay[day]=ranges.filter(r=>d>=r.start&&d<=r.end).map(r=>r.book);
  }

  return (
    <>
      <div style={{background:"var(--card-bg)",borderRadius:16,padding:"1.1rem 1rem",
        boxShadow:"0 1px 4px rgba(28,22,17,0.07)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
          <button onClick={()=>setViewDate(new Date(year,month-1,1))} style={{background:"none",
            border:"none",cursor:"pointer",color:"var(--muted)",fontSize:"1.1rem",padding:"0.2rem 0.5rem"}}>‹</button>
          <span style={{fontFamily:"'Lora',serif",fontWeight:600,fontSize:"0.95rem",color:"var(--ink)"}}>
            {MONTHS[month]} {year}
          </span>
          <button onClick={()=>setViewDate(new Date(year,month+1,1))} style={{background:"none",
            border:"none",cursor:"pointer",color:"var(--muted)",fontSize:"1.1rem",padding:"0.2rem 0.5rem"}}>›</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:"0.4rem"}}>
          {DAYS.map(d=>(
            <div key={d} style={{textAlign:"center",fontFamily:"'DM Mono',monospace",
              fontSize:"0.65rem",color:"var(--muted)",padding:"0.2rem 0",textTransform:"uppercase"}}>{d}</div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"2px"}}>
          {Array.from({length:firstDay},(_,i)=><div key={"e"+i}/>)}
          {Array.from({length:daysInMonth},(_,i)=>{
            const day=i+1;
            const isToday=today.getFullYear()===year&&today.getMonth()===month&&today.getDate()===day;
            const dayBooks=booksByDay[day];
            const hasReading=dayBooks.length>0;
            const bookCol=hasReading?bookColor(dayBooks[0].title):null;
            const bg=isToday?"var(--burgundy)":hasReading?hexToRgba(bookCol,0.18):"transparent";
            return (
              <div key={day} onClick={()=>{if(hasReading)setSelectedDay({day,books:dayBooks});}}
                style={{aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",
                  borderRadius:"50%",background:bg,position:"relative",
                  cursor:hasReading?"pointer":"default"}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.75rem",userSelect:"none",
                  color:isToday?"#fff":hasReading?bookCol:"var(--ink)",
                  fontWeight:isToday||hasReading?600:400}}>
                  {day}
                </span>
                {hasReading&&!isToday&&(
                  <span style={{position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)",
                    width:4,height:4,borderRadius:"50%",background:bookCol}}/>
                )}
              </div>
            );
          })}
        </div>
        {booksWithDates.length===0&&(
          <div style={{textAlign:"center",color:"var(--muted)",fontStyle:"italic",padding:"1rem 0 0",fontSize:"0.85rem"}}>
            Aggiungi le date di lettura per vederle sul calendario
          </div>
        )}
      </div>

      {selectedDay&&(
        <div onClick={()=>setSelectedDay(null)}
          style={{position:"fixed",inset:0,background:"rgba(28,22,17,0.45)",
            display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:500,backdropFilter:"blur(2px)"}}>
          <div onClick={e=>e.stopPropagation()}
            style={{background:"var(--bg)",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:520,
              boxShadow:"0 -8px 40px rgba(28,22,17,0.2)",paddingBottom:"env(safe-area-inset-bottom,1.5rem)"}}>
            <div style={{display:"flex",justifyContent:"center",padding:"0.75rem 0 0.5rem"}}>
              <div style={{width:36,height:4,borderRadius:2,background:"var(--border)"}}/>
            </div>
            <div style={{padding:"0 1.25rem 1.25rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",fontWeight:700,color:"var(--ink)"}}>
                  {selectedDay.day} {MONTHS[month]} {year}
                </h3>
                <button onClick={()=>setSelectedDay(null)} style={{background:"none",border:"none",
                  cursor:"pointer",color:"var(--muted)",fontSize:"1.3rem",padding:"0.2rem"}}>✕</button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"0.65rem"}}>
                {selectedDay.books.map(b=>(
                  <div key={b.id} style={{background:"var(--card-bg)",borderRadius:12,
                    padding:"0.85rem 1rem",display:"flex",alignItems:"center",gap:"0.85rem",
                    boxShadow:"0 1px 4px rgba(28,22,17,0.07)"}}>
                    <div style={{width:44,height:44,borderRadius:9,background:bookColor(b.title),flexShrink:0,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",fontWeight:700,color:"#fff"}}>
                      {b.title.charAt(0).toUpperCase()}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'Lora',serif",fontWeight:600,fontSize:"0.95rem",
                        color:"var(--ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {b.title}
                      </div>
                      <div style={{fontSize:"0.8rem",color:"var(--muted)",marginTop:"0.1rem"}}>{b.author}</div>
                      <div style={{fontSize:"0.72rem",fontFamily:"'DM Mono',monospace",color:"var(--muted)",marginTop:"0.2rem"}}>
                        {b.startDate}{b.endDate?" → "+b.endDate:""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

