import { GENRES, STATUS_MAP, STATUS_REV } from "./constants.js";
import { uid } from "./helpers.js";
import { saveLastBackup } from "./storage.js";

export const CSV_COLUMNS = [
  { key: "titolo",      required: true,  desc: "Titolo del libro" },
  { key: "autore",      required: true,  desc: "Nome dell'autore" },
  { key: "genere",      required: false, desc: "Uno tra: " + GENRES.join(", ") },
  { key: "pagine",      required: false, desc: "Numero intero" },
  { key: "stato",       required: true,  desc: "letto | in_lettura | abbandonato | da_leggere" },
  { key: "saga",        required: false, desc: "Nome della saga (es. Empyrean)" },
  { key: "data_inizio", required: false, desc: "AAAA-MM-GG  (es. 2024-03-15)" },
  { key: "data_fine",   required: false, desc: "AAAA-MM-GG  (es. 2024-06-01)" },
  { key: "valutazione", required: false, desc: "Numero da 1 a 5" },
  { key: "note",        required: false, desc: "Testo libero (virgolette se contiene virgole)" },
  { key: "preferito",   required: false, desc: "1 se preferito, altrimenti vuoto o 0" },
];

const HEADER = CSV_COLUMNS.map(c => c.key).join(",");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/* Parser RFC 4180: gestisce virgolette doppie (""), a capo dentro le note, BOM
   e separatore ";" (export tipico di Excel in italiano). */
function tokenize(text) {
  text = text.replace(/^\uFEFF/, "");
  const firstLine = text.split(/\r\n|\n|\r/)[0] || "";
  const sep = firstLine.includes(",") ? "," : firstLine.includes(";") ? ";" : ",";
  const records = [];
  let row = [], cur = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; } else inQ = false;
      } else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === sep) { row.push(cur.trim()); cur = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cur.trim()); cur = "";
      if (row.some(v => v !== "")) records.push(row);
      row = [];
    } else cur += c;
  }
  row.push(cur.trim());
  if (row.some(v => v !== "")) records.push(row);
  return records;
}

export function parseCSV(text) {
  const records = tokenize(text);
  if (records.length < 2) return { rows: [], errors: ["Il file è vuoto o contiene solo l'intestazione."] };
  const headers = records[0].map(h => h.toLowerCase().replace(/\s+/g, "_"));
  const rows = [], errors = [];
  records.slice(1).forEach((vals, idx) => {
    const lineNum = idx + 2, obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
    const missing = CSV_COLUMNS.filter(c => c.required && !obj[c.key]);
    if (missing.length) { errors.push(`Riga ${lineNum}: campi obbligatori mancanti (${missing.map(c => c.key).join(", ")})`); return; }
    const status = STATUS_MAP[obj.stato.toLowerCase().replace(/\s+/g, "_")];
    if (!status) { errors.push(`Riga ${lineNum}: valore "stato" non valido → "${obj.stato}"`); return; }
    rows.push({
      id: uid(), title: obj.titolo, author: obj.autore,
      genre: GENRES.includes(obj.genere) ? obj.genere : "Altro",
      pages: obj.pagine, status, saga: obj.saga,
      startDate: DATE_RE.test(obj.data_inizio) ? obj.data_inizio : "",
      endDate: DATE_RE.test(obj.data_fine) ? obj.data_fine : "",
      rating: Math.min(5, Math.max(0, parseInt(obj.valutazione) || 0)),
      notes: obj.note,
      favorite: /^(1|si|sì|true|x)$/i.test(obj.preferito || ""),
    });
  });
  return { rows, errors };
}

const esc = v => {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function toCSV(books) {
  const rows = books.map(b => [
    b.title, b.author, b.genre, b.pages, STATUS_REV[b.status] || b.status,
    b.saga || "", b.startDate, b.endDate, b.rating || "", b.notes, b.favorite ? "1" : "",
  ].map(esc).join(","));
  return "\uFEFF" + HEADER + "\n" + rows.join("\n");
}

/* Su iOS il download via <a> è inaffidabile nelle PWA: si usa la condivisione
   nativa (Salva su File) e, se non disponibile, il download classico. */
async function deliverFile(filename, content, type) {
  const file = new File([content], filename, { type });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: filename }); return true; }
    catch (e) { if (e.name === "AbortError") return false; }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  return true;
}

export async function exportBackupCSV(books) {
  const name = `bibliotrack_backup_${new Date().toISOString().slice(0, 10)}.csv`;
  const ok = await deliverFile(name, toCSV(books), "text/csv;charset=utf-8");
  if (ok) saveLastBackup();
  return ok;
}

export function downloadTemplate() {
  const ex = [
    ["Il nome della rosa", "Umberto Eco", "Storico", "502", "letto", "", "2023-09-01", "2023-10-15", "5", "Capolavoro", "1"],
    ["Fourth Wing", "Rebecca Yarros", "Fantasy", "517", "letto", "Empyrean", "2024-01-10", "2024-02-01", "5", "", ""],
    ["Dune", "Frank Herbert", "Sci-Fi", "896", "da_leggere", "", "", "", "", "", ""],
  ].map(r => r.map(esc).join(",")).join("\n");
  return deliverFile("bibliotrack_template.csv", "\uFEFF" + HEADER + "\n" + ex, "text/csv");
}
