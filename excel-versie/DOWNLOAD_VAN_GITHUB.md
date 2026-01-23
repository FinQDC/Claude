# 📥 Hoe Download Je de Excel Versie van GitHub?

## 🎯 Wat Heb Je Nodig?

Je hoeft **geen kant-en-klaar Excel bestand** te downloaden! Je maakt het zelf in 15 minuten met de VBA modules. Hier is hoe:

---

## Methode 1: Download Hele Repository (Makkelijkst)

### Stap 1: Download Alles

1. Ga naar de GitHub repository hoofdpagina
2. Klik op de **groene knop "Code"** (rechtsboven)
3. Klik op **"Download ZIP"**
4. Sla het ZIP bestand op (bijv. in Downloads map)

### Stap 2: Pak Uit

1. Ga naar je Downloads map
2. Rechterklik op het ZIP bestand
3. Kies **"Extract All"** of **"Uitpakken naar..."**
4. Kies een locatie (bijv. `C:\Users\JouwNaam\Documents\BankAnalyzer`)

### Stap 3: Navigeer naar Excel Versie

1. Open de uitgepakte map
2. Ga naar de map **`excel-versie`**
3. Je ziet nu:
   ```
   excel-versie/
   ├── README_EXCEL.md
   ├── EXCEL_SETUP.md
   ├── categorie_regels_voorbeeld.csv
   └── vba-modules/
       ├── ModuleImport.bas
       ├── ModuleCategorie.bas
       └── ModuleDashboard.bas
   ```

✅ **Klaar! Je hebt alle bestanden.**

---

## Methode 2: Download Individuele Bestanden

Als je alleen specifieke bestanden wilt:

### VBA Modules Downloaden

1. **Ga naar GitHub** → Klik op **`excel-versie`** map
2. Klik op **`vba-modules`** map
3. Voor elk bestand (`ModuleImport.bas`, `ModuleCategorie.bas`, `ModuleDashboard.bas`):
   - Klik op de bestandsnaam
   - Klik op **"Raw"** knop (rechtsboven de code)
   - Rechterklik → **"Save As..."** of **"Opslaan als..."**
   - Sla op met de originele naam (bijv. `ModuleImport.bas`)

### Documentatie Downloaden

1. Ga naar **`excel-versie`** map
2. Klik op `EXCEL_SETUP.md`
3. Klik **"Raw"**
4. Rechterklik → **"Save As..."**
5. Sla op als `EXCEL_SETUP.md`

### Categorie Regels Downloaden

1. Ga naar **`excel-versie`** map
2. Klik op `categorie_regels_voorbeeld.csv`
3. Klik **"Raw"**
4. Rechterklik → **"Save As..."**
5. Sla op als `categorie_regels_voorbeeld.csv`

---

## 📝 Wat Nu? Maak Je Excel Bestand!

### Optie A: Met Python Script (Automatisch)

1. **Installeer openpyxl** (eenmalig):
   ```bash
   pip install openpyxl
   ```

2. **Voer script uit**:
   ```bash
   cd excel-versie
   python genereer_excel_template.py
   ```

3. **Open gegenereerd bestand**:
   - `BankTransactieAnalyzer_temp.xlsx` wordt aangemaakt
   - Open in Excel
   - Ga verder met stap 4 hieronder

### Optie B: Handmatig in Excel (15 minuten)

**Volg deze stappen:**

#### 1. Maak Nieuw Excel Bestand

1. Open **Microsoft Excel**
2. Maak nieuwe lege workbook
3. Sla DIRECT op als: **`BankTransactieAnalyzer.xlsm`**
   - ⚠️ **Belangrijk**: Kies formaat **"Excel Macro-Enabled Workbook (.xlsm)"**
   - Locatie: Zelfde map als de VBA modules

#### 2. Maak Sheets Aan

Rechterklik op sheet tab onderaan → **"Insert"** → **"Worksheet"**

Maak 4 sheets met deze namen (exacte namen belangrijk!):
- ✅ **Instructies**
- ✅ **Data**
- ✅ **Categorieën**
- ✅ **Dashboard**

#### 3. Sheet "Data" Inrichten

Ga naar sheet **Data**:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| Datum | Omschrijving | Bedrag | Tegenrekening | Jaar | Maand | MaandNaam | InUit | BedragAbs | Categorie | Subcategorie |

- Maak rij 1 **vet**
- Geef achtergrondkleur (bijv. blauw)
- Selecteer rij 1 → **Data** tab → **Filter** (zet filters aan)

#### 4. Sheet "Categorieën" Inrichten

Ga naar sheet **Categorieën**:

| A | B | C | D |
|---|---|---|---|
| Patroon | Categorie | Subcategorie | Notitie |

- Maak rij 1 **vet** en gekleurd
- **Importeer voorbeelddata**:
  - Open `categorie_regels_voorbeeld.csv` in Notepad
  - Kopieer alles (behalve eerste regel/header)
  - Plak in Excel vanaf cel A2

#### 5. Importeer VBA Modules

**DIT IS DE BELANGRIJKSTE STAP!**

1. Druk **`Alt + F11`** (opent VBA Editor)

2. In VBA Editor:
   - Klik **"File"** menu
   - Klik **"Import File..."**

3. Navigeer naar je **`vba-modules`** map

4. Importeer **alle 3 bestanden** (één voor één):
   - Selecteer **`ModuleImport.bas`** → **"Open"**
   - Selecteer **`ModuleCategorie.bas`** → **"Open"**
   - Selecteer **`ModuleDashboard.bas`** → **"Open"**

5. **Controleer** in VBA Editor links:
   - Je ziet nu onder "Modules":
     - ModuleImport
     - ModuleCategorie
     - ModuleDashboard

6. Sluit VBA Editor: **`Alt + Q`**

#### 6. Macro Beveiliging Instellen

1. **File** → **Options** → **Trust Center** → **Trust Center Settings**
2. **Macro Settings** → Kies: **"Disable all macros with notification"**
3. Klik **OK**

#### 7. Sla Op en Test

1. **Sla bestand op**: `Ctrl + S`

2. **Sluit Excel** en **open opnieuw** `BankTransactieAnalyzer.xlsm`

3. **Klik "Enable Content"** (gele balk bovenaan)

4. **Test een macro**:
   - Druk `Alt + F8` (Macro dialog)
   - Selecteer **"ImporteerTransacties"**
   - Klik **"Run"**
   - Als File Dialog verschijnt = **SUCCES!** ✅

#### 8. Voeg Knoppen Toe (Optioneel maar Handig)

1. Activeer **Developer** tab:
   - File → Options → Customize Ribbon
   - Vink **"Developer"** aan → OK

2. Ga naar sheet **"Instructies"**

3. Voor elke macro, maak een knop:
   - **Developer** tab → **Insert** → **Button** (onder Form Controls)
   - Teken een knop (klik en sleep)
   - Selecteer macro (bijv. "ImporteerTransacties")
   - Klik OK
   - Rechterklik op knop → **"Edit Text"** → Typ naam (bijv. "📥 Importeer Transacties")

**Belangrijkste knoppen:**
- `ImporteerTransacties` → "📥 Importeer Transacties"
- `ToonOnbekendeTransacties` → "🔍 Toon Onbekende"
- `VoegCategorieRegelsToe` → "➕ Voeg Categorieën Toe"
- `HeranalyseerTransacties` → "🔄 Heranalyse"
- `VerversDashboard` → "📊 Dashboard Verversen"
- `ExporteerNaarExcel` → "💾 Exporteer"

#### 9. Klaar voor Gebruik!

**Eerste gebruik:**

1. Exporteer transacties van je bank naar CSV
2. Klik knop **"📥 Importeer Transacties"**
3. Selecteer je CSV bestand
4. Kies **"NO"** (alles wissen en opnieuw beginnen)
5. Wacht tot import klaar is
6. Bekijk sheet **"Data"** → je transacties staan er!
7. Klik **"🔍 Toon Onbekende"** → zie transacties zonder categorie
8. Vul kolom D in met categorieën
9. Klik **"➕ Voeg Categorieën Toe"**
10. Klik **"🔄 Heranalyse"**
11. Klik **"📊 Dashboard Verversen"**
12. Bekijk sheet **"Dashboard"** → zie je overzichten!

✅ **KLAAR! Je hebt nu een werkende banktransactie analyzer in Excel!**

---

## 🎬 Visuele Stappen (Samenvatting)

```
1. Download ZIP van GitHub
   ⬇️
2. Pak uit naar map op je PC
   ⬇️
3. Open Excel → Nieuwe workbook → Sla op als .xlsm
   ⬇️
4. Maak 4 sheets: Instructies, Data, Categorieën, Dashboard
   ⬇️
5. Sheet Data: Voeg headers toe (Datum, Omschrijving, etc.)
   ⬇️
6. Sheet Categorieën: Voeg headers toe + importeer voorbeelden
   ⬇️
7. Alt+F11 → Importeer 3 .bas bestanden
   ⬇️
8. Sla op → Sluit → Heropen → Enable Content
   ⬇️
9. Test: Alt+F8 → Run "ImporteerTransacties"
   ⬇️
10. Voeg knoppen toe (optioneel)
   ⬇️
11. Klaar! Start met importeren!
```

---

## ❓ Veelgestelde Vragen

### Ik zie geen .bas bestanden in GitHub
- Ze staan in de **`excel-versie/vba-modules/`** map
- Klik op de map naam om erin te navigeren
- Je ziet dan 3 bestanden: ModuleImport.bas, ModuleCategorie.bas, ModuleDashboard.bas

### Kan ik niet gewoon een .xlsm bestand downloaden?
Excel .xlsm bestanden zijn te groot en complex voor tekstgebaseerde Git.
De VBA modules (.bas) zijn tekstbestanden die je importeert.
Het duurt maar 15 minuten om het bestand zelf te maken!

### De VBA modules importeren niet
- Check of je het bestand hebt opgeslagen als **.xlsm** (niet .xlsx)
- Gebruik File → Import (niet copy-paste van code)
- Zorg dat je de .bas bestanden goed hebt gedownload (met Raw knop)

### "Enable Content" knop verschijnt niet
- File → Options → Trust Center → Macro Settings
- Kies "Disable all macros with notification"
- Heropen het bestand

### Macro's werken niet
- Heb je geklikt op "Enable Content"?
- Zijn de VBA modules geïmporteerd? (Check Alt+F11)
- Zijn de sheet namen exact: "Data", "Categorieën", "Dashboard"?

### Kan ik het Python script gebruiken?
Ja! Als je Python hebt:
```bash
pip install openpyxl
cd excel-versie
python genereer_excel_template.py
```
Dit maakt automatisch een .xlsx met alle sheets en formatting.
Je moet nog wel de VBA modules importeren (stap 5).

---

## 💡 Tips

### Backup Maken
Maak regelmatig een kopie van je .xlsm bestand:
- Rechterklik → Copy → Paste
- Hernoem naar: `BankAnalyzer_Backup_2025-01-23.xlsm`

### Template Delen
Je kunt het .xlsm bestand delen met anderen:
- Alle VBA code zit erin
- Ze hoeven alleen "Enable Content" te klikken
- En hun eigen CSV's te importeren

### Updates
Als er nieuwe VBA code komt:
- Download nieuwe .bas bestanden
- Alt+F11 → Verwijder oude modules
- Import nieuwe modules
- Sla op

---

## 🆘 Hulp Nodig?

1. ✅ Lees **EXCEL_SETUP.md** voor gedetailleerde instructies
2. ✅ Check de Troubleshooting sectie
3. ✅ Bekijk de VBA code (Alt+F11) - alles is gedocumenteerd
4. ✅ Test stap voor stap en check waar het misgaat

---

**Succes! Over 15 minuten heb je een werkende Excel analyzer! 🚀**
