import { Plus } from 'lucide-react'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatScore } from '@/lib/scoring'
import type { Player, Round } from '@/lib/scoring'
import { scoreClassName } from '@/lib/score-style'

interface ScoreboardProps {
  players: Player[]
  rounds: Round[]
  totals: Record<string, number>
  onAddRound: () => void
  onEditRound: (round: Round) => void
  onReset: () => void
}

function Scoreboard({
  players,
  rounds,
  totals,
  onAddRound,
  onEditRound,
  onReset,
}: ScoreboardProps) {
  const [resetOpen, setResetOpen] = useState(false)

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-4 pt-6 pb-32">
      <header className="flex items-start justify-between gap-3 pb-5">
        <div className="flex items-center gap-3">
          <img
            src="/pwa-192x192.png"
            alt=""
            className="size-10 rounded-xl"
            width={40}
            height={40}
          />
          <div>
            <h1 className="font-heading text-lg font-semibold tracking-[0.25em] uppercase">
              MaalTrack
            </h1>
            <p className="text-xs text-muted-foreground">
              {players.length} players · {rounds.length}{' '}
              {rounds.length === 1 ? 'round' : 'rounds'}
            </p>
          </div>
        </div>

        <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
          <AlertDialogTrigger
            render={<Button variant="outline" size="sm" />}
          >
            New game
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Start a new game?</AlertDialogTitle>
              <AlertDialogDescription>
                This clears every player and round. It cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onReset()
                  setResetOpen(false)
                }}
              >
                Start over
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <div className="overflow-x-auto overscroll-x-contain border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="sticky left-0 z-20 min-w-[88px] bg-background px-3 py-3 text-left align-bottom">
                <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Round
                </span>
              </th>
              {players.map((player) => {
                const total = totals[player.id] ?? 0
                return (
                  <th
                    key={player.id}
                    className="min-w-[84px] px-2 py-3 text-center align-top"
                  >
                    <span className="block max-w-[96px] truncate text-xs font-semibold">
                      {player.name}
                    </span>
                    <span
                      className={cn(
                        'mt-1 block font-heading text-sm font-semibold tabular-nums',
                        scoreClassName(total),
                      )}
                    >
                      {formatScore(total)}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rounds.map((round, index) => (
              <tr key={round.id} className="border-b last:border-b-0">
                <th className="sticky left-0 z-10 bg-background px-3 py-2 text-left">
                  <button
                    type="button"
                    onClick={() => onEditRound(round)}
                    className="text-xs font-semibold tracking-widest uppercase underline-offset-4 hover:underline"
                  >
                    <span className="block">Round {index + 1}</span>
                    {round.manual && (
                      <span className="mt-0.5 block text-[0.5rem] text-amber-700">
                        Manual
                      </span>
                    )}
                  </button>
                </th>
                {players.map((player) => {
                  const score = round.scores?.[player.id] ?? 0
                  return (
                    <td
                      key={player.id}
                      className={cn(
                        'px-2 py-2 text-center tabular-nums',
                        scoreClassName(score),
                      )}
                    >
                      {formatScore(score)}
                    </td>
                  )
                })}
              </tr>
            ))}

            {rounds.length === 0 && (
              <tr>
                <td
                  colSpan={players.length + 1}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No rounds yet. Add the first one below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Tap a round to edit it or override its final points. Every row totals 0.
      </p>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto max-w-3xl">
          <Button size="lg" className="w-full" onClick={onAddRound}>
            <Plus data-icon="inline-start" />
            Add round
          </Button>
        </div>
      </div>
    </main>
  )
}

export { Scoreboard }
