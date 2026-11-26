import { X } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col px-4 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <header className="flex items-center gap-3 pb-6">
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
          <p className="text-xs text-muted-foreground">Marriage scorekeeper</p>
        </div>
      </header>

      <Card size="sm" className="flex-1">
        <CardHeader>
          <CardTitle>Players</CardTitle>
          <CardDescription>
            Add {MIN_PLAYERS}–{MAX_PLAYERS} players. Seen, unseen and doubles
            are chosen for every round.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor="player-name">Player name</Label>
              <Input
                id="player-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Asha"
                maxLength={24}
                autoComplete="off"
                enterKeyHint="done"
              />
            </div>
            <Button type="submit" disabled={!canAdd}>
              Add
            </Button>
          </form>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {players.length} / {MAX_PLAYERS} players
            </span>
            {isDuplicate && <span>That name is already added.</span>}
            {isFull && <span>Table is full.</span>}
          </div>

          {players.length === 0 ? (
            <p className="border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              No players yet. Add the first one above.
            </p>
          ) : (
            <ul className="divide-y border-y">
              {players.map((player, index) => (
                <li
                  key={player.id}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="w-4 text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="truncate text-sm font-medium">
                      {player.name}
                    </span>
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
          )}
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-2">
          <Button size="lg" disabled={!canStart} onClick={onStart}>
            Start game
          </Button>
          {!canStart && (
            <p className="text-center text-xs text-muted-foreground">
              Add at least {MIN_PLAYERS} players to start.
            </p>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}

export { SetupScreen }
