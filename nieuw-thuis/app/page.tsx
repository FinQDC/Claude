import Link from 'next/link'

export default function Home() {
  return (
    <main className="wrap py-20">
      <p className="text-ink-soft mb-6">Verkenningsfase — één voorbeeldlocatie beschikbaar.</p>
      <Link
        href="/locatie/de-wilgenhof"
        className="inline-block bg-terracotta text-cream px-6 py-3 rounded font-semibold no-underline"
      >
        Bekijk De Wilgenhof →
      </Link>
    </main>
  )
}
