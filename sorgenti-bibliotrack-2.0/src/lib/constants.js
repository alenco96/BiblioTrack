export const STATUS = {
  READING: "reading", READ: "read", ABANDONED: "abandoned", WISHLIST: "wishlist",
};
export const GENRES = [
  "Narrativa","Saggistica","Fantasy","Sci-Fi","Thriller",
  "Horror","Storico","Romanzo","Biografia","Poesia","Fumetti","Altro",
];
export const STATUS_MAP = {
  letto: STATUS.READ, in_lettura: STATUS.READING,
  abbandonato: STATUS.ABANDONED, da_leggere: STATUS.WISHLIST,
};
export const STATUS_REV = {
  [STATUS.READ]: "letto", [STATUS.READING]: "in_lettura",
  [STATUS.ABANDONED]: "abbandonato", [STATUS.WISHLIST]: "da_leggere",
};
export const STATUS_LABELS = {
  [STATUS.READ]: "✅ Letto", [STATUS.READING]: "📖 In lettura",
  [STATUS.ABANDONED]: "❌ Abbandonato", [STATUS.WISHLIST]: "📚 Da leggere",
};
