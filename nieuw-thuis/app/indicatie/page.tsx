import Link from 'next/link'
import { Phone, FileText, ArrowRight, Info } from 'lucide-react'
import { zorgProfielen } from '@/lib/data/types'

export const metadata = {
  title: 'Hoe werkt een indicatie? — Nieuw Thuis',
}

export default function IndicatiePage() {
  return (
    <main className="wrap py-12 max-w-3xl mx-auto">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta mb-3">
        Uitleg in 2 minuten
      </div>
      <h1 className="font-serif font-medium text-[40px] leading-tight tracking-tight text-night mb-4">
        Hoe werkt een indicatie?
      </h1>
      <p className="font-serif italic text-[18px] text-ink-soft leading-[1.55] mb-10">
        Of u nu thuis blijft wonen met hulp, of naar een verpleeghuis verhuist — voor zorg die
        langer duurt heeft u meestal een indicatie nodig. Hier leggen we de belangrijkste in
        gewone taal uit.
      </p>

      <Sectie titel="Drie soorten indicaties — welke is voor wie?">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Kaart
            kop="Wlz"
            sub="Wet langdurige zorg"
            via="Aanvragen via het CIZ"
            voor="24-uurs zorg of permanent toezicht. Vereist voor opname in een verpleeghuis."
          />
          <Kaart
            kop="Zvw"
            sub="Zorgverzekeringswet"
            via="Wijkverpleegkundige bepaalt"
            voor="Verpleging en verzorging thuis. Bv. wondzorg, hulp bij medicatie, douchehulp."
          />
          <Kaart
            kop="Wmo"
            sub="Wet maatschappelijke ondersteuning"
            via="Aanvragen via uw gemeente"
            voor="Lichte ondersteuning: huishoudelijke hulp, dagbesteding, vervoer, woningaanpassing."
          />
        </div>
      </Sectie>

      <Sectie titel="Wat is een zorgprofiel (VV4–VV10)?">
        <p className="text-[15px] text-ink leading-[1.65] mb-5">
          Als het CIZ uw Wlz-aanvraag goedkeurt, krijgt u een <strong>zorgprofiel</strong>. Dat is
          een code die zegt hoeveel en welke zorg u nodig heeft. Het bepaalt welke locaties u
          mogen opnemen.
        </p>
        <div className="space-y-2.5">
          {zorgProfielen.map((p) => (
            <div
              key={p.code}
              className="bg-cream-warm border border-line rounded-lg p-3.5 px-4 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-md bg-terracotta text-cream flex items-center justify-center font-bold text-[13px] shrink-0">
                {p.code}
              </div>
              <div className="flex-1">
                <div className="font-serif font-medium text-[15px] text-night leading-tight mb-1">
                  {p.kort.replace(`${p.code} — `, '')}{' '}
                  <span className="font-sans font-normal text-[11px] text-salie uppercase tracking-wider ml-1">
                    {p.categorie}
                  </span>
                </div>
                <div className="text-[13px] text-ink-soft leading-[1.5]">{p.lang}</div>
              </div>
            </div>
          ))}
        </div>
      </Sectie>

      <Sectie titel="Hoe vraag ik een Wlz-indicatie aan?">
        <ol className="space-y-4">
          <Stap n={1} titel="Bel uw huisarts of casemanager dementie">
            Vaak is een verwijzing of advies de eerste stap. Bij dementie helpt een casemanager u
            door het proces.
          </Stap>
          <Stap n={2} titel="Dien aanvraag in bij het CIZ">
            Telefonisch (088-789 10 00), online via mijnciz.nl, of schriftelijk. Een familielid mag
            dit ook namens iemand doen.
          </Stap>
          <Stap n={3} titel="Onderzoek door het CIZ">
            Vaak telefonisch, soms thuis. Ze bekijken zorgbehoefte, medische situatie en hoe u
            functioneert in het dagelijks leven.
          </Stap>
          <Stap n={4} titel="Besluit binnen 6 weken">
            U ontvangt een schriftelijk besluit met uw zorgprofiel. Bij urgentie kan het sneller —
            zeg dat expliciet in uw aanvraag.
          </Stap>
        </ol>
      </Sectie>

      <Sectie titel="Tip">
        <div className="bg-oker-bg border-l-[3px] border-oker rounded-r-lg p-5 px-6 flex items-start gap-4">
          <Info size={22} className="text-oker shrink-0 mt-0.5" />
          <p className="text-[14px] text-ink leading-[1.65]">
            U kunt al beginnen met zoeken voordat de indicatie er is. Aanmelden bij een locatie kan
            vaak vooruitlopend op de indicatie. Wij tonen u alvast wat past — zo gaat geen tijd
            verloren.
          </p>
        </div>
      </Sectie>

      <div className="bg-night text-cream rounded-xl p-8 px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <div className="font-serif font-medium text-[20px] mb-1.5 tracking-tight">
            Liever even iemand spreken?
          </div>
          <p className="text-[14px] text-cream/70 leading-[1.5]">
            Onze begeleider helpt u met de aanvraag en het kiezen — zonder verkoopdruk.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <a
            href="tel:0888888888"
            className="bg-terracotta text-cream px-5 py-3 rounded-md font-semibold text-sm no-underline flex items-center gap-2 hover:bg-terracotta-deep"
          >
            <Phone size={16} /> Bel ons
          </a>
          <Link
            href="/zoeken"
            className="bg-transparent text-cream border border-cream/30 px-5 py-3 rounded-md font-semibold text-sm no-underline flex items-center gap-2 hover:bg-cream/10"
          >
            Verder met zoeken <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  )
}

function Sectie({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-serif font-medium text-[24px] text-night mb-5 tracking-tight">{titel}</h2>
      {children}
    </section>
  )
}

function Kaart({
  kop,
  sub,
  via,
  voor,
}: {
  kop: string
  sub: string
  via: string
  voor: string
}) {
  return (
    <div className="bg-cream-warm border border-line rounded-lg p-5">
      <div className="font-serif font-medium text-[22px] text-night tracking-tight">{kop}</div>
      <div className="text-[11px] uppercase tracking-[0.1em] text-salie font-semibold mb-3">
        {sub}
      </div>
      <p className="text-[13px] text-ink-soft leading-[1.5] mb-3">{voor}</p>
      <div className="text-[12px] text-terracotta font-medium flex items-center gap-1.5">
        <FileText size={13} /> {via}
      </div>
    </div>
  )
}

function Stap({
  n,
  titel,
  children,
}: {
  n: number
  titel: string
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-terracotta text-cream flex items-center justify-center font-serif font-medium text-[15px] shrink-0">
        {n}
      </div>
      <div>
        <div className="font-serif font-medium text-[16px] text-night leading-tight mb-1">
          {titel}
        </div>
        <div className="text-[14px] text-ink-soft leading-[1.6]">{children}</div>
      </div>
    </li>
  )
}
