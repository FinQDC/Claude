import { Heart } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="md:sticky md:top-[100px] md:self-start">
      <div className="bg-white border border-line rounded-xl p-7 shadow-sm-soft mb-5">
        <div className="font-serif font-medium text-[22px] text-night mb-2 tracking-tight">
          Volgende stap
        </div>
        <p className="text-[13px] text-ink-soft mb-6 leading-[1.5]">
          Bespreek deze locatie met het zorgteam of plan een bezoek. Geen verplichting, geen
          verkoopdruk.
        </p>

        <a
          href="#"
          className="block w-full bg-terracotta text-cream text-center py-3.5 px-5 rounded-md font-semibold text-sm mb-2.5 no-underline transition-all hover:bg-terracotta-deep hover:-translate-y-px hover:shadow-md-soft"
        >
          Vraag een rondleiding aan
        </a>
        <a
          href="#"
          className="block w-full bg-transparent text-night text-center py-3.5 px-5 rounded-md font-semibold text-sm no-underline border border-night transition-all hover:bg-night hover:text-cream"
        >
          Vraag iets aan deze locatie
        </a>

        <div className="h-px bg-line my-6" />

        <div className="flex items-center gap-3.5 py-3 px-3.5 bg-cream-warm rounded-lg border border-line">
          <Heart size={20} fill="currentColor" className="text-terracotta shrink-0" />
          <div className="text-[13px] text-ink leading-[1.4]">
            <strong className="text-night font-semibold">Op uw shortlist</strong> sinds 3 dagen.
            Drie van de vier locaties bezocht.
          </div>
        </div>
      </div>

      <AdvisorCard />
    </aside>
  )
}

function AdvisorCard() {
  return (
    <div className="border border-line rounded-xl p-7 bg-gradient-to-br from-cream-warm to-cream">
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-cream shadow-[0_2px_8px_rgba(31,53,72,0.1)] shrink-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80')",
          }}
        />
        <div>
          <div className="font-serif font-medium text-[18px] text-night mb-0.5 tracking-tight">
            Lieke van der Meer
          </div>
          <div className="text-[11px] text-salie uppercase tracking-[0.1em] font-semibold">
            Uw begeleider
          </div>
        </div>
      </div>
      <p className="text-sm text-ink-soft leading-[1.6] mb-4.5 italic" style={{ marginBottom: '18px' }}>
        &ldquo;Ik kijk al een paar weken met u mee. Wilt u dat ik contact opneem met De Wilgenhof om
        uw vragen door te geven? Of wilt u dat we eerst samen bellen om uw twijfels door te
        nemen?&rdquo;
      </p>
      <div className="flex gap-2">
        <button className="flex-1 bg-white border border-line text-night py-2.5 px-3 rounded-md text-xs font-semibold text-center hover:border-terracotta hover:text-terracotta">
          Bel met Lieke
        </button>
        <button className="flex-1 bg-white border border-line text-night py-2.5 px-3 rounded-md text-xs font-semibold text-center hover:border-terracotta hover:text-terracotta">
          Stuur bericht
        </button>
      </div>
    </div>
  )
}
