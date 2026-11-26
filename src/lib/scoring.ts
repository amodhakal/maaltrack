export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 12

export const UNSEEN_WEIGHT = 10
export const SEEN_WEIGHT = 3
export const DOUBLES_WIN_BONUS = 5

export interface Player {
  id: string
  name: string
}

export interface RoundEntry {
  playerId: string
  seen: boolean
  doubles: boolean
  points: number
}

export interface Round {
  id: string
  winnerId: string
  entries: RoundEntry[]
  scores: Record<string, number>
  createdAt: string
  manual?: boolean
}

export interface GameState {
  version: 1
  started: boolean
  players: Player[]
  rounds: Round[]
}

export interface PlayerRoundScore extends RoundEntry {
  weight: number
  score: number
}

/**
 * Marriage settlement for one round.
 *
 * - Seen players contribute their manual maal points; unseen players contribute 0.
 * - `T` is the sum of all seen points.
 * - Base weight: unseen 10, seen 3, seen doubles 0.
 * - If the winner is on doubles, every opponent adds 5.
 * - Every non-winner scores `n * points - (T + weight)`.
 * - The winner takes the balancing amount so the row always totals 0.
 */
export function calculateRound(
  entries: RoundEntry[],
  winnerId: string,
): PlayerRoundScore[] {
  if (entries.length < MIN_PLAYERS) {
    throw new Error(`Add at least ${MIN_PLAYERS} players.`)
  }

  const winner = entries.find((entry) => entry.playerId === winnerId)
  if (!winner) throw new Error('Select a winner for this round.')
  if (!winner.seen) throw new Error('Only seen players can win.')

  const normalized = entries.map((entry) => ({
    ...entry,
    points: entry.seen ? Math.max(0, Math.trunc(entry.points)) : 0,
    doubles: entry.seen ? entry.doubles : false,
  }))

  const totalPoints = normalized.reduce((sum, entry) => sum + entry.points, 0)
  const playerCount = normalized.length

  const scored = normalized.map((entry) => {
    if (entry.playerId === winnerId) {
      return { ...entry, weight: 0, score: 0 }
    }

    let weight = !entry.seen
      ? UNSEEN_WEIGHT
      : entry.doubles
        ? 0
        : SEEN_WEIGHT

    if (winner.doubles) {
      weight += DOUBLES_WIN_BONUS
    }

    return {
      ...entry,
      weight,
      score: playerCount * entry.points - (totalPoints + weight),
    }
  })

  const winnerScore = -scored.reduce((sum, entry) => sum + entry.score, 0)

  return scored.map((entry) =>
    entry.playerId === winnerId ? { ...entry, score: winnerScore } : entry,
  )
}

export function scoresToRecord(
  scores: PlayerRoundScore[],
): Record<string, number> {
  return Object.fromEntries(
    scores.map((entry) => [entry.playerId, entry.score]),
  )
}

export function calculateTotals(
  rounds: Round[],
  players: Player[],
): Record<string, number> {
  const totals: Record<string, number> = Object.fromEntries(
    players.map((player) => [player.id, 0]),
  )

  for (const round of rounds) {
    for (const player of players) {
      totals[player.id] += round.scores?.[player.id] ?? 0
    }
  }

  return totals
}

export function formatScore(score: number): string {
  return score > 0 ? `+${score}` : String(score)
}
