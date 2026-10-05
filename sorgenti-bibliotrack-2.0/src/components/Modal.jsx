import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(28,22,17,0.45)",
      display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:1000,backdropFilter:"blur(2px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"var(--bg)",borderRadius:"20px 20px 0 0",
        width:"100%",maxWidth:520,maxHeight:"92vh",overflowY:"auto",
        boxShadow:"0 -8px 40px rgba(28,22,17,0.2)",paddingBottom:"env(safe-area-inset-bottom,1rem)"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"0.75rem 0 0.25rem"}}>
          <div style={{width:36,height:4,borderRadius:2,background:"var(--border)"}}/>
        </div>
        <div style={{padding:"0 1.25rem 1.5rem"}}>
          {children}
        </div>
      </div>
    </div>
  );
}

