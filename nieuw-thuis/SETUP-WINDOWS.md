# Setup-check voor Windows

Werk elke stap één voor één af in **PowerShell** of **Windows Terminal**. Bij elke stap zie je hoe je kunt checken of het al staat, en wat je moet doen als het ontbreekt.

> Tip: kopieer een commando, plak in PowerShell met rechtermuisklik of `Ctrl+V`, en druk Enter.

---

## Stap 1 — Node.js (versie 20 of hoger)

**Check:**
```powershell
node --version
```

**Verwacht:** `v20.x.x` (of hoger, bv. v22.x.x).

**Als het ontbreekt of te oud is:**
1. Ga naar https://nodejs.org/en/download
2. Download de **Windows Installer (.msi)** — kies "LTS"
3. Doorloop de installer met defaults
4. Sluit PowerShell en open een nieuwe — check opnieuw

---

## Stap 2 — npm (komt mee met Node)

**Check:**
```powershell
npm --version
```

**Verwacht:** `10.x.x` of hoger.

**Fix:** als dit niet werkt na Node-installatie, herstart je PC en open een nieuwe PowerShell.

---

## Stap 3 — Git

**Check:**
```powershell
git --version
```

**Verwacht:** `git version 2.x.x.windows.x`.

**Als het ontbreekt:**
1. Ga naar https://git-scm.com/download/win
2. Download en installeer (defaults zijn prima)
3. Sluit en heropen PowerShell

---

## Stap 4 — Claude Code

**Check:**
```powershell
claude --version
```

**Verwacht:** een versienummer zoals `2.x.x`.

**Als het ontbreekt:**
```powershell
npm install -g @anthropic-ai/claude-code
```

Daarna opnieuw checken.

---

## Stap 5 — Inloggen bij Claude Code

**Check:**
```powershell
claude
```
Eenmaal in de chat:
```
/status
```

**Verwacht:** je e-mail (johan@finqdc.nl) wordt getoond.

**Als je niet ingelogd bent:**
```
/login
```
Volg de browser-prompt en autoriseer.

Sluit Claude met `/exit` om verder te gaan.

---

## Stap 6 — Werkmap aanmaken

```powershell
New-Item -ItemType Directory -Path C:\dev -Force | Out-Null
Set-Location C:\dev
```

(Een andere locatie mag ook — maar vermijd paden met spaties of OneDrive-mappen.)

---

## Stap 7 — Repo klonen

> Vervang `<REPO-URL>` met de URL van `FinQDC/Claude` op GitHub (te vinden op de GitHub-pagina onder de groene "Code"-knop).

```powershell
git clone <REPO-URL>
Set-Location Claude
git checkout claude/peaceful-fermi-kco28
git pull
```

**Verwacht:** een aantal regels met "branch is up to date" of recente commits.

---

## Stap 8 — Project-dependencies installeren

```powershell
Set-Location nieuw-thuis
npm install
```

**Duurt:** 30–90 seconden afhankelijk van je internet.
**Verwacht:** afsluitende regel met "added N packages" of "audited N packages". Eventuele warnings over deprecated packages zijn ok.

---

## Stap 9 — Dev-server testen

```powershell
npm run dev
```

**Verwacht:** een regel met `- Local: http://localhost:3000` (binnen 5 seconden).

Open in je browser: http://localhost:3000

Je ziet de homepage met de 4 zorgtype-tegels en daaronder de indicatie-sectie.

Stop de server met **Ctrl+C**.

---

## Stap 10 — Production-build testen (optioneel maar aanbevolen)

```powershell
npm run build
```

**Verwacht:** afsluit met `✓ Generating static pages` en een routes-overzicht. Output komt in `out/`.

Als je deze ook lokaal wil bekijken:
```powershell
npx serve out
```

Open http://localhost:3000 in een browser.

---

## Stap 11 — Claude Code starten in de project-map

```powershell
Set-Location C:\dev\Claude\nieuw-thuis
claude
```

---

## Stap 12 — Eerste prompt voor Claude (kopieer-plak)

```
We werken aan het Nieuw Thuis prototype op branch claude/peaceful-fermi-kco28.
Lees nieuw-thuis/README.md en het meest recente git log (git log --oneline -10).
Vat in 5 regels samen waar we staan, welke stack we gebruiken, en wat de
laatste toevoeging was. Stel daarna geen vragen — wacht op mijn vervolg.
```

---

## Veelvoorkomende problemen

| Symptoom | Oorzaak | Oplossing |
|---|---|---|
| `node` of `npm` niet gevonden | Node niet in PATH | Herstart PowerShell, of PC |
| `claude` niet gevonden | npm global path niet in PATH | `npm config get prefix` — voeg `\` aan PATH toe in Windows env-variabelen |
| `git pull` vraagt om login | HTTPS auth nodig | Installeer **GitHub CLI** (`winget install GitHub.cli`) en doe `gh auth login` |
| Port 3000 in gebruik | Andere dev-server draait | `npm run dev -- --port 3001` of stop de andere |
| Build faalt op TypeScript | Code-wijziging brak iets | Stuur de foutmelding naar Claude in de sessie |

---

## Daarna

Wijzigingen lokaal? Commit en push terug naar de branch:

```powershell
git add .
git commit -m "Korte beschrijving van wat je deed"
git push
```

Daarna pik ik (of een nieuwe Claude-sessie) het op vanaf dat punt.
