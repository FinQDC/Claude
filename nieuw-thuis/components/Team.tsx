import type { Teamlid } from '@/lib/data/types'

export function Team({ leden }: { leden: Teamlid[] }) {
  return (
    <section className="mb-14">
      <h2 className="font-serif font-medium text-[26px] text-night mb-6 tracking-tight">
        Het team dat hier werkt
      </h2>
      <p className="text-base leading-[1.7] text-ink mb-6">
        Bij een verpleeghuis-keuze gaat het niet alleen om het gebouw. De mensen die er werken
        bepalen het dagelijks leven. Hier zijn een paar van de teamleden van De Wilgenhof.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leden.map((lid) => (
          <article
            key={lid.naam}
            className="bg-cream-warm border border-line rounded-xl p-7 text-center transition-all hover:border-terracotta-soft hover:-translate-y-0.5 hover:shadow-md-soft"
          >
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 bg-cover bg-center border-[3px] border-cream shadow-md-soft"
              style={{ backgroundImage: `url('${lid.foto}')` }}
            />
            <div className="font-serif font-medium text-[18px] text-night mb-1 tracking-tight">
              {lid.naam}
            </div>
            <div className="text-xs text-salie uppercase tracking-[0.1em] font-semibold mb-3.5">
              {lid.rol}
            </div>
            <p className="font-serif italic text-sm text-ink-soft leading-[1.5]">{lid.quote}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
