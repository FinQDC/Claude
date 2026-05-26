'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import type { LocatieKort, ZorgType } from '@/lib/data/types'
import { zorgTypeKort } from '@/lib/data/types'

type Props = {
  locaties: LocatieKort[]
  selectedSlug: string | null
  onSelect: (slug: string | null) => void
  onFilterNearby: (slug: string) => void
  onFilterSameType: (slug: string) => void
}

const NL_CENTER: [number, number] = [52.95, 5.92]
const NL_ZOOM = 9

export function MapResultaten({
  locaties,
  selectedSlug,
  onSelect,
  onFilterNearby,
  onFilterSameType,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)
  const LRef = useRef<unknown>(null)
  const markersRef = useRef<Record<string, unknown>>({})

  useEffect(() => {
    let cancelled = false
    void import('leaflet').then((mod) => {
      if (cancelled || !containerRef.current) return
      const L = mod.default || mod
      LRef.current = L
      if (mapRef.current) return
      const map = L.map(containerRef.current, {
        center: NL_CENTER,
        zoom: NL_ZOOM,
        zoomControl: true,
        scrollWheelZoom: true,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)
      mapRef.current = map
    })
    return () => {
      cancelled = true
      if (mapRef.current) {
        ;(mapRef.current as { remove: () => void }).remove()
        mapRef.current = null
      }
      markersRef.current = {}
    }
  }, [])

  useEffect(() => {
    const L = LRef.current as typeof import('leaflet') | null
    const map = mapRef.current as ReturnType<typeof import('leaflet').map> | null
    if (!L || !map) return

    Object.values(markersRef.current).forEach((m) => {
      ;(m as { remove: () => void }).remove()
    })
    markersRef.current = {}

    locaties.forEach((loc) => {
      const icon = L.divIcon({
        className: 'nt-pin',
        html: `<div class="nt-pin-inner nt-pin-${loc.zorgType}"><span>${pinLabel(loc.zorgType)}</span></div>`,
        iconSize: [44, 52],
        iconAnchor: [22, 50],
        popupAnchor: [0, -44],
      })
      const m = L.marker([loc.coord.lat, loc.coord.lng], { icon }).addTo(map)
      m.bindPopup(popupHTML(loc), {
        maxWidth: 320,
        minWidth: 260,
        className: 'nt-popup',
        closeButton: true,
        autoPan: true,
      })
      m.on('popupopen', () => onSelect(loc.slug))
      m.on('popupclose', () => onSelect(null))
      markersRef.current[loc.slug] = m
    })

    if (locaties.length > 0) {
      const group = L.featureGroup(
        Object.values(markersRef.current) as ReturnType<typeof L.marker>[],
      )
      try {
        map.fitBounds(group.getBounds().pad(0.3), { maxZoom: 11, animate: false })
      } catch {
        map.setView(NL_CENTER, NL_ZOOM)
      }
    } else {
      map.setView(NL_CENTER, NL_ZOOM)
    }
  }, [locaties, onSelect])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest('[data-nt-action]') as HTMLElement | null
      if (!el) return
      const action = el.dataset.ntAction
      const slug = el.dataset.ntSlug || ''
      if (!slug) return
      if (action === 'filter-nearby') {
        e.preventDefault()
        onFilterNearby(slug)
      } else if (action === 'filter-same-type') {
        e.preventDefault()
        onFilterSameType(slug)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [onFilterNearby, onFilterSameType])

  useEffect(() => {
    if (!selectedSlug) return
    const marker = markersRef.current[selectedSlug] as
      | { openPopup: () => void; getLatLng: () => { lat: number; lng: number } }
      | undefined
    const map = mapRef.current as ReturnType<typeof import('leaflet').map> | null
    if (!marker || !map) return
    map.panTo(marker.getLatLng(), { animate: true })
    marker.openPopup()
  }, [selectedSlug])

  return <div ref={containerRef} className="w-full h-full min-h-[500px] bg-cream-warm" />
}

function pinLabel(t: ZorgType): string {
  return { pg: 'PG', somatiek: 'SOM', verzorgingshuis: 'VH', aanleunwoning: 'AW' }[t]
}

function popupHTML(loc: LocatieKort): string {
  const escapedNaam = escapeHtml(loc.naam)
  const escapedRegio = escapeHtml(loc.filters.regio)
  const escapedTagline = escapeHtml(loc.cardTagline)
  const escapedImg = escapeAttr(loc.coverImage)
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const detailHref = `${basePath}/locatie/${loc.slug}`
  return `
    <div class="nt-pop">
      <div class="nt-pop-image" style="background-image:url('${escapedImg}')"></div>
      <div class="nt-pop-body">
        <div class="nt-pop-eyebrow">${escapedRegio}</div>
        <div class="nt-pop-title">${escapedNaam}</div>
        <div class="nt-pop-tagline">${escapedTagline}</div>
        <div class="nt-pop-meta">
          <span><strong>${zorgTypeKort[loc.zorgType]}</strong></span>
          <span>${loc.meta.bewoners} bewoners</span>
          <span>wachttijd ${escapeHtml(loc.meta.wachttijdLabel)}</span>
        </div>
        <div class="nt-pop-divider"></div>
        <div class="nt-pop-actions-secondary">
          <div class="nt-pop-section-label">Filter rond deze locatie</div>
          <button type="button" data-nt-action="filter-nearby" data-nt-slug="${loc.slug}" class="nt-pop-chip">
            Binnen 5 km
          </button>
          <button type="button" data-nt-action="filter-same-type" data-nt-slug="${loc.slug}" class="nt-pop-chip">
            Zelfde zorgtype
          </button>
        </div>
        <a href="${detailHref}" class="nt-pop-btn-primary">
          Bekijk locatie →
        </a>
      </div>
    </div>
  `
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
