export function Footer() {
  return (
    <footer className="bg-night text-cream/70 py-12 pb-7">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 mb-10">
          <div>
            <div className="font-serif font-semibold text-[22px] text-cream mb-2.5">
              Nieuw Thuis
            </div>
            <p className="text-[13px] leading-relaxed max-w-[320px]">
              Eén plek voor de weg van thuis wonen naar wonen met zorg. Op basis van publieke data,
              eerlijk gepresenteerd.
            </p>
          </div>
          <FooterCol
            titel="Bronnen"
            items={[
              { label: 'BAG (Kadaster)', href: '#' },
              { label: 'EP-Online', href: '#' },
              { label: 'DigiMV', href: '#' },
              { label: 'CBS Open Data', href: '#' },
            ]}
          />
          <FooterCol
            titel="Hulp"
            items={[
              { label: 'Vraag een gesprek', href: '#' },
              { label: 'Veelgestelde vragen', href: '#' },
              { label: 'Voor professionals', href: '#' },
              { label: 'Privacy', href: '#' },
            ]}
          />
        </div>
        <div className="pt-6 border-t border-cream/10 text-xs text-cream/50">
          © 2026 Nieuw Thuis · Een initiatief van FinQDC, in verkenningsfase
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  titel,
  items,
}: {
  titel: string
  items: { label: string; href: string }[]
}) {
  return (
    <div>
      <h6 className="text-[11px] uppercase tracking-[0.15em] text-oker font-semibold mb-4">
        {titel}
      </h6>
      <ul className="list-none">
        {items.map((item) => (
          <li key={item.label} className="mb-2">
            <a href={item.href} className="text-cream/70 text-[13px] no-underline">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
