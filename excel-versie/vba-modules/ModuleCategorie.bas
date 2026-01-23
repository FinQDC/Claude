Attribute VB_Name = "ModuleCategorie"
' ============================================================================
' MODULE: Categoriebeheer
' ============================================================================
' Beheert categorisatieregels en onbekende transacties
' ============================================================================

Option Explicit

' Toon onbekende transacties
Sub ToonOnbekendeTransacties()
    Dim wsData As Worksheet
    Dim wsOnbekend As Worksheet
    Dim laatsteRij As Long
    Dim i As Long
    Dim tellerOnbekend As Long

    Set wsData = ThisWorkbook.Worksheets("Data")

    ' Maak of clear Onbekend sheet
    On Error Resume Next
    Set wsOnbekend = ThisWorkbook.Worksheets("Onbekend")
    On Error GoTo 0

    If wsOnbekend Is Nothing Then
        Set wsOnbekend = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
        wsOnbekend.Name = "Onbekend"
    Else
        wsOnbekend.Cells.Clear
    End If

    ' Headers
    wsOnbekend.Cells(1, 1).Value = "Omschrijving"
    wsOnbekend.Cells(1, 2).Value = "Aantal"
    wsOnbekend.Cells(1, 3).Value = "Totaal Bedrag"
    wsOnbekend.Cells(1, 4).Value = "Voorgestelde Categorie"

    ' Maak headers vet
    wsOnbekend.Range("A1:D1").Font.Bold = True
    wsOnbekend.Range("A1:D1").Interior.Color = RGB(200, 200, 200)

    ' Vind onbekende transacties
    laatsteRij = wsData.Cells(Rows.Count, 1).End(xlUp).Row
    tellerOnbekend = 2

    Dim dictOnbekend As Object
    Set dictOnbekend = CreateObject("Scripting.Dictionary")

    ' Verzamel unieke onbekende omschrijvingen
    For i = 2 To laatsteRij
        If wsData.Cells(i, 10).Value = "Onbekend" Then
            Dim omschr As String
            Dim bedrag As Double

            omschr = Trim(wsData.Cells(i, 2).Value)
            bedrag = wsData.Cells(i, 9).Value

            If Not dictOnbekend.Exists(omschr) Then
                dictOnbekend.Add omschr, Array(1, bedrag)
            Else
                Dim arr As Variant
                arr = dictOnbekend(omschr)
                arr(0) = arr(0) + 1
                arr(1) = arr(1) + bedrag
                dictOnbekend(omschr) = arr
            End If
        End If
    Next i

    ' Schrijf naar Onbekend sheet
    Dim key As Variant
    For Each key In dictOnbekend.Keys
        wsOnbekend.Cells(tellerOnbekend, 1).Value = key
        wsOnbekend.Cells(tellerOnbekend, 2).Value = dictOnbekend(key)(0)
        wsOnbekend.Cells(tellerOnbekend, 3).Value = dictOnbekend(key)(1)

        ' Voorgestelde categorie (kan handmatig ingevuld worden)
        wsOnbekend.Cells(tellerOnbekend, 4).Value = ""

        tellerOnbekend = tellerOnbekend + 1
    Next key

    ' Sorteer op totaal bedrag
    If tellerOnbekend > 2 Then
        wsOnbekend.Range("A1:D" & tellerOnbekend - 1).Sort _
            Key1:=wsOnbekend.Range("C1"), _
            Order1:=xlDescending, _
            Header:=xlYes
    End If

    ' Formatteren
    wsOnbekend.Columns("A:A").ColumnWidth = 50
    wsOnbekend.Columns("B:B").ColumnWidth = 10
    wsOnbekend.Columns("C:C").ColumnWidth = 15
    wsOnbekend.Columns("D:D").ColumnWidth = 20
    wsOnbekend.Range("C:C").NumberFormat = "€ #,##0.00"

    ' Activeer sheet
    wsOnbekend.Activate

    MsgBox "Gevonden: " & dictOnbekend.Count & " unieke onbekende omschrijvingen" & vbCrLf & vbCrLf & _
           "Vul kolom D in met categorieën en gebruik 'Voeg Regels Toe' om ze op te slaan.", _
           vbInformation, "Onbekende Transacties"
End Sub

' Voeg categorieregels toe vanuit Onbekend sheet
Sub VoegCategorieRegelsToe()
    Dim wsOnbekend As Worksheet
    Dim wsCategorie As Worksheet
    Dim laatsteRijOnbekend As Long
    Dim laatsteRijCat As Long
    Dim i As Long
    Dim toegevoegd As Long

    On Error Resume Next
    Set wsOnbekend = ThisWorkbook.Worksheets("Onbekend")
    Set wsCategorie = ThisWorkbook.Worksheets("Categorieën")
    On Error GoTo 0

    If wsOnbekend Is Nothing Then
        MsgBox "Sheet 'Onbekend' niet gevonden. Voer eerst 'Toon Onbekende Transacties' uit.", vbExclamation
        Exit Sub
    End If

    If wsCategorie Is Nothing Then
        MsgBox "Sheet 'Categorieën' niet gevonden!", vbCritical
        Exit Sub
    End If

    laatsteRijOnbekend = wsOnbekend.Cells(Rows.Count, 1).End(xlUp).Row
    laatsteRijCat = wsCategorie.Cells(Rows.Count, 1).End(xlUp).Row

    toegevoegd = 0

    ' Loop door Onbekend sheet
    For i = 2 To laatsteRijOnbekend
        Dim patroon As String
        Dim categorie As String

        patroon = Trim(wsOnbekend.Cells(i, 1).Value)
        categorie = Trim(wsOnbekend.Cells(i, 4).Value)

        ' Alleen toevoegen als categorie ingevuld is
        If patroon <> "" And categorie <> "" And categorie <> "Onbekend" Then
            ' Check of patroon al bestaat
            Dim bestaat As Boolean
            Dim j As Long
            bestaat = False

            For j = 2 To laatsteRijCat
                If UCase(Trim(wsCategorie.Cells(j, 1).Value)) = UCase(patroon) Then
                    bestaat = True
                    Exit For
                End If
            Next j

            ' Voeg toe als nog niet bestaat
            If Not bestaat Then
                wsCategorie.Cells(laatsteRijCat + 1, 1).Value = patroon
                wsCategorie.Cells(laatsteRijCat + 1, 2).Value = categorie
                wsCategorie.Cells(laatsteRijCat + 1, 3).Value = "" ' Subcategorie
                wsCategorie.Cells(laatsteRijCat + 1, 4).Value = "Toegevoegd " & Format(Now, "DD-MM-YYYY")

                laatsteRijCat = laatsteRijCat + 1
                toegevoegd = toegevoegd + 1
            End If
        End If
    Next i

    If toegevoegd > 0 Then
        MsgBox toegevoegd & " nieuwe categorieregels toegevoegd!" & vbCrLf & vbCrLf & _
               "Gebruik 'Heranalyse Transacties' om de categorieën toe te passen.", _
               vbInformation, "Categorieën Toegevoegd"
    Else
        MsgBox "Geen nieuwe regels toegevoegd." & vbCrLf & _
               "Vul kolom D in met categorieën.", vbInformation
    End If
End Sub

' Heranalyseer alle transacties (pas categorieën opnieuw toe)
Sub HeranalyseerTransacties()
    Dim wsData As Worksheet
    Dim wsCategorie As Worksheet

    Set wsData = ThisWorkbook.Worksheets("Data")
    Set wsCategorie = ThisWorkbook.Worksheets("Categorieën")

    Application.ScreenUpdating = False

    ' Reset alle categorieën naar Onbekend
    Dim laatsteRij As Long
    laatsteRij = wsData.Cells(Rows.Count, 1).End(xlUp).Row

    Dim i As Long
    For i = 2 To laatsteRij
        wsData.Cells(i, 10).Value = "Onbekend"
        wsData.Cells(i, 11).Value = ""
    Next i

    ' Heranalyseer
    Call ModuleImport.CategoriseerAlleTransacties(wsData, wsCategorie)

    Application.ScreenUpdating = True

    MsgBox "Alle transacties opnieuw gecategoriseerd!", vbInformation, "Heranalyse Voltooid"
End Sub

' Exporteer categorieregels naar CSV
Sub ExporteerCategorieregels()
    Dim wsCategorie As Worksheet
    Dim strPad As String
    Dim fso As Object
    Dim txtStream As Object
    Dim laatsteRij As Long
    Dim i As Long

    Set wsCategorie = ThisWorkbook.Worksheets("Categorieën")
    laatsteRij = wsCategorie.Cells(Rows.Count, 1).End(xlUp).Row

    ' Vraag waar op te slaan
    strPad = Application.GetSaveAsFilename( _
        InitialFileName:="categorie_regels.csv", _
        FileFilter:="CSV Bestanden (*.csv), *.csv", _
        Title:="Exporteer Categorieregels")

    If strPad = "False" Then Exit Sub

    ' Schrijf CSV
    Set fso = CreateObject("Scripting.FileSystemObject")
    Set txtStream = fso.CreateTextFile(strPad, True, False)

    ' Headers
    txtStream.WriteLine "Patroon,Categorie,Subcategorie,Notitie"

    ' Data
    For i = 2 To laatsteRij
        txtStream.WriteLine _
            wsCategorie.Cells(i, 1).Value & "," & _
            wsCategorie.Cells(i, 2).Value & "," & _
            wsCategorie.Cells(i, 3).Value & "," & _
            wsCategorie.Cells(i, 4).Value
    Next i

    txtStream.Close

    MsgBox "Categorieregels geëxporteerd naar:" & vbCrLf & strPad, vbInformation
End Sub
