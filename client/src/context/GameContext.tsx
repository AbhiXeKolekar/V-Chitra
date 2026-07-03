import {
  createContext,
  useContext,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { Room } from "../../../shared";
import type { GameState } from "../../../shared/game";

type GameContextType = {
  room: Room | null;
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>;

  gameState: GameState | null;
  setGameState: React.Dispatch<
    React.SetStateAction<GameState | null>
  >;

  drawerWord: string;
  setDrawerWord: React.Dispatch<
    React.SetStateAction<string>
  >;

  timeLeft: number;
  setTimeLeft: React.Dispatch<
    React.SetStateAction<number>
  >;
};

const GameContext = createContext<GameContextType | null>(
  null
);

export function GameProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [room, setRoom] = useState<Room | null>(null);

  const [gameState, setGameState] =
    useState<GameState | null>(null);

  const [drawerWord, setDrawerWord] =
    useState("");

  const [timeLeft, setTimeLeft] =
    useState(60);

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