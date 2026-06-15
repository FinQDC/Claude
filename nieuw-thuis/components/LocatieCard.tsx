import Link from 'next/link'
import { MapPin, Clock, Users, Heart } from 'lucide-react'
import type { LocatieKort } from '@/lib/data/types'
import { zorgTypeKort } from '@/lib/data/types'

export function LocatieCard({ locatie }: { locatie: LocatieKort }) {
  return (
    <Link
      href={`/locatie/${locatie.slug}`}
      className="group block bg-white border border-line rounded-xl overflow-hidden no-underline transition-all hover:border-terracotta-soft hover:-translate-y-1 hover:shadow-md-soft"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr]">
        <div
          className="relative h-48 sm:h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${locatie.coverImage}')` }}
        >
          <div className="absolute top-3 left-3 bg-cream/95 backdrop-blur text-night text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded">
            {zorgTypeKort[locatie.zorgType]}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-cream/95 backdrop-blur border border-line flex items-center justify-center hover:bg-cream"
            aria-label="Voeg toe aan shortlist"
          >
            <Heart size={16} className="text-night" />
          </button>
        </div>

        <div className="p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-terracotta mb-1">
                {locatie.filters.regio}
              </div>
              <div className="font-serif font-medium text-[22px] leading-tight tracking-tight text-night">
                {locatie.naam}
              </div>
            </div>
          </div>

          <p className="text-[14px] text-ink-soft leading-[1.5] mb-4 flex-1">
            {locatie.cardTagline}
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-soft pt-3 border-t border-line">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-terracotta" />
              <strong className="text-night font-semibold">{locatie.meta.afstandKm} km</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-terracotta" />
              <strong className="text-night font-semibold">{locatie.meta.bewoners}</strong>{' '}
              bewoners
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-terracotta" />
              wachttijd{' '}
              <strong className="text-night font-semibold">{locatie.meta.wachttijdLabel}</strong>
            </span>
            <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-cream-warm border border-line rounded text-ink">
              Label {locatie.filters.energielabel}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
