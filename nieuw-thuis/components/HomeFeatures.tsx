import { Search, Eye, MessageCircle } from 'lucide-react'

export function HomeFeatures() {
  const steps = [
    {
      icon: <Search size={22} />,
      titel: 'Vertel ons voor wie',
      tekst:
        'Het type zorg bepaalt alles. Eén klik en u ziet alleen plekken die echt passen. Geen GGZ tussen verpleeghuizen, geen aanleunwoningen waar 24-uurs zorg nodig is.',
    },
    {
      icon: <Eye size={22} />,
      titel: 'Vergelijk eerlijk',
      tekst:
        'Per locatie tonen we de cijfers die ertoe doen: bouwjaar, energielabel, bedrijfsstabiliteit, wachttijd. Plus context — wat de organisatie zelf zegt, wie het team is, hoe een dag eruitziet.',
    },
    {
      icon: <MessageCircle size={22} />,
      titel: 'Geen verkoopdruk',
      tekst:
        'Wij zijn geen bemiddelingsbureau. U vraagt zelf de rondleiding aan, of laat onze begeleider u helpen. Geen commissie, geen voorkeursaanbieders.',
    },
  ]

  return (
    <section id="hoe-werkt-het" className="py-16">
      <div className="wrap">
        <div className="text-center mb-12 max-w-xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-salie mb-3">
            Hoe Nieuw Thuis werkt
          </div>
          <h2 className="font-serif font-medium text-[32px] leading-tight tracking-tight text-night">
            Eerlijke informatie, niet meer en niet minder.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-cream-warm border border-line rounded-xl p-7 transition-all hover:border-terracotta-soft hover:-translate-y-0.5 hover:shadow-md-soft"
            >
              <div className="w-11 h-11 rounded-full bg-terracotta-bg text-terracotta flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <div className="font-serif font-medium text-[20px] tracking-tight text-night mb-2.5">
                {step.titel}
              </div>
              <p className="text-[14px] leading-[1.65] text-ink-soft">{step.tekst}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
