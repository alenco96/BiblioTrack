import React, { useState, useCallback } from "react";
import { STATUS } from "./lib/constants.js";
import { backupLabel } from "./lib/helpers.js";
import { loadBooks, saveBooks, loadLastBackup } from "./lib/storage.js";
import { exportBackupCSV } from "./lib/csv.js";
import Modal from "./components/Modal.jsx";
import BookForm from "./components/BookForm.jsx";
import BookCard from "./components/BookCard.jsx";
import ReadingCalendar from "./components/ReadingCalendar.jsx";
import Statistics from "./components/Statistics.jsx";
import LibrarySection from "./components/LibrarySection.jsx";
import OpenLibrarySearchModal from "./components/OpenLibrarySearchModal.jsx";
import CsvImportModal from "./components/CsvImportModal.jsx";

/* ══════════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════════ */
export default function BiblioTrack() {
  const [books,            setBooks]           = useState(()=>loadBooks());
  const [tab,              setTab]             = useState("home");
  const [modal,            setModal]           = useState(null);
  const [csvModal,         setCsvModal]        = useState(false);
  const [openLibraryModal, setOpenLibraryModal]= useState(false);
  const [openLibraryPreload,setOpenLibraryPreload] = useState(null);
  const [toast,            setToast]           = useState(null);
  const [lastBackup,       setLastBackup]      = useState(()=>loadLastBackup());

  const persist = useCallback(next=>{setBooks(next);saveBooks(next);},[]);

  const handleOpenLibrarySelect = (libroData) => {
    setOpenLibraryPreload(libroData);
    setOpenLibraryModal(false);
    setModal("add");
  };

  const saveBook = book => {
    persist(books.some(b=>b.id===book.id)?books.map(b=>b.id===book.id?book:b):[...books,book]);
    setModal(null);
    setOpenLibraryPreload(null);
  };
  const deleteBook = id => { if(confirm("Eliminare questo libro?")) persist(books.filter(b=>b.id!==id)); };
  const toggleFavorite = id => {
    persist(books.map(b=>b.id===id?{...b,favorite:!b.favorite}:b));
  };
  const handleCsvImport = (newBooks,added,skipped) => {
    persist(newBooks); setCsvModal(false);
    setToast(`✅ ${added} libro/i importati${skipped>0?`, ${skipped} saltati`:""}.`);
    setTimeout(()=>setToast(null),4000);
  };
  const doBackup = async () => {
    if (await exportBackupCSV(books)) {
      setLastBackup(new Date().toISOString());
      setToast("💾 Backup esportato con successo.");
      setTimeout(()=>setToast(null),3500);
    }
  };

  const reading = books.filter(b=>b.status===STATUS.READING);
  const wishlist = books.filter(b=>b.status===STATUS.WISHLIST);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buongiorno" : hour < 18 ? "Buon pomeriggio" : "Buonasera";
  const {text:backupText, urgent:backupUrgent} = backupLabel(lastBackup);

  const TABS = [
    {id:"home",     label:"Home"},
    {id:"library",  label:"Libreria"},
    {id:"wishlist", label:"Da leggere"},
    {id:"stats",    label:"Statistiche"},
  ];

  const TAB_ICONS = {
    home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    library: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    wishlist: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
    stats: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  };

  return (
    <>
      <div style={{minHeight:"100vh",background:"var(--bg)",paddingBottom:"5rem",
        maxWidth:520,margin:"0 auto"}}>
        <main style={{padding:"1.5rem 1.1rem 0"}}>

          {tab==="home"&&(
            <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
              <div>
                <div style={{fontFamily:"'Lora',serif",fontSize:"0.9rem",color:"var(--muted)"}}>{greeting}</div>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.9rem",fontWeight:700,
                  color:"var(--ink)",lineHeight:1.15}}>Calendario letture</h1>
              </div>
              {/* In lettura PRIMA del calendario */}
              <div>
                <div style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:"1rem",
                  color:"var(--ink)",marginBottom:"0.6rem"}}>In lettura ora</div>
                {reading.length===0
                  ?<div style={{background:"var(--card-bg)",borderRadius:14,padding:"1.1rem",
                      textAlign:"center",color:"var(--muted)",fontStyle:"italic",fontSize:"0.85rem",
                      boxShadow:"0 1px 4px rgba(28,22,17,0.06)"}}>
                      Nessun libro in lettura.{" "}
                      <button onClick={()=>setModal("add")} style={{background:"none",border:"none",
                        color:"var(--burgundy)",cursor:"pointer",fontFamily:"'Lora',serif",
                        fontStyle:"italic",fontSize:"inherit"}}>Aggiungine uno →</button>
                    </div>
                  :<div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                    {reading.map(b=><BookCard key={b.id} book={b} onEdit={b=>setModal(b)} onDelete={deleteBook} onToggleFavorite={toggleFavorite}/>)}
                  </div>
                }
              </div>
              <ReadingCalendar books={books}/>
            </div>
          )}

          {tab==="library"&&(
            <LibrarySection books={books} onEdit={b=>setModal(b)} onDelete={deleteBook}
              onToggleFavorite={toggleFavorite}
              onCsvImport={()=>setCsvModal(true)}
              onBackup={doBackup} backupText={backupText} backupUrgent={backupUrgent}/>
          )}

          {tab==="wishlist"&&(
            <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.9rem",fontWeight:700,color:"var(--ink)"}}>Da leggere</h1>
                <span style={{background:"rgba(122,34,51,0.12)",color:"var(--burgundy)",
                  fontFamily:"'DM Mono',monospace",fontSize:"0.72rem",fontWeight:600,
                  borderRadius:20,padding:"0.15rem 0.65rem"}}>{wishlist.length}</span>
              </div>
              {wishlist.length===0
                ?<div style={{background:"var(--card-bg)",borderRadius:14,padding:"2rem 1rem",
                    textAlign:"center",color:"var(--muted)",fontStyle:"italic",fontSize:"0.88rem",
                    boxShadow:"0 1px 4px rgba(28,22,17,0.06)"}}>
                    La tua lista è vuota.{" "}
                    <button onClick={()=>setModal("add")} style={{background:"none",border:"none",
                      color:"var(--burgundy)",cursor:"pointer",fontFamily:"'Lora',serif",
                      fontStyle:"italic",fontSize:"inherit"}}>Aggiungine uno →</button>
                  </div>
                :<div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                    {wishlist.map(b=><BookCard key={b.id} book={b} onEdit={b=>setModal(b)} onDelete={deleteBook} onToggleFavorite={toggleFavorite}/>)}
                  </div>
              }
            </div>
          )}

          {tab==="stats"&&(
            <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.9rem",fontWeight:700,color:"var(--ink)"}}>Statistiche</h1>
              <Statistics books={books}/>
            </div>
          )}

        </main>

        {/* FAB stack: 🔍 sopra + */}
        <div style={{
          position:"fixed",bottom:"6.5rem",right:"1.25rem",
          display:"flex",flexDirection:"column",gap:"0.5rem",alignItems:"flex-end",zIndex:100}}>
          <button onClick={()=>setOpenLibraryModal(true)} title="Cerca su Open Library"
            style={{width:48,height:48,borderRadius:"50%",
              background:"rgba(122,34,51,0.9)",border:"none",color:"#fff",fontSize:"1.2rem",
              cursor:"pointer",boxShadow:"0 2px 8px rgba(122,34,51,0.3)",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
            🔍
          </button>
          <button onClick={()=>setModal("add")} style={{
            width:52,height:52,borderRadius:"50%",
            background:"var(--burgundy)",border:"none",
            color:"#fff",fontSize:"1.5rem",cursor:"pointer",
            boxShadow:"0 4px 16px rgba(122,34,51,0.4)",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            +
          </button>
        </div>

        <nav style={{
          position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
          width:"100%",maxWidth:520,
          background:"var(--card-bg)",
          borderTop:"1px solid var(--border)",
          display:"flex",justifyContent:"space-around",alignItems:"center",
          padding:"0.5rem 0 0.65rem",
          paddingBottom:"calc(0.65rem + env(safe-area-inset-bottom))",
          boxShadow:"0 -2px 16px rgba(28,22,17,0.08)",
          zIndex:200,
        }}>
          {TABS.map(({id,label})=>(
            <button key={id} onClick={()=>setTab(id)} style={{
              background:"none",border:"none",cursor:"pointer",
              display:"flex",flexDirection:"column",alignItems:"center",gap:"0.15rem",
              padding:"0.1rem 0.6rem",flex:1,
              color:tab===id?"var(--burgundy)":"var(--muted)",
            }}>
              {TAB_ICONS[id]}
              <span style={{
                fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",
                color:tab===id?"var(--burgundy)":"var(--muted)",
                letterSpacing:"0.02em",textAlign:"center",lineHeight:1.2,
              }}>{label}</span>
            </button>
          ))}
        </nav>

        <Modal open={!!modal} onClose={()=>{setModal(null);setOpenLibraryPreload(null);}}>
          <BookForm initial={modal&&modal!=="add"?modal:null}
            openLibraryData={openLibraryPreload}
            onSave={saveBook}
            onCancel={()=>{setModal(null);setOpenLibraryPreload(null);}}/>
        </Modal>
        <Modal open={openLibraryModal} onClose={()=>setOpenLibraryModal(false)}>
          <OpenLibrarySearchModal onSelectBook={handleOpenLibrarySelect} onClose={()=>setOpenLibraryModal(false)}/>
        </Modal>
        <Modal open={csvModal} onClose={()=>setCsvModal(false)}>
          <CsvImportModal existingBooks={books} onImport={handleCsvImport} onClose={()=>setCsvModal(false)}/>
        </Modal>

        {toast&&(
          <div style={{position:"fixed",bottom:"5rem",left:"50%",transform:"translateX(-50%)",
            background:"var(--ink)",color:"var(--cream)",padding:"0.75rem 1.5rem",borderRadius:12,
            fontFamily:"'Lora',serif",fontSize:"0.88rem",boxShadow:"0 8px 32px rgba(28,22,17,0.3)",zIndex:2000}}>
            {toast}
          </div>
        )}
      </div>
    </>
  );
}

