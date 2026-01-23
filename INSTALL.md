# 🚀 Snelle Installatie

## Windows

1. **Dubbelklik op `setup.bat`**
2. Volg de instructies op het scherm
3. Start de app met **`start.bat`**

Dat is alles!

---

## macOS / Linux

1. Open Terminal in deze map
2. Voer uit:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
3. Start de app:
   ```bash
   ./start.sh
   ```

Klaar!

---

## Wat doet setup?

Het installatiescript doet automatisch:
- ✅ Controleert of Python geïnstalleerd is (versie 3.8+)
- ✅ Installeert Python indien nodig (met jouw toestemming)
- ✅ Maakt een virtuele omgeving aan
- ✅ Installeert alle benodigde packages (pandas, streamlit, plotly, etc.)
- ✅ Verifieert de installatie

**Geschatte tijd:** 3-5 minuten (afhankelijk van je internetsnelheid)

---

## Vereisten

- **Windows 10/11** of **macOS 10.14+** of **Linux** (Ubuntu, Debian, Fedora, Arch, etc.)
- **5 GB vrije ruimte** (voor Python + packages)
- **Internetverbinding** (alleen tijdens installatie)

Na installatie werkt de app **volledig offline**!

---

## Problemen?

### Windows: "setup.bat kan niet worden uitgevoerd"
- Rechtermuisklik op `setup.bat` → "Uitvoeren als administrator"

### macOS/Linux: "Permission denied"
```bash
chmod +x setup.sh start.sh
./setup.sh
```

### Python installatie mislukt
**Windows:**
- Download handmatig van [python.org/downloads](https://www.python.org/downloads/)
- Vink **"Add Python to PATH"** aan tijdens installatie!

**macOS:**
```bash
brew install python@3.11
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install python3 python3-venv python3-pip
```

---

## Meer informatie

Zie **README.md** voor:
- Uitgebreide handleiding
- Handmatige installatie-instructies
- Gebruikersgids
- Veelgestelde vragen
- Configuratie opties

---

**Privacy gegarandeerd:** Deze app maakt na installatie GEEN verbinding met internet. Al je financiële data blijft op jouw laptop! 🔒
