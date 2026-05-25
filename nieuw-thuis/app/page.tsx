import { HomeHero } from '@/components/HomeHero'
import { IndicatieKiezer } from '@/components/IndicatieKiezer'
import { HomeFeatures } from '@/components/HomeFeatures'
import { locaties, zorgTypeCounts } from '@/lib/data/locaties'

export default function Home() {
  const tiles = [
    {
      type: 'pg' as const,
      titel: '24-uurs zorg',
      subtitel: 'Verpleeghuis met dementiezorg',
      beschrijving:
        'Voor wie veiligheid en structuur nodig heeft door dementie. Vaak met gespecialiseerde teams en gesloten afdelingen.',
      beeld: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
      aantal: zorgTypeCounts.pg,
    },
    {
      type: 'somatiek' as const,
      titel: '24-uurs zorg',
      subtitel: 'Verpleeghuis somatiek',
      beschrijving:
        'Voor wie lichamelijke zorg of revalidatie nodig heeft. Vaak met fysiotherapie en aangepaste woonvoorzieningen.',
      beeld: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80',
      aantal: zorgTypeCounts.somatiek,
    },
    {
      type: 'verzorgingshuis' as const,
      titel: 'Lichte zorg',
      subtitel: 'Verzorgingshuis',
      beschrijving:
        'Eigen appartement in een complex, met gemeenschappelijke voorzieningen en zorg op afroep. Voor wie zelfstandig blijft.',
      beeld: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
      aantal: zorgTypeCounts.verzorgingshuis,
    },
    {
      type: 'aanleunwoning' as const,
      titel: 'Zelfstandig',
      subtitel: 'Aanleunwoning',
      beschrijving:
        'Eigen woning naast een zorgcentrum, met hulp om de hoek. Voor wie autonoom wil blijven met zekerheid van zorg.',
      beeld: 'https://images.unsplash.com/photo-1564540583246-934409427776?w=600&q=80',
      aantal: zorgTypeCounts.aanleunwoning,
    },
  ]

  return (
    <main>
      <HomeHero tiles={tiles} totaalLocaties={locaties.length} />
      <IndicatieKiezer />
      <HomeFeatures />
    </main>
  )
}
