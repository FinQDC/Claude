"""
Lokale Banktransactie Analyzer
================================
Een volledig lokale applicatie voor het analyseren van banktransacties.
GEEN externe verbindingen - alle data blijft op jouw laptop.

Auteur: Claude
Licentie: MIT
"""

import streamlit as st
import pandas as pd
import json
import os
from pathlib import Path
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import re

# Configuratie paden
CONFIG_DIR = Path(__file__).parent / "config"
DATA_DIR = Path(__file__).parent / "data"
SETTINGS_FILE = CONFIG_DIR / "settings.json"
REGELS_FILE = CONFIG_DIR / "categorie_regels.csv"

# Zorg dat directories bestaan
CONFIG_DIR.mkdir(exist_ok=True)
DATA_DIR.mkdir(exist_ok=True)


def load_settings():
    """Laad instellingen uit settings.json"""
    if SETTINGS_FILE.exists():
        with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        # Standaard instellingen
        default_settings = {
            "column_mapping": {
                "datum": "Datum",
                "omschrijving": "Omschrijving",
                "bedrag": "Bedrag",
                "tegenrekening": "Tegenrekening",
                "categorie_bank": "Categorie"
            },
            "date_format": "%Y-%m-%d",
            "decimal_separator": ",",
            "thousands_separator": ".",
            "default_category": "Onbekend"
        }
        # Sla standaard instellingen op
        with open(SETTINGS_FILE, 'w', encoding='utf-8') as f:
            json.dump(default_settings, f, indent=2, ensure_ascii=False)
        return default_settings


def load_categorie_regels():
    """Laad categorisatieregels uit CSV"""
    if REGELS_FILE.exists():
        try:
            df = pd.read_csv(REGELS_FILE, encoding='utf-8')
            # Zorg dat alle kolommen bestaan
            if 'Patroon' not in df.columns:
                df['Patroon'] = ''
            if 'Categorie' not in df.columns:
                df['Categorie'] = ''
            if 'Subcategorie' not in df.columns:
                df['Subcategorie'] = ''
            return df
        except Exception as e:
            st.error(f"Fout bij laden categorieregels: {e}")
            return pd.DataFrame(columns=['Patroon', 'Categorie', 'Subcategorie', 'Notitie'])
    else:
        # Maak leeg bestand
        df = pd.DataFrame(columns=['Patroon', 'Categorie', 'Subcategorie', 'Notitie'])
        df.to_csv(REGELS_FILE, index=False, encoding='utf-8')
        return df


def save_categorie_regels(df_regels):
    """Sla categorisatieregels op naar CSV"""
    try:
        df_regels.to_csv(REGELS_FILE, index=False, encoding='utf-8')
        return True
    except Exception as e:
        st.error(f"Fout bij opslaan categorieregels: {e}")
        return False


def clean_bedrag(bedrag_str, decimal_sep=',', thousands_sep='.'):
    """Converteer bedrag string naar float"""
    if pd.isna(bedrag_str):
        return 0.0

    if isinstance(bedrag_str, (int, float)):
        return float(bedrag_str)

    # Verwijder duizendtallen separator en vervang decimaal separator
    bedrag_str = str(bedrag_str).strip()
    bedrag_str = bedrag_str.replace(thousands_sep, '')
    bedrag_str = bedrag_str.replace(decimal_sep, '.')

    try:
        return float(bedrag_str)
    except:
        return 0.0


def lees_csv(uploaded_file, settings):
    """Lees een CSV bestand en converteer naar gestandaardiseerd formaat"""
    try:
        # Probeer verschillende encodings
        encodings = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252']
        df = None

        for encoding in encodings:
            try:
                uploaded_file.seek(0)  # Reset file pointer
                df = pd.read_csv(uploaded_file, encoding=encoding, sep=None, engine='python')
                break
            except:
                continue

        if df is None:
            st.error("Kan bestand niet lezen met bekende encodings")
            return None

        # Map kolommen naar standaard namen
        col_mapping = settings['column_mapping']

        # Probeer kolommen te vinden (case-insensitive)
        df_cols_lower = {col.lower(): col for col in df.columns}

        renamed_cols = {}
        for standard_name, expected_name in col_mapping.items():
            # Zoek kolom (case-insensitive)
            found = False
            for col_lower, col_original in df_cols_lower.items():
                if expected_name.lower() in col_lower or col_lower in expected_name.lower():
                    renamed_cols[col_original] = standard_name
                    found = True
                    break

            # Als niet gevonden, check of de exacte naam bestaat
            if not found and expected_name in df.columns:
                renamed_cols[expected_name] = standard_name

        # Hernoem kolommen
        df = df.rename(columns=renamed_cols)

        # Check verplichte kolommen
        required = ['datum', 'omschrijving', 'bedrag']
        missing = [col for col in required if col not in df.columns]

        if missing:
            st.error(f"Verplichte kolommen ontbreken: {missing}")
            st.info(f"Gevonden kolommen: {list(df.columns)}")
            st.info(f"Verwachte kolommen: {list(col_mapping.values())}")
            return None

        return df

    except Exception as e:
        st.error(f"Fout bij lezen CSV: {e}")
        return None


def verwerk_transacties(df, settings):
    """Verwerk transacties: converteer datums, voeg kolommen toe"""
    df = df.copy()

    # Converteer datum
    try:
        df['datum'] = pd.to_datetime(df['datum'], format=settings['date_format'], errors='coerce')
    except:
        # Probeer automatische detectie
        df['datum'] = pd.to_datetime(df['datum'], errors='coerce')

    # Verwijder rijen zonder geldige datum
    df = df.dropna(subset=['datum'])

    # Voeg jaar en maand toe
    df['jaar'] = df['datum'].dt.year
    df['maand_nr'] = df['datum'].dt.month
    df['maand'] = df['datum'].dt.to_period('M').astype(str)

    # Clean bedrag
    if df['bedrag'].dtype == 'object':
        df['bedrag'] = df['bedrag'].apply(
            lambda x: clean_bedrag(x, settings['decimal_separator'], settings['thousands_separator'])
        )

    df['bedrag'] = pd.to_numeric(df['bedrag'], errors='coerce').fillna(0)

    # Voeg InUit toe
    df['InUit'] = df['bedrag'].apply(lambda x: 'Inkomsten' if x > 0 else 'Uitgaven')

    # Voeg absoluut bedrag toe voor gemakkelijkere berekeningen
    df['bedrag_abs'] = df['bedrag'].abs()

    # Zorg dat omschrijving een string is
    df['omschrijving'] = df['omschrijving'].fillna('').astype(str)

    return df


def categoriseer_transacties(df, df_regels, default_category='Onbekend'):
    """Pas categorisatieregels toe op transacties"""
    df = df.copy()

    # Initialiseer categorie kolommen
    df['categorie'] = default_category
    df['subcategorie'] = ''

    # Pas regels toe
    for _, regel in df_regels.iterrows():
        patroon = str(regel['Patroon']).strip()
        if not patroon or pd.isna(patroon):
            continue

        categorie = str(regel['Categorie']) if not pd.isna(regel['Categorie']) else default_category
        subcategorie = str(regel['Subcategorie']) if not pd.isna(regel['Subcategorie']) else ''

        # Zoek patroon in omschrijving (case-insensitive)
        mask = df['omschrijving'].str.contains(patroon, case=False, na=False, regex=False)
        df.loc[mask, 'categorie'] = categorie
        df.loc[mask, 'subcategorie'] = subcategorie

    return df


def maak_maand_overzicht(df):
    """Maak overzicht per maand"""
    # Groepeer per maand
    maand_data = df.groupby(['maand', 'InUit'])['bedrag_abs'].sum().reset_index()
    maand_data = maand_data.pivot(index='maand', columns='InUit', values='bedrag_abs').fillna(0)

    # Voeg saldo toe
    if 'Inkomsten' in maand_data.columns and 'Uitgaven' in maand_data.columns:
        maand_data['Saldo'] = maand_data['Inkomsten'] - maand_data['Uitgaven']
    elif 'Inkomsten' in maand_data.columns:
        maand_data['Saldo'] = maand_data['Inkomsten']
    elif 'Uitgaven' in maand_data.columns:
        maand_data['Saldo'] = -maand_data['Uitgaven']
    else:
        maand_data['Saldo'] = 0

    # Reset index voor grafiek
    maand_data = maand_data.reset_index()

    # Sorteer op maand
    maand_data = maand_data.sort_values('maand')

    return maand_data


def maak_categorie_overzicht(df):
    """Maak overzicht per categorie per maand"""
    # Filter alleen uitgaven
    df_uitgaven = df[df['InUit'] == 'Uitgaven'].copy()

    # Groepeer per categorie en maand
    cat_data = df_uitgaven.groupby(['maand', 'categorie'])['bedrag_abs'].sum().reset_index()
    cat_data = cat_data.sort_values(['maand', 'bedrag_abs'], ascending=[True, False])

    return cat_data


def main():
    """Hoofdfunctie van de applicatie"""

    st.set_page_config(
        page_title="Banktransactie Analyzer",
        page_icon="💰",
        layout="wide"
    )

    st.title("💰 Lokale Banktransactie Analyzer")
    st.markdown("**Volledig lokaal - jouw data blijft op jouw laptop**")

    # Laad instellingen en regels
    settings = load_settings()
    df_regels = load_categorie_regels()

    # Sidebar voor bestandsupload
    st.sidebar.header("📁 Transacties inladen")

    uploaded_files = st.sidebar.file_uploader(
        "Selecteer een of meer CSV bestanden",
        type=['csv', 'txt'],
        accept_multiple_files=True,
        help="Upload je bank-CSV exports hier. Alle bestanden blijven lokaal!"
    )

    # Initialiseer session state
    if 'df_alle_transacties' not in st.session_state:
        st.session_state.df_alle_transacties = None

    # Verwerk bestanden
    if uploaded_files:
        dfs = []

        for uploaded_file in uploaded_files:
            st.sidebar.info(f"Verwerken: {uploaded_file.name}")
            df = lees_csv(uploaded_file, settings)

            if df is not None:
                df = verwerk_transacties(df, settings)
                dfs.append(df)
                st.sidebar.success(f"✓ {uploaded_file.name}: {len(df)} transacties")

        if dfs:
            # Combineer alle dataframes
            df_combined = pd.concat(dfs, ignore_index=True)

            # Verwijder duplicaten (zelfde datum, bedrag en omschrijving)
            df_combined = df_combined.drop_duplicates(
                subset=['datum', 'bedrag', 'omschrijving'],
                keep='first'
            )

            # Sorteer op datum
            df_combined = df_combined.sort_values('datum', ascending=False)

            # Categoriseer
            df_combined = categoriseer_transacties(df_combined, df_regels, settings['default_category'])

            # Sla op in session state
            st.session_state.df_alle_transacties = df_combined

            st.sidebar.success(f"✅ Totaal: {len(df_combined)} transacties geladen")

    # Check of we data hebben
    if st.session_state.df_alle_transacties is None or len(st.session_state.df_alle_transacties) == 0:
        st.info("👈 Upload een of meer CSV bestanden om te beginnen")
        st.markdown("""
        ### Hoe werkt het?

        1. **Upload je bank-CSV** in de sidebar
        2. **Bekijk overzichten** per maand en categorie
        3. **Beheer categorieën** om transacties in te delen
        4. **Exporteer** je verrijkte data naar Excel

        **Privacy gegarandeerd**: Deze app maakt GEEN verbinding met internet.
        Alle data blijft op jouw laptop.
        """)
        return

    df = st.session_state.df_alle_transacties

    # Hoofdtabs
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "📊 Overzicht per Maand",
        "🏷️ Overzicht per Categorie",
        "🔍 Detail Transacties",
        "⚙️ Categoriebeheer",
        "💾 Export"
    ])

    # TAB 1: Overzicht per maand
    with tab1:
        st.header("Overzicht per Maand")

        maand_data = maak_maand_overzicht(df)

        # Toon tabel
        st.subheader("Tabel per Maand")

        # Format bedragen
        display_df = maand_data.copy()
        for col in ['Inkomsten', 'Uitgaven', 'Saldo']:
            if col in display_df.columns:
                display_df[col] = display_df[col].apply(lambda x: f"€ {x:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.'))

        st.dataframe(display_df, use_container_width=True)

        # Grafieken
        st.subheader("Grafiek: Inkomsten vs Uitgaven")

        fig1 = go.Figure()

        if 'Inkomsten' in maand_data.columns:
            fig1.add_trace(go.Bar(
                x=maand_data['maand'],
                y=maand_data['Inkomsten'],
                name='Inkomsten',
                marker_color='green'
            ))

        if 'Uitgaven' in maand_data.columns:
            fig1.add_trace(go.Bar(
                x=maand_data['maand'],
                y=maand_data['Uitgaven'],
                name='Uitgaven',
                marker_color='red'
            ))

        fig1.update_layout(
            barmode='group',
            xaxis_title='Maand',
            yaxis_title='Bedrag (€)',
            hovermode='x unified'
        )

        st.plotly_chart(fig1, use_container_width=True)

        # Saldo grafiek
        st.subheader("Grafiek: Maandelijks Saldo")

        fig2 = go.Figure()

        fig2.add_trace(go.Scatter(
            x=maand_data['maand'],
            y=maand_data['Saldo'],
            mode='lines+markers',
            name='Saldo',
            line=dict(color='blue', width=3),
            marker=dict(size=8)
        ))

        # Voeg nul-lijn toe
        fig2.add_hline(y=0, line_dash="dash", line_color="gray")

        fig2.update_layout(
            xaxis_title='Maand',
            yaxis_title='Saldo (€)',
            hovermode='x unified'
        )

        st.plotly_chart(fig2, use_container_width=True)

        # Statistieken
        col1, col2, col3, col4 = st.columns(4)

        with col1:
            totaal_inkomsten = maand_data['Inkomsten'].sum() if 'Inkomsten' in maand_data.columns else 0
            st.metric("Totaal Inkomsten", f"€ {totaal_inkomsten:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.'))

        with col2:
            totaal_uitgaven = maand_data['Uitgaven'].sum() if 'Uitgaven' in maand_data.columns else 0
            st.metric("Totaal Uitgaven", f"€ {totaal_uitgaven:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.'))

        with col3:
            totaal_saldo = totaal_inkomsten - totaal_uitgaven
            st.metric("Totaal Saldo", f"€ {totaal_saldo:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.'))

        with col4:
            gem_maand = totaal_saldo / len(maand_data) if len(maand_data) > 0 else 0
            st.metric("Gem. per Maand", f"€ {gem_maand:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.'))

    # TAB 2: Overzicht per categorie
    with tab2:
        st.header("Overzicht per Categorie")

        cat_data = maak_categorie_overzicht(df)

        # Filter op jaar
        jaren = sorted(df['jaar'].unique(), reverse=True)
        selected_jaar = st.selectbox("Selecteer jaar", jaren, key='cat_jaar')

        # Filter data op geselecteerd jaar
        df_jaar = df[df['jaar'] == selected_jaar]
        cat_data_jaar = maak_categorie_overzicht(df_jaar)

        # Totaal per categorie (over alle maanden van geselecteerd jaar)
        cat_totaal = cat_data_jaar.groupby('categorie')['bedrag_abs'].sum().reset_index()
        cat_totaal = cat_totaal.sort_values('bedrag_abs', ascending=False)

        # Tabel
        st.subheader(f"Uitgaven per Categorie - {selected_jaar}")

        display_cat = cat_totaal.copy()
        display_cat['bedrag_abs'] = display_cat['bedrag_abs'].apply(
            lambda x: f"€ {x:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
        )
        display_cat = display_cat.rename(columns={'categorie': 'Categorie', 'bedrag_abs': 'Totaal Uitgaven'})

        st.dataframe(display_cat, use_container_width=True, hide_index=True)

        # Pie chart
        st.subheader("Verdeling per Categorie")

        fig_pie = px.pie(
            cat_totaal,
            values='bedrag_abs',
            names='categorie',
            title=f'Uitgaven per Categorie - {selected_jaar}'
        )

        st.plotly_chart(fig_pie, use_container_width=True)

        # Stacked bar per maand
        st.subheader("Uitgaven per Maand per Categorie")

        fig_stacked = px.bar(
            cat_data_jaar,
            x='maand',
            y='bedrag_abs',
            color='categorie',
            title=f'Uitgaven per Maand per Categorie - {selected_jaar}',
            labels={'bedrag_abs': 'Bedrag (€)', 'maand': 'Maand', 'categorie': 'Categorie'}
        )

        fig_stacked.update_layout(barmode='stack')

        st.plotly_chart(fig_stacked, use_container_width=True)

        # Top categorieën
        st.subheader(f"Top 10 Categorieën - {selected_jaar}")

        top_10 = cat_totaal.head(10)

        fig_top = px.bar(
            top_10,
            x='bedrag_abs',
            y='categorie',
            orientation='h',
            title=f'Top 10 Uitgaven Categorieën - {selected_jaar}',
            labels={'bedrag_abs': 'Bedrag (€)', 'categorie': 'Categorie'}
        )

        st.plotly_chart(fig_top, use_container_width=True)

    # TAB 3: Detail transacties
    with tab3:
        st.header("Detail Transacties")

        # Filters
        col1, col2, col3 = st.columns(3)

        with col1:
            jaren_filter = sorted(df['jaar'].unique(), reverse=True)
            jaar_filter = st.multiselect("Jaar", jaren_filter, default=jaren_filter[:1] if len(jaren_filter) > 0 else [])

        with col2:
            categorien = sorted(df['categorie'].unique())
            cat_filter = st.multiselect("Categorie", categorien)

        with col3:
            inuit_filter = st.multiselect("Type", ['Inkomsten', 'Uitgaven'])

        col4, col5, col6 = st.columns(3)

        with col4:
            min_bedrag = st.number_input("Min bedrag (€)", value=0.0, step=10.0)

        with col5:
            max_bedrag = st.number_input("Max bedrag (€)", value=float(df['bedrag_abs'].max()), step=10.0)

        with col6:
            zoekterm = st.text_input("Zoek in omschrijving")

        # Pas filters toe
        df_filtered = df.copy()

        if jaar_filter:
            df_filtered = df_filtered[df_filtered['jaar'].isin(jaar_filter)]

        if cat_filter:
            df_filtered = df_filtered[df_filtered['categorie'].isin(cat_filter)]

        if inuit_filter:
            df_filtered = df_filtered[df_filtered['InUit'].isin(inuit_filter)]

        df_filtered = df_filtered[
            (df_filtered['bedrag_abs'] >= min_bedrag) &
            (df_filtered['bedrag_abs'] <= max_bedrag)
        ]

        if zoekterm:
            df_filtered = df_filtered[
                df_filtered['omschrijving'].str.contains(zoekterm, case=False, na=False)
            ]

        # Toon resultaten
        st.info(f"Aantal transacties: {len(df_filtered)}")

        # Selecteer kolommen voor weergave
        display_cols = ['datum', 'omschrijving', 'bedrag', 'categorie', 'subcategorie', 'InUit']

        # Voeg optionele kolommen toe als ze bestaan
        if 'tegenrekening' in df_filtered.columns:
            display_cols.insert(3, 'tegenrekening')

        df_display = df_filtered[display_cols].copy()

        # Format datum
        df_display['datum'] = df_display['datum'].dt.strftime('%Y-%m-%d')

        # Format bedrag
        df_display['bedrag'] = df_display['bedrag'].apply(
            lambda x: f"€ {x:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
        )

        # Hernoem kolommen
        rename_dict = {
            'datum': 'Datum',
            'omschrijving': 'Omschrijving',
            'bedrag': 'Bedrag',
            'categorie': 'Categorie',
            'subcategorie': 'Subcategorie',
            'InUit': 'Type',
            'tegenrekening': 'Tegenrekening'
        }

        df_display = df_display.rename(columns=rename_dict)

        st.dataframe(df_display, use_container_width=True, hide_index=True, height=600)

        # Statistieken van gefilterde data
        col1, col2, col3 = st.columns(3)

        with col1:
            som_inkomsten = df_filtered[df_filtered['InUit'] == 'Inkomsten']['bedrag_abs'].sum()
            st.metric("Inkomsten (gefilterd)", f"€ {som_inkomsten:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.'))

        with col2:
            som_uitgaven = df_filtered[df_filtered['InUit'] == 'Uitgaven']['bedrag_abs'].sum()
            st.metric("Uitgaven (gefilterd)", f"€ {som_uitgaven:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.'))

        with col3:
            saldo_filtered = som_inkomsten - som_uitgaven
            st.metric("Saldo (gefilterd)", f"€ {saldo_filtered:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.'))

    # TAB 4: Categoriebeheer
    with tab4:
        st.header("Categoriebeheer")

        st.markdown("""
        Hier kun je categorisatieregels beheren. Elke regel bestaat uit een patroon
        dat in de omschrijving gezocht wordt, en de bijbehorende categorie.
        """)

        # Toon onbekende transacties
        st.subheader("Transacties zonder Categorie")

        df_onbekend = df[df['categorie'] == settings['default_category']].copy()

        if len(df_onbekend) > 0:
            # Groepeer unieke omschrijvingen
            unieke_omschrijvingen = df_onbekend.groupby('omschrijving').agg({
                'bedrag_abs': ['count', 'sum']
            }).reset_index()

            unieke_omschrijvingen.columns = ['Omschrijving', 'Aantal', 'Totaal']
            unieke_omschrijvingen = unieke_omschrijvingen.sort_values('Totaal', ascending=False)

            # Format
            display_onbekend = unieke_omschrijvingen.copy()
            display_onbekend['Totaal'] = display_onbekend['Totaal'].apply(
                lambda x: f"€ {x:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
            )

            st.dataframe(display_onbekend, use_container_width=True, hide_index=True)

            st.info(f"Totaal {len(df_onbekend)} transacties zonder categorie ({len(unieke_omschrijvingen)} unieke omschrijvingen)")

            # Nieuwe regel toevoegen
            st.subheader("Nieuwe Regel Toevoegen")

            col1, col2, col3 = st.columns(3)

            with col1:
                nieuw_patroon = st.text_input("Patroon (bijv. 'Albert Heijn')")

            with col2:
                nieuw_categorie = st.text_input("Categorie (bijv. 'Boodschappen')")

            with col3:
                nieuw_subcategorie = st.text_input("Subcategorie (optioneel)")

            if st.button("➕ Regel Toevoegen"):
                if nieuw_patroon and nieuw_categorie:
                    # Voeg toe aan regels
                    nieuwe_regel = pd.DataFrame([{
                        'Patroon': nieuw_patroon,
                        'Categorie': nieuw_categorie,
                        'Subcategorie': nieuw_subcategorie,
                        'Notitie': ''
                    }])

                    df_regels_updated = pd.concat([df_regels, nieuwe_regel], ignore_index=True)

                    if save_categorie_regels(df_regels_updated):
                        st.success(f"✅ Regel toegevoegd: '{nieuw_patroon}' → '{nieuw_categorie}'")
                        st.info("Herlaad de transacties (upload opnieuw) om de nieuwe regel toe te passen")

                        # Update df_regels in geheugen
                        df_regels = df_regels_updated
                else:
                    st.error("Vul minimaal een patroon en categorie in")
        else:
            st.success("✅ Alle transacties hebben een categorie!")

        # Bestaande regels tonen en beheren
        st.subheader("Bestaande Categorisatieregels")

        if len(df_regels) > 0:
            # Toon regels
            st.dataframe(df_regels, use_container_width=True, hide_index=True)

            st.info(f"Totaal {len(df_regels)} regels")

            # Regel verwijderen
            st.subheader("Regel Verwijderen")

            te_verwijderen_patroon = st.selectbox(
                "Selecteer patroon om te verwijderen",
                df_regels['Patroon'].tolist()
            )

            if st.button("🗑️ Verwijder Regel", type="secondary"):
                df_regels_updated = df_regels[df_regels['Patroon'] != te_verwijderen_patroon]

                if save_categorie_regels(df_regels_updated):
                    st.success(f"✅ Regel verwijderd: '{te_verwijderen_patroon}'")
                    st.info("Herlaad de transacties om de wijziging toe te passen")
        else:
            st.info("Nog geen categorisatieregels. Voeg er hierboven een toe!")

    # TAB 5: Export
    with tab5:
        st.header("Data Exporteren")

        st.markdown("""
        Exporteer je verrijkte transacties naar Excel of CSV voor verdere analyse.
        Alle kolommen (inclusief categorieën) worden meegenomen.
        """)

        # Selecteer export formaat
        export_format = st.radio("Kies formaat", ["Excel (.xlsx)", "CSV (.csv)"])

        # Selecteer welke data
        export_data_keuze = st.radio(
            "Welke data wil je exporteren?",
            ["Alle transacties", "Alleen huidige filters (uit Detail tab)"]
        )

        if st.button("📥 Download Bestand", type="primary"):
            # Bepaal welke data te exporteren
            if export_data_keuze == "Alle transacties":
                df_export = df.copy()
            else:
                # Gebruik gefilterde data (zou in session state kunnen, maar voor nu: alles)
                df_export = df.copy()
                st.info("Let op: export bevat alle transacties. Filters uit Detail tab worden niet toegepast in deze versie.")

            # Sorteer op datum
            df_export = df_export.sort_values('datum', ascending=False)

            # Genereer bestandsnaam
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

            if export_format == "Excel (.xlsx)":
                filename = f"transacties_export_{timestamp}.xlsx"
                filepath = DATA_DIR / filename

                # Schrijf naar Excel
                df_export.to_excel(filepath, index=False, engine='openpyxl')

                st.success(f"✅ Bestand opgeslagen: {filepath}")

                # Lees bestand om te kunnen downloaden
                with open(filepath, 'rb') as f:
                    st.download_button(
                        label="⬇️ Download Excel",
                        data=f,
                        file_name=filename,
                        mime='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    )

            else:  # CSV
                filename = f"transacties_export_{timestamp}.csv"
                filepath = DATA_DIR / filename

                # Schrijf naar CSV
                df_export.to_csv(filepath, index=False, encoding='utf-8')

                st.success(f"✅ Bestand opgeslagen: {filepath}")

                # Download button
                with open(filepath, 'rb') as f:
                    st.download_button(
                        label="⬇️ Download CSV",
                        data=f,
                        file_name=filename,
                        mime='text/csv'
                    )

        # Statistieken van volledige dataset
        st.subheader("Dataset Overzicht")

        col1, col2, col3, col4 = st.columns(4)

        with col1:
            st.metric("Totaal Transacties", f"{len(df):,}")

        with col2:
            datum_range = f"{df['datum'].min().strftime('%Y-%m-%d')} t/m {df['datum'].max().strftime('%Y-%m-%d')}"
            st.metric("Periode", datum_range)

        with col3:
            aantal_categorien = df['categorie'].nunique()
            st.metric("Aantal Categorieën", aantal_categorien)

        with col4:
            onbekend_pct = (len(df[df['categorie'] == settings['default_category']]) / len(df) * 100) if len(df) > 0 else 0
            st.metric("% Onbekend", f"{onbekend_pct:.1f}%")


if __name__ == "__main__":
    main()
