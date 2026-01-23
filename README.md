# 💰 Lokale Banktransactie Analyzer

Een **volledig lokale** Python-applicatie voor het analyseren van je banktransacties. Jouw financiële gegevens blijven **100% op jouw laptop** - geen cloud, geen externe verbindingen, geen tracking.

## ✨ Wat kan deze app?

- 📊 **Maandoverzichten**: Zie per maand je inkomsten, uitgaven en saldo
- 🏷️ **Categorisatie**: Deel transacties automatisch in (boodschappen, vervoer, abonnementen, etc.)
- 📈 **Grafieken en statistieken**: Visuele inzichten in je uitgavenpatroon
- 🔍 **Gedetailleerd zoeken**: Filter en doorzoek al je transacties
- ⚙️ **Categoriebeheer**: Eenvoudig je eigen categorisatieregels maken en aanpassen
- 💾 **Export**: Bewerkte data exporteren naar Excel of CSV

## 🔒 Privacy Garantie

Deze applicatie:
- ✅ Draait **volledig lokaal** op jouw laptop
- ✅ Maakt **geen enkele externe verbinding**
- ✅ Stuurt **geen data naar het internet**
- ✅ Heeft **geen tracking of telemetry**
- ✅ Gebruikt **geen API's of cloud-diensten**

Al je transactiegegevens blijven veilig op jouw eigen computer.

---

## ⚡ Snelstart (Automatische Installatie)

**Nieuw!** Gebruik de automatische installatiescripts voor de snelste setup:

### Windows

1. Download deze repository en pak uit
2. **Dubbelklik op `setup.bat`**
3. Het script installeert automatisch:
   - Python (indien nodig)
   - Virtuele omgeving
   - Alle benodigde packages
4. Klaar! Start de app met **`start.bat`**

### macOS / Linux

1. Download deze repository en pak uit
2. Open Terminal in de uitgepakte map
3. Voer uit:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
4. Klaar! Start de app met:
   ```bash
   ./start.sh
   ```

**Dat is alles!** De scripts zorgen voor de complete installatie.

---

## 📦 Installatie (Handmatig)

_Wil je liever handmatig installeren? Volg deze stappen:_

### Stap 1: Python Installeren

Je hebt Python 3.8 of nieuwer nodig.

**Windows:**
1. Download Python van [python.org/downloads](https://www.python.org/downloads/)
2. Bij installatie: **vink "Add Python to PATH" aan!**
3. Controleer installatie via Command Prompt:
   ```
   python --version
   ```

**macOS/Linux:**
Python is vaak al geïnstalleerd. Controleer met:
```bash
python3 --version
```

### Stap 2: Download de Applicatie

1. Download of clone deze repository naar een map op je laptop, bijvoorbeeld:
   ```
   C:\Users\JouwNaam\Documents\BankAnalyzer
   ```

### Stap 3: Virtuele Omgeving Aanmaken

Open een terminal/Command Prompt in de `app` map en voer uit:

**Windows:**
```cmd
cd C:\Users\JouwNaam\Documents\BankAnalyzer\app
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
cd ~/Documents/BankAnalyzer/app
python3 -m venv venv
source venv/bin/activate
```

Je ziet nu `(venv)` voor je prompt staan.

### Stap 4: Installeer Vereiste Packages

Met de virtuele omgeving actief:

```bash
pip install -r requirements.txt
```

Dit installeert alle benodigde Python-packages (pandas, streamlit, plotly, etc.).

### Stap 5: Start de Applicatie

**Optie A - Met start script (makkelijkste):**

Ga terug naar de hoofdmap en gebruik:
- **Windows**: Dubbelklik op `start.bat`
- **macOS/Linux**: Voer uit `./start.sh`

**Optie B - Handmatig:**
```bash
streamlit run app.py
```

De applicatie opent automatisch in je browser op `http://localhost:8501`

**Let op:** Ondanks dat het in een browser draait, is dit een **lokale applicatie**. Er wordt geen verbinding gemaakt met internet. Je kunt dit verifiëren door je WiFi uit te zetten - de app blijft gewoon werken!

---

## 🚀 Gebruik

### 1. Transacties Laden

1. Exporteer je banktransacties naar CSV vanuit je online banking omgeving
   - De meeste banken bieden een export-functie onder 'Transacties' of 'Rekeningoverzicht'
   - Selecteer de gewenste periode (bijv. laatste 6 maanden)
   - Kies formaat: CSV

2. In de app: klik op **"Browse files"** in de sidebar
3. Selecteer een of meer CSV-bestanden
4. De app verwerkt de bestanden automatisch

**Belangrijk:** Duplicaten worden automatisch verwijderd, dus je kunt gerust meerdere exports uploaden met overlappende periodes.

### 2. CSV Formaat Aanpassen

Verschillende banken gebruiken verschillende kolomnamen. Standaard verwacht de app:
- `Datum`
- `Omschrijving`
- `Bedrag`
- `Tegenrekening` (optioneel)

**Als jouw bank andere kolomnamen gebruikt:**

Open `app/config/settings.json` en pas de `column_mapping` aan:

```json
{
  "column_mapping": {
    "datum": "Datum",           // Pas "Datum" aan naar de kolom in jouw CSV
    "omschrijving": "Omschrijving",  // Pas aan naar jouw kolomnaam
    "bedrag": "Bedrag",         // Pas aan naar jouw kolomnaam
    "tegenrekening": "Tegenrekening"
  }
}
```

Bijvoorbeeld, als jouw bank "Boekdatum" en "Beschrijving" gebruikt:
```json
{
  "column_mapping": {
    "datum": "Boekdatum",
    "omschrijving": "Beschrijving",
    "bedrag": "Bedrag",
    "tegenrekening": "Tegenrekening"
  }
}
```

### 3. Overzichten Bekijken

De app heeft 5 tabbladen:

#### 📊 Overzicht per Maand
- Tabel met per maand: inkomsten, uitgaven en saldo
- Grafieken van je maandelijkse cashflow
- Totaalstatistieken over de hele periode

#### 🏷️ Overzicht per Categorie
- Selecteer een jaar om te analyseren
- Zie verdeling van uitgaven per categorie
- Pie chart en gestapelde grafieken per maand
- Top 10 uitgavencategorieën

#### 🔍 Detail Transacties
- Zoek en filter je transacties
- Filters op: jaar, categorie, type (in/uit), bedrag, zoekterm
- Exporteer gefilterde resultaten

#### ⚙️ Categoriebeheer
- Zie welke transacties nog geen categorie hebben
- Voeg eenvoudig nieuwe categorisatieregels toe
- Beheer bestaande regels

#### 💾 Export
- Exporteer je verrijkte dataset naar Excel of CSV
- Inclusief alle toegevoegde categorieën en berekende velden

### 4. Categorieën Beheren

#### Automatische Categorisatie

De app gebruikt patronen in de omschrijving om categorieën toe te kennen.

**Voorbeeld:** Een transactie met omschrijving "Betaling Albert Heijn Amsterdam" wordt automatisch herkend als "Boodschappen" als er een regel is:
- Patroon: `Albert Heijn`
- Categorie: `Boodschappen`
- Subcategorie: `Supermarkt`

#### Nieuwe Regel Toevoegen

1. Ga naar het **"Categoriebeheer"** tabblad
2. Bekijk de lijst met "Transacties zonder Categorie"
3. Vul in:
   - **Patroon**: Een tekst die in de omschrijving voorkomt (bijv. "Spotify")
   - **Categorie**: De hoofdcategorie (bijv. "Abonnementen")
   - **Subcategorie** (optioneel): Verdere specificatie (bijv. "Entertainment")
4. Klik op **"Regel Toevoegen"**
5. **Upload je CSV opnieuw** om de nieuwe regel toe te passen

#### Categorisatieregels Bewerken

De regels staan in `app/config/categorie_regels.csv`. Je kunt dit bestand:
- Openen in Excel of een teksteditor
- Regels toevoegen, verwijderen of aanpassen
- Opslaan
- De transacties opnieuw uploaden om wijzigingen toe te passen

**Tip:** Maak eerst een backup van dit bestand voordat je grote wijzigingen doorvoert!

### 5. Maandelijkse Routine

Elke maand:

1. Log in bij je online banking
2. Exporteer transacties van de afgelopen maand naar CSV
3. Start de app: `streamlit run app.py`
4. Upload het nieuwe CSV-bestand
5. Bekijk je nieuwe cijfers!
6. Voeg indien nodig nieuwe categorisatieregels toe voor onbekende transacties

**Optioneel:** Exporteer je volledige dataset naar Excel voor archivering.

---

## 📁 Projectstructuur

```
/
├── setup.bat                 # Automatische installatie (Windows)
├── setup.sh                  # Automatische installatie (macOS/Linux)
├── start.bat                 # Start app (Windows)
├── start.sh                  # Start app (macOS/Linux)
├── README.md                 # Deze handleiding
└── app/
    ├── app.py                # Hoofdapplicatie
    ├── requirements.txt      # Python dependencies
    ├── config/
    │   ├── settings.json     # Instellingen (kolomnamen, formaten)
    │   └── categorie_regels.csv # Categorisatieregels
    └── data/                 # Hier worden exports opgeslagen
```

---

## 🛠️ Configuratie

### settings.json

```json
{
  "column_mapping": {
    "datum": "Datum",
    "omschrijving": "Omschrijving",
    "bedrag": "Bedrag",
    "tegenrekening": "Tegenrekening"
  },
  "date_format": "%Y-%m-%d",        // Datumformaat in CSV
  "decimal_separator": ",",          // Decimaal scheidingsteken
  "thousands_separator": ".",        // Duizendtallen scheidingsteken
  "default_category": "Onbekend"     // Standaard categorie
}
```

### categorie_regels.csv

Format:
```
Patroon,Categorie,Subcategorie,Notitie
Albert Heijn,Boodschappen,Supermarkt,
Spotify,Abonnementen,Entertainment,
Shell,Vervoer,Brandstof,
```

---

## ❓ Veelgestelde Vragen

### Kan ik meerdere bankrekeningen tegelijk analyseren?

Ja! Upload gewoon CSV's van verschillende banken. De app combineert ze automatisch en verwijdert duplicaten.

### Wat als mijn bank een ander CSV-formaat gebruikt?

Pas `app/config/settings.json` aan zoals beschreven bij "CSV Formaat Aanpassen".

### Worden mijn gegevens ergens opgeslagen?

Ja, maar alleen **lokaal op jouw laptop**:
- Uploads blijven in het geheugen van de app (verdwijnen bij herstarten)
- Optioneel: Exports worden opgeslagen in `app/data/` op jouw laptop
- Configuratiebestanden staan in `app/config/`

**Niets wordt verstuurd naar internet of cloud.**

### Hoe stop ik de app?

Druk in de terminal op `Ctrl+C`, of sluit gewoon de browser tab en terminal.

### Hoe herstart ik de app later?

**Makkelijkste manier:**
- **Windows**: Dubbelklik op `start.bat`
- **macOS/Linux**: Voer uit `./start.sh`

**Of handmatig:**
1. Open terminal in de `app` map
2. Activeer virtuele omgeving:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
3. Start app: `streamlit run app.py`

### Kan ik dit delen met anderen?

Ja, je kunt de hele `app` map kopiëren naar een andere computer. Elke gebruiker moet wel de installatiestappen doorlopen (Python, venv, requirements.txt).

### Werkt dit ook zonder internetverbinding?

**Ja!** Zodra alles geïnstalleerd is, kun je je WiFi uitschakelen en de app blijft perfect werken. Dat bewijst dat je data veilig is.

---

## 🐛 Probleemoplossing

### "Python is not recognized" (Windows)

Python is niet toegevoegd aan PATH. Herinstalleer Python en vink "Add Python to PATH" aan.

### "streamlit: command not found"

De virtuele omgeving is niet geactiveerd. Voer uit:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

### "Verplichte kolommen ontbreken"

Jouw CSV heeft andere kolomnamen. Pas `settings.json` aan (zie "CSV Formaat Aanpassen").

### CSV wordt niet correct ingelezen

Check:
- Is het bestand echt een CSV (komma- of puntkomma-gescheiden)?
- Open het bestand in Notepad om het formaat te controleren
- Pas eventueel de `date_format` en separators in `settings.json` aan

### App is traag met grote bestanden

Dit is normaal bij 10.000+ transacties. De app blijft werken, maar filters en grafieken kunnen enkele seconden duren.

---

## 📝 Licentie

MIT License - gebruik en pas aan naar hartenlust!

---

## 🎯 Tips voor Optimaal Gebruik

1. **Maak regelmatig backups** van je `config` map (vooral `categorie_regels.csv`)
2. **Verfijn je categorieën** in de loop van de tijd voor betere inzichten
3. **Exporteer maandelijks** je verrijkte dataset naar Excel als archief
4. **Experimenteer met subcategorieën** voor nog gedetailleerder inzicht (bijv. verschillende supermarkten onder "Boodschappen")
5. **Let op seizoenspatronen** in de grafieken per maand

---

## 🙏 Ondersteuning

Deze app is volledig open source en lokaal. Voor vragen of problemen:
- Check eerst deze README
- Bekijk de code in `app.py` (alles is goed gedocumenteerd)
- Pas de code aan naar jouw wensen!

**Veel plezier met het analyseren van je financiën - privé en veilig!** 💰🔒
