@echo off
REM ====================================================================
REM Start Lokale Banktransactie Analyzer
REM ====================================================================

echo.
echo ====================================================================
echo   LOKALE BANKTRANSACTIE ANALYZER
echo ====================================================================
echo.

REM Controleer of virtuele omgeving bestaat
if not exist "app\venv" (
    echo FOUT: Virtuele omgeving niet gevonden!
    echo.
    echo Voer eerst de installatie uit:
    echo   Dubbelklik op setup.bat
    echo.
    pause
    exit /b 1
)

echo Privacy garantie: Alle data blijft op jouw laptop!
echo.
echo De app start nu in je browser op http://localhost:8501
echo.
echo Sluit dit venster NIET - de app blijft dan draaien.
echo Druk op Ctrl+C om de app te stoppen.
echo.
echo ====================================================================
echo.

REM Ga naar app directory
cd app

REM Activeer virtuele omgeving
call venv\Scripts\activate.bat

REM Start Streamlit
streamlit run app.py

REM Als streamlit stopt
echo.
echo App is gestopt.
pause
