import { Building2, BarChart3, ShieldCheck, ExternalLink, Check, AlertTriangle } from 'lucide-react'
import type { PubliekeBronnen, LocatieMeta } from '@/lib/data/types'

type Props = {
  bronnen?: PubliekeBronnen
  meta: LocatieMeta
}

export function PubliekeData({ bronnen, meta }: Props) {
  if (!bronnen) return null
  const { bag, digimv, igj } = bronnen

  return (
    <section className="my-16">
      <div className="mb-7 max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-salie mb-2">
          Publieke data — verifieerbaar
        </div>
        <h2 className="font-serif font-medium text-[28px] tracking-tight text-night leading-tight mb-2">
          Wat publieke registers over deze locatie zeggen
        </h2>
        <p className="text-[14px] text-ink-soft leading-[1.65]">
          Gegevens gehaald uit drie onafhankelijke bronnen. Geen marketing, alleen wat
          geverifieerd kan worden bij Kadaster, jaarverantwoording-zorg en de Inspectie
          Gezondheidszorg.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bag && <BagBlock bag={bag} opgegevenBouwjaar={meta.bouwjaar} />}
        {digimv && <DigiMVBlock digimv={digimv} />}
        {igj && <IgjBlock igj={igj} />}
      </div>
    </section>
  )
}

function BagBlock({
  bag,
  opgegevenBouwjaar,
}: {
  bag: NonNullable<PubliekeBronnen['bag']>
  opgegevenBouwjaar: number
}) {
  const bouwjaarKlopt = bag.bouwjaar === opgegevenBouwjaar
  const heeftZorgfunctie = bag.gebruiksdoelen.includes('gezondheidszorgfunctie')

  return (
    <article className="bg-white border border-line rounded-xl p-5">
      <header className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-full bg-cream-warm border border-line flex items-center justify-center text-night">
          <Building2 size={16} />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-salie">
            BAG · Kadaster
          </div>
          <div className="font-serif font-medium text-[16px] text-night leading-tight">
            Pandregistratie
          </div>
        </div>
      </header>

      <dl className="space-y-3 text-[13px]">
        <Row label="Pand-ID">
          <code className="font-mono text-[11px] text-ink">{bag.pandId}</code>
        </Row>
        <Row label="Bouwjaar">
          <span className="text-night font-semibold">{bag.bouwjaar}</span>
          <Verified ok={bouwjaarKlopt} note={bouwjaarKlopt ? 'klopt met opgave' : 'wijkt af van opgave'} />
        </Row>
        <Row label="Oppervlakte">
          <span className="text-night font-semibold">
            {bag.oppervlakteM2.toLocaleString('nl-NL')} m²
          </span>
        </Row>
        <Row label="Gebruiksdoel">
          <div className="flex flex-wrap gap-1.5">
            {bag.gebruiksdoelen.map((g) => (
              <span
                key={g}
                className="text-[11px] bg-salie-bg border border-salie-soft/30 text-night px-2 py-0.5 rounded"
              >
                {g}
              </span>
            ))}
          </div>
          {heeftZorgfunctie && (
            <Verified ok note="zorgfunctie geregistreerd" />
          )}
        </Row>
        <Row label="Status">
          <span className="text-night">{bag.status}</span>
        </Row>
      </dl>

      {bag.bagViewerUrl && (
        <a
          href={bag.bagViewerUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 mt-4 text-[12px] text-terracotta hover:text-terracotta-deep underline underline-offset-2"
        >
          Open in BAG-viewer
          <ExternalLink size={11} />
        </a>
      )}
    </article>
  )
}

function DigiMVBlock({ digimv }: { digimv: NonNullable<PubliekeBronnen['digimv']> }) {
  const verloopBeter = digimv.personeelsverloopPct < digimv.sectorGemiddelde.personeelsverloopPct
  const verzuimBeter = digimv.ziekteverzuimPct < digimv.sectorGemiddelde.ziekteverzuimPct

  return (
    <article className="bg-white border border-line rounded-xl p-5">
      <header className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-full bg-cream-warm border border-line flex items-center justify-center text-night">
          <BarChart3 size={16} />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-salie">
            DigiMV · jaarverslag {digimv.jaar}
          </div>
          <div className="font-serif font-medium text-[16px] text-night leading-tight">
            Bedrijfsvoering
          </div>
        </div>
      </header>

      <dl className="space-y-3 text-[13px]">
        <MetricRow
          label="Personeelsverloop"
          value={`${digimv.personeelsverloopPct}%`}
          sectorValue={`${digimv.sectorGemiddelde.personeelsverloopPct}%`}
          beter={verloopBeter}
        />
        <MetricRow
          label="Ziekteverzuim"
          value={`${digimv.ziekteverzuimPct}%`}
          sectorValue={`${digimv.sectorGemiddelde.ziekteverzuimPct}%`}
          beter={verzuimBeter}
        />
        <Row label="Bezettingsgraad">
          <span className="text-night font-semibold">{digimv.bezettingsgraadPct}%</span>
        </Row>
      </dl>

      {digimv.bron && (
        <div className="text-[11px] text-ink-muted mt-4 leading-[1.4]">
          Bron: <span className="text-ink">{digimv.bron}</span>
        </div>
      )}
    </article>
  )
}

function IgjBlock({ igj }: { igj: NonNullable<PubliekeBronnen['igj']> }) {
  const isVerbeter = igj.status === 'in verbetertraject'
  const statusKleur = igj.status === 'voldoet' ? 'green' : isVerbeter ? 'oker' : 'red'

  return (
    <article className="bg-white border border-line rounded-xl p-5">
      <header className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-full bg-cream-warm border border-line flex items-center justify-center text-night">
          <ShieldCheck size={16} />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-salie">
            IGJ-inspectie
          </div>
          <div className="font-serif font-medium text-[16px] text-night leading-tight">
            Toezicht & kwaliteit
          </div>
        </div>
      </header>

      <dl className="space-y-3 text-[13px]">
        <Row label="Laatste rapport">
          <span className="text-night font-semibold">{formatDatum(igj.datum)}</span>
        </Row>
        <Row label="Status">
          <StatusBadge variant={statusKleur} label={igj.status} />
        </Row>
      </dl>

      {igj.samenvatting && (
        <p className="text-[12px] text-ink-soft leading-[1.55] mt-4 pt-3 border-t border-line">
          {igj.samenvatting}
        </p>
      )}

      {igj.url && (
        <a
          href={igj.url}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 mt-3 text-[12px] text-terracotta hover:text-terracotta-deep underline underline-offset-2"
        >
          Lees rapport bij IGJ
          <ExternalLink size={11} />
        </a>
      )}
    </article>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
      <dt className="text-[11px] uppercase tracking-[0.1em] font-semibold text-ink-soft pt-0.5">
        {label}
      </dt>
      <dd className="flex flex-wrap items-center gap-2">{children}</dd>
    </div>
  )
}

function MetricRow({
  label,
  value,
  sectorValue,
  beter,
}: {
  label: string
  value: string
  sectorValue: string
  beter: boolean
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
      <dt className="text-[11px] uppercase tracking-[0.1em] font-semibold text-ink-soft pt-0.5">
        {label}
      </dt>
      <dd>
        <div className="flex items-center gap-2">
          <span className="text-night font-semibold">{value}</span>
          {beter ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-ok bg-green-bg px-1.5 py-0.5 rounded">
              <Check size={10} /> beter dan sector
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-ink-soft bg-cream-warm border border-line px-1.5 py-0.5 rounded">
              boven sector
            </span>
          )}
        </div>
        <div className="text-[11px] text-ink-muted mt-0.5">
          sector gemiddelde {sectorValue}
        </div>
      </dd>
    </div>
  )
}

function Verified({ ok, note }: { ok: boolean; note: string }) {
  return ok ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-ok bg-green-bg px-1.5 py-0.5 rounded">
      <Check size={10} /> {note}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-terracotta bg-terracotta-bg px-1.5 py-0.5 rounded">
      <AlertTriangle size={10} /> {note}
    </span>
  )
}

function StatusBadge({ variant, label }: { variant: 'green' | 'oker' | 'red'; label: string }) {
  const cls =
    variant === 'green'
      ? 'bg-green-bg text-green-ok'
      : variant === 'oker'
        ? 'bg-oker-bg text-oker'
        : 'bg-terracotta-bg text-terracotta'
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  )
}

function formatDatum(yyyymm: string): string {
  const [y, m] = yyyymm.split('-').map(Number)
  const maanden = ['jan', 'feb', 'maa', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
  if (!y || !m || !maanden[m - 1]) return yyyymm
  return `${maanden[m - 1]} ${y}`
}
