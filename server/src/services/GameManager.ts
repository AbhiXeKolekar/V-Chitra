import type { Room } from "../../../shared";

export type GameSession = {
  roomCode: string;

  scores: Record<string, number>;

  currentRound: number;
  totalRounds: number;

  drawerId: string;
  drawerName: string;

  word: string;

  timeLeft: number;
  timer: NodeJS.Timeout | null;
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

  scores,

  currentRound: 1,
  totalRounds: 5,

  drawerId: drawer.id,
  drawerName: drawer.username,

  word,

  timeLeft: 60,
  timer: null,
};

    this.sessions.set(room.code, session);

    return session;
  }

  getSession(roomCode: string) {
    return this.sessions.get(roomCode);
  }

  nextRound(room: Room) {
  const session = this.sessions.get(room.code);

  if (!session) return null;

  if (session.currentRound >= session.totalRounds) {
    return null;
  }

  session.currentRound++;

  const drawer =
    room.players[
      Math.floor(Math.random() * room.players.length)
    ];

  const word =
    this.words[
      Math.floor(Math.random() * this.words.length)
    ];

  session.drawerId = drawer.id;
  session.drawerName = drawer.username;
  session.word = word;
  session.timeLeft = 60;

  return session;
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