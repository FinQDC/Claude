'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Users, Clock, Search, ArrowRight } from 'lucide-react'
import type { ZorgType } from '@/lib/data/types'
import { zorgTypeLabels } from '@/lib/data/types'

type Tile = {
  type: ZorgType
  titel: string
  subtitel: string
  beschrijving: string
  beeld: string
  aantal: number
}

type Urgentie = 'urgent' | 'binnenkort' | 'orientatie' | ''

const urgentieMaanden: Record<Exclude<Urgentie, ''>, number> = {
  urgent: 3,
  binnenkort: 6,
  orientatie: 12,
}

export function HomeHero({
  tiles,
  totaalLocaties,
}: {
  tiles: Tile[]
  totaalLocaties: number
}) {
  const router = useRouter()
  const [type, setType] = useState<ZorgType | ''>('')
  const [postcode, setPostcode] = useState('')
  const [urgentie, setUrgentie] = useState<Urgentie>('')

  const submit = (override?: { type?: ZorgType }) => {
    const params = new URLSearchParams()
    const t = override?.type ?? (type || null)
    if (t) params.set('type', t)
    if (postcode.trim()) params.set('postcode', postcode.trim())
    if (urgentie) params.set('maxWacht', String(urgentieMaanden[urgentie]))
    router.push(`/zoeken${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <section className="bg-gradient-to-b from-cream-warm to-cream pt-12 md:pt-16 pb-12">
      <div className="wrap">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta mb-4">
            Voor uw vader, moeder, partner — of voor uzelf
          </div>
          <h1 className="font-serif font-medium text-[40px] md:text-[54px] leading-[1.05] tracking-tight text-night mb-5">
            Wat voor woonplek zoekt u?
          </h1>
          <p className="font-serif italic text-[19px] text-ink-soft leading-[1.5]">
            Eén goede keuze begint met de juiste vragen. Beantwoord drie korte vragen — wij tonen
            alleen wat past.
          </p>
        </div>

        <div className="bg-white border border-line rounded-2xl shadow-lg-soft max-w-4xl mx-auto p-2 md:p-2.5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-stretch">
            <SearchField
              icon={<Users size={18} />}
              label="Voor wie?"
              hint={type ? zorgTypeLabels[type] : 'Type zorg'}
              actief={!!type}
            >
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ZorgType | '')}
                className="w-full bg-transparent text-[14px] text-night font-medium focus:outline-none cursor-pointer appearance-none"
              >
                <option value="">— Kies type zorg —</option>
                <option value="pg">Verpleeghuis (PG / dementie)</option>
                <option value="somatiek">Verpleeghuis (somatiek)</option>
                <option value="verzorgingshuis">Verzorgingshuis</option>
                <option value="aanleunwoning">Aanleunwoning</option>
              </select>
            </SearchField>

            <SearchField
              icon={<MapPin size={18} />}
              label="Waar?"
              hint={postcode || 'Postcode of plaats'}
              actief={!!postcode}
            >
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="bv. 9203 of Drachten"
                className="w-full bg-transparent text-[14px] text-night font-medium placeholder:text-ink-muted placeholder:font-normal focus:outline-none"
              />
            </SearchField>

            <SearchField
              icon={<Clock size={18} />}
              label="Wanneer?"
              hint={
                urgentie
                  ? { urgent: 'Urgent (≤3 mnd)', binnenkort: 'Binnen 6 maanden', orientatie: 'Oriëntatie' }[urgentie]
                  : 'Urgentie'
              }
              actief={!!urgentie}
            >
              <select
                value={urgentie}
                onChange={(e) => setUrgentie(e.target.value as Urgentie)}
                className="w-full bg-transparent text-[14px] text-night font-medium focus:outline-none cursor-pointer appearance-none"
              >
                <option value="">— Wanneer nodig? —</option>
                <option value="urgent">Urgent (binnen 3 mnd)</option>
                <option value="binnenkort">Binnen 6 maanden</option>
                <option value="orientatie">Oriënteren (12+ mnd)</option>
              </select>
            </SearchField>

            <button
              onClick={() => submit()}
              className="bg-terracotta text-cream font-semibold text-[14px] px-6 md:px-8 py-4 rounded-xl hover:bg-terracotta-deep transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Search size={16} />
              Zoek locaties
            </button>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link
            href="/zoeken"
            className="text-[13px] text-ink-soft underline underline-offset-4 hover:text-terracotta"
          >
            Of bekijk alle {totaalLocaties} locaties zonder filter →
          </Link>
        </div>

        <div className="mt-14">
          <div className="text-center mb-6 max-w-xl mx-auto">
            <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-salie mb-2">
              Niet zeker wat u zoekt?
            </div>
            <h2 className="font-serif font-medium text-[26px] tracking-tight text-night">
              Begin met het type woonplek
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiles.map((tile) => (
              <button
                key={tile.type}
                onClick={() => submit({ type: tile.type })}
                className="group relative bg-white border-2 border-line rounded-xl overflow-hidden text-left transition-all hover:border-terracotta hover:-translate-y-1 hover:shadow-lg-soft"
              >
                <div
                  className="h-32 bg-cover bg-center"
                  style={{ backgroundImage: `url('${tile.beeld}')` }}
                >
                  <div className="h-full w-full bg-gradient-to-t from-black/30 to-transparent flex items-end p-4">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-white/90 font-semibold drop-shadow">
                      {tile.titel}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-serif font-medium text-[18px] leading-tight tracking-tight text-night mb-1.5">
                    {tile.subtitel}
                  </div>
                  <p className="text-[12px] text-ink-soft leading-[1.5] mb-3 line-clamp-3">
                    {tile.beschrijving}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-salie font-semibold">{tile.aantal} locaties</span>
                    <ArrowRight
                      size={14}
                      className="text-terracotta opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SearchField({
  icon,
  label,
  hint,
  actief,
  children,
}: {
  icon: React.ReactNode
  label: string
  hint: string
  actief: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors ${
        actief
          ? 'border-terracotta-soft bg-terracotta-bg/40'
          : 'border-transparent bg-cream-warm hover:bg-cream-deep/60'
      }`}
    >
      <div className={`shrink-0 ${actief ? 'text-terracotta' : 'text-ink-soft'}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft mb-0.5">
          {label}
        </div>
        <div className="relative">{children}</div>
      </div>
    </div>
  )
}
