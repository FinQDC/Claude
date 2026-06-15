import { zorgProfielMap, type ZorgProfiel } from '@/lib/data/types'

export function Zorgprofielen({
  profielen,
  context,
}: {
  profielen: ZorgProfiel[]
  context: string
}) {
  return (
    <section className="mb-14">
      <h2 className="font-serif font-medium text-[26px] text-night mb-6 tracking-tight">
        Welke zorgprofielen levert deze locatie?
      </h2>

      {profielen.length === 0 ? (
        <div className="bg-salie-bg border border-line rounded-xl p-6 px-7">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-salie mb-2">
            Geen Wlz-indicatie nodig
          </div>
          <p className="text-[15px] text-ink leading-[1.65]">{context}</p>
        </div>
      ) : (
        <>
          <p className="text-[15px] text-ink leading-[1.65] mb-5">{context}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profielen.map((code) => {
              const p = zorgProfielMap[code]
              return (
                <div
                  key={code}
                  className="bg-cream-warm border border-line rounded-lg p-4 px-5 flex items-start gap-3.5"
                >
                  <div className="w-11 h-11 rounded-md bg-terracotta text-cream flex items-center justify-center font-bold text-[13px] shrink-0">
                    {p.code}
                  </div>
                  <div>
                    <div className="font-serif font-medium text-[15px] text-night leading-tight mb-1">
                      {p.kort.replace(`${p.code} — `, '')}
                    </div>
                    <div className="text-[12px] text-ink-soft leading-[1.45]">{p.lang}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-[12px] text-ink-muted mt-5 italic leading-[1.5]">
            Op basis van openbare informatie en het zorgaanbod zoals door de organisatie zelf
            aangegeven. Definitieve plaatsing hangt af van uw CIZ-besluit en het beoordelingsgesprek
            met de locatie.
          </p>
        </>
      )}
    </section>
  )
}
