'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X, MapPin, ChevronDown } from 'lucide-react'
import { LocatieCard } from './LocatieCard'
import { MapResultaten } from './MapResultaten'
import {
  type LocatieKort,
  type ZorgType,
  type ReligieuzeIdentiteit,
  type ZorgProfiel,
  zorgTypeLabels,
  religieuzeIdentiteitLabels,
  zorgProfielen,
  zorgProfielMap,
} from '@/lib/data/types'

type Sort = 'afstand' | 'wachttijd' | 'naam'

type FilterState = {
  type: ZorgType | null
  profiel: ZorgProfiel | null
  postcode: string
  kleinschalig: boolean
  partneropname: boolean
  huisdier: boolean
  eigenTuin: boolean
  religieuzeIdentiteit: ReligieuzeIdentiteit | null
  maxWachttijd: number | null
  sort: Sort
  nearbySlug: string | null
}

export function ZoekClient({ alleLocaties }: { alleLocaties: LocatieKort[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const filters: FilterState = useMemo(
    () => ({
      type: (searchParams.get('type') as ZorgType | null) || null,
      profiel: (searchParams.get('profiel') as ZorgProfiel | null) || null,
      postcode: searchParams.get('postcode') || '',
      kleinschalig: searchParams.get('kleinschalig') === '1',
      partneropname: searchParams.get('partneropname') === '1',
      huisdier: searchParams.get('huisdier') === '1',
      eigenTuin: searchParams.get('eigenTuin') === '1',
      religieuzeIdentiteit:
        (searchParams.get('religie') as ReligieuzeIdentiteit | null) || null,
      maxWachttijd: searchParams.get('maxWacht')
        ? Number(searchParams.get('maxWacht'))
        : null,
      sort: (searchParams.get('sort') as Sort) || 'afstand',
      nearbySlug: searchParams.get('nearby') || null,
    }),
    [searchParams],
  )

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      const params = new URLSearchParams(searchParams.toString())
      const paramKey = paramName(key)
      if (
        value === null ||
        value === '' ||
        value === false ||
        (key === 'sort' && value === 'afstand')
      ) {
        params.delete(paramKey)
      } else {
        params.set(paramKey, value === true ? '1' : String(value))
      }
      router.replace(`/zoeken?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  const clearAll = () => router.replace('/zoeken')

  const resultaten = useMemo(() => {
    let r = alleLocaties.slice()
    if (filters.type) r = r.filter((l) => l.zorgType === filters.type)
    if (filters.profiel) r = r.filter((l) => l.zorgprofielen.includes(filters.profiel!))
    if (filters.kleinschalig) r = r.filter((l) => l.filters.kleinschalig)
    if (filters.partneropname) r = r.filter((l) => l.filters.partneropname)
    if (filters.huisdier) r = r.filter((l) => l.filters.huisdier)
    if (filters.eigenTuin) r = r.filter((l) => l.filters.eigenTuin)
    if (filters.religieuzeIdentiteit)
      r = r.filter((l) => l.filters.religieuzeIdentiteit === filters.religieuzeIdentiteit)
    if (filters.maxWachttijd !== null)
      r = r.filter((l) => l.filters.wachttijdMaanden <= filters.maxWachttijd!)
    if (filters.nearbySlug) {
      const anchor = alleLocaties.find((l) => l.slug === filters.nearbySlug)
      if (anchor) {
        r = r.filter((l) => distanceKm(l.coord, anchor.coord) <= 5)
      }
    }

    if (filters.sort === 'wachttijd')
      r.sort((a, b) => a.filters.wachttijdMaanden - b.filters.wachttijdMaanden)
    else if (filters.sort === 'naam') r.sort((a, b) => a.naam.localeCompare(b.naam))
    else r.sort((a, b) => a.meta.afstandKm - b.meta.afstandKm)

    return r
  }, [alleLocaties, filters])

  const actieveFilterCount = countActive(filters)

  const onFilterNearby = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('nearby', slug)
      router.replace(`/zoeken?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  const onFilterSameType = useCallback(
    (slug: string) => {
      const anchor = alleLocaties.find((l) => l.slug === slug)
      if (!anchor) return
      const params = new URLSearchParams(searchParams.toString())
      params.set('type', anchor.zorgType)
      router.replace(`/zoeken?${params.toString()}`, { scroll: false })
    },
    [router, searchParams, alleLocaties],
  )

  const anchorLocatie = filters.nearbySlug
    ? alleLocaties.find((l) => l.slug === filters.nearbySlug)
    : null

  return (
    <div>
      <div className="sticky top-[68px] z-30 bg-white border-b border-line">
        <div className="wrap py-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="inline-flex items-center gap-2 bg-night text-cream text-[13px] font-semibold px-4 py-2 rounded-md hover:bg-night-soft"
            >
              <Filter size={14} />
              Filters
              {actieveFilterCount > 0 && (
                <span className="bg-terracotta text-cream text-[11px] font-bold px-1.5 py-0.5 rounded">
                  {actieveFilterCount}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <FilterChip
              actief={filters.type !== null}
              label={filters.type ? zorgTypeLabels[filters.type] : 'Type zorg'}
              onClear={filters.type ? () => updateFilter('type', null) : undefined}
            />
            <FilterChip
              actief={!!filters.postcode}
              label={filters.postcode ? `Postcode ${filters.postcode}` : 'Postcode'}
              onClear={filters.postcode ? () => updateFilter('postcode', '') : undefined}
            />
            {filters.maxWachttijd !== null && (
              <FilterChip
                actief
                label={`Binnen ${filters.maxWachttijd} mnd`}
                onClear={() => updateFilter('maxWachttijd', null)}
              />
            )}
            {filters.kleinschalig && (
              <FilterChip
                actief
                label="Kleinschalig"
                onClear={() => updateFilter('kleinschalig', false)}
              />
            )}
            {filters.partneropname && (
              <FilterChip
                actief
                label="Partneropname"
                onClear={() => updateFilter('partneropname', false)}
              />
            )}
            {filters.huisdier && (
              <FilterChip
                actief
                label="Huisdier"
                onClear={() => updateFilter('huisdier', false)}
              />
            )}
            {filters.eigenTuin && (
              <FilterChip
                actief
                label="Eigen tuin"
                onClear={() => updateFilter('eigenTuin', false)}
              />
            )}
            {filters.profiel && (
              <FilterChip
                actief
                label={`Profiel ${filters.profiel}`}
                onClear={() => updateFilter('profiel', null)}
              />
            )}
            {filters.religieuzeIdentiteit && (
              <FilterChip
                actief
                label={religieuzeIdentiteitLabels[filters.religieuzeIdentiteit]}
                onClear={() => updateFilter('religieuzeIdentiteit', null)}
              />
            )}
            {anchorLocatie && (
              <FilterChip
                actief
                label={`≤5 km van ${anchorLocatie.naam}`}
                onClear={() => updateFilter('nearbySlug', null)}
              />
            )}
            {actieveFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="text-[12px] text-ink-soft hover:text-terracotta underline underline-offset-2 ml-2"
              >
                Wis alles
              </button>
            )}

            <div className="ml-auto flex items-center gap-3">
              <span className="text-[13px] text-ink-soft">
                <strong className="text-night">{resultaten.length}</strong>{' '}
                {resultaten.length === 1 ? 'locatie' : 'locaties'}
              </span>
              <label className="text-[13px] text-ink-soft">
                Sorteer:
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value as Sort)}
                  className="ml-2 bg-white border border-line rounded-md px-3 py-1.5 text-[13px] text-night focus:outline-none focus:border-terracotta"
                >
                  <option value="afstand">Dichtstbij</option>
                  <option value="wachttijd">Kortste wachttijd</option>
                  <option value="naam">Naam (A-Z)</option>
                </select>
              </label>
            </div>
          </div>

          {filtersOpen && (
            <div className="mt-4 pt-4 border-t border-line grid grid-cols-2 md:grid-cols-4 gap-5">
              <FilterGroup titel="Type zorg">
                <select
                  value={filters.type ?? ''}
                  onChange={(e) =>
                    updateFilter('type', (e.target.value || null) as ZorgType | null)
                  }
                  className="w-full bg-white border border-line rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-terracotta"
                >
                  <option value="">Alle types</option>
                  {(Object.keys(zorgTypeLabels) as ZorgType[]).map((t) => (
                    <option key={t} value={t}>
                      {zorgTypeLabels[t]}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup titel="Wlz-zorgprofiel">
                <select
                  value={filters.profiel ?? ''}
                  onChange={(e) =>
                    updateFilter('profiel', (e.target.value || null) as ZorgProfiel | null)
                  }
                  className="w-full bg-white border border-line rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-terracotta"
                >
                  <option value="">Geen filter</option>
                  {zorgProfielen.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.kort}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup titel="Postcode">
                <div className="flex items-center gap-2 border border-line rounded-md px-3 py-2 bg-cream-warm">
                  <MapPin size={14} className="text-terracotta shrink-0" />
                  <input
                    type="text"
                    value={filters.postcode}
                    onChange={(e) => updateFilter('postcode', e.target.value)}
                    placeholder="bv. 9203"
                    className="flex-1 bg-transparent text-[13px] focus:outline-none"
                  />
                </div>
              </FilterGroup>

              <FilterGroup titel="Max. wachttijd">
                <select
                  value={filters.maxWachttijd === null ? '' : String(filters.maxWachttijd)}
                  onChange={(e) =>
                    updateFilter(
                      'maxWachttijd',
                      e.target.value === '' ? null : Number(e.target.value),
                    )
                  }
                  className="w-full bg-white border border-line rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-terracotta"
                >
                  <option value="">Maakt niet uit</option>
                  <option value="3">Binnen 3 maanden</option>
                  <option value="6">Binnen 6 maanden</option>
                  <option value="12">Binnen 12 maanden</option>
                </select>
              </FilterGroup>

              <FilterGroup titel="Levensbeschouwing">
                <select
                  value={filters.religieuzeIdentiteit ?? ''}
                  onChange={(e) =>
                    updateFilter(
                      'religieuzeIdentiteit',
                      (e.target.value || null) as ReligieuzeIdentiteit | null,
                    )
                  }
                  className="w-full bg-white border border-line rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-terracotta"
                >
                  <option value="">Geen voorkeur</option>
                  {(Object.keys(religieuzeIdentiteitLabels) as ReligieuzeIdentiteit[])
                    .filter((k) => k !== 'geen')
                    .map((k) => (
                      <option key={k} value={k}>
                        {religieuzeIdentiteitLabels[k]}
                      </option>
                    ))}
                </select>
              </FilterGroup>

              <FilterGroup titel="Belangrijk voor familie" wide>
                <div className="flex flex-wrap gap-2">
                  <ChipToggle
                    actief={filters.kleinschalig}
                    label="Kleinschalig (≤30 bewoners)"
                    onToggle={(v) => updateFilter('kleinschalig', v)}
                  />
                  <ChipToggle
                    actief={filters.partneropname}
                    label="Partneropname mogelijk"
                    onToggle={(v) => updateFilter('partneropname', v)}
                  />
                  <ChipToggle
                    actief={filters.huisdier}
                    label="Huisdier toegestaan"
                    onToggle={(v) => updateFilter('huisdier', v)}
                  />
                  <ChipToggle
                    actief={filters.eigenTuin}
                    label="Eigen tuin"
                    onToggle={(v) => updateFilter('eigenTuin', v)}
                  />
                </div>
              </FilterGroup>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
        <div className="bg-cream">
          <div className="p-5 lg:p-6 space-y-4">
            {resultaten.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <>
                {filters.profiel && (
                  <div className="bg-terracotta-bg border border-terracotta-soft rounded-lg p-4 px-5 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-terracotta text-cream flex items-center justify-center font-bold text-[13px] shrink-0">
                      {filters.profiel}
                    </div>
                    <div className="flex-1 text-[12px] text-ink-soft leading-[1.5]">
                      <strong className="text-night">Alleen {filters.profiel}</strong> —{' '}
                      {zorgProfielMap[filters.profiel].lang}.
                    </div>
                  </div>
                )}
                {resultaten.map((l) => (
                  <div
                    key={l.slug}
                    onMouseEnter={() => setSelectedSlug(l.slug)}
                    onMouseLeave={() => setSelectedSlug(null)}
                  >
                    <LocatieCard locatie={l} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="hidden lg:block relative bg-cream-warm">
          <div className="sticky top-[140px] h-[calc(100vh-140px)]">
            <MapResultaten
              locaties={resultaten}
              selectedSlug={selectedSlug}
              onSelect={setSelectedSlug}
              onFilterNearby={onFilterNearby}
              onFilterSameType={onFilterSameType}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterGroup({
  titel,
  children,
  wide,
}: {
  titel: string
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <div className={wide ? 'md:col-span-3' : ''}>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft mb-2">
        {titel}
      </h3>
      {children}
    </div>
  )
}

function FilterChip({
  actief,
  label,
  onClear,
}: {
  actief: boolean
  label: string
  onClear?: () => void
}) {
  if (!actief && !onClear) {
    return (
      <span className="text-[12px] text-ink-muted bg-cream-warm border border-line rounded-full px-3 py-1.5">
        {label}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-terracotta-bg border border-terracotta-soft text-terracotta-deep rounded-full px-3 py-1.5">
      {label}
      {onClear && (
        <button
          onClick={onClear}
          className="hover:text-terracotta"
          aria-label={`Verwijder ${label}`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  )
}

function ChipToggle({
  actief,
  label,
  onToggle,
}: {
  actief: boolean
  label: string
  onToggle: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onToggle(!actief)}
      className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
        actief
          ? 'bg-terracotta text-cream border-terracotta'
          : 'bg-white text-ink border-line hover:border-terracotta-soft'
      }`}
    >
      {label}
    </button>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="bg-cream-warm border border-line rounded-xl p-10 text-center">
      <X size={32} className="mx-auto text-ink-muted mb-4" />
      <h3 className="font-serif font-medium text-[22px] text-night mb-2">
        Geen locaties met deze combinatie
      </h3>
      <p className="text-[14px] text-ink-soft mb-5 max-w-md mx-auto">
        Probeer een filter weg te halen, of bel met onze begeleider die misschien een suggestie
        heeft buiten dit overzicht.
      </p>
      <button
        onClick={onClear}
        className="bg-terracotta text-cream px-5 py-2.5 rounded-md font-semibold text-[13px]"
      >
        Wis alle filters
      </button>
    </div>
  )
}

function paramName(key: keyof FilterState): string {
  switch (key) {
    case 'maxWachttijd':
      return 'maxWacht'
    case 'religieuzeIdentiteit':
      return 'religie'
    case 'nearbySlug':
      return 'nearby'
    default:
      return key
  }
}

function countActive(f: FilterState): number {
  let n = 0
  if (f.type) n++
  if (f.profiel) n++
  if (f.postcode) n++
  if (f.kleinschalig) n++
  if (f.partneropname) n++
  if (f.huisdier) n++
  if (f.eigenTuin) n++
  if (f.religieuzeIdentiteit) n++
  if (f.maxWachttijd !== null) n++
  if (f.nearbySlug) n++
  return n
}

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(h))
}
