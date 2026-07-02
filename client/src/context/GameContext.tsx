import {
  createContext,
  useContext,
  useState,
} from "react";
import type { ReactNode } from "react";

type Player = {
  id: string;
  username: string;
  isHost: boolean;
};

type Room = {
  code: string;
  players: Player[];
};

type GameContextType = {
  room: Room | null;
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<Room | null>(null);

  return (
    <GameContext.Provider value={{ room, setRoom }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }

  return context;
}