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

Open http://localhost:3000 — landingspagina met link naar `/locatie/de-wilgenhof`.

## Static export

`next.config.js` heeft `output: 'export'` aanstaan, dus `npm run build` produceert een volledig statische site in `out/`. Geen Node-runtime nodig op de host.

```bash
npm run build
npx serve out
```

## Deployen op Cloudflare Pages

GitHub-integratie (auto-deploy bij elke push):

1. CF dashboard → Workers & Pages → Create → Pages → Connect to Git
2. Selecteer `FinQDC/Claude` (eerst CF GitHub App autoriseren voor de org)
3. Production branch: `main` (of de branch die je wilt)
4. Framework preset: **None**
5. Build command: `cd nieuw-thuis && npm ci && npm run build`
6. Build output directory: `nieuw-thuis/out`
7. Environment variables: `NODE_VERSION = 20` (matcht `.nvmrc`)
8. Save & Deploy

## Structuur

```
app/
  layout.tsx                # Root layout met TopBar + Footer
  page.tsx                  # Landingspagina
  locatie/[slug]/page.tsx   # Detailpagina per locatie
components/                 # UI-componenten per sectie
lib/data/
  types.ts                  # Type-definities
  locaties.ts               # Mock-data (De Wilgenhof)
```

Nieuwe locaties: voeg toe aan `lib/data/locaties.ts` — `generateStaticParams` pakt ze automatisch op.

## Design tokens

Kleurpalet en typografie staan in `tailwind.config.ts`. Fraunces (serif) + Inter (sans) via `next/font/google`.
