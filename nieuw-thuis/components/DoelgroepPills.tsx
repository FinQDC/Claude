import { Check, X } from 'lucide-react'
import type { Doelgroep } from '@/lib/data/types'

export function DoelgroepPills({ items }: { items: Doelgroep[] }) {
  return (
    <section className="mb-14">
      <h2 className="font-serif font-medium text-[26px] text-night mb-6 tracking-tight">
        Voor wie geschikt
      </h2>
      <div className="flex flex-wrap gap-2">
        {items.map((d) => (
          <span
            key={d.label}
            className={`bg-cream-warm border border-line px-4 py-2 rounded-full text-[13px] font-medium inline-flex items-center gap-2 ${
              d.beschikbaar ? 'text-night' : 'text-ink-muted'
            }`}
          >
            {d.beschikbaar ? (
              <Check size={14} strokeWidth={2.5} className="text-salie" />
            ) : (
              <X size={14} strokeWidth={2.5} className="text-ink-muted opacity-50" />
            )}
            {d.label}
          </span>
        ))}
      </div>
    </section>
  )
}
