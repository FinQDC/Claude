'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X, MapPin } from 'lucide-react'
import { LocatieCard } from './LocatieCard'
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
}

export function ZoekClient({ alleLocaties }: { alleLocaties: LocatieKort[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

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
    }),
    [searchParams],
  )

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
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
  }

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

    if (filters.sort === 'wachttijd')
      r.sort((a, b) => a.filters.wachttijdMaanden - b.filters.wachttijdMaanden)
    else if (filters.sort === 'naam') r.sort((a, b) => a.naam.localeCompare(b.naam))
    else r.sort((a, b) => a.meta.afstandKm - b.meta.afstandKm)

    return r
  }, [alleLocaties, filters])

  const actieveFilterCount = countActive(filters)

  return (
    <div className="wrap py-8">
      {filters.profiel && (
        <div className="bg-terracotta-bg border border-terracotta-soft rounded-lg p-4 px-5 mb-6 flex items-start gap-4">
          <div className="w-9 h-9 rounded-full bg-terracotta text-cream flex items-center justify-center font-bold text-[13px] shrink-0">
            {filters.profiel}
          </div>
          <div className="flex-1">
            <div className="font-serif font-medium text-[16px] text-night mb-0.5">
              Alleen locaties die {filters.profiel} kunnen leveren
            </div>
            <div className="text-[13px] text-ink-soft leading-[1.5]">
              {zorgProfielMap[filters.profiel].lang}.
            </div>
          </div>
          <button
            onClick={() => updateFilter('profiel', null)}
            className="text-[12px] text-ink-soft hover:text-terracotta underline underline-offset-2 shrink-0"
          >
            Verwijder
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-terracotta mb-2">
            {filters.type ? zorgTypeLabels[filters.type] : 'Alle zorgvormen'}
          </div>
          <h1 className="font-serif font-medium text-[34px] tracking-tight text-night">
            {resultaten.length} {resultaten.length === 1 ? 'locatie' : 'locaties'}
            {filters.postcode && (
              <span className="text-ink-soft font-normal text-[20px] ml-3">
                rondom {filters.postcode}
              </span>
            )}
          </h1>
        </div>
        <div className="flex items-center gap-3">
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

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          <div className="bg-white border border-line rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif font-medium text-[18px] text-night flex items-center gap-2">
                <Filter size={16} className="text-terracotta" />
                Filters
              </h2>
              {actieveFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[12px] text-ink-soft hover:text-terracotta underline underline-offset-2"
                >
                  Wis alles ({actieveFilterCount})
                </button>
              )}
            </div>

            <FilterGroup titel="Type zorg">
              <div className="space-y-1.5">
                <RadioRow
                  checked={filters.type === null}
                  label="Alle types"
                  onChange={() => updateFilter('type', null)}
                />
                {(Object.keys(zorgTypeLabels) as ZorgType[]).map((t) => (
                  <RadioRow
                    key={t}
                    checked={filters.type === t}
                    label={zorgTypeLabels[t]}
                    onChange={() => updateFilter('type', t)}
                  />
                ))}
              </div>
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
              <p className="text-[11px] text-ink-muted mt-2 leading-[1.4]">
                Staat op uw CIZ-besluit. Onbekend?{' '}
                <a href="/indicatie" className="underline hover:text-terracotta">
                  Lees uitleg
                </a>
                .
              </p>
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

            <FilterGroup titel="Wat is voor uw familie belangrijk?">
              <div className="space-y-2">
                <CheckRow
                  checked={filters.kleinschalig}
                  label="Kleinschalig (≤30 bewoners)"
                  onChange={(v) => updateFilter('kleinschalig', v)}
                />
                <CheckRow
                  checked={filters.partneropname}
                  label="Partneropname mogelijk"
                  onChange={(v) => updateFilter('partneropname', v)}
                />
                <CheckRow
                  checked={filters.huisdier}
                  label="Huisdier toegestaan"
                  onChange={(v) => updateFilter('huisdier', v)}
                />
                <CheckRow
                  checked={filters.eigenTuin}
                  label="Eigen tuin"
                  onChange={(v) => updateFilter('eigenTuin', v)}
                />
              </div>
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

            <FilterGroup titel="Maximale wachttijd">
              <div className="space-y-1.5">
                {[null, 3, 6, 12].map((m) => (
                  <RadioRow
                    key={String(m)}
                    checked={filters.maxWachttijd === m}
                    label={m === null ? 'Maakt niet uit' : `Binnen ${m} maanden`}
                    onChange={() => updateFilter('maxWachttijd', m)}
                  />
                ))}
              </div>
            </FilterGroup>
          </div>
        </aside>

        <div>
          {resultaten.length === 0 ? (
            <EmptyState onClear={clearAll} />
          ) : (
            <div className="space-y-4">
              {resultaten.map((l) => (
                <LocatieCard key={l.slug} locatie={l} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 pb-5 border-b border-line last:border-b-0 last:mb-0 last:pb-0">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft mb-3">
        {titel}
      </h3>
      {children}
    </div>
  )
}

function CheckRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-terracotta cursor-pointer"
      />
      <span className="text-[13px] text-ink leading-[1.4] group-hover:text-night">{label}</span>
    </label>
  )
}

function RadioRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: () => void
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer group">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 w-4 h-4 accent-terracotta cursor-pointer"
      />
      <span className="text-[13px] text-ink leading-[1.4] group-hover:text-night">{label}</span>
    </label>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="bg-cream-warm border border-line rounded-xl p-12 text-center">
      <X size={32} className="mx-auto text-ink-muted mb-4" />
      <h3 className="font-serif font-medium text-[22px] text-night mb-2">
        Geen locaties met deze combinatie
      </h3>
      <p className="text-[14px] text-ink-soft mb-5 max-w-md mx-auto">
        Dat kan kloppen — de combinatie is specifiek. Probeer een filter weg te halen, of bel met
        onze begeleider die misschien een suggestie heeft buiten dit overzicht.
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
  return n
}
