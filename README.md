# MaalTrack

A mobile-first scorekeeper for **Marriage** — the Nepali partnership card game. Add 2–12 players, log each round with seen/unseen and doubles flags, and the app settles points automatically so every round totals zero.

![MaalTrack](public/favicon.svg)

## Why MaalTrack?

Marriage scoring is tedious: seen players declare maal points, unseen players pay weights, doubles winners add bonuses, and the winner balances the row to zero. MaalTrack does the math instantly — you just pick the winner and enter points.

- **Zero prose** — labels and live feedback teach the rules, not paragraphs
- **Dark-first, game-like UI** — large numerals, redundant score encoding (icon + sign + color), no color-only meaning
- **Works offline** — PWA with service worker, installable on mobile
- **Local-first** — all data stays in your browser's localStorage

## Quick start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173` — works best on mobile or a narrow browser window.

## How scoring works

Per round:

1. One **seen** player wins.
2. Seen players declare their maal points; unseen players contribute 0.
3. `T` = sum of all seen points.
4. Base weight: unseen `10`, seen `3`, seen doubles `0`.
5. If the winner is on doubles, **every opponent** adds `5` to their weight.
6. Non-winner score: `n × points − (T + weight)`.
7. Winner takes the balancing amount so the row totals `0`.

> **Manual override** — Saved rounds can be corrected by entering final points directly for non-winners. The winner stays locked and auto-balances to keep the row at zero. Saving normally clears the override.

The calculation lives in [`src/lib/scoring.ts`](src/lib/scoring.ts).

## Screens

| Screen | Purpose |
|--------|---------|
| **Seat the table** | Add players (2–12), see count meter, start when ready |
| **Board** | Vertical leaderboard: rank, name, big total, last-round delta |
| **Rounds** | Expandable timeline showing every player's score per round |
| **Log round** | Step 1: pick winner → Step 2: enter points with steppers, live total |

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (custom tokens, no shadcn preset) |
| UI primitives | Base UI (`@base-ui/react`) — headless, accessible |
| Fonts | Fraunces (headings/numerals) + Instrument Sans (body) via `@fontsource-variable` |
| State | React hooks + localStorage (versioned) |
| PWA | `vite-plugin-pwa` + Workbox |
| Analytics | Vercel Web Analytics (production only) |
| Icons | Lucide React |

## Project structure

```
src/
├── App.tsx                 # Routes: setup → scoreboard
├── main.tsx                # Entry (no ThemeProvider — dark only)
├── index.css               # Design tokens, base styles, reduced-motion
├── components/
│   ├── game/
│   │   ├── setup-screen.tsx      # Add/remove players, start game
│   │   ├── scoreboard.tsx        # Board / Rounds tabs, sticky log button
│   │   ├── leaderboard.tsx       # Ranked list with totals
│   │   ├── rounds-list.tsx       # Round timeline, all scores
│   │   ├── round-sheet.tsx       # 2-step modal: winner → points
│   │   └── score.tsx             # Score display (icon + sign + color)
│   ├── ui/                       # Base UI wrappers (button, input, dialog, etc.)
│   └── pwa/                      # Install prompt, offline banner, update toast
├── hooks/
│   ├── use-game.ts         # Players, rounds, persistence, scoring
│   ├── use-online-status.ts
│   └── use-pwa-install.ts
└── lib/
    ├── scoring.ts          # Pure Marriage settlement math
    ├── score-style.ts      # Score tone (positive/negative/zero)
    ├── storage.ts          # Versioned localStorage (v1)
    └── utils.ts            # cn() helper
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Type-check + production build |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |

## PWA

The app is a full PWA: service worker, manifest, offline support, installable.

- **Manifest**: dark theme colors, `games` category, standalone display
- **Icons**: generated from `public/favicon.svg` (cream card + marigold rule + vermilion pip)
- **Regenerate icons**:
  ```bash
  pnpm dlx @vite-pwa/assets-generator --preset minimal-2023 public/favicon.svg
  ```
- **Test SW**: `pnpm build && pnpm preview`

## Accessibility

- Minimum 14px type, 16px body, 24px+ for critical numbers
- 48px minimum touch targets, 8px gaps
- Redundant score encoding: icon (▲/▼) + sign (+/−) + color
- `prefers-reduced-motion` respected (animations → instant)
- Focus-visible rings on all interactive elements
- Semantic HTML, proper ARIA labels

## Design tokens (excerpt)

```css
:root {
  --background: #12100e;      /* warm charcoal */
  --foreground: #f4ead9;      /* cream ink */
  --card: #1a1613;            /* elevated surface */
  --primary: #e9a63c;         /* marigold */
  --destructive: #d8503a;     /* vermilion */
  --indigo: #3a3566;          /* suit accent */
  --radius: 0.25rem;          /* tight, ledger feel */
}
```

Defined in [`src/index.css`](src/index.css).

## Deployment

Any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

1. `pnpm build` → outputs to `dist/`
2. Deploy `dist/` as a static site
3. Enable HTTPS (required for PWA install + service worker)
4. On Vercel: connect repo, framework preset = Vite, done

Vercel Web Analytics activates automatically on production deploys.

## License

MIT — see [LICENSE](LICENSE) for details.