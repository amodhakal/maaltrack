import type { Metadata } from "next";
import { GameClient } from "@/components/game/game-client";

export const metadata: Metadata = {
  title: "Play — MaalTrack",
  description:
    "Start tracking your Marriage card game scores. Add players, log rounds, and auto-settle totals.",
  alternates: {
    canonical: "/play",
  },
};

export default function PlayPage() {
  return <GameClient />;
}
