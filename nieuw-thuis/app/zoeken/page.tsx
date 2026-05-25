import { Suspense } from 'react'
import { locatiesKort } from '@/lib/data/locaties'
import { ZoekClient } from '@/components/ZoekClient'

export const metadata = {
  title: 'Zoeken — Nieuw Thuis',
}

export default function ZoekenPage() {
  return (
    <Suspense
      fallback={
        <div className="wrap py-12 text-ink-soft text-sm">Resultaten laden…</div>
      }
    >
      <ZoekClient alleLocaties={locatiesKort()} />
    </Suspense>
  )
}
