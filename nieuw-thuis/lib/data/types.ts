export type Crumb = { label: string; href: string }

export type GalleryItem = {
  src: string
  label: string
}

export type Doelgroep = { label: string; beschikbaar: boolean }

export type TimelineMoment = { tijd: string; tekst: string }

export type Sfeer = {
  eyebrow: string
  titel: string
  body: string[]
  timeline: TimelineMoment[]
}

export type Teamlid = {
  naam: string
  rol: string
  quote: string
  foto: string
}

export type Cijfer = {
  label: string
  value: string
  badge?: { tekst: string; variant: 'a' | 'b' | 'good' | 'medium' }
  context: string
}

export type OrgResponse = {
  naam: string
  initiaal: string
  reactieDatum: string
  quote: string
}

export type Voorziening = { naam: string; beschikbaar: boolean; icon: string }

export type Wachttijd = {
  eyebrow: string
  titel: string
  tekst: string
  cijfer: string
  eenheid: string
}

export type PoiType = 'transit' | 'shop' | 'nature' | 'medical'
export type Poi = {
  type: PoiType
  label: string
  positie: { top: string; left?: string; right?: string }
}

export type Omgeving = {
  pois: Poi[]
  info: { label: string; value: string }[]
}

export type LocatieMeta = {
  afstandKm: number
  bewoners: number
  bouwjaar: number
  renovatie?: number
  wachttijdLabel: string
}

export type ZorgType = 'pg' | 'somatiek' | 'verzorgingshuis' | 'aanleunwoning'

export type ReligieuzeIdentiteit =
  | 'geen'
  | 'protestants'
  | 'katholiek'
  | 'joods'
  | 'islamitisch'

export type Energielabel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export type ZorgProfiel = 'VV4' | 'VV5' | 'VV6' | 'VV7' | 'VV8' | 'VV9b' | 'VV10'

export type IndicatieStatus = 'wlz' | 'wmo-zvw' | 'geen' | 'onbekend'

export type Coord = { lat: number; lng: number }

export type BagPand = {
  pandId: string
  bouwjaar: number
  oppervlakteM2: number
  gebruiksdoelen: string[]
  status: string
  bagViewerUrl?: string
}

export type DigiMV = {
  jaar: number
  personeelsverloopPct: number
  ziekteverzuimPct: number
  bezettingsgraadPct: number
  sectorGemiddelde: {
    personeelsverloopPct: number
    ziekteverzuimPct: number
  }
  bron?: string
}

export type IgjRapport = {
  datum: string
  status: 'voldoet' | 'voldoet niet' | 'in verbetertraject'
  url?: string
  samenvatting?: string
}

export type PubliekeBronnen = {
  bag?: BagPand
  digimv?: DigiMV
  igj?: IgjRapport
}

export type Locatie = {
  slug: string
  naam: string
  type: string
  zorgType: ZorgType
  tagline: string
  cardTagline: string
  breadcrumbs: Crumb[]
  meta: LocatieMeta
  coord: Coord
  filters: {
    regio: string
    gemeente: string
    postcode: string
    kleinschalig: boolean
    partneropname: boolean
    huisdier: boolean
    religieuzeIdentiteit: ReligieuzeIdentiteit
    eigenTuin: boolean
    wachttijdMaanden: number
    energielabel: Energielabel
  }
  zorgprofielen: ZorgProfiel[]
  zorgprofielenContext: string
  gallery: GalleryItem[]
  doelgroep: Doelgroep[]
  sfeer: Sfeer
  team: Teamlid[]
  cijfers: Cijfer[]
  cijfersBron: string
  organisatie: OrgResponse
  voorzieningen: Voorziening[]
  wachttijd: Wachttijd
  omgeving: Omgeving
  publiekeBronnen?: PubliekeBronnen
}

export type LocatieKort = Pick<
  Locatie,
  'slug' | 'naam' | 'type' | 'zorgType' | 'cardTagline' | 'meta' | 'coord' | 'filters' | 'zorgprofielen'
> & { coverImage: string }

export const zorgTypeLabels: Record<ZorgType, string> = {
  pg: 'Verpleeghuis — PG (dementie)',
  somatiek: 'Verpleeghuis — Somatiek',
  verzorgingshuis: 'Verzorgingshuis / geclusterd wonen',
  aanleunwoning: 'Aanleunwoning / zelfstandig met zorg',
}

export const zorgTypeKort: Record<ZorgType, string> = {
  pg: 'PG',
  somatiek: 'Somatiek',
  verzorgingshuis: 'Verzorgingshuis',
  aanleunwoning: 'Aanleunwoning',
}

export const religieuzeIdentiteitLabels: Record<ReligieuzeIdentiteit, string> = {
  geen: 'Geen voorkeur',
  protestants: 'Protestants-christelijk',
  katholiek: 'Rooms-katholiek',
  joods: 'Joods',
  islamitisch: 'Islamitisch',
}

export const zorgProfielen: { code: ZorgProfiel; kort: string; lang: string; categorie: string }[] = [
  { code: 'VV4', kort: 'VV4 — Beschut wonen', lang: 'Beschut wonen met intensieve begeleiding', categorie: 'Lichte zorg' },
  { code: 'VV5', kort: 'VV5 — PG, lichter', lang: 'Beschermd wonen met intensieve dementiezorg', categorie: 'Psychogeriatrie' },
  { code: 'VV6', kort: 'VV6 — Intensieve zorg', lang: 'Beschermd wonen met intensieve verzorging en verpleging', categorie: 'PG of somatiek' },
  { code: 'VV7', kort: 'VV7 — PG, zwaar', lang: 'Beschermd wonen met zeer intensieve zorg, vanwege ernstige PG-problematiek', categorie: 'Psychogeriatrie' },
  { code: 'VV8', kort: 'VV8 — Somatiek, zwaar', lang: 'Beschermd wonen met zeer intensieve zorg, vanwege specifieke aandoeningen', categorie: 'Somatiek' },
  { code: 'VV9b', kort: 'VV9b — Revalidatie', lang: 'Herstelgerichte behandeling met verpleging en verzorging', categorie: 'Tijdelijk' },
  { code: 'VV10', kort: 'VV10 — Palliatief', lang: 'Beschermd verblijf met intensieve palliatief-terminale zorg', categorie: 'Palliatief' },
]

export const zorgProfielMap: Record<ZorgProfiel, (typeof zorgProfielen)[number]> = Object.fromEntries(
  zorgProfielen.map((p) => [p.code, p]),
) as Record<ZorgProfiel, (typeof zorgProfielen)[number]>

export const indicatieLabels: Record<IndicatieStatus, string> = {
  wlz: 'Wlz-indicatie afgegeven',
  'wmo-zvw': 'Wmo of Zvw (wijkverpleging)',
  geen: 'Nog geen indicatie',
  onbekend: 'Weet ik niet zeker',
}
