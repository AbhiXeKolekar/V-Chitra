import { Server, Socket } from "socket.io";

import { roomManager, gameManager } from "../services";

import { endRound } from "./roundManager";
import { startRound } from "./roundManager";

export function registerGameHandlers(
  io: Server,
  socket: Socket
) {
  socket.on(
    "start-game",
    (roomCode: string) => {
      const room =
        roomManager.getRoom(roomCode);

      if (!room) return;

      const host = room.players.find(
        (player) => player.isHost
      );

      if (
        !host ||
        host.id !== socket.id
      ) {
        return;
      }

      gameManager.startGame(room);

      io.to(room.code).emit(
        "game-started"
      );

      startRound(io, room.code);
    }
  );

  socket.on(
    "get-game-state",
    (roomCode: string) => {
      const session =
        gameManager.getSession(roomCode);

      if (!session) return;

      socket.emit("game-state", {
        drawerId: session.drawerId,
        drawerName: session.drawerName,

        wordLength: session.word.length,

        timeLeft: session.timeLeft,

        currentRound: session.currentRound,
        totalRounds: session.totalRounds,
      });

      if (
        session.drawerId === socket.id
      ) {
        socket.emit("drawer-data", {
          drawerId: session.drawerId,
          word: session.word,
        });
      }
    }
  );

  socket.on(
    "end-round",
    (roomCode: string) => {
      const session =
        gameManager.getSession(roomCode);

      if (!session) return;

      if (session.timer) {
        clearInterval(session.timer);
        session.timer = null;
      }

      endRound(io, roomCode);
    }
  );

  socket.on(
  "play-again",
  (roomCode: string) => {
    const room =
      roomManager.getRoom(roomCode);

    if (!room) return;

    const host = room.players.find(
      (player) => player.isHost
    );

    if (!host) return;

    if (host.id !== socket.id) {
      return;
    }

    gameManager.resetGame(room.code);

    io.to(room.code).emit(
      "return-to-lobby"
    );
  }
);
}