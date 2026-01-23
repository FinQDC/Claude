# 📊 Excel Versie - Setup Handleiding

**Lokale Banktransactie Analyzer - Excel Editie**

Deze handleiding helpt je om de Excel versie van de Banktransactie Analyzer in te richten.

## ✨ Voordelen Excel Versie

- ✅ **Geen Python installatie nodig**
- ✅ **Werkt in Excel (Windows/Mac)**
- ✅ **Vertrouwde interface**
- ✅ **Direct data manipuleren**
- ✅ **VBA macro's voor automatisering**
- ✅ **PivotTables en grafieken**
- ✅ **100% lokaal - geen externe verbindingen**

---

## 🚀 Snelle Setup (15 minuten)

### Stap 1: Nieuwe Excel Workbook Maken

1. Open **Excel** (versie 2016 of nieuwer aanbevolen)
2. Maak een nieuwe lege workbook
3. Sla op als: `BankTransactieAnalyzer.xlsm`
   - **Belangrijk**: Kies `.xlsm` formaat (Macro-Enabled Workbook)

### Stap 2: Sheets Aanmaken

Maak de volgende sheets aan (rechtermuisklik op tabblad → Insert):

1. **Instructies** - Voor gebruiksinstructies
2. **Data** - Voor alle transacties
3. **Categorieën** - Voor categorisatieregels
4. **Dashboard** - Voor overzichten en grafieken
5. **Onbekend** - Voor onbekende transacties (wordt automatisch gemaakt)

### Stap 3: Sheet "Data" Inrichten

Ga naar sheet **Data** en maak de volgende kolommen (rij 1):

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| Datum | Omschrijving | Bedrag | Tegenrekening | Jaar | Maand | MaandNaam | InUit | BedragAbs | Categorie | Subcategorie |

**Formattering:**
- Maak rij 1 **vet** en geef een achtergrondkleur (bijv. lichtblauw)
- Zet filters aan: Selecteer rij 1 → Data tab → Filter
- Kolom A (Datum): Formaat → Datum (DD-MM-YYYY)
- Kolom C (Bedrag): Formaat → Getal (2 decimalen)
- Kolom E-K worden automatisch gevuld door VBA

### Stap 4: Sheet "Categorieën" Inrichten

Ga naar sheet **Categorieën** en maak kolommen:

| A | B | C | D |
|---|---|---|---|
| Patroon | Categorie | Subcategorie | Notitie |

**Vul voorbeeldregels in:**

```
Patroon             | Categorie        | Subcategorie      | Notitie
Albert Heijn        | Boodschappen     | Supermarkt        |
Jumbo               | Boodschappen     | Supermarkt        |
Lidl                | Boodschappen     | Supermarkt        |
Aldi                | Boodschappen     | Supermarkt        |
Etos                | Boodschappen     | Drogist           |
Shell               | Vervoer          | Brandstof         |
BP                  | Vervoer          | Brandstof         |
NS                  | Vervoer          | Openbaar vervoer  |
OV-chipkaart        | Vervoer          | Openbaar vervoer  |
Ziggo               | Abonnementen     | Internet/TV       |
KPN                 | Abonnementen     | Internet/TV       |
Netflix             | Abonnementen     | Entertainment     |
Spotify             | Abonnementen     | Entertainment     |
Amazon              | Online shopping  |                   |
Bol.com             | Online shopping  |                   |
```

**Formattering:**
- Maak rij 1 **vet** en gekleurde achtergrond
- Zet filters aan

### Stap 5: VBA Modules Importeren

1. Open de **VBA Editor**: Druk op `Alt + F11`

2. **Importeer modules:**
   - File → Import File
   - Navigeer naar de map `vba-modules/`
   - Importeer de volgende bestanden (één voor één):
     - `ModuleImport.bas`
     - `ModuleCategorie.bas`
     - `ModuleDashboard.bas`

3. **Controleer**: In de VBA Editor zie je nu in de "Modules" map:
   - ModuleImport
   - ModuleCategorie
   - ModuleDashboard

4. **Sluit VBA Editor**: `Alt + Q` of File → Close

### Stap 6: Macro's Toegankelijk Maken (Knoppen in Ribbon)

**Optie A - Via Quick Access Toolbar:**

1. Klik rechtsboven op het **↓** pijltje naast de Quick Access Toolbar
2. Kies "More Commands"
3. Bij "Choose commands from" selecteer "Macros"
4. Voeg toe:
   - `ImporteerTransacties`
   - `ToonOnbekendeTransacties`
   - `VoegCategorieRegelsToe`
   - `HeranalyseerTransacties`
   - `VerversDashboard`
   - `ExporteerNaarExcel`

**Optie B - Via Developer Tab (aanbevolen):**

1. Activeer Developer Tab:
   - File → Options → Customize Ribbon
   - Vink "Developer" aan → OK

2. Maak knoppen op sheet "Instructies":
   - Developer tab → Insert → Button (Form Control)
   - Teken een knop
   - Wijs macro toe
   - Herhaal voor alle belangrijke macro's

**Aanbevolen knoppen:**
- **Importeer Transacties** → `ImporteerTransacties`
- **Toon Onbekende** → `ToonOnbekendeTransacties`
- **Voeg Categorieën Toe** → `VoegCategorieRegelsToe`
- **Heranalyse** → `HeranalyseerTransacties`
- **Dashboard Verversen** → `VerversDashboard`
- **Exporteer naar Excel** → `ExporteerNaarExcel`

### Stap 7: Macro Beveiliging Instellen

1. File → Options → Trust Center → Trust Center Settings
2. Macro Settings → **"Disable all macros with notification"** (aanbevolen)
3. Of voeg de map toe aan "Trusted Locations"

### Stap 8: Sheet "Instructies" Invullen

Ga naar sheet **Instructies** en voeg toe:

```
BANKTRANSACTIE ANALYZER - EXCEL EDITIE
=======================================

PRIVACY GARANTIE: 100% lokaal - geen externe verbindingen!

STAPPEN:
1. Klik op [Importeer Transacties] om CSV te laden
2. Bekijk Dashboard voor overzichten
3. Gebruik [Toon Onbekende] voor nieuwe transacties zonder categorie
4. Voeg categorieën toe en klik [Voeg Categorieën Toe]
5. Klik [Heranalyse] om categorieën opnieuw toe te passen
6. Gebruik [Dashboard Verversen] voor actuele grafieken

TIPS:
- Je kunt meerdere CSV's tegelijk importeren
- Duplicaten worden automatisch verwijderd
- Pas sheet "Categorieën" aan voor je eigen regels
- Sorteer en filter direct in de Data sheet

SHEETS:
- Data: Alle transacties
- Categorieën: Classificatieregels
- Dashboard: Overzichten en grafieken
- Onbekend: Te classificeren transacties
```

---

## 📖 Gebruiksinstructies

### Eerste Gebruik

1. **Maak macro's actief**: Open het bestand en klik "Enable Content" (gele balk bovenaan)

2. **Importeer je eerste CSV**:
   - Klik op knop "Importeer Transacties" (of gebruik Quick Access Toolbar)
   - Selecteer één of meer CSV bestanden van je bank
   - Kies: JA om data toe te voegen, NEE om opnieuw te beginnen
   - Wacht tot import klaar is

3. **Bekijk resultaat**:
   - Ga naar sheet "Data" → zie je transacties
   - Kolommen E t/m K zijn automatisch ingevuld
   - Categorie staat waarschijnlijk nog op "Onbekend"

4. **Categoriseer transacties**:
   - Klik "Toon Onbekende" → sheet "Onbekend" wordt gevuld
   - Vul kolom D in met categorieën
   - Klik "Voeg Categorieën Toe" → regels worden toegevoegd aan sheet "Categorieën"
   - Klik "Heranalyse" → categorieën worden toegepast

5. **Bekijk Dashboard**:
   - Klik "Dashboard Verversen"
   - Ga naar sheet "Dashboard"
   - Zie overzichten, statistieken en grafieken

### Maandelijks Gebruik

1. **Exporteer nieuwe transacties** van je bank naar CSV
2. **Open BankTransactieAnalyzer.xlsm**
3. **Klik "Importeer Transacties"** → Kies JA om toe te voegen
4. **Selecteer het nieuwe CSV bestand**
5. **Eventueel**: Voeg nieuwe categorieën toe voor onbekende transacties
6. **Klik "Dashboard Verversen"** voor actuele cijfers
7. **Klaar!**

### CSV Formaat Aanpassen

Als je bank andere kolomnamen gebruikt dan Datum/Omschrijving/Bedrag:

**Optie 1 - In CSV editor:**
- Open CSV in Notepad of Excel
- Wijzig de eerste regel (headers) naar: `Datum,Omschrijving,Bedrag,Tegenrekening`
- Sla op

**Optie 2 - In VBA code aanpassen:**
- Open VBA Editor (`Alt + F11`)
- Ga naar `ModuleImport`
- Zoek functie `ImporteerCSV`
- Pas kolomnummers aan indien nodig

---

## 🔧 Macro Overzicht

### ImporteerTransacties
- **Doel**: CSV bestanden inlezen
- **Gebruik**: Klik knop of Quick Access
- **Resultaat**: Data wordt toegevoegd aan sheet "Data"
- **Opties**: Toevoegen of vervangen

### ToonOnbekendeTransacties
- **Doel**: Vind transacties zonder categorie
- **Gebruik**: Na import uitvoeren
- **Resultaat**: Sheet "Onbekend" met unieke omschrijvingen
- **Actie**: Vul kolom D in met categorieën

### VoegCategorieRegelsToe
- **Doel**: Voeg nieuwe regels toe aan sheet "Categorieën"
- **Gebruik**: Na invullen van kolom D in sheet "Onbekend"
- **Resultaat**: Regels worden toegevoegd
- **Vervolg**: Voer "Heranalyse" uit

### HeranalyseerTransacties
- **Doel**: Pas alle categorieregels opnieuw toe
- **Gebruik**: Na aanpassen categorieregels
- **Resultaat**: Alle transacties opnieuw geclassificeerd

### VerversDashboard
- **Doel**: Maak/update dashboard
- **Gebruik**: Na import of heranalyse
- **Resultaat**: Sheet "Dashboard" met PivotTables en grafieken

### ExporteerNaarExcel / ExporteerNaarCSV
- **Doel**: Exporteer verrijkte data
- **Gebruik**: Voor archivering of externe analyse
- **Resultaat**: Nieuw bestand met alle data

---

## 🎨 Dashboard Aanpassen

Het Dashboard wordt automatisch gegenereerd, maar je kunt het aanpassen:

1. **PivotTables**:
   - Rechterklik op PivotTable → PivotTable Options
   - Voeg velden toe/verwijder velden
   - Wijzig layout

2. **Grafieken**:
   - Rechterklik op grafiek → Change Chart Type
   - Selecteer grafiek → Design tab → Change Colors
   - Wijzig titels, labels, etc.

3. **Extra grafieken toevoegen**:
   - Insert tab → PivotChart
   - Kies data van bestaande PivotTable
   - Of maak nieuwe PivotTable + grafiek

---

## 🔒 Privacy en Beveiliging

### Lokaal Werken
De VBA code maakt **GEEN** externe verbindingen:
- ✅ Geen HTTP requests
- ✅ Geen API calls
- ✅ Geen cloud uploads
- ✅ Alle data blijft op jouw PC

### Macro Beveiliging
Excel vraagt standaard toestemming voor macro's:
- Klik altijd "Enable Content" voor dit bestand
- Voeg de map toe aan Trusted Locations voor automatisch enablen

### Bestandsbeveiliging
Optioneel: Beveilig het bestand met wachtwoord:
1. File → Info → Protect Workbook → Encrypt with Password
2. Kies een sterk wachtwoord
3. **Vergeet het wachtwoord NIET!** (kan niet hersteld worden)

---

## 💡 Tips en Trucs

### Meerdere Bankrekeningen
Je kunt CSV's van verschillende banken importeren:
- Alle data komt in dezelfde Data sheet
- Eventueel: Voeg kolom "Bank" toe en vul handmatig in
- Of gebruik "Tegenrekening" kolom om rekeningen te herkennen

### Grote Datasets
Bij 10.000+ transacties:
- Schakel automatisch berekenen uit tijdens import: Formulas → Calculation Options → Manual
- Zet terug op Automatic na import
- Of gebruik de macro die dit automatisch doet

### Subcategorieën
Gebruik subcategorieën voor meer detail:
- Categorie: Boodschappen → Subcategorie: Supermarkt, Drogist
- Categorie: Vervoer → Subcategorie: Brandstof, OV, Parkeren

### Budgettering
Voeg extra sheet "Budget" toe:
- Maak tabel met Categorie | Budget per Maand
- Gebruik VLOOKUP om budget vs werkelijk te vergelijken
- Maak grafiek voor visualisatie

### Jaaroverzicht
Maak extra PivotTable:
- Rijen: Jaar
- Kolommen: Categorie
- Waarden: Som van BedragAbs
- Vergelijk jaren eenvoudig

---

## ❓ Veelgestelde Vragen

### Kan ik CSV's automatisch importeren?
Niet volledig automatisch (Excel beveiligingspolitiek), maar:
- Gebruik Quick Access knop voor 1-klik import
- Of maak Auto_Open macro (opent bij opstarten)

### Werkt dit op Mac?
Ja, maar met beperkingen:
- Excel voor Mac 2016+ heeft VBA ondersteuning
- Sommige Windows-specifieke functies werken niet (bijv. FileDialog)
- Gebruik Mac-compatible alternatieven indien nodig

### Kan ik formules gebruiken ipv macro's?
Ja, gedeeltelijk:
- Categorisatie kan met nested IF of VLOOKUP
- Maar macro's zijn sneller bij grote datasets
- Combinatie van beide is ook mogelijk

### Hoe maak ik een backup?
- File → Save As → Kies nieuwe naam (bijv. Backup_YYYYMMDD.xlsm)
- Of kopieer het bestand in Windows Verkenner
- Tip: Maak wekelijks een backup!

### Gaat mijn data verloren bij crash?
- Excel maakt automatisch AutoRecover bestanden
- File → Options → Save → AutoRecover file location
- Backup regelmatig naar veilige locatie

---

## 🚨 Probleemoplossing

### "Macro's zijn uitgeschakeld"
- Klik op gele balk bovenaan → "Enable Content"
- Of: File → Options → Trust Center → Macro Settings → Enable

### Import werkt niet
- Check of CSV correct geformatteerd is (komma of puntkomma gescheiden)
- Open CSV in Notepad om structuur te zien
- Pas delimiter aan in VBA code indien nodig

### Dashboard toont geen data
- Check of sheet "Data" transacties bevat
- Klik "Dashboard Verversen" om opnieuw te genereren
- Check of PivotCache correct verwijst naar Data

### Categorieën worden niet toegepast
- Check of patronen exact matchen (hoofdlettergevoelig in VBA)
- Voer "Heranalyse" uit na aanpassen regels
- Check of sheet "Categorieën" correct ingevuld is

### VBA foutmelding bij import
- Check of alle sheets bestaan (Data, Categorieën)
- Check of kolommen correct zijn (A=Datum, B=Omschrijving, C=Bedrag)
- Debug in VBA Editor (`F8` voor stap-voor-stap)

---

## 📚 Bronbestanden

Deze installatie gebruikt de volgende VBA modules:
- `ModuleImport.bas` - CSV import en data verwerking
- `ModuleCategorie.bas` - Categoriebeheer
- `ModuleDashboard.bas` - Dashboard en exports

Alle code is volledig lokaal en bevat **geen externe verbindingen**.

---

## 🎓 Verdere Aanpassingen

Wil je de VBA code aanpassen?

1. Open VBA Editor: `Alt + F11`
2. Zoek de functie die je wilt aanpassen
3. Wijzig de code
4. Test met `F5` (Run)
5. Sla op: `Ctrl + S`

**Voorbeelden:**
- Datumformaat aanpassen: Zoek `Format(datumWaarde, "YYYY-MM")`
- Andere CSV delimiter: Wijzig `.TextFileCommaDelimiter` in `ImporteerCSV`
- Extra kolommen toevoegen: Pas `VoegBerekendekolommenToe` aan

---

**Veel succes met je banktransactie analyse! 💰**

*Privacy gegarandeerd - 100% lokaal!* 🔒
