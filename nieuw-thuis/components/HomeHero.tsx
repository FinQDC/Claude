'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import type { ZorgType } from '@/lib/data/types'

type Tile = {
  type: ZorgType
  titel: string
  subtitel: string
  beschrijving: string
  beeld: string
  aantal: number
}

export function HomeHero({
  tiles,
  totaalLocaties,
}: {
  tiles: Tile[]
  totaalLocaties: number
}) {
  const router = useRouter()
  const [postcode, setPostcode] = useState('')
  const [type, setType] = useState<ZorgType | null>(null)

  const submit = (chosenType?: ZorgType) => {
    const t = chosenType ?? type
    if (!t) return
    const params = new URLSearchParams({ type: t })
    if (postcode.trim()) params.set('postcode', postcode.trim())
    router.push(`/zoeken?${params.toString()}`)
  }

  return (
    <section className="bg-gradient-to-b from-cream-warm to-cream pt-12 pb-16">
      <div className="wrap">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta mb-4">
            Voor uw vader, moeder, partner — of voor uzelf
          </div>
          <h1 className="font-serif font-medium text-[40px] md:text-[52px] leading-[1.05] tracking-tight text-night mb-5">
            Wat voor woonplek zoekt u?
          </h1>
          <p className="font-serif italic text-[19px] text-ink-soft leading-[1.5]">
            Eén goede keuze begint met het juiste type zorg. Wij tonen alleen wat past — geen
            verpleeghuis tussen aanleunwoningen, geen GGZ tussen somatiek.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tiles.map((tile) => (
            <button
              key={tile.type}
              onClick={() => submit(tile.type)}
              className={`group relative bg-white border-2 ${
                type === tile.type ? 'border-terracotta' : 'border-line'
              } rounded-xl overflow-hidden text-left transition-all hover:border-terracotta hover:-translate-y-1 hover:shadow-lg-soft`}
            >
              <div
                className="h-36 bg-cover bg-center"
                style={{ backgroundImage: `url('${tile.beeld}')` }}
              >
                <div className="h-full w-full bg-gradient-to-t from-black/30 to-transparent flex items-end p-4">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-white/90 font-semibold drop-shadow">
                    {tile.titel}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="font-serif font-medium text-[20px] leading-tight tracking-tight text-night mb-2">
                  {tile.subtitel}
                </div>
                <p className="text-[13px] text-ink-soft leading-[1.5] mb-3">{tile.beschrijving}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-salie font-semibold">{tile.aantal} locaties in regio</span>
                  <ArrowRight
                    size={16}
                    className="text-terracotta opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white border border-line rounded-xl p-5 md:p-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center max-w-3xl mx-auto shadow-sm-soft">
          <div className="flex items-center gap-3 flex-1">
            <MapPin size={20} className="text-terracotta shrink-0" />
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="Postcode (optioneel) — bv. 9203 BC"
              className="w-full bg-transparent text-[15px] text-ink placeholder:text-ink-muted focus:outline-none"
            />
          </div>
          <span className="text-[13px] text-ink-soft hidden md:inline">
            of klik een type hierboven
          </span>
          <Link
            href="/zoeken"
            className="bg-night text-cream text-center px-6 py-3 rounded-md font-semibold text-sm no-underline hover:bg-night-soft transition-colors"
          >
            Alle {totaalLocaties} locaties
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link
            href="#hoe-werkt-het"
            className="text-[13px] text-ink-soft underline underline-offset-4 hover:text-terracotta"
          >
            Liever even uitleg krijgen voordat u zoekt?
          </Link>
        </div>
      </div>
    </section>
  )
}
