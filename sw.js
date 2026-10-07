const CACHE = "bibliotrack-v16";
const COVERS = "bibliotrack-covers-v1"; // copertine Open Library: sopravvive agli aggiornamenti dell'app
const SHELL = ["./", "./index.html", "./app.js"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" }))))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE && k !== COVERS).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Copertine: prima la cache, poi la rete; ogni copertina vista viene salvata. */
async function coverResponse(e) {
  const cache = await caches.open(COVERS);
  const hit = await cache.match(e.request.url);
  if (hit) return hit;
  let res;
  try {
    res = await fetch(e.request.url, { mode: "cors", credentials: "omit" });
  } catch {
    try { res = await fetch(e.request); } catch { return Response.error(); }
  }
  if (res && (res.ok || res.type === "opaque")) e.waitUntil(cache.put(e.request.url, res.clone()));
  return res;
}

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (new URL(e.request.url).hostname === "covers.openlibrary.org") {
    e.respondWith(coverResponse(e));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
});
