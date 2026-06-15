import type { Omgeving, PoiType } from '@/lib/data/types'

const poiDotColors: Record<PoiType, string> = {
  transit: 'bg-[#4A6FA5]',
  shop: 'bg-oker',
  nature: 'bg-salie',
  medical: 'bg-terracotta',
}

export function OmgevingMap({ omgeving }: { omgeving: Omgeving }) {
  return (
    <section className="mb-14">
      <h2 className="font-serif font-medium text-[26px] text-night mb-6 tracking-tight">
        In de omgeving
      </h2>
      <div className="bg-white border border-line rounded-xl overflow-hidden">
        <div
          className="relative h-[360px] overflow-hidden"
          style={{ background: '#E8E2D4' }}
        >
          {/* Paper-textuur achtergrond */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 70% 30%, rgba(122, 139, 111, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(184, 161, 130, 0.15) 0%, transparent 60%)',
            }}
          />
          {/* Subtiele grid */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(31, 53, 72, 0.04) 60px, rgba(31, 53, 72, 0.04) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(31, 53, 72, 0.04) 60px, rgba(31, 53, 72, 0.04) 61px)',
            }}
          />

          <MapSvg />

          {/* Hoofdpin */}
          <div
            className="absolute z-[5] flex flex-col items-center"
            style={{ top: '45%', left: '48%', transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-16 h-16 bg-terracotta/20 rounded-full absolute animate-[pulse_2.5s_ease-in-out_infinite]" />
            <div className="w-5 h-5 bg-terracotta rounded-full border-[3px] border-white shadow-[0_3px_10px_rgba(0,0,0,0.25)] relative z-[2]" />
            <div className="bg-night text-cream text-[11px] py-[5px] px-[11px] rounded mt-2.5 whitespace-nowrap font-semibold z-[2] shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
              De Wilgenhof
            </div>
          </div>

          {/* POIs */}
          {omgeving.pois.map((poi, i) => (
            <div
              key={i}
              className="absolute bg-white border border-line py-[5px] px-[11px] rounded-full text-[11px] text-ink font-medium shadow-sm-soft flex items-center gap-1.5 z-[4]"
              style={poi.positie}
            >
              <span className={`w-[7px] h-[7px] rounded-full ${poiDotColors[poi.type]}`} />
              {poi.label}
            </div>
          ))}

          {/* Zoom controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-px bg-line rounded-md overflow-hidden z-[6] shadow-md-soft">
            <button className="bg-white w-[34px] h-[34px] flex items-center justify-center text-lg text-night font-light hover:bg-cream-warm">
              +
            </button>
            <button className="bg-white w-[34px] h-[34px] flex items-center justify-center text-lg text-night font-light hover:bg-cream-warm">
              −
            </button>
          </div>

          <div className="absolute bottom-2 right-3 text-[10px] text-ink-muted z-[4]">
            Indicatieve kaart
          </div>
        </div>

        <div className="p-6 px-7 bg-cream-warm border-t border-line grid grid-cols-1 md:grid-cols-3 gap-6">
          {omgeving.info.map((item) => (
            <div key={item.label} className="border-l-2 border-terracotta pl-3.5">
              <div className="text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-1 font-semibold">
                {item.label}
              </div>
              <div className="font-serif font-medium text-base text-night leading-[1.3]">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MapSvg() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bospartij (rechtsonder, salie) */}
      <path
        d="M 480 280 Q 560 260, 620 300 Q 700 320, 780 290 L 800 400 L 480 400 Z"
        fill="rgba(122, 139, 111, 0.25)"
      />
      <circle cx="540" cy="320" r="14" fill="rgba(122, 139, 111, 0.35)" />
      <circle cx="600" cy="340" r="18" fill="rgba(122, 139, 111, 0.4)" />
      <circle cx="680" cy="330" r="12" fill="rgba(122, 139, 111, 0.35)" />
      <circle cx="720" cy="360" r="16" fill="rgba(122, 139, 111, 0.4)" />
      <circle cx="560" cy="370" r="10" fill="rgba(122, 139, 111, 0.3)" />
      <circle cx="650" cy="380" r="14" fill="rgba(122, 139, 111, 0.35)" />

      {/* Parkje */}
      <ellipse cx="120" cy="340" rx="60" ry="30" fill="rgba(122, 139, 111, 0.2)" />
      <circle cx="100" cy="335" r="8" fill="rgba(122, 139, 111, 0.4)" />
      <circle cx="140" cy="345" r="10" fill="rgba(122, 139, 111, 0.4)" />

      {/* Vijver */}
      <ellipse cx="180" cy="80" rx="50" ry="22" fill="rgba(120, 160, 200, 0.35)" />

      {/* Hoofdweg */}
      <path d="M 0 200 Q 200 196, 384 200 L 800 204" stroke="white" strokeWidth="14" fill="none" />
      <path d="M 0 200 Q 200 196, 384 200 L 800 204" stroke="rgba(31, 53, 72, 0.15)" strokeWidth="14" fill="none" />
      <path d="M 0 200 Q 200 196, 384 200 L 800 204" stroke="white" strokeWidth="10" fill="none" />

      {/* Kruisende weg */}
      <path d="M 400 0 L 400 400" stroke="white" strokeWidth="10" fill="none" />
      <path d="M 400 0 L 400 400" stroke="rgba(31, 53, 72, 0.1)" strokeWidth="10" fill="none" />
      <path d="M 400 0 L 400 400" stroke="white" strokeWidth="7" fill="none" />

      {/* Wegje naar bos */}
      <path d="M 400 200 Q 500 220, 580 280" stroke="rgba(31, 53, 72, 0.12)" strokeWidth="5" fill="none" />
      <path d="M 400 200 Q 500 220, 580 280" stroke="white" strokeWidth="3" fill="none" />

      {/* Wegje linksboven */}
      <path d="M 0 110 Q 100 105, 220 130 L 400 145" stroke="rgba(31, 53, 72, 0.1)" strokeWidth="4" fill="none" />
      <path d="M 0 110 Q 100 105, 220 130 L 400 145" stroke="white" strokeWidth="2.5" fill="none" />

      {/* Wegje rechtsboven */}
      <path d="M 400 130 L 680 100 L 800 80" stroke="rgba(31, 53, 72, 0.1)" strokeWidth="4" fill="none" />
      <path d="M 400 130 L 680 100 L 800 80" stroke="white" strokeWidth="2.5" fill="none" />

      {/* Gebouwen */}
      <rect x="60" y="170" width="40" height="22" fill="rgba(31, 53, 72, 0.08)" rx="2" />
      <rect x="110" y="170" width="30" height="22" fill="rgba(31, 53, 72, 0.08)" rx="2" />
      <rect x="60" y="218" width="50" height="20" fill="rgba(31, 53, 72, 0.08)" rx="2" />
      <rect x="120" y="218" width="35" height="20" fill="rgba(31, 53, 72, 0.08)" rx="2" />
      <rect x="220" y="170" width="45" height="20" fill="rgba(31, 53, 72, 0.08)" rx="2" />
      <rect x="280" y="172" width="38" height="18" fill="rgba(31, 53, 72, 0.08)" rx="2" />
      <rect x="230" y="218" width="40" height="22" fill="rgba(31, 53, 72, 0.08)" rx="2" />
      <rect x="290" y="218" width="42" height="20" fill="rgba(31, 53, 72, 0.08)" rx="2" />

      {/* De Wilgenhof gebouw */}
      <rect
        x="370"
        y="178"
        width="50"
        height="38"
        fill="rgba(185, 96, 63, 0.18)"
        stroke="rgba(185, 96, 63, 0.4)"
        strokeWidth="1"
        rx="3"
      />

      <rect x="450" y="172" width="40" height="22" fill="rgba(31, 53, 72, 0.08)" rx="2" />
      <rect x="500" y="170" width="35" height="22" fill="rgba(31, 53, 72, 0.08)" rx="2" />
      <rect x="450" y="220" width="44" height="22" fill="rgba(31, 53, 72, 0.08)" rx="2" />

      {/* Straatnamen */}
      <text x="200" y="195" fontFamily="Inter, sans-serif" fontSize="9" fill="rgba(31, 53, 72, 0.45)" fontStyle="italic">
        De Wouden
      </text>
      <text
        x="410"
        y="100"
        fontFamily="Inter, sans-serif"
        fontSize="9"
        fill="rgba(31, 53, 72, 0.45)"
        fontStyle="italic"
        transform="rotate(90, 410, 100)"
      >
        Boslaan
      </text>
      <text x="620" y="340" fontFamily="Inter, sans-serif" fontSize="10" fill="rgba(122, 139, 111, 0.7)" fontStyle="italic">
        Wouden van Drachten
      </text>
      <text x="160" y="78" fontFamily="Inter, sans-serif" fontSize="9" fill="rgba(120, 160, 200, 0.7)" fontStyle="italic">
        Vijver
      </text>
    </svg>
  )
}
