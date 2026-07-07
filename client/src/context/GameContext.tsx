import {
  createContext,
  useContext,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { Room } from "../../../shared";
import type { GameState } from "../../../shared/game";

type ScoreMap = Record<string, number>;

type GameContextType = {
  // Room
  room: Room | null;
  setRoom: React.Dispatch<
    React.SetStateAction<Room | null>
  >;

  // Game state
  gameState: GameState | null;
  setGameState: React.Dispatch<
    React.SetStateAction<GameState | null>
  >;

  // Drawer's secret word
  drawerWord: string;
  setDrawerWord: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Countdown timer
  timeLeft: number;
  setTimeLeft: React.Dispatch<
    React.SetStateAction<number>
  >;

  // Scoreboard
  scores: ScoreMap;
  setScores: React.Dispatch<
    React.SetStateAction<ScoreMap>
  >;

  // Word revealed after round ends
  revealedWord: string;
  setRevealedWord: React.Dispatch<
    React.SetStateAction<string>
  >;

  gameOver: boolean;
  setGameOver: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  finalScores: FinalScore[];
  setFinalScores: React.Dispatch<
    React.SetStateAction<FinalScore[]>
  >;
};

type FinalScore = {
  playerId: string;
  username: string;
  score: number;
};

const GameContext =
  createContext<GameContextType | null>(null);

export function GameProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [room, setRoom] =
    useState<Room | null>(null);

  const [gameState, setGameState] =
    useState<GameState | null>(null);

  const [drawerWord, setDrawerWord] =
    useState("");

  const [timeLeft, setTimeLeft] =
    useState(60);

  const [scores, setScores] =
    useState<ScoreMap>({});

  const [revealedWord, setRevealedWord] =
    useState("");

  const [gameOver, setGameOver] =
    useState(false);

  const [finalScores, setFinalScores] =
    useState<FinalScore[]>([]);

  return (
    <GameContext.Provider
      value={{
        room,
        setRoom,

        gameState,
        setGameState,

        drawerWord,
        setDrawerWord,

        timeLeft,
        setTimeLeft,

        scores,
        setScores,

        revealedWord,
        setRevealedWord,

        gameOver,
        setGameOver,

        finalScores,
        setFinalScores,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGame must be used inside GameProvider"
    );
  }

  return context;
}

export default GameContext;