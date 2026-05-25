import { notFound } from 'next/navigation'
import { getLocatie, locaties } from '@/lib/data/locaties'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Gallery } from '@/components/Gallery'
import { LocationHeader } from '@/components/LocationHeader'
import { DoelgroepPills } from '@/components/DoelgroepPills'
import { SfeerVerhaal } from '@/components/SfeerVerhaal'
import { Team } from '@/components/Team'
import { Cijfers } from '@/components/Cijfers'
import { OrgResponse } from '@/components/OrgResponse'
import { Voorzieningen } from '@/components/Voorzieningen'
import { Wachttijd } from '@/components/Wachttijd'
import { OmgevingMap } from '@/components/OmgevingMap'
import { Sidebar } from '@/components/Sidebar'
import { CompareBar } from '@/components/CompareBar'

export function generateStaticParams() {
  return locaties.map((l) => ({ slug: l.slug }))
}

export default async function LocatiePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const locatie = getLocatie(slug)
  if (!locatie) notFound()

  return (
    <div className="wrap">
      <Breadcrumb trail={locatie.breadcrumbs} current={locatie.naam} />

      <Gallery items={locatie.gallery} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 mb-20">
        <div>
          <LocationHeader locatie={locatie} />
          <DoelgroepPills items={locatie.doelgroep} />
          <SfeerVerhaal sfeer={locatie.sfeer} />
          <Team leden={locatie.team} />
          <Cijfers cijfers={locatie.cijfers} bron={locatie.cijfersBron} />
          <OrgResponse response={locatie.organisatie} />
          <Voorzieningen items={locatie.voorzieningen} />
          <Wachttijd wachttijd={locatie.wachttijd} />
          <OmgevingMap omgeving={locatie.omgeving} />
        </div>
        <Sidebar />
      </div>

      <CompareBar />
    </div>
  )
}
