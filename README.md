# TI Group — Website

Statische Website (HTML/CSS/JS, kein Build-Schritt) für die TI Group.
Design „Exposé“: Die Seite liegt in einem hellgrauen Rahmen, Schwarz nur für Schrift und Buttons, Gold nur als feine Linie.
Startseite mit interaktiver 3D-Karte von Aachen (MapLibre GL + OpenFreeMap, kein API-Key).

## Inhalt

```
ti-group-site/
├── index.html          Startseite (3D-Karte Aachen + Übersicht)
├── ueber-uns.html      Über Uns
├── leistungen.html     Leistungen (3 Säulen)
├── projekte.html       Projekte (mit Filter)
├── suchprofil.html     Suchprofil / Partner
├── kontakt.html        Kontakt (Formular)
├── impressum.html
├── datenschutz.html
├── 404.html
├── .nojekyll           sagt GitHub Pages: kein Jekyll-Build
└── assets/
    ├── styles.css      gemeinsames Design
    └── main.js         Navigation, Mobile-Menü, Cookie, Animationen
```

## Auf GitHub Pages veröffentlichen

### Variante A — über die GitHub-Weboberfläche (einfachste)
1. Auf github.com ein neues Repository anlegen (z. B. `ti-group`).
2. **Add file → Upload files** → den **Inhalt** dieses Ordners hochladen
   (also `index.html`, die anderen Seiten und den `assets`-Ordner — nicht den `ti-group-site`-Ordner selbst).
3. **Commit changes**.
4. **Settings → Pages** → bei *Source* **„Deploy from a branch"**, Branch **`main`**, Ordner **`/ (root)`** → **Save**.
5. Nach ca. 1 Minute ist die Seite unter `https://<dein-name>.github.io/ti-group/` erreichbar.

### Variante B — per Git
```bash
cd ti-group-site
git init
git add .
git commit -m "TI Group website"
git branch -M main
git remote add origin https://github.com/<dein-name>/ti-group.git
git push -u origin main
```
Danach wie oben **Settings → Pages** aktivieren.

## Hinweise
- Alle Pfade sind **relativ** — die Seite funktioniert auch im Unterpfad `…github.io/ti-group/`.
- Die Karte und die Schriften laden über das Internet (CDN/OpenStreetMap). Online nötig.
- Projektbilder sind aktuell Unsplash-Platzhalter und können durch echte Fotos ersetzt werden.
- Das Kontaktformular zeigt nur eine Erfolgsmeldung (kein echter Versand). Für echten Mailversand
  einen Formdienst (z. B. Formspree) oder ein Backend anbinden.
