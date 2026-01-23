Attribute VB_Name = "ModuleDashboard"
' ============================================================================
' MODULE: Dashboard en Rapportages
' ============================================================================
' Genereert overzichten, grafieken en exports
' ============================================================================

Option Explicit

' Ververs Dashboard
Sub VerversDashboard()
    Dim wsDash As Worksheet
    Dim wsData As Worksheet
    Dim ptCache As PivotCache
    Dim pt As PivotTable

    Set wsData = ThisWorkbook.Worksheets("Data")

    ' Maak of clear Dashboard sheet
    On Error Resume Next
    Set wsDash = ThisWorkbook.Worksheets("Dashboard")
    On Error GoTo 0

    If wsDash Is Nothing Then
        Set wsDash = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
        wsDash.Name = "Dashboard"
    End If

    Application.ScreenUpdating = False

    ' Clear bestaande content
    wsDash.Cells.Clear

    ' Titel
    wsDash.Cells(1, 1).Value = "BANKTRANSACTIE DASHBOARD"
    wsDash.Cells(1, 1).Font.Size = 16
    wsDash.Cells(1, 1).Font.Bold = True

    ' Statistieken
    Call MaakStatistieken(wsDash, wsData)

    ' Maak PivotTables
    Call MaakMaandOverzicht(wsDash, wsData)
    Call MaakCategorieOverzicht(wsDash, wsData)

    Application.ScreenUpdating = True

    wsDash.Activate

    MsgBox "Dashboard ververst!", vbInformation, "Dashboard"
End Sub

' Maak algemene statistieken
Private Sub MaakStatistieken(wsDash As Worksheet, wsData As Worksheet)
    Dim laatsteRij As Long
    Dim totaalInkomsten As Double
    Dim totaalUitgaven As Double
    Dim saldo As Double
    Dim aantalTransacties As Long
    Dim i As Long

    laatsteRij = wsData.Cells(Rows.Count, 1).End(xlUp).Row
    aantalTransacties = laatsteRij - 1

    ' Bereken totalen
    For i = 2 To laatsteRij
        If wsData.Cells(i, 8).Value = "Inkomsten" Then
            totaalInkomsten = totaalInkomsten + wsData.Cells(i, 9).Value
        Else
            totaalUitgaven = totaalUitgaven + wsData.Cells(i, 9).Value
        End If
    Next i

    saldo = totaalInkomsten - totaalUitgaven

    ' Schrijf statistieken
    wsDash.Cells(3, 1).Value = "OVERZICHT"
    wsDash.Cells(3, 1).Font.Bold = True

    wsDash.Cells(4, 1).Value = "Aantal transacties:"
    wsDash.Cells(4, 2).Value = aantalTransacties

    wsDash.Cells(5, 1).Value = "Totaal inkomsten:"
    wsDash.Cells(5, 2).Value = totaalInkomsten
    wsDash.Cells(5, 2).NumberFormat = "€ #,##0.00"
    wsDash.Cells(5, 2).Font.Color = RGB(0, 128, 0)

    wsDash.Cells(6, 1).Value = "Totaal uitgaven:"
    wsDash.Cells(6, 2).Value = totaalUitgaven
    wsDash.Cells(6, 2).NumberFormat = "€ #,##0.00"
    wsDash.Cells(6, 2).Font.Color = RGB(255, 0, 0)

    wsDash.Cells(7, 1).Value = "Saldo:"
    wsDash.Cells(7, 2).Value = saldo
    wsDash.Cells(7, 2).NumberFormat = "€ #,##0.00"
    wsDash.Cells(7, 2).Font.Bold = True

    If saldo >= 0 Then
        wsDash.Cells(7, 2).Font.Color = RGB(0, 128, 0)
    Else
        wsDash.Cells(7, 2).Font.Color = RGB(255, 0, 0)
    End If

    ' Datum range
    Dim minDatum As Date
    Dim maxDatum As Date

    minDatum = Application.WorksheetFunction.Min(wsData.Range("A2:A" & laatsteRij))
    maxDatum = Application.WorksheetFunction.Max(wsData.Range("A2:A" & laatsteRij))

    wsDash.Cells(9, 1).Value = "Periode:"
    wsDash.Cells(9, 2).Value = Format(minDatum, "DD-MM-YYYY") & " t/m " & Format(maxDatum, "DD-MM-YYYY")
End Sub

' Maak maandoverzicht PivotTable
Private Sub MaakMaandOverzicht(wsDash As Worksheet, wsData As Worksheet)
    Dim ptCache As PivotCache
    Dim pt As PivotTable
    Dim laatsteRij As Long

    laatsteRij = wsData.Cells(Rows.Count, 1).End(xlUp).Row

    ' Maak PivotCache
    Set ptCache = ThisWorkbook.PivotCaches.Create( _
        SourceType:=xlDatabase, _
        SourceData:=wsData.Range("A1:K" & laatsteRij))

    ' Maak PivotTable
    Set pt = ptCache.CreatePivotTable( _
        TableDestination:=wsDash.Cells(12, 1), _
        TableName:="PivotMaand")

    ' Configureer PivotTable
    With pt
        .PivotFields("Maand").Orientation = xlRowField
        .PivotFields("InUit").Orientation = xlColumnField

        .AddDataField .PivotFields("BedragAbs"), "Totaal", xlSum
        .DataBodyRange.NumberFormat = "€ #,##0.00"

        .ColumnGrand = True
        .RowGrand = True
    End With

    ' Voeg grafiek toe
    Dim cht As Chart
    Set cht = wsDash.ChartObjects.Add(Left:=300, Top:=wsDash.Cells(12, 1).Top, Width:=400, Height:=250).Chart

    With cht
        .SetSourceData Source:=pt.TableRange2
        .ChartType = xlColumnClustered
        .HasTitle = True
        .ChartTitle.Text = "Inkomsten vs Uitgaven per Maand"
    End With
End Sub

' Maak categorie overzicht
Private Sub MaakCategorieOverzicht(wsDash As Worksheet, wsData As Worksheet)
    Dim ptCache As PivotCache
    Dim pt As PivotTable
    Dim laatsteRij As Long

    laatsteRij = wsData.Cells(Rows.Count, 1).End(xlUp).Row

    ' Maak PivotCache
    Set ptCache = ThisWorkbook.PivotCaches.Create( _
        SourceType:=xlDatabase, _
        SourceData:=wsData.Range("A1:K" & laatsteRij))

    ' Maak PivotTable voor categorieën (alleen uitgaven)
    Set pt = ptCache.CreatePivotTable( _
        TableDestination:=wsDash.Cells(30, 1), _
        TableName:="PivotCategorie")

    With pt
        .PivotFields("Categorie").Orientation = xlRowField
        .PivotFields("InUit").Orientation = xlPageField
        .PivotFields("InUit").CurrentPage = "Uitgaven"

        .AddDataField .PivotFields("BedragAbs"), "Totaal Uitgaven", xlSum
        .DataBodyRange.NumberFormat = "€ #,##0.00"

        .RowGrand = True
    End With

    ' Voeg Pie Chart toe
    Dim cht As Chart
    Set cht = wsDash.ChartObjects.Add(Left:=300, Top:=wsDash.Cells(30, 1).Top, Width:=400, Height:=300).Chart

    With cht
        .SetSourceData Source:=pt.TableRange2
        .ChartType = xlPie
        .HasTitle = True
        .ChartTitle.Text = "Uitgaven per Categorie"
        .ApplyDataLabels xlDataLabelsShowPercent
    End With
End Sub

' Exporteer naar Excel
Sub ExporteerNaarExcel()
    Dim wsData As Worksheet
    Dim wbNieuw As Workbook
    Dim strPad As String

    Set wsData = ThisWorkbook.Worksheets("Data")

    ' Vraag waar op te slaan
    strPad = Application.GetSaveAsFilename( _
        InitialFileName:="transacties_export_" & Format(Now, "YYYYMMDD_HHMMSS") & ".xlsx", _
        FileFilter:="Excel Bestanden (*.xlsx), *.xlsx", _
        Title:="Exporteer Transacties")

    If strPad = "False" Then Exit Sub

    Application.ScreenUpdating = False

    ' Maak nieuwe workbook
    Set wbNieuw = Workbooks.Add

    ' Kopieer data
    wsData.UsedRange.Copy wbNieuw.Worksheets(1).Range("A1")

    ' Opslaan
    wbNieuw.SaveAs Filename:=strPad, FileFormat:=xlOpenXMLWorkbook
    wbNieuw.Close SaveChanges:=False

    Application.ScreenUpdating = True

    MsgBox "Data geëxporteerd naar:" & vbCrLf & strPad, vbInformation, "Export Voltooid"
End Sub

' Exporteer naar CSV
Sub ExporteerNaarCSV()
    Dim wsData As Worksheet
    Dim strPad As String
    Dim fso As Object
    Dim txtStream As Object
    Dim laatsteRij As Long
    Dim laatsteKolom As Long
    Dim i As Long, j As Long

    Set wsData = ThisWorkbook.Worksheets("Data")

    ' Vraag waar op te slaan
    strPad = Application.GetSaveAsFilename( _
        InitialFileName:="transacties_export_" & Format(Now, "YYYYMMDD_HHMMSS") & ".csv", _
        FileFilter:="CSV Bestanden (*.csv), *.csv", _
        Title:="Exporteer naar CSV")

    If strPad = "False" Then Exit Sub

    laatsteRij = wsData.Cells(Rows.Count, 1).End(xlUp).Row
    laatsteKolom = wsData.Cells(1, Columns.Count).End(xlToLeft).Column

    ' Schrijf CSV
    Set fso = CreateObject("Scripting.FileSystemObject")
    Set txtStream = fso.CreateTextFile(strPad, True, False)

    ' Schrijf alle rijen
    For i = 1 To laatsteRij
        Dim regel As String
        regel = ""

        For j = 1 To laatsteKolom
            If j > 1 Then regel = regel & ","
            regel = regel & wsData.Cells(i, j).Value
        Next j

        txtStream.WriteLine regel
    Next i

    txtStream.Close

    MsgBox "Data geëxporteerd naar:" & vbCrLf & strPad, vbInformation, "Export Voltooid"
End Sub
