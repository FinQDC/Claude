import type { OrgResponse as OrgResponseT } from '@/lib/data/types'

export function OrgResponse({ response }: { response: OrgResponseT }) {
  return (
    <section className="mb-14">
      <h2 className="font-serif font-medium text-[26px] text-night mb-6 tracking-tight">
        Wat de organisatie zelf zegt
      </h2>
      <div className="border-l-[3px] border-oker p-6 px-7 bg-oker-bg rounded-r-lg">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-9 h-9 bg-oker text-night rounded-full flex items-center justify-center font-serif italic font-semibold text-base">
            {response.initiaal}
          </div>
          <div>
            <div className="font-serif font-medium text-base text-night">{response.naam}</div>
            <div className="text-xs text-ink-soft">{response.reactieDatum}</div>
          </div>
        </div>
        <p className="text-[15px] leading-[1.65] text-ink">{response.quote}</p>
      </div>
    </section>
  )
}
