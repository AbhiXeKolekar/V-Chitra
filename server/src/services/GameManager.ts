import type { Room } from "../../../shared";

export type GameSession = {
  roomCode: string;

  drawerId: string;
  drawerName: string;

  word: string;

  timeLeft: number;
  timer: NodeJS.Timeout | null;

  scores: Record<string, number>;
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

    const scores: Record<string, number> = {};

room.players.forEach((player) => {
  scores[player.id] = 0;
});

const session: GameSession = {
      roomCode: room.code,
      drawerId: drawer.id,
      drawerName: drawer.username,
      word,

      timeLeft: 60,
      timer: null,
      scores,
    };

    this.sessions.set(room.code, session);

    return session;
  }

  getSession(roomCode: string) {
    return this.sessions.get(roomCode);
  }

  addPoint(roomCode: string, playerId: string) {
  const session = this.sessions.get(roomCode);

  if (!session) return;

  session.scores[playerId]++;
}

getScores(roomCode: string) {
  return this.sessions.get(roomCode)?.scores;
}

  startTimer(
    roomCode: string,
    onTick: (timeLeft: number) => void,
    onFinish: () => void
  ) {
    const session = this.sessions.get(roomCode);

    if (!session) return;

    // Prevent duplicate timers
    if (session.timer) {
      clearInterval(session.timer);
    }

    session.timer = setInterval(() => {
      session.timeLeft--;

      onTick(session.timeLeft);

      if (session.timeLeft <= 0) {
        clearInterval(session.timer!);

        session.timer = null;

        onFinish();
      }
    }, 1000);
  }

  endGame(roomCode: string) {
    const session = this.sessions.get(roomCode);

    if (session?.timer) {
      clearInterval(session.timer);
    }

    this.sessions.delete(roomCode);
  }
}