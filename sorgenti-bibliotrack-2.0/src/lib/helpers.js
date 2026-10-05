export function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

export function ratingStars(n) { return "★".repeat(n) + "☆".repeat(5 - n); }

export function backupLabel(isoDate) {
  if (!isoDate) return { text: "Nessun backup", urgent: true };
  const days = Math.floor((Date.now() - new Date(isoDate)) / 86400000);
  if (days === 0) return { text: "Backup oggi", urgent: false };
  if (days === 1) return { text: "Backup ieri", urgent: false };
  return { text: `Backup ${days} gg fa`, urgent: days > 7 };
}

const PALETTE = ["#4A7FA5","#5A8A5A","#8A5A8A","#A57A4A","#7A2233","#4A5A8A","#8A7A4A","#5A7A6A"];
export function bookColor(title) {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) & 0xffffffff;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

export function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Data locale "AAAA-MM-GG" senza slittamenti di fuso orario
export function dayStart(iso) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}
