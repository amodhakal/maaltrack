"use client";

import { useState } from "react";
import { RoundSheet } from "@/components/game/round-sheet";
import { Scoreboard } from "@/components/game/scoreboard";
import { SetupScreen } from "@/components/game/setup-screen";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { OfflineIndicator } from "@/components/pwa/offline-indicator";
import { PwaUpdateToast } from "@/components/pwa/pwa-update-toast";
import { Toaster } from "@/components/ui/sonner";
import { useGame } from "@/hooks/use-game";
import type { Round } from "@/lib/scoring";

export function GameClient() {
  const game = useGame();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);

  const roundNumber = editingRound
    ? Math.max(
        1,
        game.rounds.findIndex((round) => round.id === editingRound.id) + 1,
      )
    : game.rounds.length + 1;

  function openAddRound() {
    setEditingRound(null);
    setDialogOpen(true);
  }

  function openEditRound(round: Round) {
    setEditingRound(round);
    setDialogOpen(true);
  }

  if (!game.started) {
    return (
      <>
        <OfflineIndicator />
        <SetupScreen
          players={game.players}
          canStart={game.canStart}
          onAddPlayer={game.addPlayer}
          onRemovePlayer={game.removePlayer}
          onStart={game.startGame}
        />
        <InstallPrompt />
        <PwaUpdateToast />
        <Toaster position="top-center" closeButton />
      </>
    );
  }

  return (
    <>
      <OfflineIndicator />
      <Scoreboard
        players={game.players}
        rounds={game.rounds}
        totals={game.totals}
        onAddRound={openAddRound}
        onEditRound={openEditRound}
        onReset={game.resetGame}
      />

      <RoundSheet
        key={dialogOpen ? (editingRound?.id ?? "new") : "closed"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        players={game.players}
        round={editingRound}
        roundNumber={roundNumber}
        onSave={(winnerId, entries) => {
          if (editingRound) {
            game.updateRound(editingRound.id, winnerId, entries);
          } else {
            game.addRound(winnerId, entries);
          }
        }}
        onDelete={editingRound ? (roundId) => game.deleteRound(roundId) : undefined}
        onOverride={game.overrideRoundScores}
      />

      <InstallPrompt />
      <PwaUpdateToast />
      <Toaster position="top-center" closeButton />
    </>
  );
}
