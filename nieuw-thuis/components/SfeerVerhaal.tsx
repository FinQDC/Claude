import type { Sfeer } from '@/lib/data/types'

export function SfeerVerhaal({ sfeer }: { sfeer: Sfeer }) {
  return (
    <section className="mb-14">
      <div className="bg-cream-warm rounded-xl p-10 md:px-11 border border-line">
        <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-salie mb-4">
          {sfeer.eyebrow}
        </div>
        <h3 className="font-serif font-medium text-[28px] leading-[1.2] tracking-tight text-night mb-6">
          {sfeer.titel}
        </h3>
        <div className="font-serif text-[17px] leading-[1.75] text-ink">
          {sfeer.body.map((para, i) => (
            <p key={i} className={`mb-3.5 ${i === 0 ? 'dropcap' : ''}`}>
              {para}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-8 pt-8 border-t border-line">
          {sfeer.timeline.map((moment, i) => (
            <div key={i} className="text-center">
              <div className="font-serif italic text-sm text-terracotta mb-1.5">{moment.tijd}</div>
              <div className="text-xs text-ink-soft leading-[1.4]">{moment.tekst}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
