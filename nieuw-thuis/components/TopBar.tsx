import Link from 'next/link'

export function TopBar() {
  return (
    <div className="sticky top-0 z-50 border-b border-line bg-cream/95 backdrop-blur-md py-4">
      <div className="wrap flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 shrink-0 text-night no-underline">
          <svg
            width="38"
            height="32"
            viewBox="0 0 60 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M 4 36 Q 4 30, 8 26 L 22 10 Q 25 7, 28 10 L 30 12 L 30 36 Z"
              fill="none"
              stroke="#1F3548"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M 30 12 L 32 10 Q 35 7, 38 10 L 52 26 Q 56 30, 56 36 L 30 36 Z"
              fill="none"
              stroke="#B9603F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-serif font-semibold text-[22px] tracking-tight">Nieuw Thuis</span>
        </Link>
        <nav className="flex items-center gap-7">
          <Link href="/zoeken" className="hidden md:inline text-sm font-medium text-ink">
            Zoeken
          </Link>
          <Link href="#" className="hidden md:inline text-sm font-medium text-ink">
            Vergelijken
          </Link>
          <Link href="#" className="hidden md:inline text-sm font-medium text-ink">
            Mijn dossier
          </Link>
          <Link
            href="#"
            className="bg-terracotta text-cream px-5 py-2.5 rounded text-[13px] font-medium"
          >
            Inloggen
          </Link>
        </nav>
      </div>
    </div>
  )
}
