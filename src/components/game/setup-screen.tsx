import { X } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MAX_PLAYERS, MIN_PLAYERS } from '@/lib/scoring'
import type { Player } from '@/lib/scoring'

interface SetupScreenProps {
  players: Player[]
  canStart: boolean
  onAddPlayer: (name: string) => void
  onRemovePlayer: (playerId: string) => void
  onStart: () => void
}

function SetupScreen({
  players,
  canStart,
  onAddPlayer,
  onRemovePlayer,
  onStart,
}: SetupScreenProps) {
  const [name, setName] = useState('')
  const trimmed = name.trim()
  const isFull = players.length >= MAX_PLAYERS
  const isDuplicate = players.some(
    (player) => player.name.toLowerCase() === trimmed.toLowerCase(),
  )
  const canAdd = trimmed.length > 0 && !isFull && !isDuplicate

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canAdd) return
    onAddPlayer(trimmed)
    setName('')
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
      <header className="flex items-baseline justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">
            MaalTrack
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Marriage card game scorekeeper
          </p>
        </div>
        <span className="text-sm text-muted-foreground tabular-nums">
          {players.length}/{MAX_PLAYERS}
        </span>
      </header>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        Add 2–12 players. Each round, pick a winner and mark seen, unseen, or
        doubles. Points auto-settle so every round totals zero. Works offline as
        a PWA.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex gap-2">
        <Input
          id="player-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Player name"
          aria-label="Player name"
          maxLength={24}
          autoComplete="off"
          enterKeyHint="done"
          className="flex-1"
        />
        <Button type="submit" disabled={!canAdd}>
          Add
        </Button>
      </form>

      {isFull || (isDuplicate && trimmed.length > 0) ? (
        <p className="mt-2 text-sm text-destructive">
          {isFull ? 'Table full.' : 'Already added.'}
        </p>
      ) : null}

      <ul className="mt-6 flex-1 divide-y divide-border border-y border-border">
        {players.map((player, index) => (
          <li key={player.id} className="flex items-center gap-3 py-2">
            <span className="w-5 shrink-0 font-serif text-sm text-muted-foreground tabular-nums">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-base">
              {player.name}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${player.name}`}
              onClick={() => onRemovePlayer(player.id)}
            >
              <X />
            </Button>
          </li>
        ))}
      </ul>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto w-full max-w-xl pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
          <Button
            size="lg"
            className="w-full"
            disabled={!canStart}
            onClick={onStart}
          >
            Start game
          </Button>
        </div>
      </div>

      <span className="sr-only">
        Add at least {MIN_PLAYERS} players to start.
      </span>
    </main>
  )
}

export { SetupScreen }
