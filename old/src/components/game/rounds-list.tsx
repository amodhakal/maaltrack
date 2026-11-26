import { ChevronRight } from 'lucide-react'
import type { Player, Round } from '@/lib/scoring'
import { Score } from './score'
import { cn } from '@/lib/utils'

interface RoundsListProps {
  players: Player[]
  rounds: Round[]
  onEditRound: (round: Round) => void
}

function RoundsList({ players, rounds, onEditRound }: RoundsListProps) {
  if (rounds.length === 0) {
    return <div className="border-y border-border py-12 text-center text-muted-foreground">—</div>
  }

  return (
    <ol className="border-y border-border">
      {rounds.map((round, index) => {
        const winner = players.find((player) => player.id === round.winnerId)

        return (
          <li key={round.id} className="border-b border-border last:border-b-0">
            <button
              type="button"
              onClick={() => onEditRound(round)}
              className="w-full text-left transition-colors active:bg-secondary/60"
            >
              <header className="flex items-center gap-3 py-2">
                <span className="w-7 shrink-0 pl-2 font-serif text-sm text-muted-foreground tabular-nums">
                  R{index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-base">
                  {winner?.name ?? '—'}
                </span>
                {round.manual ? (
                  <span className="label-caps shrink-0 text-muted-foreground">
                    Manual
                  </span>
                ) : null}
                <ChevronRight
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground"
                />
              </header>

              <div className="border-t border-border divide-y divide-border">
                {players.map((player) => {
                  const score = round.scores?.[player.id] ?? 0
                  const isWinner = player.id === round.winnerId

                  return (
                    <div
                      key={player.id}
                      className="flex items-center gap-3 py-1.5 pl-9"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm">
                        {player.name}
                      </span>
                      <Score
                        value={score}
                        showIcon={false}
                        className={cn(
                          'font-sans text-sm',
                          isWinner && 'font-semibold',
                        )}
                      />
                    </div>
                  )
                })}
              </div>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export { RoundsList }