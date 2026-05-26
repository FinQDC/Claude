import type { Locatie, LocatieKort, ZorgType } from './types'

export const deWilgenhof: Locatie = {
  slug: 'de-wilgenhof',
  naam: 'De Wilgenhof',
  type: 'Kleinschalig verpleeghuis · PG',
  zorgType: 'pg',
  tagline:
    'Een huis met 24 bewoners aan de rand van Drachten — waar het personeel ouder is dan gemiddeld en blijft.',
  cardTagline: 'Kleinschalig, met een team dat hier blijft. Veel groen.',
  breadcrumbs: [
    { label: 'Zoeken', href: '/zoeken' },
    { label: 'Friesland', href: '/zoeken?regio=friesland' },
    { label: 'Drachten e.o.', href: '/zoeken?regio=drachten' },
  ],
  meta: {
    afstandKm: 8,
    bewoners: 24,
    bouwjaar: 1978,
    renovatie: 2019,
    wachttijdLabel: '4-6 mnd',
  },
  coord: { lat: 53.1034, lng: 6.0942 },
  filters: {
    regio: 'Drachten e.o.',
    gemeente: 'Smallingerland',
    postcode: '9203',
    kleinschalig: true,
    partneropname: true,
    huisdier: true,
    religieuzeIdentiteit: 'geen',
    eigenTuin: true,
    wachttijdMaanden: 5,
    energielabel: 'B',
  },
  zorgprofielen: ['VV5', 'VV6'],
  zorgprofielenContext:
    'Gespecialiseerd in lichtere tot middelzware PG. Voor zeer intensieve zorg (VV7) verwijzen we door naar partnerlocaties — kleinschalig wonen werkt minder goed bij die zorgzwaarte.',
  gallery: [
    { src: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80', label: 'Voorgevel — herfst' },
    { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', label: 'Woonkamer' },
    { src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', label: 'Tuin' },
    { src: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80', label: 'Eetkamer' },
    { src: 'https://images.unsplash.com/photo-1522444690501-9bbb9ce92005?w=600&q=80', label: 'Voorbeeldkamer' },
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
    { naam: 'Marian Drenth', rol: 'Manager Zorg', quote: '"We werken niet met protocollen voor alles. We werken met aandacht. Wat een bewoner vandaag nodig heeft is niet altijd wat in het zorgplan staat."', foto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80' },
    { naam: 'Joost Wiersma', rol: 'Verzorgende IG', quote: '"Ik werk hier veertien jaar. De helft van de bewoners herken ik nog van vroeger uit de buurt — dat maakt het werk anders."', foto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80' },
    { naam: 'Anneke Bos', rol: 'Activiteitenbegeleider', quote: '"De tuin is het belangrijkste. We zijn buiten zodra het kan. Beweging, geur, licht — dat doet meer dan veel andere therapieën."', foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80' },
  ],
  cijfers: [
    { label: 'Bouwjaar pand', value: '1978', context: 'Volledig gerenoveerd in 2019. Gemiddelde leeftijd verpleeghuizen in NL: 35 jaar.' },
    { label: 'Energielabel', value: 'B', badge: { tekst: 'B', variant: 'b' }, context: 'Beter dan 60% van de sector. Goed geïsoleerd na de renovatie.' },
    { label: 'Bedrijfsstabiliteit', value: 'Goed', badge: { tekst: '●', variant: 'good' }, context: 'Op basis van DigiMV-jaarverantwoording in de bovenste helft van de sector op continuïteit-indicatoren.' },
    { label: 'Aantal locaties', value: '3', context: 'Onderdeel van Stichting Friese Wouden Zorg. Bestaat sinds 1968.' },
  ],
  cijfersBron: 'Bronnen: BAG, EP-Online, DigiMV jaarverantwoording',
  organisatie: {
    naam: 'Stichting Friese Wouden Zorg',
    initiaal: 'F',
    reactieDatum: 'Reactie van het bestuur · maart 2026',
    quote: '"We zijn een kleine, regionaal verankerde organisatie. Het personeel werkt hier vaak al jaren — die continuïteit zien onze bewoners en familie als belangrijkste kwaliteit. We investeren bewust in personeelswelzijn en kleinschalig werken, ook waar dat financieel niet altijd het meest efficiënt lijkt. Voor wie aanvullende informatie wenst over hoe wij werken: ons jaarverslag staat op onze website en onze deur staat open voor een rondleiding."',
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
    tekst: 'Op basis van plaatsingen in de afgelopen 18 maanden. De wachttijd hangt af van uw zorgprofiel, voorkeursvolgorde en eventuele urgentie. De zorgaanbieder en het zorgkantoor bemiddelen actief.',
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

const huizeAnna: Locatie = {
  slug: 'huize-anna',
  naam: 'Huize Anna',
  type: 'Verpleeghuis · PG · Rooms-katholiek',
  zorgType: 'pg',
  tagline:
    'Een verpleeghuis in Heerenveen waar de katholieke traditie nog dagelijks zichtbaar is — voor wie daar troost uit haalt.',
  cardTagline: 'Katholieke traditie, dagelijkse vieringen, 40 bewoners.',
  breadcrumbs: [
    { label: 'Zoeken', href: '/zoeken' },
    { label: 'Friesland', href: '/zoeken?regio=friesland' },
    { label: 'Heerenveen', href: '/zoeken?regio=heerenveen' },
  ],
  meta: { afstandKm: 18, bewoners: 40, bouwjaar: 1995, renovatie: 2014, wachttijdLabel: '8-12 mnd' },
  coord: { lat: 52.9576, lng: 5.9184 },
  filters: {
    regio: 'Heerenveen',
    gemeente: 'Heerenveen',
    postcode: '8442',
    kleinschalig: false,
    partneropname: true,
    huisdier: false,
    religieuzeIdentiteit: 'katholiek',
    eigenTuin: true,
    wachttijdMaanden: 10,
    energielabel: 'C',
  },
  zorgprofielen: ['VV5', 'VV6', 'VV7'],
  zorgprofielenContext:
    'Volledig spectrum PG, inclusief zeer intensieve zorg (VV7). Aparte gesloten afdeling voor wie veiligheid nodig heeft.',
  gallery: [
    { src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80', label: 'Voorgevel' },
    { src: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80', label: 'Kapel' },
    { src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80', label: 'Eetzaal' },
    { src: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80', label: 'Tuin' },
    { src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80', label: 'Woonkamer' },
  ],
  doelgroep: [
    { label: 'Psychogeriatrie (PG)', beschikbaar: true },
    { label: 'Rooms-katholieke identiteit', beschikbaar: true },
    { label: 'Partneropname mogelijk', beschikbaar: true },
    { label: 'Dagelijkse vieringen', beschikbaar: true },
    { label: 'Huisdier toegestaan', beschikbaar: false },
  ],
  sfeer: {
    eyebrow: 'Een dag in Huize Anna',
    titel: 'Vaste tijden, vertrouwde rituelen, voor wie houvast vindt in herhaling.',
    body: [
      'De dag begint om acht uur met ontbijt in de eetzaal. Voor wie wil is er om half tien een korte viering in de huiskapel — voor velen het anker van de dag. De rest van de ochtend is rustig, soms met gespreksgroep of muziek.',
      'Familieleden komen vaak na de lunch. Het pastoraal team is dagelijks aanwezig en bekend met de bewoners. Op zondag is er een uitgebreidere viering, vaak met familie erbij.',
    ],
    timeline: [
      { tijd: '8:00', tekst: 'Ontbijt in de eetzaal' },
      { tijd: '9:30', tekst: 'Ochtendviering in de huiskapel' },
      { tijd: '12:30', tekst: 'Warme lunch' },
      { tijd: '15:00', tekst: 'Bezoek, koffie, activiteit of stilte' },
    ],
  },
  team: [
    { naam: 'Zr. Petra van der Vaart', rol: 'Pastoraal werker', quote: '"Vertrouwde gebeden, vertrouwde melodieën — voor mensen met dementie zijn dat vaak de laatste dingen die blijven."', foto: 'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=300&q=80' },
    { naam: 'Mark Hofstra', rol: 'Manager Zorg', quote: '"Wij combineren professionele zorg met een levensbeschouwelijke context die mensen rust geeft."', foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80' },
  ],
  cijfers: [
    { label: 'Bouwjaar pand', value: '1995', context: 'Uitbreiding kapel in 2014.' },
    { label: 'Energielabel', value: 'C', badge: { tekst: 'C', variant: 'medium' }, context: 'In lijn met sectorgemiddelde.' },
    { label: 'Bedrijfsstabiliteit', value: 'Goed', badge: { tekst: '●', variant: 'good' }, context: 'Onderdeel van een grotere katholieke zorgkoepel.' },
    { label: 'Aantal locaties', value: '11', context: 'Onderdeel van een landelijke katholieke zorgorganisatie.' },
  ],
  cijfersBron: 'Bronnen: BAG, EP-Online, DigiMV',
  organisatie: {
    naam: 'Stichting Anna Zorg',
    initiaal: 'A',
    reactieDatum: 'Reactie · februari 2026',
    quote: '"Huize Anna is bewust kleinschalig binnen onze koepel. Voor families voor wie geloof of katholieke gemeenschap belangrijk is, willen we een herkenbare plek zijn — ook in een tijd dat dat steeds zeldzamer wordt."',
  },
  voorzieningen: [
    { naam: 'Eigen kamer met badkamer', beschikbaar: true, icon: 'home' },
    { naam: 'Huiskapel', beschikbaar: true, icon: 'book' },
    { naam: 'Tuin', beschikbaar: true, icon: 'leaf' },
    { naam: 'Activiteitenruimte', beschikbaar: true, icon: 'message' },
    { naam: 'Logeerkamer voor familie', beschikbaar: true, icon: 'bed' },
    { naam: 'Bibliotheek', beschikbaar: true, icon: 'book' },
    { naam: 'Huisdier toegestaan', beschikbaar: false, icon: 'x' },
  ],
  wachttijd: {
    eyebrow: 'Realistische indicatie',
    titel: 'Gemiddeld 8 tot 12 maanden vanaf aanmelding',
    tekst: 'De langere wachttijd komt deels door de specifieke identiteitsprofiel. Voor mensen met urgentie kan bemiddeling via het zorgkantoor sneller resultaat geven.',
    cijfer: '8-12',
    eenheid: 'maanden',
  },
  omgeving: {
    pois: [
      { type: 'transit', label: 'Station 1.2km', positie: { top: '18%', left: '22%' } },
      { type: 'shop', label: 'Supermarkt 300m', positie: { top: '58%', left: '24%' } },
      { type: 'medical', label: 'Ziekenhuis 2km', positie: { top: '26%', right: '18%' } },
      { type: 'nature', label: 'Heidepark 800m', positie: { top: '74%', left: '62%' } },
    ],
    info: [
      { label: 'Bereikbaarheid', value: 'Centrum Heerenveen, goed bereikbaar' },
      { label: 'Buurtkenmerk', value: 'Stedelijk maar rustig' },
      { label: 'Reistijd vanaf u', value: '22 minuten met de auto' },
    ],
  },
}

const deTjongerwald: Locatie = {
  slug: 'de-tjongerwald',
  naam: 'Zorgcentrum De Tjongerwâld',
  type: 'Verpleeghuis · Somatiek',
  zorgType: 'somatiek',
  tagline:
    'Een ruim verpleeghuis in Wolvega gericht op lichamelijke zorg — modern, professioneel, met sterke fysiotherapie.',
  cardTagline: 'Ruim opgezet, sterke fysiotherapie, 60 bewoners.',
  breadcrumbs: [
    { label: 'Zoeken', href: '/zoeken' },
    { label: 'Friesland', href: '/zoeken?regio=friesland' },
    { label: 'Wolvega', href: '/zoeken?regio=wolvega' },
  ],
  meta: { afstandKm: 28, bewoners: 60, bouwjaar: 2008, wachttijdLabel: '3-5 mnd' },
  coord: { lat: 52.8765, lng: 6.0007 },
  filters: {
    regio: 'Wolvega',
    gemeente: 'Weststellingwerf',
    postcode: '8471',
    kleinschalig: false,
    partneropname: true,
    huisdier: false,
    religieuzeIdentiteit: 'geen',
    eigenTuin: true,
    wachttijdMaanden: 4,
    energielabel: 'A',
  },
  zorgprofielen: ['VV4', 'VV6', 'VV8', 'VV9b'],
  zorgprofielenContext:
    'Somatische zorg over de volle breedte plus aparte revalidatie-afdeling (VV9b). Geen PG-zorg op deze locatie — daar verwijzen we door.',
  gallery: [
    { src: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&q=80', label: 'Hoofdingang' },
    { src: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&q=80', label: 'Fysiotherapie-ruimte' },
    { src: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80', label: 'Restaurant' },
    { src: 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=600&q=80', label: 'Atrium' },
    { src: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600&q=80', label: 'Tuin' },
  ],
  doelgroep: [
    { label: 'Somatische zorg', beschikbaar: true },
    { label: 'Revalidatie mogelijk', beschikbaar: true },
    { label: 'Partneropname mogelijk', beschikbaar: true },
    { label: 'Eigen badkamer', beschikbaar: true },
    { label: 'Huisdier', beschikbaar: false },
  ],
  sfeer: {
    eyebrow: 'Een dag in De Tjongerwâld',
    titel: 'Een actief huis waar revalidatie en zelfstandigheid centraal staan.',
    body: [
      'De Tjongerwâld voelt eerder als een modern wooncomplex dan een traditioneel verpleeghuis. Veel bewoners zijn na een operatie of CVA hier voor revalidatie. Anderen wonen langer en gebruiken de fysiotherapie wekelijks.',
      'Het restaurant is open voor familie, en op donderdag is er een algemene activiteit met buurtbewoners — bewust om de drempel naar buiten laag te houden.',
    ],
    timeline: [
      { tijd: '8:00', tekst: 'Ontbijt op eigen kamer of in het restaurant' },
      { tijd: '10:00', tekst: 'Fysiotherapie / activiteit' },
      { tijd: '12:30', tekst: 'Lunch in het restaurant' },
      { tijd: '15:00', tekst: 'Vrije middag of therapie' },
    ],
  },
  team: [
    { naam: 'Karin Postma', rol: 'Hoofd Fysiotherapie', quote: '"Het verschil tussen zes weken en zes maanden revalideren — dat zit vaak in de eerste weken. Daar zetten we vol op in."', foto: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&q=80' },
    { naam: 'Henk de Boer', rol: 'Manager Zorg', quote: '"We zijn geen kleinschalig huis, maar we hebben wel kleine teams per gang. Het verschil zit in de organisatie, niet in de schaal."', foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80' },
  ],
  cijfers: [
    { label: 'Bouwjaar pand', value: '2008', context: 'Modern gebouw, ontworpen voor zorg.' },
    { label: 'Energielabel', value: 'A', badge: { tekst: 'A', variant: 'a' }, context: 'Bovengemiddeld duurzaam, zonnepanelen.' },
    { label: 'Bedrijfsstabiliteit', value: 'Goed', badge: { tekst: '●', variant: 'good' }, context: 'Stevige financiële positie.' },
    { label: 'Aantal locaties', value: '5', context: 'Regionaal verankerd in Friesland.' },
  ],
  cijfersBron: 'Bronnen: BAG, EP-Online, DigiMV',
  organisatie: {
    naam: 'Stichting Tjonger Zorg',
    initiaal: 'T',
    reactieDatum: 'Reactie · januari 2026',
    quote: '"Wij geloven in revalideren tot het hoogste niveau dat haalbaar is. Voor de meeste mensen betekent dat: terug naar huis, of zo zelfstandig mogelijk leven binnen ons huis."',
  },
  voorzieningen: [
    { naam: 'Eigen kamer met badkamer', beschikbaar: true, icon: 'home' },
    { naam: 'Fysiotherapie-afdeling', beschikbaar: true, icon: 'footprints' },
    { naam: 'Restaurant', beschikbaar: true, icon: 'utensils' },
    { naam: 'Tuin', beschikbaar: true, icon: 'leaf' },
    { naam: 'Activiteitenruimte', beschikbaar: true, icon: 'message' },
    { naam: 'Logeerkamer', beschikbaar: true, icon: 'bed' },
    { naam: 'Bibliotheek', beschikbaar: true, icon: 'book' },
    { naam: 'Huisdier', beschikbaar: false, icon: 'x' },
  ],
  wachttijd: {
    eyebrow: 'Realistische indicatie',
    titel: 'Gemiddeld 3 tot 5 maanden vanaf aanmelding',
    tekst: 'Voor revalidatie-trajecten kan plaatsing soms binnen een week. Voor permanente plaatsing zijn de wachttijden zoals aangegeven.',
    cijfer: '3-5',
    eenheid: 'maanden',
  },
  omgeving: {
    pois: [
      { type: 'transit', label: 'Bushalte 100m', positie: { top: '20%', left: '20%' } },
      { type: 'shop', label: 'Centrum 800m', positie: { top: '40%', left: '70%' } },
      { type: 'medical', label: 'Ziekenhuis 3km', positie: { top: '24%', right: '12%' } },
      { type: 'nature', label: 'Bos 500m', positie: { top: '70%', left: '30%' } },
    ],
    info: [
      { label: 'Bereikbaarheid', value: 'Goed met auto en OV' },
      { label: 'Buurtkenmerk', value: 'Wolvega-rand, ruim opgezet' },
      { label: 'Reistijd vanaf u', value: '32 minuten met de auto' },
    ],
  },
}

const hetSterrenbos: Locatie = {
  slug: 'het-sterrenbos',
  naam: 'Het Sterrenbos',
  type: 'Kleinschalig verpleeghuis · Somatiek',
  zorgType: 'somatiek',
  tagline:
    'Kleinschalig somatisch verpleeghuis in een rustige Leeuwarder wijk — 32 bewoners, drie woongroepen.',
  cardTagline: 'Kleinschalig somatisch, drie woongroepen, eigen tuin.',
  breadcrumbs: [
    { label: 'Zoeken', href: '/zoeken' },
    { label: 'Friesland', href: '/zoeken?regio=friesland' },
    { label: 'Leeuwarden', href: '/zoeken?regio=leeuwarden' },
  ],
  meta: { afstandKm: 22, bewoners: 32, bouwjaar: 1985, renovatie: 2021, wachttijdLabel: '5-8 mnd' },
  coord: { lat: 53.1951, lng: 5.8120 },
  filters: {
    regio: 'Leeuwarden',
    gemeente: 'Leeuwarden',
    postcode: '8932',
    kleinschalig: true,
    partneropname: false,
    huisdier: true,
    religieuzeIdentiteit: 'geen',
    eigenTuin: true,
    wachttijdMaanden: 6,
    energielabel: 'B',
  },
  zorgprofielen: ['VV4', 'VV6'],
  zorgprofielenContext:
    'Kleinschalig somatisch — geschikt voor middelzware zorg. VV8 (zeer intensief) kan vanwege de schaal niet altijd, daar bespreken we per situatie.',
  gallery: [
    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', label: 'Voorgevel' },
    { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', label: 'Woonkamer woongroep 1' },
    { src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', label: 'Tuin' },
    { src: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&q=80', label: 'Keuken' },
    { src: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80', label: 'Hal' },
  ],
  doelgroep: [
    { label: 'Somatische zorg', beschikbaar: true },
    { label: 'Kleinschalig wonen', beschikbaar: true },
    { label: 'Huisdier toegestaan', beschikbaar: true },
    { label: 'Eigen tuin', beschikbaar: true },
    { label: 'Partneropname', beschikbaar: false },
  ],
  sfeer: {
    eyebrow: 'Een dag in Het Sterrenbos',
    titel: 'Drie kleine woongroepen, elk met eigen ritme en kleur.',
    body: [
      'Het Sterrenbos heeft drie woongroepen van ieder ongeveer tien bewoners. Elke woongroep heeft een eigen huiskamer, keuken en team. Dat betekent dat de dag binnen je groep heel persoonlijk wordt — wie wat wil eten, wanneer er opgestaan wordt.',
      'Tussen de woongroepen door loopt een tuinpad. Veel bewoners kennen elkaar over de groepen heen van de wandeling of de gezamenlijke activiteiten op woensdag.',
    ],
    timeline: [
      { tijd: '8:00 — 9:30', tekst: 'Ontbijt per woongroep, op eigen tempo' },
      { tijd: '11:00', tekst: 'Activiteit binnen of buiten' },
      { tijd: '13:00', tekst: 'Lunch per woongroep' },
      { tijd: '15:00', tekst: 'Bezoek of rustmoment' },
    ],
  },
  team: [
    { naam: 'Jorien Visser', rol: 'Locatiemanager', quote: '"Drie groepen van tien — daar zit een bewuste schaal achter. Niet zo klein dat één uitval het team kraakt, niet zo groot dat je elkaar niet meer kent."', foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80' },
  ],
  cijfers: [
    { label: 'Bouwjaar pand', value: '1985', context: 'Grondige renovatie in 2021.' },
    { label: 'Energielabel', value: 'B', badge: { tekst: 'B', variant: 'b' }, context: 'Na renovatie naar B getild.' },
    { label: 'Bedrijfsstabiliteit', value: 'Stabiel', badge: { tekst: '●', variant: 'medium' }, context: 'Onderdeel van een middelgrote zorgcoöperatie.' },
    { label: 'Aantal locaties', value: '2', context: 'Kleine, regionale organisatie.' },
  ],
  cijfersBron: 'Bronnen: BAG, EP-Online, DigiMV',
  organisatie: {
    naam: 'Zorgcoöperatie Sterrenbos',
    initiaal: 'S',
    reactieDatum: 'Reactie · maart 2026',
    quote: '"We zijn coöperatief opgezet — familie en buurt zijn medeverantwoordelijk voor hoe het hier werkt. Dat zorgt voor betrokkenheid die je in grotere organisaties zelden ziet."',
  },
  voorzieningen: [
    { naam: 'Eigen kamer met badkamer', beschikbaar: true, icon: 'home' },
    { naam: 'Drie aparte woonkamers', beschikbaar: true, icon: 'home' },
    { naam: 'Tuin met paden', beschikbaar: true, icon: 'leaf' },
    { naam: 'Activiteitenruimte', beschikbaar: true, icon: 'message' },
    { naam: 'Huisdier toegestaan', beschikbaar: true, icon: 'home' },
    { naam: 'Logeerkamer', beschikbaar: false, icon: 'x' },
  ],
  wachttijd: {
    eyebrow: 'Realistische indicatie',
    titel: 'Gemiddeld 5 tot 8 maanden vanaf aanmelding',
    tekst: 'Door de kleinschalige opzet is er minder doorstroom. Voor families met urgentie loont het om met de coöperatie in gesprek te gaan.',
    cijfer: '5-8',
    eenheid: 'maanden',
  },
  omgeving: {
    pois: [
      { type: 'transit', label: 'Bushalte 250m', positie: { top: '22%', left: '24%' } },
      { type: 'shop', label: 'Buurtwinkels 400m', positie: { top: '60%', left: '20%' } },
      { type: 'nature', label: 'Stadspark 1km', positie: { top: '76%', left: '54%' } },
      { type: 'medical', label: 'Huisarts 350m', positie: { top: '28%', right: '20%' } },
    ],
    info: [
      { label: 'Bereikbaarheid', value: 'Rustige woonwijk, OV op loopafstand' },
      { label: 'Buurtkenmerk', value: 'Groen, jaren-80 wijk, gevarieerde bewoning' },
      { label: 'Reistijd vanaf u', value: '28 minuten met de auto' },
    ],
  },
}

const residentieMarekade: Locatie = {
  slug: 'residentie-marekade',
  naam: 'Residentie Marekade',
  type: 'Verzorgingshuis · zelfstandige appartementen',
  zorgType: 'verzorgingshuis',
  tagline:
    'Ruime appartementen aan het water in Leeuwarden, met zorg op afroep — voor wie zelfstandig wil blijven met de zekerheid van zorg dichtbij.',
  cardTagline: 'Eigen appartement aan het water, zorg op afroep.',
  breadcrumbs: [
    { label: 'Zoeken', href: '/zoeken' },
    { label: 'Friesland', href: '/zoeken?regio=friesland' },
    { label: 'Leeuwarden', href: '/zoeken?regio=leeuwarden' },
  ],
  meta: { afstandKm: 24, bewoners: 80, bouwjaar: 2015, wachttijdLabel: '2-4 mnd' },
  coord: { lat: 53.2049, lng: 5.8021 },
  filters: {
    regio: 'Leeuwarden',
    gemeente: 'Leeuwarden',
    postcode: '8911',
    kleinschalig: false,
    partneropname: true,
    huisdier: true,
    religieuzeIdentiteit: 'geen',
    eigenTuin: false,
    wachttijdMaanden: 3,
    energielabel: 'A',
  },
  zorgprofielen: ['VV4'],
  zorgprofielenContext:
    'Voor zelfstandige bewoning met lichte zorg op afroep. Geen 24-uurs verpleegzorg (VV6/VV7/VV8). Voor zwaardere zorg kan binnen het netwerk worden doorverwezen.',
  gallery: [
    { src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80', label: 'Voorgevel aan het water' },
    { src: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80', label: 'Voorbeeld appartement' },
    { src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', label: 'Lobby' },
    { src: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80', label: 'Restaurant' },
    { src: 'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=600&q=80', label: 'Terras aan het water' },
  ],
  doelgroep: [
    { label: 'Zelfstandig wonen', beschikbaar: true },
    { label: 'Zorg op afroep', beschikbaar: true },
    { label: 'Partneropname mogelijk', beschikbaar: true },
    { label: 'Huisdier toegestaan', beschikbaar: true },
    { label: 'Zware zorg (PG/somatiek)', beschikbaar: false },
  ],
  sfeer: {
    eyebrow: 'Een dag in Residentie Marekade',
    titel: 'Eigen voordeur, eigen ritme, gezelschap als u dat wilt.',
    body: [
      'Marekade voelt als een hotelresidentie. U heeft een eigen appartement met keuken en badkamer, en bepaalt zelf wat u eet, wanneer u opstaat, of u thuis ontbijt of in het restaurant beneden.',
      'Zorg is er als u die nodig heeft — via een knop, of in een vaste afspraak. Voor het overige is het uw eigen huis. Veel bewoners gebruiken het restaurant alleen \'s avonds, of komen alleen voor activiteiten.',
    ],
    timeline: [
      { tijd: 'Eigen ritme', tekst: 'Geen vaste tijden — alles draait om eigen invulling' },
      { tijd: '12:00 — 14:00', tekst: 'Restaurant open voor lunch' },
      { tijd: '17:30 — 19:30', tekst: 'Diner in restaurant of in eigen appartement' },
      { tijd: '24/7', tekst: 'Zorg op afroep via alarmknop' },
    ],
  },
  team: [
    { naam: 'Esther Bergsma', rol: 'Directeur', quote: '"Wij zijn geen verpleeghuis — we zijn een woonconcept met zorg. Het verschil zit in autonomie. Onze bewoners zien zichzelf niet als patiënt."', foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80' },
  ],
  cijfers: [
    { label: 'Bouwjaar pand', value: '2015', context: 'Nieuwbouw, ontworpen voor zelfstandig wonen.' },
    { label: 'Energielabel', value: 'A', badge: { tekst: 'A', variant: 'a' }, context: 'BENG-norm, warmtepomp en zonnepanelen.' },
    { label: 'Bedrijfsstabiliteit', value: 'Goed', badge: { tekst: '●', variant: 'good' }, context: 'Particuliere financiering, stabiele bezetting.' },
    { label: 'Aantal locaties', value: '1', context: 'Zelfstandige residentie, niet onderdeel van een koepel.' },
  ],
  cijfersBron: 'Bronnen: BAG, EP-Online, KvK',
  organisatie: {
    naam: 'Residentie Marekade B.V.',
    initiaal: 'M',
    reactieDatum: 'Reactie · maart 2026',
    quote: '"Wij zien onszelf als een tussenstap — voor wie thuis niet meer past, maar voor wie verpleeghuis nog niet aan de orde is. De zorg schaalt mee met wat u nodig heeft."',
  },
  voorzieningen: [
    { naam: 'Eigen appartement met keuken', beschikbaar: true, icon: 'home' },
    { naam: 'Restaurant', beschikbaar: true, icon: 'utensils' },
    { naam: 'Lobby met receptie', beschikbaar: true, icon: 'home' },
    { naam: 'Zorg 24/7 op afroep', beschikbaar: true, icon: 'message' },
    { naam: 'Terras aan het water', beschikbaar: true, icon: 'leaf' },
    { naam: 'Bibliotheek', beschikbaar: true, icon: 'book' },
    { naam: 'Logeerkamer', beschikbaar: true, icon: 'bed' },
    { naam: 'Eigen tuin', beschikbaar: false, icon: 'x' },
  ],
  wachttijd: {
    eyebrow: 'Realistische indicatie',
    titel: 'Gemiddeld 2 tot 4 maanden vanaf aanmelding',
    tekst: 'Doordat de bezetting redelijk doorstromend is en de financieringsstructuur breder, zijn wachttijden korter dan bij reguliere verpleeghuizen.',
    cijfer: '2-4',
    eenheid: 'maanden',
  },
  omgeving: {
    pois: [
      { type: 'transit', label: 'Bus 150m', positie: { top: '18%', left: '20%' } },
      { type: 'shop', label: 'Stadshart 1km', positie: { top: '32%', left: '68%' } },
      { type: 'nature', label: 'Wandelroute langs het water', positie: { top: '72%', left: '52%' } },
      { type: 'medical', label: 'Huisarts in pand', positie: { top: '40%', right: '20%' } },
    ],
    info: [
      { label: 'Bereikbaarheid', value: 'Goed met OV, eigen parkeergarage' },
      { label: 'Buurtkenmerk', value: 'Aan het water, dichtbij stadshart' },
      { label: 'Reistijd vanaf u', value: '29 minuten met de auto' },
    ],
  },
}

const zonnehofAanleun: Locatie = {
  slug: 'zonnehof-aanleun',
  naam: 'Zonnehof Aanleunwoningen',
  type: 'Aanleunwoning · zelfstandig met zorg dichtbij',
  zorgType: 'aanleunwoning',
  tagline:
    'Eigen woning naast zorgcentrum Zonnehof in Heerenveen — zelfstandig, met de zekerheid dat hulp om de hoek is.',
  cardTagline: 'Eigen woning naast zorgcentrum, hulp om de hoek.',
  breadcrumbs: [
    { label: 'Zoeken', href: '/zoeken' },
    { label: 'Friesland', href: '/zoeken?regio=friesland' },
    { label: 'Heerenveen', href: '/zoeken?regio=heerenveen' },
  ],
  meta: { afstandKm: 16, bewoners: 45, bouwjaar: 2002, renovatie: 2018, wachttijdLabel: '1-3 mnd' },
  coord: { lat: 52.9640, lng: 5.9283 },
  filters: {
    regio: 'Heerenveen',
    gemeente: 'Heerenveen',
    postcode: '8443',
    kleinschalig: false,
    partneropname: true,
    huisdier: true,
    religieuzeIdentiteit: 'geen',
    eigenTuin: true,
    wachttijdMaanden: 2,
    energielabel: 'B',
  },
  zorgprofielen: [],
  zorgprofielenContext:
    'Aanleunwoningen vragen geen Wlz-indicatie. Zorg wordt geleverd via Wmo (gemeente) en Zvw (wijkverpleging). Bij toenemende zorgbehoefte is doorstroom naar het naastgelegen verpleeghuis mogelijk.',
  gallery: [
    { src: 'https://images.unsplash.com/photo-1564540583246-934409427776?w=1200&q=80', label: 'Aanleunwoningen' },
    { src: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=600&q=80', label: 'Voorbeeld interieur' },
    { src: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=600&q=80', label: 'Plein voor het zorgcentrum' },
    { src: 'https://images.unsplash.com/photo-1503423909728-91c8c2bfd9a2?w=600&q=80', label: 'Gemeenschappelijke ruimte' },
    { src: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=600&q=80', label: 'Privé tuin' },
  ],
  doelgroep: [
    { label: 'Zelfstandig wonen', beschikbaar: true },
    { label: 'Zorg op afroep', beschikbaar: true },
    { label: 'Partneropname mogelijk', beschikbaar: true },
    { label: 'Huisdier toegestaan', beschikbaar: true },
    { label: 'Eigen tuintje', beschikbaar: true },
    { label: '24/7 verpleegzorg', beschikbaar: false },
  ],
  sfeer: {
    eyebrow: 'Een dag in een aanleunwoning',
    titel: 'Helemaal uw eigen huis — alleen dan met de zekerheid van zorg om de hoek.',
    body: [
      'De aanleunwoningen zijn 45 zelfstandige woningen direct naast Zonnehof. U heeft uw eigen voordeur, eigen meubels, eigen ritme. De woning heeft een kleine tuin of balkon en is rolstoeltoegankelijk.',
      'Zorg komt op afroep — via de alarmknop, of in vaste afspraken. Veel bewoners gebruiken de gezamenlijke ruimte voor koffie of een maaltijd, maar dat is altijd vrijwillig.',
    ],
    timeline: [
      { tijd: 'Eigen ritme', tekst: 'Geen vaste tijden, u bepaalt zelf' },
      { tijd: 'Op afroep', tekst: 'Zorg beschikbaar via alarmknop of telefoon' },
      { tijd: 'Optioneel', tekst: 'Koffieochtend, maaltijden of activiteiten in Zonnehof' },
      { tijd: '24/7', tekst: 'Verpleegkundige bereikbaar in nabijgelegen pand' },
    ],
  },
  team: [
    { naam: 'Rinske de Vries', rol: 'Coördinator Aanleunwoningen', quote: '"Mensen zien ons soms als een wachtkamer voor het verpleeghuis. Dat zijn we niet. Veel bewoners blijven hier acht, tien jaar — gewoon thuis."', foto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&q=80' },
  ],
  cijfers: [
    { label: 'Bouwjaar pand', value: '2002', context: 'Volledig gerenoveerd in 2018.' },
    { label: 'Energielabel', value: 'B', badge: { tekst: 'B', variant: 'b' }, context: 'Na renovatie naar B getild.' },
    { label: 'Bedrijfsstabiliteit', value: 'Goed', badge: { tekst: '●', variant: 'good' }, context: 'Onderdeel van Stichting Zonnehof, lokaal verankerd.' },
    { label: 'Aantal locaties', value: '4', context: 'Stichting Zonnehof beheert zorgcentrum + aanleunwoningen.' },
  ],
  cijfersBron: 'Bronnen: BAG, EP-Online, DigiMV',
  organisatie: {
    naam: 'Stichting Zonnehof',
    initiaal: 'Z',
    reactieDatum: 'Reactie · februari 2026',
    quote: '"De aanleunwoningen zijn voor ons net zo belangrijk als ons verpleeghuis. Het is een woonvorm die mensen lang autonoom houdt — en als zwaardere zorg nodig wordt, is de stap naar binnen kort."',
  },
  voorzieningen: [
    { naam: 'Eigen voordeur', beschikbaar: true, icon: 'home' },
    { naam: 'Eigen tuintje of balkon', beschikbaar: true, icon: 'leaf' },
    { naam: 'Eigen keuken en badkamer', beschikbaar: true, icon: 'utensils' },
    { naam: 'Alarmknop met 24/7 hulp', beschikbaar: true, icon: 'message' },
    { naam: 'Gemeenschappelijke ruimte', beschikbaar: true, icon: 'home' },
    { naam: 'Huisdier toegestaan', beschikbaar: true, icon: 'home' },
    { naam: 'Restaurant naast de deur', beschikbaar: true, icon: 'utensils' },
    { naam: 'Eigen 24/7 verpleegafdeling', beschikbaar: false, icon: 'x' },
  ],
  wachttijd: {
    eyebrow: 'Realistische indicatie',
    titel: 'Gemiddeld 1 tot 3 maanden vanaf aanmelding',
    tekst: 'Door de zelfstandige woonvorm is doorstroming hoger dan bij zware zorg. Verhuizen kan vaak binnen enkele weken na akkoord.',
    cijfer: '1-3',
    eenheid: 'maanden',
  },
  omgeving: {
    pois: [
      { type: 'transit', label: 'Bushalte voor de deur', positie: { top: '20%', left: '22%' } },
      { type: 'shop', label: 'Supermarkt 200m', positie: { top: '54%', left: '24%' } },
      { type: 'medical', label: 'Zorgcentrum naast de deur', positie: { top: '40%', right: '38%' } },
      { type: 'nature', label: 'Park 400m', positie: { top: '74%', left: '60%' } },
    ],
    info: [
      { label: 'Bereikbaarheid', value: 'Centraal in Heerenveen, OV voor de deur' },
      { label: 'Buurtkenmerk', value: 'Gemengde woonwijk, levendig' },
      { label: 'Reistijd vanaf u', value: '19 minuten met de auto' },
    ],
  },
}

export const locaties: Locatie[] = [
  deWilgenhof,
  huizeAnna,
  deTjongerwald,
  hetSterrenbos,
  residentieMarekade,
  zonnehofAanleun,
]

export function getLocatie(slug: string): Locatie | undefined {
  return locaties.find((l) => l.slug === slug)
}

export function toLocatieKort(l: Locatie): LocatieKort {
  return {
    slug: l.slug,
    naam: l.naam,
    type: l.type,
    zorgType: l.zorgType,
    cardTagline: l.cardTagline,
    meta: l.meta,
    coord: l.coord,
    filters: l.filters,
    zorgprofielen: l.zorgprofielen,
    coverImage: l.gallery[0]?.src ?? '',
  }
}

export function locatiesKort(): LocatieKort[] {
  return locaties.map(toLocatieKort)
}

export const zorgTypeCounts: Record<ZorgType, number> = locaties.reduce(
  (acc, l) => {
    acc[l.zorgType] = (acc[l.zorgType] ?? 0) + 1
    return acc
  },
  { pg: 0, somatiek: 0, verzorgingshuis: 0, aanleunwoning: 0 } as Record<ZorgType, number>,
)
