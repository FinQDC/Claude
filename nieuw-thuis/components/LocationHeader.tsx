import { MapPin, Users, Home, Clock } from 'lucide-react'
import type { Locatie } from '@/lib/data/types'

export function LocationHeader({ locatie }: { locatie: Locatie }) {
  const renovatieTekst = locatie.meta.renovatie ? `, renovatie ${locatie.meta.renovatie}` : ''

  return (
    <div className="pb-7 border-b border-line mb-9">
      <div className="text-xs font-semibold uppercase tracking-[0.15em] text-terracotta mb-3 flex items-center gap-3.5">
        <span className="w-6 h-px bg-terracotta" />
        {locatie.type}
      </div>
      <h1 className="font-serif font-medium text-[34px] md:text-[46px] leading-[1.05] tracking-tight text-night mb-3.5">
        {locatie.naam}
      </h1>
      <p className="font-serif italic text-[19px] text-ink-soft leading-[1.5] mb-6">
        {locatie.tagline}
      </p>

      <div className="flex flex-wrap gap-6 text-sm text-ink-soft">
        <MetaItem icon={<MapPin size={16} />}>
          <strong className="text-night font-semibold mr-1">{locatie.meta.afstandKm} km</strong>
          vanaf uw adres
        </MetaItem>
        <MetaItem icon={<RectIcon />}>
          <strong className="text-night font-semibold mr-1">{locatie.meta.bewoners}</strong>
          bewoners
        </MetaItem>
        <MetaItem icon={<Home size={16} />}>
          Gebouw uit <strong className="text-night font-semibold mx-1">{locatie.meta.bouwjaar}</strong>
          {renovatieTekst}
        </MetaItem>
        <MetaItem icon={<Clock size={16} />}>
          Wachttijd{' '}
          <strong className="text-night font-semibold mx-1">{locatie.meta.wachttijdLabel}</strong>
        </MetaItem>
      </div>
    </div>
  )
}

function MetaItem({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-terracotta shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  )
}

function RectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
    </svg>
  )
}
