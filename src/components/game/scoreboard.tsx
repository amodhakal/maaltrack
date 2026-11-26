import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
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
import type { Player, Round } from '@/lib/scoring'
import { Leaderboard } from './leaderboard'
import { RoundsList } from './rounds-list'

type View = 'board' | 'rounds'

interface ScoreboardProps {
  players: Player[]
  rounds: Round[]
  totals: Record<string, number>
  onAddRound: () => void
  onEditRound: (round: Round) => void
  onReset: () => void
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'relative flex min-h-11 items-center gap-1.5 pb-2 text-sm font-semibold transition-colors',
        active
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
      {active ? (
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
        />
      ) : null}
    </button>
  )
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
  const [view, setView] = useState<View>('board')

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
      <header className="flex items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          MaalTrack
        </h1>

        <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
          <AlertDialogTrigger render={<Button variant="ghost" size="sm" />}>
            Reset
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Start a new game?</AlertDialogTitle>
              <AlertDialogDescription>
                Clears all players and rounds.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
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

      <nav aria-label="Views" className="mt-6 flex gap-6 border-b border-border">
        <Tab active={view === 'board'} onClick={() => setView('board')}>
          Board
        </Tab>
        <Tab active={view === 'rounds'} onClick={() => setView('rounds')}>
          Rounds
          <span className="text-muted-foreground tabular-nums">
            {rounds.length}
          </span>
        </Tab>
      </nav>

      <section className="mt-4 flex-1">
        {view === 'board' ? (
          <Leaderboard players={players} totals={totals} rounds={rounds} />
        ) : (
          <RoundsList
            players={players}
            rounds={rounds}
            onEditRound={onEditRound}
          />
        )}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto w-full max-w-xl pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
          <Button size="lg" className="w-full" onClick={onAddRound}>
            <Plus data-icon="inline-start" />
            Log round
          </Button>
        </div>
      </div>
    </main>
  )
}

export { Scoreboard }
