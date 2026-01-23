#!/bin/bash

# ====================================================================
# Start Lokale Banktransactie Analyzer
# ====================================================================

# Kleuren
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "===================================================================="
echo "  LOKALE BANKTRANSACTIE ANALYZER"
echo "===================================================================="
echo ""

# Controleer of virtuele omgeving bestaat
if [ ! -d "app/venv" ]; then
    echo -e "${RED}FOUT: Virtuele omgeving niet gevonden!${NC}"
    echo ""
    echo "Voer eerst de installatie uit:"
    echo "  ./setup.sh"
    echo ""
    echo "Als je een 'permission denied' fout krijgt, maak setup.sh uitvoerbaar:"
    echo "  chmod +x setup.sh"
    echo ""
    exit 1
fi

echo -e "${GREEN}Privacy garantie: Alle data blijft op jouw laptop!${NC}"
echo ""
echo "De app start nu in je browser op http://localhost:8501"
echo ""
echo -e "${BLUE}Sluit dit venster NIET - de app blijft dan draaien.${NC}"
echo "Druk op Ctrl+C om de app te stoppen."
echo ""
echo "===================================================================="
echo ""

# Ga naar app directory
cd app

# Activeer virtuele omgeving
source venv/bin/activate

# Start Streamlit
streamlit run app.py

# Als streamlit stopt
echo ""
echo "App is gestopt."
