'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Play,
  Pause,
  Headphones,
  Video,
  RotateCw,
  Sparkles,
  Upload,
  X,
  ExternalLink,
  Info,
} from 'lucide-react'
import type { Media, Welkomsboodschap, VideoTour, Tour360 } from '@/lib/data/types'

type Props = {
  media?: Media
  naam: string
}

export function VirtueleRondleiding({ media, naam }: Props) {
  if (!media || (!media.welkomsboodschap && !media.videoTour && !media.tour360)) {
    return <LegeStaat naam={naam} />
  }

  return (
    <section className="my-16">
      <div className="mb-7 max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta mb-2">
          Virtuele rondleiding
        </div>
        <h2 className="font-serif font-medium text-[28px] tracking-tight text-night leading-tight mb-2">
          Krijg in vijf minuten een indruk
        </h2>
        <p className="text-[14px] text-ink-soft leading-[1.65]">
          Voordat u een fysieke rondleiding aanvraagt, kunt u hier alvast luisteren naar de
          locatieleider, het gebouw vanuit de lucht zien en virtueel door de gemeenschappelijke
          ruimtes lopen. Bespaart tijd voor u én voor het zorgteam.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {media.welkomsboodschap ? (
          <WelkomsBlok boodschap={media.welkomsboodschap} naam={naam} />
        ) : (
          <PlaceholderBlok
            icon={<Headphones size={16} />}
            titel="Welkomsboodschap"
            tekst="Deze locatie heeft nog geen welkomsboodschap geüpload."
          />
        )}

        {media.videoTour ? (
          <VideoBlok tour={media.videoTour} />
        ) : (
          <PlaceholderBlok
            icon={<Video size={16} />}
            titel="Video-rondleiding"
            tekst="Nog geen drone- of rondleidingsvideo beschikbaar."
          />
        )}

        {media.tour360 ? (
          <Tour360Blok tour={media.tour360} />
        ) : (
          <PlaceholderBlok
            icon={<RotateCw size={16} />}
            titel="360°-tour"
            tekst="Nog geen 360°-tour beschikbaar voor deze locatie."
          />
        )}
      </div>

      <div className="mt-5 flex items-center gap-3 text-[12px] text-ink-soft bg-cream-warm border border-line rounded-lg px-4 py-3">
        <Upload size={14} className="text-terracotta shrink-0" />
        <span>
          Bent u verbonden aan deze locatie?{' '}
          <a
            href="/portaal"
            className="text-terracotta underline underline-offset-2 hover:text-terracotta-deep font-semibold"
          >
            Upload media via het organisatie-portaal →
          </a>
        </span>
      </div>
    </section>
  )
}

function WelkomsBlok({ boodschap, naam }: { boodschap: Welkomsboodschap; naam: string }) {
  const [speaking, setSpeaking] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const startedAtRef = useRef<number | null>(null)
  const tickRef = useRef<number | null>(null)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      if (tickRef.current) cancelAnimationFrame(tickRef.current)
    }
  }, [])

  const totalSec = parseDuur(boodschap.duurSchatting)

  const play = useCallback(() => {
    if (!supported) return
    const synth = window.speechSynthesis
    synth.cancel()
    const utt = new SpeechSynthesisUtterance(boodschap.tekst)
    utt.lang = 'nl-NL'
    utt.rate = 0.95
    utt.pitch = 1.0
    const voices = synth.getVoices()
    const nlVoice = voices.find((v) => v.lang.startsWith('nl'))
    if (nlVoice) utt.voice = nlVoice
    utt.onstart = () => {
      startedAtRef.current = performance.now()
      setSpeaking(true)
      const tick = () => {
        if (!startedAtRef.current) return
        const elapsed = (performance.now() - startedAtRef.current) / 1000
        setProgress(Math.min(elapsed / totalSec, 1))
        tickRef.current = requestAnimationFrame(tick)
      }
      tickRef.current = requestAnimationFrame(tick)
    }
    utt.onend = utt.onerror = () => {
      setSpeaking(false)
      setProgress(0)
      startedAtRef.current = null
      if (tickRef.current) cancelAnimationFrame(tickRef.current)
    }
    utteranceRef.current = utt
    synth.speak(utt)
  }, [boodschap.tekst, totalSec, supported])

  const stop = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setProgress(0)
    startedAtRef.current = null
    if (tickRef.current) cancelAnimationFrame(tickRef.current)
  }, [supported])

  return (
    <article className="bg-white border border-line rounded-xl p-5 flex flex-col">
      <header className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-terracotta-bg flex items-center justify-center text-terracotta shrink-0">
          <Headphones size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-terracotta mb-0.5">
            Welkomsboodschap
          </div>
          <div className="font-serif font-medium text-[16px] text-night leading-tight">
            {boodschap.spreker}
          </div>
          <div className="text-[12px] text-ink-soft">{boodschap.sprekerRol}</div>
        </div>
        {boodschap.isAiStem && (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-oker bg-oker-bg px-2 py-0.5 rounded shrink-0"
            title="Tekst door spreker, stem AI-gegenereerd met toestemming"
          >
            <Sparkles size={10} /> AI-stem
          </span>
        )}
      </header>

      <div className="mb-3">
        <button
          onClick={speaking ? stop : play}
          disabled={!supported}
          className="w-full flex items-center gap-3 bg-cream-warm hover:bg-cream-deep/60 disabled:opacity-50 disabled:cursor-not-allowed border border-line rounded-lg px-3 py-2.5 transition-colors group"
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              speaking ? 'bg-terracotta-deep text-cream' : 'bg-terracotta text-cream group-hover:bg-terracotta-deep'
            }`}
          >
            {speaking ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-1 bg-line rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-terracotta transition-[width] duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-ink-soft">
              <span>{speaking ? formatTijd(progress * totalSec) : 'Speel af'}</span>
              <span>{boodschap.duurSchatting}</span>
            </div>
          </div>
        </button>

        {!supported && (
          <p className="text-[11px] text-ink-muted mt-2 italic">
            Uw browser ondersteunt geen spraaksynthese. Probeer Chrome of Safari.
          </p>
        )}
      </div>

      <button
        onClick={() => setShowTranscript((v) => !v)}
        className="text-[12px] text-terracotta hover:text-terracotta-deep underline underline-offset-2 text-left"
      >
        {showTranscript ? 'Verberg' : 'Lees'} transcript
      </button>

      {showTranscript && (
        <blockquote className="mt-3 pt-3 border-t border-line text-[13px] text-ink-soft leading-[1.6] italic">
          &ldquo;{boodschap.tekst}&rdquo;
        </blockquote>
      )}

      <div className="mt-auto pt-3 text-[10px] text-ink-muted flex items-start gap-1.5">
        <Info size={10} className="shrink-0 mt-0.5" />
        <span>
          {boodschap.isAiStem
            ? 'Tekst door spreker, stem AI-gegenereerd met toestemming. Wordt afgespeeld via uw browser.'
            : `Ingesproken door ${boodschap.spreker.split(' ')[0]} via Nieuw Thuis (demo: browser-stem).`}
        </span>
      </div>
    </article>
  )
}

function VideoBlok({ tour }: { tour: VideoTour }) {
  const [open, setOpen] = useState(false)

  const typeLabel = {
    drone: 'Drone-tour',
    rondleiding: 'Rondleiding',
    sfeervideo: 'Sfeervideo',
  }[tour.type]

  return (
    <>
      <article className="bg-white border border-line rounded-xl overflow-hidden flex flex-col group">
        <button
          onClick={() => setOpen(true)}
          className="relative h-44 bg-cover bg-center w-full text-left"
          style={{ backgroundImage: `url('${tour.posterUrl}')` }}
          aria-label={`Speel ${tour.titel}`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white bg-night/80 backdrop-blur-sm px-2 py-1 rounded">
            <Video size={10} /> {typeLabel}
          </div>
          <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-night/80 backdrop-blur-sm px-2 py-1 rounded">
            {tour.duur}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-cream/95 text-terracotta flex items-center justify-center shadow-lg-soft group-hover:scale-110 transition-transform">
              <Play size={22} fill="currentColor" className="ml-1" />
            </div>
          </div>
        </button>
        <div className="p-4 flex-1 flex flex-col">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-terracotta mb-1">
            Video-rondleiding
          </div>
          <div className="font-serif font-medium text-[15px] text-night leading-tight mb-1">
            {tour.titel}
          </div>
          <div className="text-[11px] text-ink-muted mt-auto pt-2">
            Demo · in productie speelt hier de video van de organisatie
          </div>
        </div>
      </article>
      {open && <DemoModal titel={tour.titel} subtitel={`${typeLabel} · ${tour.duur}`} onClose={() => setOpen(false)} posterUrl={tour.posterUrl} />}
    </>
  )
}

function Tour360Blok({ tour }: { tour: Tour360 }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <article className="bg-white border border-line rounded-xl overflow-hidden flex flex-col group">
        <button
          onClick={() => setOpen(true)}
          className="relative h-44 bg-cover bg-center w-full text-left"
          style={{ backgroundImage: `url('${tour.posterUrl}')` }}
          aria-label="Open 360-tour"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white bg-night/80 backdrop-blur-sm px-2 py-1 rounded">
            <RotateCw size={10} /> 360°
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-cream/95 text-terracotta flex items-center justify-center shadow-lg-soft group-hover:scale-110 transition-transform">
              <RotateCw size={20} />
            </div>
          </div>
        </button>
        <div className="p-4 flex-1 flex flex-col">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-terracotta mb-1">
            360°-tour
          </div>
          <div className="font-serif font-medium text-[15px] text-night leading-tight mb-2">
            {tour.ruimtes.length} ruimtes
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {tour.ruimtes.map((r) => (
              <span
                key={r}
                className="text-[10px] bg-cream-warm border border-line text-ink rounded px-1.5 py-0.5"
              >
                {r}
              </span>
            ))}
          </div>
          <div className="text-[11px] text-ink-muted mt-auto pt-2">
            Demo · Matterport-tour zou hier embedden
          </div>
        </div>
      </article>
      {open && <DemoModal titel="360°-rondleiding" subtitel={tour.ruimtes.join(' · ')} onClose={() => setOpen(false)} posterUrl={tour.posterUrl} />}
    </>
  )
}

function PlaceholderBlok({
  icon,
  titel,
  tekst,
}: {
  icon: React.ReactNode
  titel: string
  tekst: string
}) {
  return (
    <article className="bg-cream-warm border border-dashed border-line rounded-xl p-5 flex flex-col">
      <header className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center text-ink-muted shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-muted mb-0.5">
            {titel}
          </div>
          <div className="font-serif font-medium text-[15px] text-ink leading-tight">
            Nog niet beschikbaar
          </div>
        </div>
      </header>
      <p className="text-[12px] text-ink-soft leading-[1.5] flex-1">{tekst}</p>
    </article>
  )
}

function LegeStaat({ naam }: { naam: string }) {
  return (
    <section className="my-16 bg-cream-warm border border-dashed border-line rounded-xl p-8 text-center max-w-3xl mx-auto">
      <div className="w-12 h-12 rounded-full bg-white border border-line flex items-center justify-center text-ink-muted mx-auto mb-4">
        <Video size={20} />
      </div>
      <h2 className="font-serif font-medium text-[22px] text-night mb-2">
        Nog geen virtuele rondleiding
      </h2>
      <p className="text-[14px] text-ink-soft leading-[1.6] mb-5 max-w-md mx-auto">
        {naam} heeft nog geen welkomsboodschap, video of 360°-tour geüpload. Bent u verbonden aan
        deze locatie? Voeg media toe zodat familie sneller een indruk krijgt.
      </p>
      <a
        href="/portaal"
        className="inline-flex items-center gap-2 bg-terracotta text-cream px-5 py-2.5 rounded-md font-semibold text-[13px] hover:bg-terracotta-deep"
      >
        <Upload size={14} />
        Open organisatie-portaal
      </a>
    </section>
  )
}

function DemoModal({
  titel,
  subtitel,
  posterUrl,
  onClose,
}: {
  titel: string
  subtitel: string
  posterUrl: string
  onClose: () => void
}) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-night/80 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-lg-soft"
      >
        <div
          className="relative h-72 md:h-96 bg-cover bg-center"
          style={{ backgroundImage: `url('${posterUrl}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-night/90 to-night/20" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-night/80 text-cream hover:bg-night flex items-center justify-center"
            aria-label="Sluit"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-6 left-6 right-6 text-cream">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cream/80 mb-2">
              {subtitel}
            </div>
            <h3 className="font-serif font-medium text-[28px] leading-tight">{titel}</h3>
          </div>
        </div>
        <div className="p-6 bg-cream-warm">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-terracotta shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] text-night font-semibold mb-1">
                Dit is een prototype — de video speelt nog niet
              </p>
              <p className="text-[13px] text-ink-soft leading-[1.55]">
                In productie embedden we hier de video die de organisatie heeft geüpload via het
                portaal. Voor drone-rondleidingen werken we samen met gecertificeerde piloten;
                voor 360°-tours gebruiken we Matterport of Pannellum (open source).
              </p>
              <a
                href="/portaal"
                className="inline-flex items-center gap-1.5 mt-3 text-[12px] font-semibold text-terracotta hover:text-terracotta-deep underline underline-offset-2"
              >
                Hoe organisaties media uploaden
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function parseDuur(s: string): number {
  const [m, sec] = s.split(':').map(Number)
  return (m || 0) * 60 + (sec || 0)
}

function formatTijd(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = Math.floor(totalSec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
