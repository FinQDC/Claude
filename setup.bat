@echo off
REM ====================================================================
REM Automatische installatie van Lokale Banktransactie Analyzer
REM Voor Windows
REM ====================================================================

echo.
echo ====================================================================
echo   LOKALE BANKTRANSACTIE ANALYZER - AUTOMATISCHE INSTALLATIE
echo ====================================================================
echo.
echo Dit script installeert automatisch:
echo   - Python 3.11 (als nog niet aanwezig)
echo   - Virtuele omgeving
echo   - Alle benodigde packages
echo.
echo Privacy garantie: Geen externe verbindingen na installatie!
echo.
echo ====================================================================
echo.

REM Controleer of Python al geinstalleerd is
echo [1/5] Python versie controleren...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo     Python is al geinstalleerd:
    python --version
    goto :check_version
) else (
    echo     Python is niet gevonden.
    goto :install_python
)

:check_version
REM Controleer of versie 3.8 of hoger is
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo     Gevonden versie: %PYTHON_VERSION%

REM Simpele versiecheck (3.8+)
for /f "tokens=1,2 delims=." %%a in ("%PYTHON_VERSION%") do (
    set MAJOR=%%a
    set MINOR=%%b
)

if %MAJOR% LSS 3 (
    echo     WAARSCHUWING: Python versie te oud (vereist: 3.8+^)
    goto :install_python
)
if %MAJOR% EQU 3 if %MINOR% LSS 8 (
    echo     WAARSCHUWING: Python versie te oud (vereist: 3.8+^)
    goto :install_python
)

echo     Python versie is geschikt!
goto :create_venv

:install_python
echo.
echo [PYTHON INSTALLATIE NODIG]
echo.
echo Python is niet geinstalleerd of te oud.
echo.
echo OPTIE 1 - Automatische installatie (Windows 10/11 met winget):
echo   Druk op 'A' om Python automatisch te installeren via winget
echo.
echo OPTIE 2 - Handmatige installatie:
echo   Druk op 'H' om de Python downloadpagina te openen
echo   Download dan Python 3.11 en vink "Add to PATH" aan!
echo.
echo OPTIE 3 - Annuleren:
echo   Druk op 'Q' om te stoppen
echo.

choice /C AHQ /N /M "Kies optie (A/H/Q): "
set CHOICE=%errorlevel%

if %CHOICE% EQU 1 goto :auto_install
if %CHOICE% EQU 2 goto :manual_install
if %CHOICE% EQU 3 goto :end

:auto_install
echo.
echo Installeren van Python via winget...
echo Dit kan enkele minuten duren...
echo.

winget install Python.Python.3.11 --silent --accept-package-agreements --accept-source-agreements

if %errorlevel% neq 0 (
    echo.
    echo FOUT: Automatische installatie mislukt.
    echo Probeer handmatige installatie (Optie H) of installeer Chocolatey.
    echo.
    pause
    goto :end
)

echo.
echo Python is geinstalleerd! Je moet deze terminal SLUITEN en een NIEUWE openen.
echo Voer dan setup.bat opnieuw uit.
echo.
pause
goto :end

:manual_install
echo.
echo Openen van Python downloadpagina...
start https://www.python.org/downloads/
echo.
echo BELANGRIJK NA DOWNLOAD:
echo   1. Dubbelklik op het gedownloade bestand
echo   2. Vink "Add Python to PATH" AAN (onderaan het venster)
echo   3. Klik op "Install Now"
echo   4. Wacht tot installatie klaar is
echo   5. Sluit deze terminal en open een NIEUWE terminal
echo   6. Voer setup.bat opnieuw uit
echo.
pause
goto :end

:create_venv
echo.
echo [2/5] Controleren virtuele omgeving...
if exist "app\venv" (
    echo     Virtuele omgeving bestaat al.
) else (
    echo     Aanmaken virtuele omgeving...
    cd app
    python -m venv venv
    if %errorlevel% neq 0 (
        echo     FOUT: Kan virtuele omgeving niet aanmaken
        pause
        goto :end
    )
    cd ..
    echo     Virtuele omgeving aangemaakt!
)

:install_packages
echo.
echo [3/5] Installeren Python packages...
echo     Dit kan enkele minuten duren bij eerste keer...
echo.

cd app
call venv\Scripts\activate.bat

python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

if %errorlevel% neq 0 (
    echo.
    echo FOUT: Kan packages niet installeren
    echo Probeer handmatig: cd app, venv\Scripts\activate, pip install -r requirements.txt
    pause
    goto :end
)

cd ..

echo     Alle packages geinstalleerd!

:verify_install
echo.
echo [4/5] Installatie verifiëren...

cd app
call venv\Scripts\activate.bat

python -c "import streamlit, pandas, plotly" 2>nul
if %errorlevel% neq 0 (
    echo     WAARSCHUWING: Sommige packages ontbreken
    echo     Probeer: pip install -r requirements.txt
) else (
    echo     Alle packages werken correct!
)

cd ..

:success
echo.
echo [5/5] Installatie voltooid!
echo.
echo ====================================================================
echo   INSTALLATIE SUCCESVOL!
echo ====================================================================
echo.
echo De applicatie is klaar voor gebruik.
echo.
echo Om de app te starten:
echo   - Dubbelklik op 'start.bat'
echo   - Of voer uit: cd app ^&^& venv\Scripts\activate ^&^& streamlit run app.py
echo.
echo ====================================================================
echo.

choice /C YN /N /M "Wil je de app nu starten? (Y/N): "
if %errorlevel% EQU 1 (
    echo.
    echo App wordt gestart...
    call start.bat
) else (
    echo.
    echo OK! Start de app later met start.bat
)

goto :end

:end
echo.
pause
