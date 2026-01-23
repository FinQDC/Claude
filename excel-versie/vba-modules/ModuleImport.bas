Attribute VB_Name = "ModuleImport"
' ============================================================================
' MODULE: Import Transacties
' ============================================================================
' Importeert CSV bestanden en verwerkt transacties
' Volledig lokaal - geen externe verbindingen
' ============================================================================

Option Explicit

' Hoofdfunctie: Importeer CSV bestand
Sub ImporteerTransacties()
    Dim fd As FileDialog
    Dim strBestand As String
    Dim wsData As Worksheet
    Dim wsCategorie As Worksheet
    Dim laatsteRij As Long
    Dim nieuweData As Long
    Dim antwoord As VbMsgBoxResult

    ' Check of sheets bestaan
    On Error Resume Next
    Set wsData = ThisWorkbook.Worksheets("Data")
    Set wsCategorie = ThisWorkbook.Worksheets("Categorieën")
    On Error GoTo 0

    If wsData Is Nothing Or wsCategorie Is Nothing Then
        MsgBox "FOUT: Sheets 'Data' en/of 'Categorieën' ontbreken!" & vbCrLf & _
               "Maak eerst de benodigde sheets aan.", vbCritical, "Banktransactie Analyzer"
        Exit Sub
    End If

    ' Vraag of bestaande data gewist moet worden
    If wsData.Cells(2, 1).Value <> "" Then
        antwoord = MsgBox("Wil je de bestaande transacties behouden?" & vbCrLf & vbCrLf & _
                         "JA = Nieuwe data toevoegen (duplicaten worden verwijderd)" & vbCrLf & _
                         "NEE = Alles wissen en opnieuw beginnen", _
                         vbYesNoCancel + vbQuestion, "Banktransactie Analyzer")

        If antwoord = vbCancel Then Exit Sub

        If antwoord = vbNo Then
            ' Wis alles behalve headers
            wsData.Range("A2:Z100000").ClearContents
        End If
    End If

    ' File Dialog voor CSV selectie
    Set fd = Application.FileDialog(msoFileDialogFilePicker)

    With fd
        .Title = "Selecteer CSV bestand(en) met banktransacties"
        .Filters.Clear
        .Filters.Add "CSV Bestanden", "*.csv"
        .Filters.Add "Tekst Bestanden", "*.txt"
        .AllowMultiSelect = True

        If .Show = -1 Then
            Application.ScreenUpdating = False
            Application.Calculation = xlCalculationManual

            Dim i As Integer
            Dim totaalNieuw As Long
            totaalNieuw = 0

            ' Loop door geselecteerde bestanden
            For i = 1 To .SelectedItems.Count
                strBestand = .SelectedItems(i)
                nieuweData = ImporteerCSV(strBestand, wsData)
                totaalNieuw = totaalNieuw + nieuweData
            Next i

            ' Verwijder duplicaten
            Call VerwijderDuplicaten(wsData)

            ' Voeg berekende kolommen toe
            Call VoegBerekendekolommenToe(wsData)

            ' Categoriseer transacties
            Call CategoriseerAlleTransacties(wsData, wsCategorie)

            Application.Calculation = xlCalculationAutomatic
            Application.ScreenUpdating = True

            MsgBox "Klaar!" & vbCrLf & vbCrLf & _
                   totaalNieuw & " transacties geïmporteerd uit " & .SelectedItems.Count & " bestand(en)." & vbCrLf & _
                   "Totaal: " & wsData.Cells(Rows.Count, 1).End(xlUp).Row - 1 & " transacties.", _
                   vbInformation, "Import Voltooid"
        End If
    End With
End Sub

' Importeer één CSV bestand
Private Function ImporteerCSV(strPad As String, wsData As Worksheet) As Long
    Dim qt As QueryTable
    Dim laatsteRij As Long
    Dim startRij As Long
    Dim aantalNieuw As Long

    ' Bepaal waar nieuwe data moet komen
    laatsteRij = wsData.Cells(Rows.Count, 1).End(xlUp).Row
    If laatsteRij = 1 And wsData.Cells(1, 1).Value = "Datum" Then
        startRij = 2
    Else
        startRij = laatsteRij + 1
    End If

    ' Importeer CSV met QueryTable
    Set qt = wsData.QueryTables.Add( _
        Connection:="TEXT;" & strPad, _
        Destination:=wsData.Cells(startRij, 1))

    With qt
        .TextFileParseType = xlDelimited
        .TextFileCommaDelimiter = True
        .TextFileSemicolonDelimiter = True
        .TextFileTabDelimiter = False
        .TextFileDecimalSeparator = ","
        .TextFileThousandsSeparator = "."
        .RefreshStyle = xlInsertEntireRows
        .FieldNames = False ' Geen headers uit CSV halen
        .Refresh BackgroundQuery:=False

        aantalNieuw = .ResultRange.Rows.Count
        .Delete
    End With

    ImporteerCSV = aantalNieuw
End Function

' Verwijder dubbele transacties
Private Sub VerwijderDuplicaten(wsData As Worksheet)
    Dim laatsteRij As Long
    Dim dataRange As Range

    laatsteRij = wsData.Cells(Rows.Count, 1).End(xlUp).Row

    If laatsteRij > 2 Then
        Set dataRange = wsData.Range("A1:D" & laatsteRij)

        ' Verwijder duplicaten op basis van Datum, Bedrag en Omschrijving
        dataRange.RemoveDuplicates Columns:=Array(1, 2, 3), Header:=xlYes
    End If
End Sub

' Voeg berekende kolommen toe
Private Sub VoegBerekendekolommenToe(wsData As Worksheet)
    Dim laatsteRij As Long
    Dim i As Long
    Dim datumWaarde As Date
    Dim bedragWaarde As Double

    laatsteRij = wsData.Cells(Rows.Count, 1).End(xlUp).Row

    ' Kolom headers instellen (als nog niet aanwezig)
    If wsData.Cells(1, 5).Value = "" Then
        wsData.Cells(1, 5).Value = "Jaar"
        wsData.Cells(1, 6).Value = "Maand"
        wsData.Cells(1, 7).Value = "MaandNaam"
        wsData.Cells(1, 8).Value = "InUit"
        wsData.Cells(1, 9).Value = "BedragAbs"
        wsData.Cells(1, 10).Value = "Categorie"
        wsData.Cells(1, 11).Value = "Subcategorie"
    End If

    ' Loop door alle rijen
    For i = 2 To laatsteRij
        ' Converteer datum
        If IsDate(wsData.Cells(i, 1).Value) Then
            datumWaarde = CDate(wsData.Cells(i, 1).Value)

            ' Jaar
            wsData.Cells(i, 5).Value = Year(datumWaarde)

            ' Maand (YYYY-MM)
            wsData.Cells(i, 6).Value = Format(datumWaarde, "YYYY-MM")

            ' Maand naam
            wsData.Cells(i, 7).Value = Format(datumWaarde, "MMMM YYYY")
        End If

        ' Bedrag verwerking
        bedragWaarde = wsData.Cells(i, 3).Value

        ' In/Uit
        If bedragWaarde > 0 Then
            wsData.Cells(i, 8).Value = "Inkomsten"
        Else
            wsData.Cells(i, 8).Value = "Uitgaven"
        End If

        ' Absoluut bedrag
        wsData.Cells(i, 9).Value = Abs(bedragWaarde)

        ' Initiële categorie (wordt later overschreven)
        If wsData.Cells(i, 10).Value = "" Then
            wsData.Cells(i, 10).Value = "Onbekend"
        End If
    Next i
End Sub

' Categoriseer alle transacties
Private Sub CategoriseerAlleTransacties(wsData As Worksheet, wsCategorie As Worksheet)
    Dim laatsteRijData As Long
    Dim laatsteRijCat As Long
    Dim i As Long, j As Long
    Dim omschrijving As String
    Dim patroon As String
    Dim categorie As String
    Dim subcategorie As String
    Dim gevonden As Boolean

    laatsteRijData = wsData.Cells(Rows.Count, 1).End(xlUp).Row
    laatsteRijCat = wsCategorie.Cells(Rows.Count, 1).End(xlUp).Row

    ' Loop door alle transacties
    For i = 2 To laatsteRijData
        omschrijving = UCase(Trim(wsData.Cells(i, 2).Value))
        gevonden = False

        ' Probeer elke categoriseregel
        For j = 2 To laatsteRijCat
            patroon = UCase(Trim(wsCategorie.Cells(j, 1).Value))

            If patroon <> "" Then
                ' Check of patroon in omschrijving voorkomt
                If InStr(1, omschrijving, patroon) > 0 Then
                    categorie = wsCategorie.Cells(j, 2).Value
                    subcategorie = wsCategorie.Cells(j, 3).Value

                    wsData.Cells(i, 10).Value = categorie
                    wsData.Cells(i, 11).Value = subcategorie

                    gevonden = True
                    Exit For
                End If
            End If
        Next j

        ' Als geen match, zet op Onbekend
        If Not gevonden Then
            wsData.Cells(i, 10).Value = "Onbekend"
            wsData.Cells(i, 11).Value = ""
        End If
    Next i
End Sub
