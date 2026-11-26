import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  calculateRound,
  calculateTotals,
  scoresToRecord,
} from '@/lib/scoring'
import type { GameState, Round, RoundEntry } from '@/lib/scoring'
import { clearGame, loadGame, saveGame } from '@/lib/storage'

const EMPTY_STATE: GameState = {
  version: 1,
  started: false,
  players: [],
  rounds: [],
}

export function useGame() {
  const [state, setState] = useState<GameState>(() => loadGame() ?? EMPTY_STATE)

  useEffect(() => {
    saveGame(state)
  }, [state])

  const totals = useMemo(
    () => calculateTotals(state.rounds, state.players),
    [state.rounds, state.players],
  )

  const addPlayer = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return

    const playerId = crypto.randomUUID()

    setState((prev) => {
      if (prev.started || prev.players.length >= MAX_PLAYERS) return prev
      if (
        prev.players.some(
          (player) => player.name.toLowerCase() === trimmed.toLowerCase(),
        )
      ) {
        return prev
      }

      return {
        ...prev,
        players: [...prev.players, { id: playerId, name: trimmed }],
      }
    })
  }, [])

  const removePlayer = useCallback((playerId: string) => {
    setState((prev) =>
      prev.started
        ? prev
        : {
            ...prev,
            players: prev.players.filter((player) => player.id !== playerId),
          },
    )
  }, [])

  const startGame = useCallback(() => {
    setState((prev) =>
      prev.players.length >= MIN_PLAYERS ? { ...prev, started: true } : prev,
    )
  }, [])

  const resetGame = useCallback(() => {
    clearGame()
    setState(EMPTY_STATE)
  }, [])

  const addRound = useCallback((winnerId: string, entries: RoundEntry[]) => {
    const scores = scoresToRecord(calculateRound(entries, winnerId))
    const round: Round = {
      id: crypto.randomUUID(),
      winnerId,
      entries,
      scores,
      createdAt: new Date().toISOString(),
    }

    setState((prev) => ({ ...prev, rounds: [...prev.rounds, round] }))
  }, [])

  const updateRound = useCallback(
    (roundId: string, winnerId: string, entries: RoundEntry[]) => {
      const scores = scoresToRecord(calculateRound(entries, winnerId))

      setState((prev) => ({
        ...prev,
        rounds: prev.rounds.map((round) =>
          round.id === roundId
            ? { ...round, winnerId, entries, scores, manual: false }
            : round,
        ),
      }))
    },
    [],
  )

  const overrideRoundScores = useCallback(
    (
      roundId: string,
      winnerId: string,
      entries: RoundEntry[],
      scores: Record<string, number>,
    ) => {
      if (!entries.some((entry) => entry.playerId === winnerId)) return

      const normalized = Object.fromEntries(
        entries.map((entry) => [
          entry.playerId,
          Math.trunc(scores[entry.playerId] ?? 0),
        ]),
      )
      const total = Object.values(normalized).reduce(
        (sum, score) => sum + score,
        0,
      )
      if (total !== 0) return

      setState((prev) => ({
        ...prev,
        rounds: prev.rounds.map((round) =>
          round.id === roundId
            ? {
                ...round,
                winnerId,
                entries,
                scores: normalized,
                manual: true,
              }
            : round,
        ),
      }))
    },
    [],
  )

  const deleteRound = useCallback((roundId: string) => {
    setState((prev) => ({
      ...prev,
      rounds: prev.rounds.filter((round) => round.id !== roundId),
    }))
  }, [])

  return {
    started: state.started && state.players.length >= MIN_PLAYERS,
    players: state.players,
    rounds: state.rounds,
    totals,
    canStart: state.players.length >= MIN_PLAYERS,
    addPlayer,
    removePlayer,
    startGame,
    resetGame,
    addRound,
    updateRound,
    overrideRoundScores,
    deleteRound,
  }
}
