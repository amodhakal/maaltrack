import { useState } from 'react'
import { RoundDialog } from '@/components/game/round-dialog'
import { Scoreboard } from '@/components/game/scoreboard'
import { SetupScreen } from '@/components/game/setup-screen'
import { Toaster } from '@/components/ui/sonner'
import { useGame } from '@/hooks/use-game'
import type { Round } from '@/lib/scoring'

function App() {
  const game = useGame()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRound, setEditingRound] = useState<Round | null>(null)

  function openAddRound() {
    setEditingRound(null)
    setDialogOpen(true)
  }

  function openEditRound(round: Round) {
    setEditingRound(round)
    setDialogOpen(true)
  }

  if (!game.started) {
    return (
      <>
        <SetupScreen
          players={game.players}
          canStart={game.canStart}
          onAddPlayer={game.addPlayer}
          onRemovePlayer={game.removePlayer}
          onStart={game.startGame}
        />
        <Toaster position="top-center" closeButton />
      </>
    )
  }

  return (
    <>
      <Scoreboard
        players={game.players}
        rounds={game.rounds}
        totals={game.totals}
        onAddRound={openAddRound}
        onEditRound={openEditRound}
        onReset={game.resetGame}
      />

      <RoundDialog
        key={dialogOpen ? (editingRound?.id ?? 'new') : 'closed'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        players={game.players}
        round={editingRound}
        onSave={(winnerId, entries) => {
          if (editingRound) {
            game.updateRound(editingRound.id, winnerId, entries)
          } else {
            game.addRound(winnerId, entries)
          }
        }}
        onDelete={
          editingRound
            ? (roundId) => game.deleteRound(roundId)
            : undefined
        }
        onOverride={game.overrideRoundScores}
      />

      <Toaster position="top-center" closeButton />
    </>
  )
}

export default App
