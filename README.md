# MaalTrack

A mobile-first Marriage (Nepali card game) scorekeeper. Add 2–12 players, log
each round with seen/unseen and doubles flags, and the app settles the points
automatically so every round totals 0.

Built with React 19, TypeScript, Vite 8, Tailwind CSS v4, shadcn/ui (Base UI,
`base-sera` preset), Vercel Web Analytics, and `vite-plugin-pwa`.

## Getting started

```bash
pnpm install
pnpm dev
```

## Scoring

Per round: one seen winner. Seen players enter maal points; unseen players
contribute 0.

- `T` = sum of all seen players' points.
- Base weight: unseen `10`, seen `3`, seen doubles `0`.
- If the winner is doubles, **every opponent** adds `5`.
- Non-winner score: `n × points − (T + weight)`.
- Winner score balances the row to `0`.
- Seen doubles always drop the `+3`; unseen players cannot be doubles.

The calculation lives in `src/lib/scoring.ts`.

Saved rounds can also be corrected with a manual override. Non-winner final
points are entered directly after a warning; the winner stays locked and is
recalculated to keep the row at `0`. Saving the round details normally clears
the override and recalculates everything.

## Scripts

| Command        | Description                         |
| -------------- | ----------------------------------- |
| `pnpm dev`     | Start the Vite dev server           |
| `pnpm build`   | Type-check and build for production |
| `pnpm preview` | Preview the production build        |
| `pnpm lint`    | Run ESLint                          |

## Analytics

Vercel Web Analytics is mounted in `src/main.tsx` via
`<Analytics />` from `@vercel/analytics/react`. It only records on a Vercel
deployment; enable **Analytics** in the project dashboard, then deploy.

## PWA

The PWA scaffold is still configured (`vite-plugin-pwa`, manifest, icons,
Workbox), but the install/offline/update overlays are currently not mounted
while the game is being built. Re-enable them from
`src/components/pwa/` when PWA work resumes.

- Build with `pnpm build && pnpm preview` to exercise the service worker.
- Icons regenerate from `public/favicon.svg`:

  ```bash
  pnpm dlx @vite-pwa/assets-generator --preset minimal-2023 public/favicon.svg
  ```

## Project structure

```
src/
  components/game/       setup, scoreboard, round dialog
  components/pwa/        install prompt, offline badge, update toast (dormant)
  components/ui/         shadcn/ui components
  hooks/use-game.ts      players, rounds, persistence
  lib/scoring.ts         Marriage settlement math
  lib/storage.ts         versioned localStorage
  App.tsx                setup ↔ scoreboard
  index.css              Tailwind v4 + shadcn theme tokens
```
