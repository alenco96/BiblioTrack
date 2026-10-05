# BiblioTrack 2.0

Sorgenti in `src/`, build con esbuild.

    npm install
    npm run build     # genera dist/index.html + dist/app.js

Deploy: copia il contenuto di `dist/` nella root del repo GitHub Pages
(accanto a `sw.js`, `manifest.json`, `icons/`). Poi **incrementa la versione
della cache in `sw.js`** (es. v6 -> v7) e aggiungi `./app.js` all'elenco dei file in cache.
