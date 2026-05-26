import Link from 'next/link'
import { Upload, Headphones, Video, RotateCw, Shield, FileCheck, Users, ArrowRight, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Organisatie-portaal — Nieuw Thuis',
  description:
    'Beheer media van uw zorglocatie: welkomsboodschap, foto\'s, video en 360°-tour.',
}

export default function PortaalPage() {
  return (
    <div className="wrap py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta mb-3">
          Voor zorgorganisaties
        </div>
        <h1 className="font-serif font-medium text-[42px] tracking-tight text-night leading-[1.05] mb-4">
          Organisatie-portaal
        </h1>
        <p className="text-[16px] text-ink-soft leading-[1.65] mb-10 max-w-2xl">
          Hier beheert u de media van uw locatie(s) op Nieuw Thuis. Upload foto&apos;s,
          welkomsboodschap, video&apos;s en 360°-tours. Familie krijgt zo sneller een eerste indruk
          — en uw team houdt tijd over voor wie écht een rondleiding aanvraagt.
        </p>

        <div className="bg-oker-bg border border-oker-soft/40 rounded-xl p-5 mb-10 flex items-start gap-3">
          <Shield size={18} className="text-oker shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] text-night font-semibold mb-1">
              Prototype — nog geen werkende upload
            </p>
            <p className="text-[13px] text-ink-soft leading-[1.55]">
              Dit is een schets van hoe het portaal eruit komt te zien. De daadwerkelijke
              upload-functionaliteit (auth, opslag, AVG-checks) bouwen we op basis van wat
              koepels en organisaties belangrijk vinden.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Feature
            icon={<Headphones size={20} />}
            titel="Welkomsboodschap"
            tekst="Spreek 1 minuut in — eigen stem of AI-stem op basis van uw tekst. Tot 60 seconden per locatie."
          />
          <Feature
            icon={<Video size={20} />}
            titel="Foto's & video"
            tekst="Drag-en-drop. Automatische compressie, gezichten kunnen we onherkenbaar maken."
          />
          <Feature
            icon={<RotateCw size={20} />}
            titel="360°-tour"
            tekst="Upload Matterport-link of 360°-foto's. Bezoekers wandelen virtueel door."
          />
        </div>

        <div className="bg-white border border-line rounded-2xl overflow-hidden mb-10">
          <div className="px-6 py-5 border-b border-line bg-cream-warm">
            <h2 className="font-serif font-medium text-[22px] text-night">
              Zo werkt het straks
            </h2>
          </div>
          <div className="divide-y divide-line">
            <Stap
              n={1}
              titel="Account aanvragen"
              tekst="Eenmalig: koppel uw zorgaanbieder-AGB-code. Wij verifiëren via het CIBG-register zodat alleen u uw locaties kunt beheren."
            />
            <Stap
              n={2}
              titel="Locatie kiezen"
              tekst="Alle vestigingen van uw organisatie staan in één overzicht. Per locatie de media apart beheren."
            />
            <Stap
              n={3}
              titel="Media uploaden"
              tekst="Drag-en-drop foto's, video, audio. AVG-checklist verplicht: 'Zijn er bewoners herkenbaar?' → geautomatiseerde face-blur waar nodig."
            />
            <Stap
              n={4}
              titel="Welkomsboodschap inspreken"
              tekst="In de browser opnemen óf tekst typen en laten omzetten naar natuurlijke stem (ElevenLabs, met uw toestemming voice-cloning mogelijk)."
            />
            <Stap
              n={5}
              titel="Status zien"
              tekst="Per item ziet u: concept · ingediend · gepubliceerd. Lichte moderatie door Nieuw Thuis (24u doorlooptijd)."
            />
          </div>
        </div>

        <div className="bg-cream-warm border border-line rounded-xl p-6 mb-10">
          <div className="flex items-start gap-3 mb-4">
            <FileCheck size={20} className="text-terracotta shrink-0 mt-1" />
            <div>
              <h3 className="font-serif font-medium text-[18px] text-night mb-1">
                AVG-eisen — vooraf duidelijk
              </h3>
              <p className="text-[13px] text-ink-soft leading-[1.55]">
                Voor zorgomgeving gelden strengere regels dan voor hotels. Wat u moet weten:
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-[13px] text-ink-soft pl-8">
            <li className="flex items-start gap-2">
              <ChevronRight size={14} className="text-terracotta shrink-0 mt-0.5" />
              <span>Bewoners herkenbaar in beeld vereist schriftelijke toestemming (Wgbo + AVG).</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight size={14} className="text-terracotta shrink-0 mt-0.5" />
              <span>
                Geen badkamers, geen persoonlijke kamers met spullen — alleen lege voorbeeldkamers.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight size={14} className="text-terracotta shrink-0 mt-0.5" />
              <span>Drone-opnames: alleen exterieur, geen ramen van bewonerskamers in beeld.</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight size={14} className="text-terracotta shrink-0 mt-0.5" />
              <span>
                Audio: stemmen op de achtergrond zijn ook persoonsgegevens — opnames in stille
                uren of in lege ruimtes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight size={14} className="text-terracotta shrink-0 mt-0.5" />
              <span>Bewaartermijn: media worden automatisch verwijderd 1 jaar na sluiting locatie.</span>
            </li>
          </ul>
        </div>

        <div className="bg-night text-cream rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-5">
            <Users size={28} className="text-terracotta-soft shrink-0" />
            <div>
              <h3 className="font-serif font-medium text-[22px] mb-2">
                Wat het uw team oplevert
              </h3>
              <p className="text-[14px] text-cream/80 leading-[1.55]">
                Bij gemiddeld 4 rondleidingen per week per locatie, en 1,5 uur per rondleiding,
                gaat <strong className="text-cream">200 uur zorgtijd per locatie per jaar</strong>{' '}
                op aan rondleidingen waarvan familie achteraf zegt &quot;eigenlijk had ik dit al
                online willen zien&quot;. Een goed gevulde mediasectie filtert dat eruit.
              </p>
            </div>
          </div>
          <Link
            href="/zoeken"
            className="inline-flex items-center gap-2 bg-terracotta text-cream px-5 py-2.5 rounded-md font-semibold text-[14px] hover:bg-terracotta-deep"
          >
            Bekijk hoe locaties nu getoond worden
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-10 text-center text-[13px] text-ink-soft">
          Vragen of wensen?{' '}
          <a className="text-terracotta underline underline-offset-2" href="mailto:hallo@nieuwthuis.nl">
            hallo@nieuwthuis.nl
          </a>
        </div>
      </div>
    </div>
  )
}

function Feature({
  icon,
  titel,
  tekst,
}: {
  icon: React.ReactNode
  titel: string
  tekst: string
}) {
  return (
    <div className="bg-white border border-line rounded-xl p-5">
      <div className="w-11 h-11 rounded-full bg-terracotta-bg text-terracotta flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-serif font-medium text-[18px] text-night mb-2">{titel}</h3>
      <p className="text-[13px] text-ink-soft leading-[1.55]">{tekst}</p>
    </div>
  )
}

function Stap({ n, titel, tekst }: { n: number; titel: string; tekst: string }) {
  return (
    <div className="p-5 flex items-start gap-4">
      <div className="w-9 h-9 rounded-full bg-terracotta text-cream flex items-center justify-center font-serif font-medium text-[16px] shrink-0">
        {n}
      </div>
      <div className="flex-1">
        <h3 className="font-serif font-medium text-[17px] text-night mb-1">{titel}</h3>
        <p className="text-[13px] text-ink-soft leading-[1.55]">{tekst}</p>
      </div>
    </div>
  )
}
