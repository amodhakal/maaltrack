import type { GameState, Player, Round, RoundEntry } from '@/lib/scoring'

const STORAGE_KEY = 'maaltrack:game:v1'

function isPlayer(value: unknown): value is Player {
  if (!value || typeof value !== 'object') return false
  const player = value as Partial<Player>
  return typeof player.id === 'string' && typeof player.name === 'string'
}

function isRoundEntry(value: unknown): value is RoundEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<RoundEntry>
  return (
    typeof entry.playerId === 'string' &&
    typeof entry.seen === 'boolean' &&
    typeof entry.doubles === 'boolean' &&
    typeof entry.points === 'number'
  )
}

function isRound(value: unknown): value is Round {
  if (!value || typeof value !== 'object') return false
  const round = value as Partial<Round>
  return (
    typeof round.id === 'string' &&
    typeof round.winnerId === 'string' &&
    typeof round.createdAt === 'string' &&
    Array.isArray(round.entries) &&
    round.entries.every(isRoundEntry) &&
    !!round.scores &&
    typeof round.scores === 'object' &&
    Object.values(round.scores).every(
      (score) => typeof score === 'number' && Number.isFinite(score),
    ) &&
    (round.manual === undefined || typeof round.manual === 'boolean')
  )
}

function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false
  const state = value as Partial<GameState>
  return (
    state.version === 1 &&
    typeof state.started === 'boolean' &&
    Array.isArray(state.players) &&
    state.players.every(isPlayer) &&
    Array.isArray(state.rounds) &&
    state.rounds.every(isRound)
  )
}

export function loadGame(): GameState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    return isGameState(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveGame(state: GameState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage may be unavailable (private browsing); the game still works in memory.
  }
}

export function clearGame() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore storage failures.
  }
}
