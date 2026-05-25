# Nieuw Thuis

Verkenningsfase prototype voor een platform dat mensen helpt op de weg van thuis wonen naar wonen met zorg. Eén plek waar gezinnen verpleeghuizen kunnen vergelijken op basis van publieke data, eerlijk gepresenteerd.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS 3
- lucide-react

## Lokaal draaien

```bash
npm install
npm run dev
```

Open http://localhost:3000 — je wordt doorgestuurd naar `/locatie/de-wilgenhof`.

## Structuur

```
app/
  layout.tsx                # Root layout met TopBar + Footer
  page.tsx                  # Homepage (redirect naar De Wilgenhof)
  locatie/[slug]/page.tsx   # Detailpagina per locatie
components/                 # UI-componenten per sectie
lib/data/
  types.ts                  # Type-definities
  locaties.ts               # Mock-data (De Wilgenhof)
```

Nieuwe locaties: voeg toe aan `lib/data/locaties.ts` — `generateStaticParams` pakt ze automatisch op.

## Design tokens

Kleurpalet en typografie staan in `tailwind.config.ts`. Fraunces (serif) + Inter (sans) via `next/font/google`.
