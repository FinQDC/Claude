'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ClipboardCheck, HelpCircle, FileQuestion, ArrowRight } from 'lucide-react'
import { zorgProfielen, type ZorgProfiel } from '@/lib/data/types'

export function IndicatieKiezer() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [profiel, setProfiel] = useState<ZorgProfiel | null>(null)

  const submit = () => {
    if (!profiel) return
    router.push(`/zoeken?profiel=${profiel}`)
  }

  return (
    <section className="bg-cream py-14 border-y border-line">
      <div className="wrap">
        <div className="max-w-2xl mx-auto text-center mb-9">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-salie mb-3">
            Tip: zo komt u nóg gerichter uit
          </div>
          <h2 className="font-serif font-medium text-[30px] md:text-[34px] leading-tight tracking-tight text-night mb-4">
            Heeft u al een indicatie?
          </h2>
          <p className="text-[15px] text-ink-soft leading-[1.65]">
            Voor verpleeghuiszorg is een Wlz-indicatie nodig — afgegeven door het CIZ. Met
            zorgprofiel (VV4 t/m VV10) tonen we precies welke locaties iemand kunnen opnemen, niet
            alleen welke type past.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setOpen((v) => !v)}
            className={`group bg-white border-2 ${
              open ? 'border-terracotta' : 'border-line'
            } rounded-xl p-6 text-left transition-all hover:border-terracotta hover:shadow-md-soft`}
          >
            <div className="w-11 h-11 rounded-full bg-terracotta-bg text-terracotta flex items-center justify-center mb-4">
              <ClipboardCheck size={22} />
            </div>
            <div className="font-serif font-medium text-[18px] tracking-tight text-night mb-2">
              Ja, Wlz-indicatie
            </div>
            <p className="text-[13px] text-ink-soft leading-[1.5]">
              Het CIZ heeft een zorgprofiel (VV4–VV10) afgegeven. Selecteer hieronder welke.
            </p>
          </button>

          <Link
            href="/zoeken"
            className="group bg-white border-2 border-line rounded-xl p-6 no-underline transition-all hover:border-terracotta hover:shadow-md-soft"
          >
            <div className="w-11 h-11 rounded-full bg-oker-bg text-oker flex items-center justify-center mb-4">
              <FileQuestion size={22} />
            </div>
            <div className="font-serif font-medium text-[18px] tracking-tight text-night mb-2">
              Wmo / Zvw / onbekend
            </div>
            <p className="text-[13px] text-ink-soft leading-[1.5]">
              Geen Wlz, of weet niet zeker. We tonen alle opties — aanleunwoningen en
              verzorgingshuizen vragen vaak geen indicatie.
            </p>
          </Link>

          <Link
            href="/indicatie"
            className="group bg-white border-2 border-line rounded-xl p-6 no-underline transition-all hover:border-terracotta hover:shadow-md-soft"
          >
            <div className="w-11 h-11 rounded-full bg-salie-bg text-salie flex items-center justify-center mb-4">
              <HelpCircle size={22} />
            </div>
            <div className="font-serif font-medium text-[18px] tracking-tight text-night mb-2">
              Nog geen, of weet niet hoe
            </div>
            <p className="text-[13px] text-ink-soft leading-[1.5]">
              Lees in 2 minuten hoe een indicatie werkt en hoe u er een aanvraagt bij het CIZ.
            </p>
          </Link>
        </div>

        {open && (
          <div className="mt-6 bg-white border border-terracotta-soft rounded-xl p-6 md:p-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-terracotta mb-3">
              Selecteer uw zorgprofiel
            </div>
            <h3 className="font-serif font-medium text-[22px] text-night mb-2 tracking-tight">
              Welk Wlz-zorgprofiel staat op uw indicatie?
            </h3>
            <p className="text-[13px] text-ink-soft mb-5 leading-[1.5]">
              Staat op het besluit van het CIZ. Bij twijfel: zie het document, of bel het CIZ
              (088-789 10 00).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-6">
              {zorgProfielen.map((p) => (
                <label
                  key={p.code}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    profiel === p.code
                      ? 'border-terracotta bg-terracotta-bg/40'
                      : 'border-line bg-cream-warm hover:border-terracotta-soft'
                  }`}
                >
                  <input
                    type="radio"
                    checked={profiel === p.code}
                    onChange={() => setProfiel(p.code)}
                    className="mt-1 w-4 h-4 accent-terracotta cursor-pointer shrink-0"
                  />
                  <div>
                    <div className="font-serif font-medium text-[15px] text-night leading-tight mb-0.5">
                      {p.kort}
                    </div>
                    <div className="text-[11px] text-ink-soft leading-[1.4]">{p.categorie}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <Link
                href="/indicatie"
                className="text-[13px] text-ink-soft underline underline-offset-4 hover:text-terracotta"
              >
                Ik weet mijn profiel niet — help me kiezen
              </Link>
              <button
                onClick={submit}
                disabled={!profiel}
                className="bg-terracotta text-cream px-6 py-3 rounded-md font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-terracotta-deep transition-colors flex items-center justify-center gap-2"
              >
                Toon passende locaties <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
