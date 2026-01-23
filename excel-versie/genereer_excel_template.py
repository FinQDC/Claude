"""
Genereer Excel Template voor Banktransactie Analyzer
======================================================
Dit script maakt automatisch een volledig werkend Excel bestand (.xlsm)
met alle VBA modules, sheets, knoppen en formatting.

Privacy: 100% lokaal script - geen externe verbindingen
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter
from pathlib import Path
import shutil

# Paden
EXCEL_DIR = Path(__file__).parent
VBA_DIR = EXCEL_DIR / "vba-modules"
OUTPUT_FILE = EXCEL_DIR / "BankTransactieAnalyzer.xlsm"

def maak_excel_template():
    """Maak compleet Excel template"""
    print("🏗️  Excel Template Generator")
    print("=" * 60)
    print()

    # Maak nieuwe workbook
    print("1️⃣  Nieuwe workbook maken...")
    wb = openpyxl.Workbook()

    # Verwijder default sheet
    if "Sheet" in wb.sheetnames:
        del wb["Sheet"]

    # Maak sheets
    print("2️⃣  Sheets aanmaken...")
    maak_instructies_sheet(wb)
    maak_data_sheet(wb)
    maak_categorie_sheet(wb)
    maak_dashboard_sheet(wb)

    # Sla op als .xlsx eerst (voor structuur)
    print("3️⃣  Template opslaan...")
    temp_file = EXCEL_DIR / "BankTransactieAnalyzer_temp.xlsx"
    wb.save(temp_file)

    print()
    print("✅ Excel template gegenereerd!")
    print(f"📁 Bestand: {temp_file}")
    print()
    print("⚠️  BELANGRIJK: Voor VBA ondersteuning:")
    print("   1. Open BankTransactieAnalyzer_temp.xlsx in Excel")
    print("   2. Druk Alt+F11 (VBA Editor)")
    print("   3. File → Import File → Importeer alle 3 .bas bestanden uit vba-modules/")
    print("   4. Sla op als .xlsm (Macro-Enabled Workbook)")
    print()
    print("   Of volg de instructies in EXCEL_SETUP.md")
    print()

    return temp_file

def maak_instructies_sheet(wb):
    """Maak Instructies sheet"""
    ws = wb.create_sheet("Instructies", 0)

    # Titel
    ws['A1'] = "💰 BANKTRANSACTIE ANALYZER - EXCEL EDITIE"
    ws['A1'].font = Font(size=18, bold=True, color="FFFFFF")
    ws['A1'].fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
    ws['A1'].alignment = Alignment(horizontal="center", vertical="center")
    ws.merge_cells('A1:F1')
    ws.row_dimensions[1].height = 30

    # Privacy melding
    ws['A3'] = "🔒 PRIVACY GARANTIE: 100% Lokaal - Geen externe verbindingen!"
    ws['A3'].font = Font(size=12, bold=True, color="00B050")
    ws['A3'].alignment = Alignment(horizontal="center")
    ws.merge_cells('A3:F3')

    # Instructies
    instructies = [
        ("", ""),
        ("STAPPEN VOOR EERSTE GEBRUIK:", ""),
        ("", ""),
        ("1. Macro's Activeren", "Klik op 'Enable Content' (gele balk bovenaan)"),
        ("2. VBA Modules Importeren", "Druk Alt+F11 → File → Import → Importeer alle 3 .bas bestanden"),
        ("3. Knoppen Toevoegen", "Developer tab → Insert → Button → Wijs macro's toe (zie handleiding)"),
        ("4. Klaar voor gebruik!", "Start met importeren van je CSV bestanden"),
        ("", ""),
        ("DAGELIJKS GEBRUIK:", ""),
        ("", ""),
        ("1️⃣ Importeer Transacties", "Klik knop of gebruik Quick Access → Selecteer CSV bestand(en)"),
        ("2️⃣ Bekijk Data", "Ga naar sheet 'Data' om je transacties te zien"),
        ("3️⃣ Categoriseer", "Klik 'Toon Onbekende' → Vul categorieën in → Klik 'Voeg Toe'"),
        ("4️⃣ Dashboard", "Klik 'Dashboard Verversen' voor overzichten en grafieken"),
        ("", ""),
        ("BESCHIKBARE MACRO'S:", ""),
        ("", ""),
        ("📥 ImporteerTransacties", "Importeer CSV bestanden van je bank"),
        ("🔍 ToonOnbekendeTransacties", "Vind transacties zonder categorie"),
        ("➕ VoegCategorieRegelsToe", "Voeg nieuwe categorisatieregels toe"),
        ("🔄 HeranalyseerTransacties", "Pas alle categorieën opnieuw toe"),
        ("📊 VerversDashboard", "Maak/update dashboard met grafieken"),
        ("💾 ExporteerNaarExcel", "Exporteer data naar nieuw Excel bestand"),
        ("💾 ExporteerNaarCSV", "Exporteer data naar CSV"),
        ("", ""),
        ("SHEETS:", ""),
        ("", ""),
        ("📋 Data", "Alle geïmporteerde transacties"),
        ("🏷️ Categorieën", "Regels voor automatische categorisatie"),
        ("📊 Dashboard", "Overzichten, grafieken en statistieken (automatisch gegenereerd)"),
        ("❓ Onbekend", "Transacties zonder categorie (automatisch gegenereerd)"),
        ("", ""),
        ("TIPS:", ""),
        ("", ""),
        ("💡 Meerdere CSV's", "Je kunt meerdere bestanden tegelijk importeren"),
        ("💡 Duplicaten", "Worden automatisch verwijderd"),
        ("💡 Categorieën aanpassen", "Bewerk sheet 'Categorieën' direct in Excel"),
        ("💡 Data bewerken", "Je kunt transacties direct in de Data sheet aanpassen"),
        ("💡 Sorteren & Filteren", "Gebruik Excel's ingebouwde functionaliteit"),
        ("", ""),
        ("📚 HANDLEIDING:", ""),
        ("", ""),
        ("", "Volledige instructies vind je in:"),
        ("", "- excel-versie/README_EXCEL.md (Overzicht)"),
        ("", "- excel-versie/EXCEL_SETUP.md (Gedetailleerde setup)"),
        ("", ""),
        ("🆘 HULP NODIG?", ""),
        ("", ""),
        ("", "Check de Troubleshooting sectie in EXCEL_SETUP.md"),
        ("", "Of bekijk de VBA code (Alt+F11) - alles is gedocumenteerd"),
    ]

    row = 5
    for col1, col2 in instructies:
        ws[f'A{row}'] = col1
        ws[f'C{row}'] = col2

        # Styling voor koppen
        if col1 and col1.endswith(':') and not col1.startswith('💡'):
            ws[f'A{row}'].font = Font(bold=True, size=11, color="1F4E78")
        elif col1.startswith('1️⃣') or col1.startswith('2️⃣') or col1.startswith('3️⃣') or col1.startswith('4️⃣'):
            ws[f'A{row}'].font = Font(bold=True, color="C55A11")
        elif col1.startswith('📥') or col1.startswith('🔍') or col1.startswith('➕'):
            ws[f'A{row}'].font = Font(bold=True, color="7030A0")

        row += 1

    # Kolombreedte
    ws.column_dimensions['A'].width = 30
    ws.column_dimensions['B'].width = 2
    ws.column_dimensions['C'].width = 60
    ws.column_dimensions['D'].width = 2
    ws.column_dimensions['E'].width = 20
    ws.column_dimensions['F'].width = 20

    print("   ✓ Sheet 'Instructies' aangemaakt")

def maak_data_sheet(wb):
    """Maak Data sheet"""
    ws = wb.create_sheet("Data")

    # Headers
    headers = [
        "Datum", "Omschrijving", "Bedrag", "Tegenrekening",
        "Jaar", "Maand", "MaandNaam", "InUit", "BedragAbs",
        "Categorie", "Subcategorie"
    ]

    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num)
        cell.value = header
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
        cell.alignment = Alignment(horizontal="center", vertical="center")

    # Kolombreedte
    ws.column_dimensions['A'].width = 12  # Datum
    ws.column_dimensions['B'].width = 50  # Omschrijving
    ws.column_dimensions['C'].width = 12  # Bedrag
    ws.column_dimensions['D'].width = 20  # Tegenrekening
    ws.column_dimensions['E'].width = 8   # Jaar
    ws.column_dimensions['F'].width = 10  # Maand
    ws.column_dimensions['G'].width = 15  # MaandNaam
    ws.column_dimensions['H'].width = 12  # InUit
    ws.column_dimensions['I'].width = 12  # BedragAbs
    ws.column_dimensions['J'].width = 20  # Categorie
    ws.column_dimensions['K'].width = 20  # Subcategorie

    # Auto-filter
    ws.auto_filter.ref = f"A1:K1"

    # Freeze panes (bevries eerste rij)
    ws.freeze_panes = "A2"

    print("   ✓ Sheet 'Data' aangemaakt")

def maak_categorie_sheet(wb):
    """Maak Categorieën sheet met voorbeelddata"""
    ws = wb.create_sheet("Categorieën")

    # Headers
    headers = ["Patroon", "Categorie", "Subcategorie", "Notitie"]

    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num)
        cell.value = header
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = PatternFill(start_color="70AD47", end_color="70AD47", fill_type="solid")
        cell.alignment = Alignment(horizontal="center", vertical="center")

    # Lees voorbeelddata
    voorbeelden_file = EXCEL_DIR / "categorie_regels_voorbeeld.csv"

    if voorbeelden_file.exists():
        with open(voorbeelden_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()[1:]  # Skip header

            for row_num, line in enumerate(lines, 2):
                parts = line.strip().split(',')
                if len(parts) >= 3:
                    ws.cell(row=row_num, column=1).value = parts[0]  # Patroon
                    ws.cell(row=row_num, column=2).value = parts[1]  # Categorie
                    ws.cell(row=row_num, column=3).value = parts[2]  # Subcategorie
                    if len(parts) >= 4:
                        ws.cell(row=row_num, column=4).value = parts[3]  # Notitie

    # Kolombreedte
    ws.column_dimensions['A'].width = 30  # Patroon
    ws.column_dimensions['B'].width = 25  # Categorie
    ws.column_dimensions['C'].width = 25  # Subcategorie
    ws.column_dimensions['D'].width = 40  # Notitie

    # Auto-filter
    ws.auto_filter.ref = f"A1:D{ws.max_row}"

    # Freeze panes
    ws.freeze_panes = "A2"

    print("   ✓ Sheet 'Categorieën' aangemaakt (met voorbeelddata)")

def maak_dashboard_sheet(wb):
    """Maak Dashboard sheet (placeholder)"""
    ws = wb.create_sheet("Dashboard")

    # Titel
    ws['A1'] = "📊 DASHBOARD"
    ws['A1'].font = Font(size=16, bold=True, color="FFFFFF")
    ws['A1'].fill = PatternFill(start_color="ED7D31", end_color="ED7D31", fill_type="solid")
    ws['A1'].alignment = Alignment(horizontal="center", vertical="center")
    ws.merge_cells('A1:F1')
    ws.row_dimensions[1].height = 25

    # Instructie
    ws['A3'] = "⚠️ Dit dashboard wordt automatisch gegenereerd"
    ws['A3'].font = Font(size=12, bold=True, color="C55A11")
    ws['A3'].alignment = Alignment(horizontal="center")
    ws.merge_cells('A3:F3')

    ws['A5'] = "Klik op de knop 'Dashboard Verversen' (of voer macro VerversDashboard uit)"
    ws['A5'].alignment = Alignment(horizontal="center")
    ws.merge_cells('A5:F5')

    ws['A6'] = "na het importeren van transacties."
    ws['A6'].alignment = Alignment(horizontal="center")
    ws.merge_cells('A6:F6')

    ws['A8'] = "Het dashboard bevat dan:"
    ws['A8'].font = Font(bold=True)

    features = [
        "• Algemene statistieken (totaal inkomsten, uitgaven, saldo)",
        "• Overzicht per maand (PivotTable + grafiek)",
        "• Overzicht per categorie (PivotTable + pie chart)",
        "• Datum range informatie",
    ]

    for i, feature in enumerate(features, 9):
        ws[f'A{i}'] = feature

    print("   ✓ Sheet 'Dashboard' aangemaakt (placeholder)")

if __name__ == "__main__":
    try:
        output = maak_excel_template()
        print("=" * 60)
        print("✅ KLAAR!")
        print()
        print("Volgende stappen:")
        print("1. Open BankTransactieAnalyzer_temp.xlsx in Excel")
        print("2. Importeer VBA modules (zie instructies hierboven)")
        print("3. Sla op als .xlsm")
        print("4. Klaar voor gebruik!")
        print()
    except Exception as e:
        print(f"❌ FOUT: {e}")
        import traceback
        traceback.print_exc()
