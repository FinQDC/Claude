#!/bin/bash

# ====================================================================
# Automatische installatie van Lokale Banktransactie Analyzer
# Voor Linux en macOS
# ====================================================================

echo ""
echo "===================================================================="
echo "  LOKALE BANKTRANSACTIE ANALYZER - AUTOMATISCHE INSTALLATIE"
echo "===================================================================="
echo ""
echo "Dit script installeert automatisch:"
echo "  - Python 3.8+ (als nog niet aanwezig)"
echo "  - Virtuele omgeving"
echo "  - Alle benodigde packages"
echo ""
echo "Privacy garantie: Geen externe verbindingen na installatie!"
echo ""
echo "===================================================================="
echo ""

# Kleuren voor output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detecteer OS
OS="$(uname -s)"
case "$OS" in
    Linux*)     PLATFORM="Linux";;
    Darwin*)    PLATFORM="macOS";;
    *)          PLATFORM="Unknown";;
esac

echo -e "${BLUE}[INFO]${NC} Gedetecteerd platform: $PLATFORM"
echo ""

# Functie: Controleer Python versie
check_python() {
    echo -e "${BLUE}[1/5]${NC} Python versie controleren..."

    # Probeer python3 eerst
    if command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
        PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
        echo -e "${GREEN}✓${NC} Python gevonden: $PYTHON_VERSION (python3)"

        # Check versie (minimaal 3.8)
        MAJOR=$(echo $PYTHON_VERSION | cut -d. -f1)
        MINOR=$(echo $PYTHON_VERSION | cut -d. -f2)

        if [ "$MAJOR" -ge 3 ] && [ "$MINOR" -ge 8 ]; then
            echo -e "${GREEN}✓${NC} Python versie is geschikt!"
            return 0
        else
            echo -e "${RED}✗${NC} Python versie te oud (vereist: 3.8+)"
            return 1
        fi
    elif command -v python &> /dev/null; then
        # Fallback naar python
        PYTHON_CMD="python"
        PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}')
        echo -e "${YELLOW}!${NC} Python gevonden via 'python': $PYTHON_VERSION"

        MAJOR=$(echo $PYTHON_VERSION | cut -d. -f1)
        MINOR=$(echo $PYTHON_VERSION | cut -d. -f2)

        if [ "$MAJOR" -ge 3 ] && [ "$MINOR" -ge 8 ]; then
            echo -e "${GREEN}✓${NC} Python versie is geschikt!"
            return 0
        else
            echo -e "${RED}✗${NC} Python versie te oud (vereist: 3.8+)"
            return 1
        fi
    else
        echo -e "${RED}✗${NC} Python is niet geïnstalleerd"
        return 1
    fi
}

# Functie: Installeer Python
install_python() {
    echo ""
    echo -e "${YELLOW}[PYTHON INSTALLATIE NODIG]${NC}"
    echo ""

    if [ "$PLATFORM" == "macOS" ]; then
        echo "Voor macOS, installeer Python via een van deze methoden:"
        echo ""
        echo "OPTIE 1 - Homebrew (aanbevolen):"
        echo "  brew install python@3.11"
        echo ""
        echo "OPTIE 2 - Officiële installer:"
        echo "  Download van https://www.python.org/downloads/macos/"
        echo ""

        read -p "Wil je Homebrew methode proberen? (y/n): " choice
        if [ "$choice" == "y" ] || [ "$choice" == "Y" ]; then
            if command -v brew &> /dev/null; then
                echo "Installeren Python via Homebrew..."
                brew install python@3.11

                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✓${NC} Python geïnstalleerd!"
                    # Herlaad PATH
                    export PATH="/usr/local/opt/python@3.11/bin:$PATH"
                    return 0
                else
                    echo -e "${RED}✗${NC} Installatie mislukt"
                    return 1
                fi
            else
                echo -e "${RED}✗${NC} Homebrew niet gevonden. Installeer eerst Homebrew:"
                echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                return 1
            fi
        fi

    elif [ "$PLATFORM" == "Linux" ]; then
        echo "Voor Linux, installeer Python via je package manager:"
        echo ""

        # Detecteer package manager
        if command -v apt-get &> /dev/null; then
            echo "Ubuntu/Debian:"
            echo "  sudo apt-get update"
            echo "  sudo apt-get install python3 python3-venv python3-pip"
            echo ""
            read -p "Uitvoeren? (y/n): " choice
            if [ "$choice" == "y" ] || [ "$choice" == "Y" ]; then
                sudo apt-get update
                sudo apt-get install -y python3 python3-venv python3-pip
                return $?
            fi
        elif command -v yum &> /dev/null; then
            echo "RedHat/CentOS/Fedora:"
            echo "  sudo yum install python3 python3-pip"
            echo ""
            read -p "Uitvoeren? (y/n): " choice
            if [ "$choice" == "y" ] || [ "$choice" == "Y" ]; then
                sudo yum install -y python3 python3-pip
                return $?
            fi
        elif command -v pacman &> /dev/null; then
            echo "Arch Linux:"
            echo "  sudo pacman -S python python-pip"
            echo ""
            read -p "Uitvoeren? (y/n): " choice
            if [ "$choice" == "y" ] || [ "$choice" == "Y" ]; then
                sudo pacman -S --noconfirm python python-pip
                return $?
            fi
        else
            echo "Package manager niet herkend."
            echo "Installeer Python 3.8+ handmatig voor jouw distributie."
        fi
    fi

    return 1
}

# Functie: Maak virtuele omgeving
create_venv() {
    echo ""
    echo -e "${BLUE}[2/5]${NC} Controleren virtuele omgeving..."

    if [ -d "app/venv" ]; then
        echo -e "${GREEN}✓${NC} Virtuele omgeving bestaat al"
        return 0
    else
        echo "  Aanmaken virtuele omgeving..."
        cd app
        $PYTHON_CMD -m venv venv

        if [ $? -eq 0 ]; then
            cd ..
            echo -e "${GREEN}✓${NC} Virtuele omgeving aangemaakt!"
            return 0
        else
            cd ..
            echo -e "${RED}✗${NC} Fout bij aanmaken virtuele omgeving"
            echo ""
            echo "Mogelijk ontbreekt python3-venv. Installeer met:"
            echo "  Ubuntu/Debian: sudo apt-get install python3-venv"
            echo "  RedHat/Fedora: sudo yum install python3-venv"
            return 1
        fi
    fi
}

# Functie: Installeer packages
install_packages() {
    echo ""
    echo -e "${BLUE}[3/5]${NC} Installeren Python packages..."
    echo "  Dit kan enkele minuten duren bij eerste keer..."
    echo ""

    cd app
    source venv/bin/activate

    # Upgrade pip
    pip install --upgrade pip --quiet

    # Installeer requirements
    pip install -r requirements.txt --quiet

    if [ $? -eq 0 ]; then
        deactivate
        cd ..
        echo -e "${GREEN}✓${NC} Alle packages geïnstalleerd!"
        return 0
    else
        deactivate
        cd ..
        echo -e "${RED}✗${NC} Fout bij installeren packages"
        echo ""
        echo "Probeer handmatig:"
        echo "  cd app"
        echo "  source venv/bin/activate"
        echo "  pip install -r requirements.txt"
        return 1
    fi
}

# Functie: Verifieer installatie
verify_install() {
    echo ""
    echo -e "${BLUE}[4/5]${NC} Installatie verifiëren..."

    cd app
    source venv/bin/activate

    python -c "import streamlit, pandas, plotly" 2>/dev/null

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Alle packages werken correct!"
        deactivate
        cd ..
        return 0
    else
        echo -e "${YELLOW}!${NC} Sommige packages ontbreken"
        echo "  Probeer: pip install -r requirements.txt"
        deactivate
        cd ..
        return 1
    fi
}

# Functie: Maak start script uitvoerbaar
setup_start_script() {
    if [ -f "start.sh" ]; then
        chmod +x start.sh
        echo -e "${GREEN}✓${NC} start.sh is uitvoerbaar gemaakt"
    fi
}

# Functie: Toon succes bericht
show_success() {
    echo ""
    echo -e "${BLUE}[5/5]${NC} Installatie voltooid!"
    echo ""
    echo "===================================================================="
    echo -e "${GREEN}  INSTALLATIE SUCCESVOL!${NC}"
    echo "===================================================================="
    echo ""
    echo "De applicatie is klaar voor gebruik."
    echo ""
    echo "Om de app te starten:"
    echo "  ./start.sh"
    echo ""
    echo "Of handmatig:"
    echo "  cd app && source venv/bin/activate && streamlit run app.py"
    echo ""
    echo "===================================================================="
    echo ""

    read -p "Wil je de app nu starten? (y/n): " choice
    if [ "$choice" == "y" ] || [ "$choice" == "Y" ]; then
        echo ""
        echo "App wordt gestart..."
        ./start.sh
    else
        echo ""
        echo "OK! Start de app later met ./start.sh"
    fi
}

# ====================================================================
# MAIN SCRIPT
# ====================================================================

# Check Python
if ! check_python; then
    if ! install_python; then
        echo ""
        echo -e "${RED}Installatie afgebroken.${NC}"
        echo "Installeer Python 3.8+ en voer dit script opnieuw uit."
        exit 1
    fi

    # Re-check na installatie
    if ! check_python; then
        echo ""
        echo -e "${RED}Python installatie lijkt mislukt.${NC}"
        echo "Herstart je terminal en probeer opnieuw."
        exit 1
    fi
fi

# Maak virtuele omgeving
if ! create_venv; then
    echo ""
    echo -e "${RED}Installatie afgebroken.${NC}"
    exit 1
fi

# Installeer packages
if ! install_packages; then
    echo ""
    echo -e "${RED}Installatie afgebroken.${NC}"
    exit 1
fi

# Verifieer
verify_install

# Setup start script
setup_start_script

# Succes!
show_success

echo ""
