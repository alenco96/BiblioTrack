# BiblioTrack PWA — Istruzioni di installazione

## Struttura dei file

```
bibliotrack-pwa/
├── index.html       ← App principale
├── manifest.json    ← Configurazione PWA
├── sw.js            ← Service Worker (offline + cache)
└── icons/
    ├── icon-192.png ← Icona per la schermata home
    └── icon-512.png ← Icona grande
```

---

## Opzione A — GitHub Pages (consigliata, gratuita, HTTPS automatico)

### 1. Crea un account GitHub
Vai su https://github.com e registrati (è gratuito).

### 2. Crea un nuovo repository
- Clicca su **"New repository"**
- Nome: `bibliotrack` (o qualsiasi nome tu voglia)
- Visibilità: **Public** (necessario per GitHub Pages gratuito)
- Clicca **"Create repository"**

### 3. Carica i file
Dal tuo laptop Linux, apri il terminale nella cartella `bibliotrack-pwa/`:

```bash
cd bibliotrack-pwa

git init
git add .
git commit -m "BiblioTrack PWA"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/bibliotrack.git
git push -u origin main
```

### 4. Attiva GitHub Pages
- Nel repository su GitHub, vai su **Settings → Pages**
- Source: **"Deploy from a branch"**
- Branch: **main**, cartella: **/ (root)**
- Clicca **Save**
- Dopo 1-2 minuti l'app sarà disponibile su:
  `https://TUO_USERNAME.github.io/bibliotrack/`

### 5. Installa su iPhone
1. Apri Safari sull'iPhone
2. Vai all'indirizzo `https://TUO_USERNAME.github.io/bibliotrack/`
3. Tocca l'icona **Condividi** (il quadrato con la freccia in su)
4. Scorri e tocca **"Aggiungi a schermata Home"**
5. Conferma con **"Aggiungi"**

✅ L'app apparirà nella schermata home come un'app nativa!

---

## Opzione B — Server locale (solo rete Wi-Fi di casa)

Se preferisci tenere tutto in locale senza GitHub:

### Sul laptop Linux

```bash
# Installa un server HTTP semplice (se non hai Node.js)
python3 -m http.server 8080 --directory /percorso/bibliotrack-pwa
```

oppure con Node.js:
```bash
npx serve bibliotrack-pwa -p 8080
```

### Trova l'IP del tuo laptop
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```
Esempio: `192.168.1.42`

### Su iPhone
1. Assicurati che iPhone e laptop siano sulla stessa rete Wi-Fi
2. Apri Safari e vai su `http://192.168.1.42:8080`

⚠️ **Limite**: Con HTTP locale (senza HTTPS) il Service Worker non si registra,
quindi l'app non funzionerà offline e i dati potrebbero essere soggetti
alla politica ITP di Safari (cancellazione dopo 7 giorni senza uso).
Per la persistenza stabile usa GitHub Pages (HTTPS).

---

## Note importanti sui dati

- I dati vengono salvati nel **localStorage** di Safari
- Finché l'app è installata come PWA (icona sulla home), Safari NON cancella i dati
- Il Service Worker mette in cache l'app per il **funzionamento offline**
- Usa il pulsante **Backup CSV** (⬇ nella Libreria) regolarmente come copia di sicurezza

---

## Aggiornamenti futuri

Se modifichi l'app e vuoi aggiornare la versione sul telefono:

```bash
# Modifica i file, poi:
git add .
git commit -m "aggiornamento"
git push
```

GitHub Pages si aggiornerà automaticamente in pochi minuti.
Sul telefono, riapri l'app e attendi che il Service Worker scarichi la nuova versione
(oppure chiudi e riapri l'app).
