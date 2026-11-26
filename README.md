# MaalTrack

Free browser-based scorekeeper for **Marriage** (Nepali card game).

- **Home:** static landing page at `/`
- **Play:** client-side game at `/play`
- **Offline-ready:** PWA manifest + service worker
- **Local-first:** game state saved in browser `localStorage` (`maaltrack:game:v1`)

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm start
```

## Lint

```bash
pnpm lint
```

## Tech

- Next.js App Router
- React 19
- Tailwind CSS v4
- TypeScript
