import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { TopBar } from '@/components/TopBar'
import { Footer } from '@/components/Footer'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nieuw Thuis — wonen met zorg',
  description:
    'Eén plek voor de weg van thuis wonen naar wonen met zorg. Op basis van publieke data, eerlijk gepresenteerd.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <TopBar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
