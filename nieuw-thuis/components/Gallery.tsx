'use client'

import { useState } from 'react'
import { Heart, Share2 } from 'lucide-react'
import type { GalleryItem } from '@/lib/data/types'

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [saved, setSaved] = useState(true)
  const [main, ...rest] = items

  return (
    <div className="relative mb-8 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2 gap-2 md:h-[460px] rounded-xl overflow-hidden">
      <GalleryTile
        src={main.src}
        label={main.label}
        large
        className="md:row-span-2 relative"
      >
        <div className="absolute top-4 right-4 z-30 flex gap-2">
          <button
            onClick={() => setSaved((v) => !v)}
            title={saved ? 'Op shortlist' : 'Voeg toe aan shortlist'}
            className={`w-[38px] h-[38px] rounded-full border flex items-center justify-center backdrop-blur transition-all hover:scale-105 ${
              saved
                ? 'bg-terracotta border-terracotta text-cream'
                : 'bg-cream/95 border-line text-night hover:bg-cream'
            }`}
          >
            <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>
          <button
            title="Delen"
            className="w-[38px] h-[38px] rounded-full border border-line bg-cream/95 text-night flex items-center justify-center backdrop-blur transition-all hover:bg-cream hover:scale-105"
          >
            <Share2 size={18} />
          </button>
        </div>
      </GalleryTile>

      {rest.map((item, i) => (
        <GalleryTile key={i} src={item.src} label={item.label}>
          {i === rest.length - 1 && (
            <button className="absolute bottom-4 right-4 z-30 bg-cream/95 text-night px-4 py-[9px] rounded text-[13px] font-semibold border border-line backdrop-blur cursor-pointer">
              Alle {items.length + 13} foto&apos;s bekijken
            </button>
          )}
        </GalleryTile>
      ))}
    </div>
  )
}

function GalleryTile({
  src,
  label,
  large = false,
  className = '',
  children,
}: {
  src: string
  label: string
  large?: boolean
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={`relative overflow-hidden bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url('${src}')` }}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-black/40" />
      <span
        className={`absolute z-20 text-white font-serif italic opacity-95 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] ${
          large
            ? 'bottom-4 left-5 text-xs tracking-wide [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]'
            : 'bottom-3 left-3.5 text-[11px]'
        }`}
      >
        {label}
      </span>
      {children}
    </div>
  )
}
