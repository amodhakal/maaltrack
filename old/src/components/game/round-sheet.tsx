import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, Lock, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { calculateRound, formatScore } from '@/lib/scoring'
import type { Player, Round, RoundEntry } from '@/lib/scoring'
import { Score } from './score'

type Step = 'winner' | 'points' | 'warning' | 'manual'

interface RoundSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  players: Player[]
  round: Round | null
  roundNumber: number
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
      return { playerId: player.id, seen: false, doubles: false, points: 0 }
    }

    return { ...existing, doubles: existing.seen && existing.doubles }
  })
}

function Chip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'relative h-9 px-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-inset-y-1',
        pressed
          ? 'bg-primary/15 text-primary'
          : 'text-muted-foreground hover:bg-secondary',
      )}
    >
      {children}
    </button>
  )
}

function Stepper({
  player,
  value,
  onChange,
}: {
  player: Player
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex shrink-0 items-center border border-border">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        aria-label={`Decrease ${player.name} points`}
        className="grid size-11 place-items-center text-lg text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-30"
      >
        −
      </button>
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        step={1}
        value={value === 0 ? '' : value}
        placeholder="0"
        onChange={(event) =>
          onChange(Math.max(0, Math.trunc(Number(event.target.value) || 0)))
        }
        onFocus={(event) => {
          event.currentTarget.select()
          event.currentTarget.scrollIntoView({ block: 'center' })
        }}
        aria-label={`${player.name} points`}
        className="h-11 w-10 rounded-none border-0 border-x border-border bg-transparent px-0 text-center text-base font-semibold tabular-nums focus-visible:bg-transparent focus-visible:ring-0"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label={`Increase ${player.name} points`}
        className="grid size-11 place-items-center text-lg text-muted-foreground transition-colors hover:bg-secondary"
      >
        +
      </button>
    </div>
  )
}

function RoundSheet({
  open,
  onOpenChange,
  players,
  round,
  roundNumber,
  onSave,
  onDelete,
  onOverride,
}: RoundSheetProps) {
  const [entries, setEntries] = useState<RoundEntry[]>(() =>
    createEntries(players, round),
  )
  const [winnerId, setWinnerId] = useState(() => round?.winnerId ?? '')
  const [step, setStep] = useState<Step>(() => (round ? 'points' : 'winner'))
  const [manualInputs, setManualInputs] = useState<Record<string, string>>({})
  const [confirmDelete, setConfirmDelete] = useState(false)

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

  const winnerName = players.find((player) => player.id === winnerId)?.name
  const winnerScore = manualScores[winnerId] ?? 0
  const canSave = preview !== null
  const canOverride = Boolean(round && onOverride && winnerId)
  

  const title =
    step === 'winner'
      ? 'Who won?'
      : step === 'manual' || step === 'warning'
        ? 'Override'
        : `Round ${roundNumber}`

  const subtitle =
    step === 'winner'
      ? round
        ? `Round ${roundNumber}`
        : 'New round'
      : step === 'points'
        ? winnerName
        : undefined

  function selectWinner(playerId: string) {
    setWinnerId(playerId)
    setEntries((prev) =>
      prev.map((entry) =>
        entry.playerId === playerId ? { ...entry, seen: true } : entry,
      ),
    )
    setStep('points')
  }

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

  function handlePoints(playerId: string, points: number) {
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

  function handleSave() {
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
    setStep('manual')
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

  function goBack() {
    setStep('points')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <header className="flex items-center gap-1 px-3 pt-3 pb-2 pr-16">
          {step !== 'winner' ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Back"
              onClick={goBack}
            >
              <ArrowLeft />
            </Button>
          ) : null}
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate text-xl">{title}</DialogTitle>
            {subtitle ? (
              <p className="truncate text-sm text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>
        </header>

        <DialogDescription className="sr-only">Round scoring</DialogDescription>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {step === 'winner' ? (
            <div className="grid grid-cols-2 gap-2 pt-1">
              {players.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => selectWinner(player.id)}
                  className={cn(
                    'h-14 truncate border px-3 text-left text-base font-medium transition-colors',
                    winnerId === player.id
                      ? 'border-primary text-primary'
                      : 'border-border hover:bg-secondary active:bg-secondary',
                  )}
                >
                  {player.name}
                </button>
              ))}
            </div>
          ) : null}

          {step === 'points' ? (
            <>
              <ul className="border-y border-border">
                {players.map((player) => {
                  const entry = entries.find(
                    (item) => item.playerId === player.id,
                  )
                  if (!entry) return null

                  const isWinner = player.id === winnerId
                  const score = previewById.get(player.id)?.score ?? 0

                  return (
                    <li
                      key={player.id}
                      className="relative border-b border-border py-2 last:border-b-0"
                    >
                      {isWinner ? (
                        <span
                          aria-hidden
                          className="absolute inset-y-2 left-0 w-0.5 bg-primary"
                        />
                      ) : null}
                      <div className="flex items-center gap-2 pl-2">
                        <span
                          className={cn(
                            'min-w-0 flex-1 truncate text-base',
                            isWinner && 'font-semibold',
                          )}
                        >
                          {player.name}
                        </span>
                        <Score
                          value={score}
                          showIcon={false}
                          className="text-sm"
                        />
                        <Stepper
                          player={player}
                          value={entry.points}
                          onChange={(points) =>
                            handlePoints(player.id, points)
                          }
                        />
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 pl-2">
                        <Chip
                          pressed={entry.seen}
                          onClick={() => handleSeen(player.id, !entry.seen)}
                        >
                          Seen
                        </Chip>
                        {entry.seen ? (
                          <Chip
                            pressed={entry.doubles}
                            onClick={() =>
                              handleDoubles(player.id, !entry.doubles)
                            }
                          >
                            Doubles
                          </Chip>
                        ) : null}
                      </div>
                    </li>
                  )
                })}
              </ul>

              {round && onDelete ? (
                <div className="pt-4">
                  {confirmDelete ? (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setConfirmDelete(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        className="flex-1"
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
                      className="w-full text-destructive hover:bg-destructive/10"
                      onClick={() => setConfirmDelete(true)}
                    >
                      Delete round
                    </Button>
                  )}
                </div>
              ) : null}
            </>
          ) : null}

          {step === 'warning' ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 border-l-2 border-destructive bg-destructive/5 py-3 pr-2 pl-3">
                <TriangleAlert
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-destructive"
                />
                <p className="text-sm text-muted-foreground">
                  Skips auto scoring. Winner balances the row.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('points')}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={startManualOverride}
                >
                  Continue
                </Button>
              </div>
            </div>
          ) : null}

          {step === 'manual' ? (
            <ul className="border-y border-border">
              {players.map((player) => {
                const isWinner = player.id === winnerId
                const autoScore = previewById.get(player.id)?.score

                return (
                  <li
                    key={player.id}
                    className="flex items-center gap-3 border-b border-border py-2 last:border-b-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base">{player.name}</p>
                      {!isWinner && autoScore !== undefined ? (
                        <p className="text-sm text-muted-foreground tabular-nums">
                          Auto {formatScore(autoScore)}
                        </p>
                      ) : null}
                    </div>

                    {isWinner ? (
                      <span className="flex h-11 min-w-20 items-center justify-end gap-1.5 border-b border-input pr-1 font-serif text-lg tabular-nums">
                        <Lock
                          aria-hidden
                          className="size-3.5 text-muted-foreground"
                        />
                        {formatScore(winnerScore)}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleManualSign(player.id)}
                          aria-label={`Flip sign for ${player.name}`}
                          className="grid size-11 place-items-center border border-border text-base transition-colors hover:bg-secondary"
                        >
                          ±
                        </button>
                        <Input
                          type="number"
                          inputMode="numeric"
                          step={1}
                          placeholder="0"
                          value={manualInputs[player.id] ?? ''}
                          onChange={(event) =>
                            handleManualInput(player.id, event.target.value)
                          }
                          onFocus={(event) => {
                            event.currentTarget.select()
                            event.currentTarget.scrollIntoView({
                              block: 'center',
                            })
                          }}
                          onBlur={() => normalizeManualInput(player.id)}
                          aria-label={`${player.name} final points`}
                          className="h-11 w-20 text-right tabular-nums"
                        />
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>

        {step === 'points' || step === 'manual' ? (
          <footer className="border-t border-border px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <Button
              type="button"
              size="lg"
              className="w-full"
              disabled={step === 'manual' ? !canOverride : !canSave}
              onClick={step === 'manual' ? handleSaveManual : handleSave}
            >
              {step === 'manual' ? 'Save' : round ? 'Save' : 'Add round'}
            </Button>

            {step === 'points' && round && onOverride ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-1 w-full"
                disabled={!winnerId}
                onClick={() => setStep('warning')}
              >
                Override
              </Button>
            ) : null}
          </footer>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export { RoundSheet }
