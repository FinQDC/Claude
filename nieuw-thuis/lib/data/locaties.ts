import type { Locatie } from './types'

export const deWilgenhof: Locatie = {
  slug: 'de-wilgenhof',
  naam: 'De Wilgenhof',
  type: 'Kleinschalig verpleeghuis · PG',
  tagline:
    'Een huis met 24 bewoners aan de rand van Drachten — waar het personeel ouder is dan gemiddeld en blijft.',
  breadcrumbs: [
    { label: 'Zoeken', href: '#' },
    { label: 'Friesland', href: '#' },
    { label: 'Drachten e.o.', href: '#' },
  ],
  meta: {
    afstandKm: 8,
    bewoners: 24,
    bouwjaar: 1978,
    renovatie: 2019,
    wachttijdLabel: '4-6 mnd',
  },
  gallery: [
    {
      src: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80',
      label: 'Voorgevel — herfst',
    },
    {
      src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
      label: 'Woonkamer',
    },
    {
      src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
      label: 'Tuin',
    },
    {
      src: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
      label: 'Eetkamer',
    },
    {
      src: 'https://images.unsplash.com/photo-1522444690501-9bbb9ce92005?w=600&q=80',
      label: 'Voorbeeldkamer',
    },
  ],
  doelgroep: [
    { label: 'Psychogeriatrie (PG)', beschikbaar: true },
    { label: 'Kleinschalig wonen', beschikbaar: true },
    { label: 'Partneropname mogelijk', beschikbaar: true },
    { label: 'Huisdier in overleg', beschikbaar: true },
    { label: 'Eigen tuin', beschikbaar: true },
    { label: 'Religieuze identiteit', beschikbaar: false },
  ],
  sfeer: {
    eyebrow: 'Een dag in De Wilgenhof',
    titel: 'Het ritme van het huis volgt de seizoenen, niet de klok.',
    body: [
      'De ochtend begint vroeg, maar zonder haast. Wie wakker wordt komt naar de gezamenlijke keuken — Marian heeft de koffie al klaar, en op zachte dagen staat de tuindeur open. Bewoners helpen mee met ontbijt klaarmaken, voor wie dat kan en wil. De anderen zitten erbij, lezen de krant, kijken naar de tuin.',
      'Rond elf uur is er ruimte voor activiteiten of rust. Soms wordt er gewandeld door het bos achter het terrein. Soms is er muziek in de woonkamer. Het is een dag zoals een dag thuis ooit was — niet vol gepland, niet leeg, maar met natuurlijk ritme.',
    ],
    timeline: [
      { tijd: '7:30 — 9:00', tekst: 'Ontbijt op eigen tempo in de gezamenlijke keuken' },
      { tijd: '10:30 — 12:00', tekst: 'Beweging, muziek of stilte in de tuin' },
      { tijd: '12:30 — 13:30', tekst: 'Warme lunch, samen aan één lange tafel' },
      { tijd: '15:00 — 16:30', tekst: 'Bezoekuur, koffie, wandelen, rust' },
    ],
  },
  team: [
    {
      naam: 'Marian Drenth',
      rol: 'Manager Zorg',
      quote:
        '"We werken niet met protocollen voor alles. We werken met aandacht. Wat een bewoner vandaag nodig heeft is niet altijd wat in het zorgplan staat."',
      foto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80',
    },
    {
      naam: 'Joost Wiersma',
      rol: 'Verzorgende IG',
      quote:
        '"Ik werk hier veertien jaar. De helft van de bewoners herken ik nog van vroeger uit de buurt — dat maakt het werk anders."',
      foto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80',
    },
    {
      naam: 'Anneke Bos',
      rol: 'Activiteitenbegeleider',
      quote:
        '"De tuin is het belangrijkste. We zijn buiten zodra het kan. Beweging, geur, licht — dat doet meer dan veel andere therapieën."',
      foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80',
    },
  ],
  cijfers: [
    {
      label: 'Bouwjaar pand',
      value: '1978',
      context:
        'Volledig gerenoveerd in 2019. Gemiddelde leeftijd verpleeghuizen in NL: 35 jaar.',
    },
    {
      label: 'Energielabel',
      value: 'B',
      badge: { tekst: 'B', variant: 'b' },
      context: 'Beter dan 60% van de sector. Goed geïsoleerd na de renovatie.',
    },
    {
      label: 'Bedrijfsstabiliteit',
      value: 'Goed',
      badge: { tekst: '●', variant: 'good' },
      context:
        'Op basis van DigiMV-jaarverantwoording in de bovenste helft van de sector op continuïteit-indicatoren.',
    },
    {
      label: 'Aantal locaties',
      value: '3',
      context: 'Onderdeel van Stichting Friese Wouden Zorg. Bestaat sinds 1968.',
    },
  ],
  cijfersBron: 'Bronnen: BAG, EP-Online, DigiMV jaarverantwoording',
  organisatie: {
    naam: 'Stichting Friese Wouden Zorg',
    initiaal: 'F',
    reactieDatum: 'Reactie van het bestuur · maart 2026',
    quote:
      '"We zijn een kleine, regionaal verankerde organisatie. Het personeel werkt hier vaak al jaren — die continuïteit zien onze bewoners en familie als belangrijkste kwaliteit. We investeren bewust in personeelswelzijn en kleinschalig werken, ook waar dat financieel niet altijd het meest efficiënt lijkt. Voor wie aanvullende informatie wenst over hoe wij werken: ons jaarverslag staat op onze website en onze deur staat open voor een rondleiding."',
  },
  voorzieningen: [
    { naam: 'Eigen kamer met badkamer', beschikbaar: true, icon: 'home' },
    { naam: 'Tuin met terras', beschikbaar: true, icon: 'leaf' },
    { naam: 'Gemeenschappelijke keuken', beschikbaar: true, icon: 'utensils' },
    { naam: 'Activiteitenruimte', beschikbaar: true, icon: 'message' },
    { naam: 'Huiselijke setting', beschikbaar: true, icon: 'home' },
    { naam: 'Wandelpaden buiten', beschikbaar: true, icon: 'footprints' },
    { naam: 'Bibliotheek / leeshoek', beschikbaar: true, icon: 'book' },
    { naam: 'Logeerkamer voor familie', beschikbaar: true, icon: 'bed' },
    { naam: 'Zwembad', beschikbaar: false, icon: 'x' },
  ],
  wachttijd: {
    eyebrow: 'Realistische indicatie',
    titel: 'Gemiddeld 4 tot 6 maanden vanaf aanmelding',
    tekst:
      'Op basis van plaatsingen in de afgelopen 18 maanden. De wachttijd hangt af van uw zorgprofiel, voorkeursvolgorde en eventuele urgentie. De zorgaanbieder en het zorgkantoor bemiddelen actief.',
    cijfer: '4-6',
    eenheid: 'maanden',
  },
  omgeving: {
    pois: [
      { type: 'transit', label: 'Bushalte 200m', positie: { top: '14%', left: '18%' } },
      { type: 'shop', label: 'Supermarkt 600m', positie: { top: '64%', left: '20%' } },
      { type: 'nature', label: 'Wouden van Drachten', positie: { top: '78%', left: '58%' } },
      { type: 'medical', label: 'Huisartsenpraktijk', positie: { top: '22%', right: '14%' } },
      { type: 'shop', label: 'Apotheek 400m', positie: { top: '36%', left: '67%' } },
    ],
    info: [
      { label: 'Bereikbaarheid', value: 'Goed met auto en bus, halte op 200m' },
      { label: 'Buurtkenmerk', value: 'Rustige rand-stad, veel groen' },
      { label: 'Reistijd vanaf u', value: '12 minuten met de auto' },
    ],
  },
}

export const locaties: Locatie[] = [deWilgenhof]

export function getLocatie(slug: string): Locatie | undefined {
  return locaties.find((l) => l.slug === slug)
}
