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

export type Locatie = {
  slug: string
  naam: string
  type: string
  zorgType: ZorgType
  tagline: string
  cardTagline: string
  breadcrumbs: Crumb[]
  meta: LocatieMeta
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
}

export type LocatieKort = Pick<
  Locatie,
  'slug' | 'naam' | 'type' | 'zorgType' | 'cardTagline' | 'meta' | 'filters'
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
