import type { Crumb } from '@/lib/data/types'

export function Breadcrumb({
  trail,
  current,
}: {
  trail: Crumb[]
  current: string
}) {
  return (
    <div className="py-5 pb-3 text-[13px] text-ink-soft">
      {trail.map((crumb, i) => (
        <span key={i}>
          <a href={crumb.href} className="text-ink-soft no-underline mr-2 hover:text-terracotta">
            {crumb.label}
          </a>
          <span className="mr-2 opacity-40">/</span>
        </span>
      ))}
      <span className="text-night font-medium">{current}</span>
    </div>
  )
}
