import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Lock, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { calculateRound, formatScore } from '@/lib/scoring'
import type { Player, Round, RoundEntry } from '@/lib/scoring'
import { scoreClassName } from '@/lib/score-style'

type DialogMode = 'round' | 'warning' | 'manual'

interface RoundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  players: Player[]
  round: Round | null
  onSave: (winnerId: string, entries: RoundEntry[]) => void
  onDelete?: (roundId: string) => void
  onOverride?: (
    roundId: string,
    winnerId: string,
    entries: RoundEntry[],
    scores: Record<string, number>,
  ) => void
}

function createEntries(players: Player[], round: Round | null): RoundEntry[] {
  return players.map((player) => {
    const existing = round?.entries.find(
      (entry) => entry.playerId === player.id,
    )

    if (!existing) {
      return {
        playerId: player.id,
        seen: false,
        doubles: false,
        points: 0,
      }
    }

    return {
      ...existing,
      doubles: existing.seen && existing.doubles,
    }
  })
}

function RoundDialog({
  open,
  onOpenChange,
  players,
  round,
  onSave,
  onDelete,
  onOverride,
}: RoundDialogProps) {
  const [entries, setEntries] = useState<RoundEntry[]>(() =>
    createEntries(players, round),
  )
  const [winnerId, setWinnerId] = useState(() => round?.winnerId ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [mode, setMode] = useState<DialogMode>('round')
  const [manualInputs, setManualInputs] = useState<Record<string, string>>({})

  const preview = useMemo(() => {
    if (!winnerId) return null
    try {
      return calculateRound(entries, winnerId)
    } catch {
      return null
    }
  }, [entries, winnerId])

  const previewById = useMemo(
    () => new Map(preview?.map((entry) => [entry.playerId, entry]) ?? []),
    [preview],
  )

  const manualScores = useMemo<Record<string, number>>(() => {
    if (!winnerId) return {}

    const scores: Record<string, number> = {}
    let nonWinnerTotal = 0

    for (const player of players) {
      if (player.id === winnerId) continue
      const score = Math.trunc(Number(manualInputs[player.id] ?? 0) || 0)
      scores[player.id] = score
      nonWinnerTotal += score
    }

    scores[winnerId] = -nonWinnerTotal
    return scores
  }, [manualInputs, players, winnerId])

  const manualTotal = useMemo(
    () => Object.values(manualScores).reduce((sum, score) => sum + score, 0),
    [manualScores],
  )

  const winnerEntry = entries.find((entry) => entry.playerId === winnerId)
  const winnerName = players.find((player) => player.id === winnerId)?.name
  const winnerScore = manualScores[winnerId] ?? 0
  const canSave = preview !== null
  const canOverride = Boolean(round && onOverride && winnerId)

  const dialogTitle =
    mode === 'warning'
      ? 'Manual override'
      : mode === 'manual'
        ? 'Edit final points'
        : round
          ? 'Edit round'
          : 'Add round'

  const dialogDescription =
    mode === 'warning'
      ? 'This bypasses the automatic scoring calculation for this round.'
      : mode === 'manual'
        ? 'Change every non-winner final score. The winner is locked and balances the row.'
        : 'Everyone starts unseen. Pick a winner to mark them seen automatically, or toggle Seen / type points above 0. Unseen players score automatically.'

  function handleSeen(playerId: string, seen: boolean) {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.playerId === playerId
          ? {
              ...entry,
              seen,
              points: seen ? entry.points : 0,
              doubles: seen ? entry.doubles : false,
            }
          : entry,
      ),
    )

    if (!seen) {
      setWinnerId((prev) => (prev === playerId ? '' : prev))
    }
  }

  function handleWinnerChange(playerId: string) {
    setWinnerId(playerId)
    setEntries((prev) =>
      prev.map((entry) =>
        entry.playerId === playerId ? { ...entry, seen: true } : entry,
      ),
    )
  }

  function handlePoints(playerId: string, value: string) {
    const points = Math.max(0, Math.trunc(Number(value) || 0))
    setEntries((prev) =>
      prev.map((entry) =>
        entry.playerId === playerId
          ? { ...entry, points, seen: points > 0 ? true : entry.seen }
          : entry,
      ),
    )
  }

  function handleDoubles(playerId: string, doubles: boolean) {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.playerId === playerId ? { ...entry, doubles } : entry,
      ),
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSave) return
    onSave(winnerId, entries)
    onOpenChange(false)
  }

  function startManualOverride() {
    if (!round || !onOverride || !winnerId) return

    setManualInputs(
      Object.fromEntries(
        players.map((player) => {
          const score = round.scores[player.id] ?? 0
          return [player.id, score === 0 ? '' : String(score)]
        }),
      ),
    )
    setMode('manual')
  }

  function handleManualInput(playerId: string, value: string) {
    setManualInputs((prev) => ({ ...prev, [playerId]: value }))
  }

  function normalizeManualInput(playerId: string) {
    setManualInputs((prev) => {
      const score = Math.trunc(Number(prev[playerId] ?? 0) || 0)
      return { ...prev, [playerId]: score === 0 ? '' : String(score) }
    })
  }

  function toggleManualSign(playerId: string) {
    setManualInputs((prev) => {
      const score = Math.trunc(Number(prev[playerId] ?? 0) || 0)
      const next = -score
      return { ...prev, [playerId]: next === 0 ? '' : String(next) }
    })
  }

  function handleSaveManual() {
    if (!round || !onOverride || !winnerId) return
    onOverride(round.id, winnerId, entries, manualScores)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-auto bottom-0 left-1/2 max-h-[92svh] w-full max-w-none translate-y-0 gap-4 overflow-y-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:top-1/2 sm:bottom-auto sm:max-w-lg sm:-translate-y-1/2 sm:p-6">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        {mode === 'warning' ? (
          <div className="space-y-4">
            <div className="flex gap-3 border border-destructive/30 bg-destructive/5 p-4">
              <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-destructive">
                  This skips the scoring calculation.
                </p>
                <p className="text-muted-foreground">
                  You will set the final points for every non-winner directly.
                  The winner&apos;s points are locked and automatically adjust
                  to keep the row at 0.
                </p>
                <p className="font-semibold">
                  Only use this to correct a saved round.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setMode('round')}
              >
                Go back
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="lg"
                onClick={startManualOverride}
              >
                Continue
              </Button>
            </div>
          </div>
        ) : mode === 'manual' ? (
          <div className="space-y-4">
            <div className="flex gap-2 border border-destructive/30 bg-destructive/5 p-3 text-xs">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-muted-foreground">
                Automatic scoring is bypassed. The winner&apos;s points are
                locked and recalculated to keep the row at 0.
              </p>
            </div>

            <div className="space-y-2">
              {players.map((player) => {
                const isWinner = player.id === winnerId
                const autoScore = previewById.get(player.id)?.score

                return (
                  <div
                    key={player.id}
                    className={cn(
                      'flex items-center gap-3 border p-3',
                      isWinner && 'bg-muted/40',
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold">
                          {player.name}
                        </p>
                        {isWinner && (
                          <span className="shrink-0 text-[0.5rem] font-semibold tracking-widest text-muted-foreground uppercase">
                            Winner
                          </span>
                        )}
                      </div>
                      {isWinner ? (
                        <p className="text-xs text-muted-foreground">
                          Auto-balanced
                        </p>
                      ) : autoScore !== undefined ? (
                        <p className="text-xs text-muted-foreground tabular-nums">
                          Auto {formatScore(autoScore)}
                        </p>
                      ) : null}
                    </div>

                    {isWinner ? (
                      <div className="flex h-10 min-w-24 items-center justify-end gap-1.5 border-b border-input text-base font-semibold tabular-nums">
                        <Lock className="size-3.5 text-muted-foreground" />
                        <span className={scoreClassName(winnerScore)}>
                          {formatScore(winnerScore)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() => toggleManualSign(player.id)}
                          aria-label={`Flip sign for ${player.name}`}
                        >
                          ±
                        </Button>
                        <Input
                          id={`manual-${player.id}`}
                          type="number"
                          inputMode="numeric"
                          step={1}
                          placeholder="0"
                          value={manualInputs[player.id] ?? ''}
                          onChange={(event) =>
                            handleManualInput(player.id, event.target.value)
                          }
                          onFocus={(event) => event.currentTarget.select()}
                          onBlur={() => normalizeManualInput(player.id)}
                          aria-label={`${player.name} final points`}
                          className="h-10 w-24 text-right text-base tabular-nums"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="space-y-1 border-t pt-3">
              <div className="flex items-center justify-between text-[0.625rem] font-semibold tracking-widest uppercase">
                <span>Row total</span>
                <span>{formatScore(manualTotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {winnerName
                  ? `${winnerName} is locked and balances the row.`
                  : 'Pick a winner to balance the row.'}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                size="lg"
                onClick={handleSaveManual}
                disabled={!canOverride}
              >
                Save final points
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMode('round')}
              >
                Go back to round details
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {round?.manual && (
              <p className="border-l-2 border-amber-600/50 pl-3 text-xs text-muted-foreground">
                This round has manual final points. Saving changes here will
                recalculate them.
              </p>
            )}

            <RadioGroup
              value={winnerId}
              onValueChange={handleWinnerChange}
              className="gap-3"
            >
              {players.map((player) => {
                const entry = entries.find(
                  (item) => item.playerId === player.id,
                )
                const previewEntry = previewById.get(player.id)

                if (!entry) return null

                return (
                  <div key={player.id} className="border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {player.name}
                        </p>
                        {previewEntry && (
                          <p
                            className={cn(
                              'text-xs font-semibold tabular-nums',
                              scoreClassName(previewEntry.score),
                            )}
                          >
                            {formatScore(previewEntry.score)}
                          </p>
                        )}
                      </div>

                      <div
                        className="flex shrink-0 items-center gap-2"
                        onClick={() => handleWinnerChange(player.id)}
                      >
                        <RadioGroupItem
                          value={player.id}
                          aria-label={`${player.name} is the winner`}
                        />
                        <span className="text-[0.625rem] font-semibold tracking-widest uppercase">
                          Winner
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[0.625rem] font-semibold tracking-widest uppercase">
                          Seen
                        </span>
                        <Switch
                          checked={entry.seen}
                          onCheckedChange={(checked) =>
                            handleSeen(player.id, checked)
                          }
                          aria-label={`${player.name} has seen`}
                        />
                      </div>

                      <div
                        className={cn(
                          'flex items-center justify-between gap-2',
                          !entry.seen && 'opacity-50',
                        )}
                      >
                        <span className="text-[0.625rem] font-semibold tracking-widest uppercase">
                          Doubles
                        </span>
                        <Switch
                          checked={entry.doubles}
                          disabled={!entry.seen}
                          onCheckedChange={(checked) =>
                            handleDoubles(player.id, checked)
                          }
                          aria-label={`${player.name} is on doubles`}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <Label
                        htmlFor={`points-${player.id}`}
                        className="w-14 shrink-0"
                      >
                        Points
                      </Label>
                      <Input
                        id={`points-${player.id}`}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={1}
                        placeholder="0"
                        value={entry.points === 0 ? '' : entry.points}
                        onChange={(event) =>
                          handlePoints(player.id, event.target.value)
                        }
                        onFocus={(event) => event.currentTarget.select()}
                        className="h-10 text-right text-base tabular-nums"
                      />
                    </div>
                  </div>
                )
              })}
            </RadioGroup>

            {winnerEntry?.doubles && (
              <p className="border-l-2 border-foreground/30 pl-3 text-xs text-muted-foreground">
                Doubles win: every opponent pays an extra 5.
              </p>
            )}

            {preview && (
              <div className="space-y-1 border-t pt-3">
                <div className="flex items-center justify-between text-[0.625rem] font-semibold tracking-widest uppercase">
                  <span>Round preview</span>
                  <span>Total 0</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {preview.map((entry) => {
                    const player = players.find(
                      (item) => item.id === entry.playerId,
                    )
                    return (
                      <div
                        key={entry.playerId}
                        className="flex min-w-0 items-center justify-between gap-2 text-sm"
                      >
                        <span className="truncate">{player?.name}</span>
                        <span
                          className={cn(
                            'shrink-0 font-semibold tabular-nums',
                            scoreClassName(entry.score),
                          )}
                        >
                          {formatScore(entry.score)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-1">
              <Button type="submit" size="lg" disabled={!canSave}>
                {round ? 'Save changes' : 'Add round'}
              </Button>

              {round && onOverride && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={!winnerId}
                  title={!winnerId ? 'Pick a winner first' : undefined}
                  onClick={() => setMode('warning')}
                >
                  Edit final points
                </Button>
              )}

              {round && onDelete && (
                <div className="flex flex-col gap-2">
                  {confirmDelete ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setConfirmDelete(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          onDelete(round.id)
                          onOpenChange(false)
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => setConfirmDelete(true)}
                    >
                      Delete round
                    </Button>
                  )}
                </div>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { RoundDialog }
