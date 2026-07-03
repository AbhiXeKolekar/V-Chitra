import type { Room } from "../../../shared";

export type GameSession = {
  roomCode: string;
  drawerId: string;
  drawerName: string;
  word: string;
};

export class GameManager {
  private sessions = new Map<string, GameSession>();

  private words = [
    "Dragon",
    "Castle",
    "Rocket",
    "Elephant",
    "Laptop",
    "Ocean",
    "Tiger",
    "Robot",
    "Guitar",
    "Volcano",
  ];

  startGame(room: Room) {
    const drawer =
      room.players[
        Math.floor(Math.random() * room.players.length)
      ];

    const word =
      this.words[
        Math.floor(Math.random() * this.words.length)
      ];

    const session: GameSession = {
      roomCode: room.code,
      drawerId: drawer.id,
      drawerName: drawer.username,
      word,
    };

    this.sessions.set(room.code, session);

    return session;
  }

  getSession(roomCode: string) {
    return this.sessions.get(roomCode);
  }

  endGame(roomCode: string) {
    this.sessions.delete(roomCode);
  }
}