const byText = (a, b) => (a || "").localeCompare(b || "", "it");

export function sortBooks(books, sortBy) {
  const s = [...books];
  switch (sortBy) {
    case "author_asc": return s.sort((a, b) => byText(a.author, b.author));
    case "genre":      return s.sort((a, b) => byText(a.genre, b.genre) || byText(a.title, b.title));
    case "date_desc":  return s.sort((a, b) => (b.endDate || b.startDate || "").localeCompare(a.endDate || a.startDate || ""));
    default:           return s.sort((a, b) => byText(a.title, b.title));
  }
}
