const STORAGE_KEY = "bibliotrack-books";
const BACKUP_KEY = "bibliotrack-last-backup";

export function loadBooks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
export function saveBooks(books) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(books)); } catch {}
}
export function loadLastBackup() {
  try { return localStorage.getItem(BACKUP_KEY) || null; } catch { return null; }
}
export function saveLastBackup() {
  try { localStorage.setItem(BACKUP_KEY, new Date().toISOString()); } catch {}
}
