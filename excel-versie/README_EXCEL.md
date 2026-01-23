# 📊 Banktransactie Analyzer - Excel Versie

**100% Lokaal - Geen Python nodig - Alleen Excel!**

## 🚀 Wat is dit?

Een complete banktransactie analyzer gebouwd in **Microsoft Excel** met VBA macro's. Alles wat de Python versie kan, maar dan in de vertrouwde Excel-omgeving.

## ✨ Voordelen

- ✅ **Geen installatie nodig** (behalve Excel zelf)
- ✅ **Vertrouwde interface** - Je kent Excel al!
- ✅ **Direct data manipuleren** - Sorteer, filter, bewerk in realtime
- ✅ **VBA automatisering** - Import met één klik
- ✅ **PivotTables & Grafieken** - Krachtige visualisaties
- ✅ **100% Lokaal** - Geen cloud, geen internet nodig

## 📦 Vereisten

- **Microsoft Excel 2016 of nieuwer** (Windows of Mac)
- **Macro's enabled** (wordt bij openen gevraagd)
- Dat is alles!

---

## 📥 NIEUW: Download van GitHub?

**👉 [Klik hier voor stap-voor-stap download instructies](DOWNLOAD_VAN_GITHUB.md)**

Deze handleiding legt PRECIES uit:
- Waar je in GitHub moet klikken
- Hoe je de VBA bestanden download
- Hoe je in 15 minuten een werkend Excel bestand maakt
- Met screenshots en troubleshooting

---

## ⚡ Snelstart

### Optie 1: Gebruik kant-en-klare template (Aanbevolen)

1. Download `BankTransactieAnalyzer_Template.xlsm` *(indien beschikbaar)*
2. Open bestand → Klik "Enable Content"
3. Ga naar sheet "Instructies"
4. Klik knop **"Importeer Transacties"**
5. Selecteer je bank-CSV
6. Klaar!

### Optie 2: Zelf bouwen (15 minuten)

Volg de gedetailleerde instructies in **`EXCEL_SETUP.md`**

**Samenvatting:**
1. Maak nieuwe Excel workbook (`.xlsm`)
2. Maak 4 sheets: Data, Categorieën, Dashboard, Instructies
3. Importeer VBA modules vanuit `vba-modules/` map
4. Voeg knoppen toe voor macro's
5. Importeer je eerste CSV!

## 📖 Hoe werkt het?

### 1. Import
```
Klik [Importeer Transacties]
→ Selecteer CSV bestand(en)
→ Data wordt automatisch verwerkt en gecategoriseerd
```

### 2. Categoriseren
```
Klik [Toon Onbekende]
→ Zie transacties zonder categorie
→ Vul categorieën in
→ Klik [Voeg Categorieën Toe]
→ Klik [Heranalyse]
```

### 3. Analyseren
```
Klik [Dashboard Verversen]
→ Zie overzichten per maand
→ Zie uitgaven per categorie
→ Bekijk grafieken
```

## 🎯 Functies

### Automatische Import
- Meerdere CSV's tegelijk
- Duplicaten detectie
- Datum, bedrag en categorie verwerking

### Slimme Categorisatie
- Automatische matching op basis van patronen
- Eenvoudig nieuwe regels toevoegen
- Bulk categoriseren

### Dashboard & Rapportages
- Maandoverzicht (inkomsten vs uitgaven)
- Categorie verdeling (pie chart)
- Statistieken (totalen, saldo, periode)
- Exporteer naar Excel of CSV

### Direct Data Manipulatie
- Sorteer op elke kolom
- Filter transacties
- Zoek met Ctrl+F
- Handmatig categorieën aanpassen
- Excel formules gebruiken

## 📁 Bestandsstructuur

```
excel-versie/
├── README_EXCEL.md              # Deze handleiding
├── EXCEL_SETUP.md               # Gedetailleerde setup instructies
├── vba-modules/
│   ├── ModuleImport.bas        # CSV import en verwerking
│   ├── ModuleCategorie.bas     # Categoriebeheer
│   └── ModuleDashboard.bas     # Dashboard en exports
└── categorie_regels_voorbeeld.csv # Voorbeeldregels
```

## 🔧 Macro's Overzicht

| Macro | Functie | Gebruik |
|-------|---------|---------|
| **ImporteerTransacties** | Import CSV bestanden | Na elke bankexport |
| **ToonOnbekendeTransacties** | Vind ongecategoriseerde transacties | Na import |
| **VoegCategorieRegelsToe** | Voeg nieuwe categorieën toe | Na invullen categorieën |
| **HeranalyseerTransacties** | Her-categoriseer alles | Na aanpassen regels |
| **VerversDashboard** | Update overzichten | Voor actuele cijfers |
| **ExporteerNaarExcel** | Export verrijkte data | Voor backup/archief |
| **ExporteerNaarCSV** | Export naar CSV | Voor externe tools |

## 💡 Tips

### Eerste Keer
1. Importeer 3-6 maanden transacties in één keer
2. Categoriseer de onbekende transacties
3. Voer heranalyse uit
4. Bekijk dashboard

### Maandelijks
1. Exporteer nieuwe transacties van bank
2. Importeer CSV (kies "Toevoegen")
3. Categoriseer eventuele nieuwe patronen
4. Ververs dashboard
5. Klaar in 2 minuten!

### Categorieën
- Begin breed (Boodschappen, Vervoer, etc.)
- Verfijn later met subcategorieën
- Gebruik korte, herkenbare patronen (bijv. "AH" voor Albert Heijn)

### Performance
- Bij 10.000+ transacties: Schakel automatisch berekenen uit tijdens import
- Sluit andere Excel bestanden
- Sla regelmatig op

## 🔒 Privacy & Veiligheid

### 100% Lokaal
De VBA code bevat:
- ✅ Geen HTTP requests
- ✅ Geen API calls
- ✅ Geen cloud uploads
- ✅ Geen telemetry
- ✅ Geen externe verbindingen

**Al je financiële data blijft op jouw computer!**

### Macro Beveiliging
- Excel vraagt toestemming voor macro's → Klik "Enable Content"
- Voeg de map toe aan Trusted Locations voor automatisch enablen
- Beveilig bestand met wachtwoord indien gewenst

## 🆚 Vergelijking: Excel vs Python Versie

| Feature | Excel | Python/Streamlit |
|---------|-------|------------------|
| Installatie | Alleen Excel nodig | Python + packages |
| Interface | Excel sheets | Web browser |
| Automatisering | VBA macro's | Python scripts |
| Visualisatie | PivotTables + grafieken | Plotly interactief |
| Data manipulatie | Direct in cells | Via interface |
| Performance | Goed tot 50k rijen | Goed tot 1M+ rijen |
| Portabiliteit | .xlsm bestand | Requires Python |
| Aanpasbaarheid | VBA code | Python code |

**Kies Excel als:**
- Je Excel gewend bent
- Geen Python wilt installeren
- Direct in data wilt werken
- Minder dan 50.000 transacties hebt

**Kies Python als:**
- Grotere datasets hebt
- Modernere UI wilt
- Meer programmeerbare controle wilt
- Python al hebt/gebruikt

## ❓ Veelgestelde Vragen

### Werkt dit op Mac?
Ja! Excel voor Mac 2016+ ondersteunt VBA. Enkele dialogs zien er anders uit, maar de functionaliteit is hetzelfde.

### Kan ik beide versies gebruiken?
Absoluut! Ze kunnen zelfs hetzelfde categorie_regels.csv bestand delen.

### Gaan mijn data verloren?
Nee, Excel maakt AutoRecover bestanden. Maak wel regelmatig backups!

### Kan ik formules gebruiken ipv macro's?
Ja, voor categorisatie kun je VLOOKUP of nested IF gebruiken. Macro's zijn wel sneller bij grote datasets.

### Hoe pas ik de VBA code aan?
1. Open VBA Editor: Alt + F11
2. Zoek de module en functie
3. Wijzig code
4. Test en sla op

## 🐛 Problemen?

Zie **EXCEL_SETUP.md** sectie "Probleemoplossing" voor:
- Macro's werken niet
- Import faalt
- Dashboard toont geen data
- VBA foutmeldingen
- En meer...

## 📚 Verdere Documentatie

- **EXCEL_SETUP.md** - Complete setup handleiding (stap-voor-stap)
- VBA modules - Volledig gedocumenteerde code
- Sheet "Instructies" - Quick reference in Excel zelf

## 🙏 Hulp Nodig?

1. Lees eerst **EXCEL_SETUP.md**
2. Check sectie "Probleemoplossing"
3. Bekijk VBA code (goed gedocumenteerd)
4. Open sheet "Instructies" in de workbook

## 🎉 Aan de Slag!

1. Download de VBA modules
2. Volg **EXCEL_SETUP.md**
3. Importeer je eerste CSV
4. Geniet van inzicht in je financiën!

**Privacy gegarandeerd - 100% lokaal - Alleen jij hebt toegang tot je data!** 🔒💰

---

*Voor de Python versie, zie de hoofd-README.md in de root directory.*
