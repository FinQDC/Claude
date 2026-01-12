# 🎙️ Voice Notes Email App

Een Progressive Web App (PWA) waarmee je spraaknotities kunt maken en automatisch naar je e-mail kunt versturen.

## ✨ Functies

- 🎤 **Spraakherkenning** - Gebruik de Web Speech API om je stem om te zetten naar tekst (Nederlands)
- 📧 **Automatische e-mail** - Verstuur je notities direct naar je e-mailadres
- 📱 **Mobiel geoptimaliseerd** - Werkt perfect op je telefoon
- 💾 **Lokale opslag** - Bewaar je e-mailadres en zie je recente notities
- 🔌 **Offline ondersteuning** - Werkt zelfs zonder internetverbinding (PWA)
- 📲 **Installeerbaar** - Installeer als app op je telefoon

## 🚀 Snel aan de slag

### Optie 1: Alleen de frontend gebruiken (met mailto)

Als je alleen de basis functionaliteit wilt zonder backend:

1. Open `index.html` in een moderne browser (Chrome of Safari aanbevolen)
2. Geef toestemming voor microfoon toegang
3. Klik op de microfoon knop en spreek je notitie in
4. Vul je e-mailadres in
5. Klik op "Verzenden" - dit opent je standaard e-mail client

### Optie 2: Volledige versie met backend (automatische e-mail)

Voor automatische e-mail verzending zonder handmatige tussenkomst:

#### Stap 1: Installeer dependencies

```bash
npm install
```

#### Stap 2: Configureer e-mail

Maak een `.env` bestand (kopieer van `.env.example`):

```bash
cp .env.example .env
```

Bewerk `.env` en vul je e-mail gegevens in:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=jouw-email@gmail.com
EMAIL_PASSWORD=jouw-app-wachtwoord
PORT=3000
```

**Voor Gmail:**
1. Ga naar je Google Account instellingen
2. Activeer 2-staps verificatie
3. Genereer een app-specifiek wachtwoord op: https://myaccount.google.com/apppasswords
4. Gebruik dit wachtwoord in `.env`

**Alternatieve e-mail services:**
- SendGrid, Mailgun, AWS SES, etc. zijn ook mogelijk
- Zie configuratie voorbeelden in `.env.example`

#### Stap 3: Start de server

```bash
npm start
```

Of voor development met auto-reload:

```bash
npm run dev
```

De app draait nu op: http://localhost:3000

## 📱 Installeren op je telefoon

### iPhone (Safari):

1. Open de app in Safari
2. Tik op het deel-icoon (vierkant met pijl omhoog)
3. Scroll en selecteer "Zet op beginscherm"
4. Geef de app een naam en tik "Voeg toe"

### Android (Chrome):

1. Open de app in Chrome
2. Tik op het menu (drie puntjes)
3. Selecteer "App installeren" of "Toevoegen aan startscherm"
4. Bevestig de installatie

## 🎯 Gebruik

1. **Opnemen starten**: Tik op de grote microfoon knop
2. **Spreek duidelijk**: De app luistert en transcribeert in real-time
3. **Opnemen stoppen**: Tik nogmaals op de knop
4. **E-mail versturen**: Vul je e-mailadres in en tik op "Verzenden"
5. **Wissen**: Tik op "Wissen" om opnieuw te beginnen

## 🔧 Technische details

### Technologieën

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Speech API**: Web Speech API (SpeechRecognition)
- **Backend**: Node.js, Express
- **E-mail**: Nodemailer
- **PWA**: Service Worker, Web App Manifest

### Browser ondersteuning

- ✅ Chrome (desktop & mobiel) - Aanbevolen
- ✅ Safari (iOS) - Spraakherkenning werkt goed
- ✅ Edge (desktop)
- ⚠️ Firefox - Beperkte spraakherkenning ondersteuning

### Spraakherkenning

De app gebruikt de Web Speech API die:
- Werkt in de browser zonder externe API's
- Ondersteunt Nederlands (nl-NL)
- Real-time transcriptie biedt
- Continu blijft luisteren tijdens opname

## 🛡️ Privacy & Beveiliging

- **Lokaal eerst**: Spraakherkenning gebeurt in de browser (afhankelijk van browser implementatie)
- **Geen opslag**: Audio wordt niet opgeslagen, alleen de tekst transcriptie
- **Geschiedenis**: Alleen lokaal opgeslagen in je browser (localStorage)
- **E-mail**: Gebruik environment variables voor gevoelige gegevens

## 🚢 Deployment

### Netlify / Vercel (alleen frontend met mailto)

1. Push je code naar GitHub
2. Connect je repository op Netlify of Vercel
3. Deploy - klaar!

### Heroku / Railway (volledige app met backend)

1. Voeg een `Procfile` toe:
   ```
   web: node server.js
   ```

2. Configureer environment variables in het platform
3. Deploy je app

### VPS (DigitalOcean, AWS, etc.)

1. Upload je bestanden
2. Installeer Node.js
3. Configureer een reverse proxy (nginx)
4. Gebruik PM2 voor process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name voice-notes
   pm2 save
   ```

## 📝 To-Do lijst (toekomstige verbeteringen)

- [ ] Categorieën/tags toevoegen aan notities
- [ ] Meerdere talen ondersteuning
- [ ] Audio opname opslaan (optioneel)
- [ ] Integratie met to-do apps (Todoist, Notion, etc.)
- [ ] Spraak commando's ("Verzenden", "Wissen")
- [ ] Cloud sync voor geschiedenis
- [ ] Dark mode ondersteuning

## 🐛 Bekende issues

- Spraakherkenning stopt soms automatisch na een tijd van stilte (browser limitatie)
- iOS vereist HTTPS voor spraakherkenning (gebruik localhost voor testing)
- Sommige browsers vragen elke keer om microfoon permissie

## 📄 Licentie

MIT License - Vrij te gebruiken voor persoonlijke en commerciële projecten

## 🤝 Bijdragen

Suggesties en verbeteringen zijn welkom! Open een issue of pull request.

## ⚡ Handige tips

- **Snel notities maken**: Installeer de app op je telefoon voor snelle toegang
- **E-mail opslaan**: Je e-mailadres wordt automatisch opgeslagen
- **Geschiedenis**: Bekijk je laatste 5 notities onderaan de pagina
- **Offline**: De app werkt ook zonder internet (behalve e-mail verzenden)

---

Gemaakt met ❤️ voor productiviteit
