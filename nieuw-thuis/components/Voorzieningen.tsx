import { Home, Leaf, Utensils, MessageSquare, Footprints, BookOpen, BedDouble, X } from 'lucide-react'
import type { Voorziening } from '@/lib/data/types'

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  home: Home,
  leaf: Leaf,
  utensils: Utensils,
  message: MessageSquare,
  footprints: Footprints,
  book: BookOpen,
  bed: BedDouble,
  x: X,
}

export function Voorzieningen({ items }: { items: Voorziening[] }) {
  return (
    <section className="mb-14">
      <h2 className="font-serif font-medium text-[26px] text-night mb-6 tracking-tight">
        Voorzieningen
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line rounded-lg overflow-hidden">
        {items.map((v) => {
          const Icon = iconMap[v.icon] ?? Home
          return (
            <div
              key={v.naam}
              className={`bg-cream-warm py-4.5 px-5 flex items-center gap-3.5 transition-colors hover:bg-cream ${
                !v.beschikbaar ? 'opacity-90' : ''
              }`}
              style={{ paddingTop: '18px', paddingBottom: '18px' }}
            >
              <div
                className={`w-8 h-8 rounded-md bg-cream border border-line flex items-center justify-center shrink-0 ${
                  v.beschikbaar ? 'text-terracotta' : 'text-ink-muted opacity-50'
                }`}
              >
                <Icon size={18} />
              </div>
              <span
                className={`text-sm font-medium ${
                  v.beschikbaar ? 'text-night' : 'text-ink-muted line-through'
                }`}
              >
                {v.naam}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
