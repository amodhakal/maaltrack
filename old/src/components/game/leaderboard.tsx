import type { Player, Round } from '@/lib/scoring'
import { cn } from '@/lib/utils'
import { Score } from './score'

interface LeaderboardProps {
  players: Player[]
  totals: Record<string, number>
  rounds: Round[]
}

function Leaderboard({ players, totals, rounds }: LeaderboardProps) {
  const ranked = players
    .map((player, order) => ({ player, order, total: totals[player.id] ?? 0 }))
    .sort((a, b) => b.total - a.total || a.order - b.order)

  const hasRounds = rounds.length > 0

  return (
    <ol className="border-y border-border">
      {ranked.map(({ player, total }) => {
        const rank = 1 + ranked.filter((row) => row.total > total).length
        const isLeader = hasRounds && rank === 1

        return (
          <li
            key={player.id}
            className="relative flex items-center gap-3 border-b border-border py-3.5 last:border-b-0"
          >
            {isLeader ? (
              <span
                aria-hidden
                className="absolute inset-y-2 left-0 w-0.5 bg-primary"
              />
            ) : null}
            <span
              className={cn(
                'w-5 shrink-0 pl-2 font-serif text-base tabular-nums',
                isLeader ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {rank}
            </span>
            <span className="min-w-0 flex-1 truncate text-base font-medium">
              {player.name}
            </span>
            <Score value={total} className="text-2xl" />
          </li>
        )
      })}
    </ol>
  )
}

export { Leaderboard }
