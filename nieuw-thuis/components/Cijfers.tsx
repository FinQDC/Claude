import type { Cijfer } from '@/lib/data/types'

const badgeStyles: Record<NonNullable<Cijfer['badge']>['variant'], string> = {
  a: 'bg-[#2E7A3A] text-white',
  b: 'bg-[#5C8B3A] text-white',
  good: 'bg-green-ok text-white',
  medium: 'bg-oker text-night',
}

export function Cijfers({ cijfers, bron }: { cijfers: Cijfer[]; bron: string }) {
  return (
    <section className="mb-14">
      <div className="bg-night text-cream rounded-xl p-10 md:px-11 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(212, 160, 90, 0.1) 0%, transparent 70%)',
          }}
        />

        <div className="flex justify-between items-start mb-7 relative">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-oker mb-2.5">
              Openbare gegevens
            </div>
            <h3 className="font-serif font-medium text-[26px] text-cream tracking-tight">
              De cijfers die ertoe doen
            </h3>
          </div>
          <div className="text-xs text-cream/60 text-right leading-[1.5] whitespace-pre-line">
            {bron.replace(', ', ',\n')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-cream/10 rounded-lg overflow-hidden relative">
          {cijfers.map((c) => (
            <div
              key={c.label}
              className="bg-night p-6 px-[22px] transition-colors hover:bg-[#2A4258]"
            >
              <div className="text-[11px] uppercase tracking-[0.15em] text-oker font-semibold mb-3">
                {c.label}
              </div>
              <div className="font-serif font-medium text-[28px] text-cream leading-[1.05] tracking-tight mb-2 flex items-baseline gap-2.5">
                {c.value}
                {c.badge && (
                  <span
                    className={`inline-block px-2.5 py-[3px] rounded text-[11px] font-bold font-sans ${
                      badgeStyles[c.badge.variant]
                    }`}
                  >
                    {c.badge.tekst}
                  </span>
                )}
              </div>
              <div className="text-xs text-cream/70 leading-[1.45]">{c.context}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-5 border-t border-cream/10 text-xs text-cream/60 leading-[1.5] italic">
          Cijfers samengesteld uit publieke registers. Nieuw Thuis geeft geen oordeel over kwaliteit
          — de getoonde context is bedoeld om uw eigen afweging te ondersteunen.
        </div>
      </div>
    </section>
  )
}
