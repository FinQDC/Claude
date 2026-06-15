import type { Wachttijd as WachttijdT } from '@/lib/data/types'

export function Wachttijd({ wachttijd }: { wachttijd: WachttijdT }) {
  return (
    <section className="mb-14">
      <h2 className="font-serif font-medium text-[26px] text-night mb-6 tracking-tight">
        Wachttijd
      </h2>
      <div className="bg-cream-warm border border-line rounded-xl p-7 px-8 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-salie mb-2">
            {wachttijd.eyebrow}
          </div>
          <div className="font-serif font-medium text-[20px] text-night mb-2.5 tracking-tight">
            {wachttijd.titel}
          </div>
          <div className="text-sm text-ink-soft leading-[1.6]">{wachttijd.tekst}</div>
        </div>
        <div className="text-left sm:text-right">
          <div className="font-serif font-medium text-[42px] text-terracotta leading-none tracking-tight">
            {wachttijd.cijfer}
          </div>
          <div className="text-[13px] text-ink-soft mt-1">{wachttijd.eenheid}</div>
        </div>
      </div>
    </section>
  )
}
