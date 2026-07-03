import { Server, Socket } from "socket.io";

import { roomManager, gameManager } from "../services";

export function registerGameHandlers(
  io: Server,
  socket: Socket
) {
  socket.on("start-game", (roomCode: string) => {
    const room = roomManager.getRoom(roomCode);

    if (!room) return;

    const host = room.players.find(
      (player) => player.isHost
    );

    if (!host || host.id !== socket.id) {
      return;
    }

    const session = gameManager.startGame(room);

    io.to(room.code).emit("game-started");

    io.to(room.code).emit("game-state", {
      drawerId: session.drawerId,
      drawerName: session.drawerName,

      wordLength: session.word.length,

      timeLeft: session.timeLeft,

      currentRound: session.currentRound,
      totalRounds: session.totalRounds,
    });

    io.to(session.drawerId).emit("drawer-data", {
      drawerId: session.drawerId,
      word: session.word,
    });

    gameManager.startTimer(
      room.code,

      (timeLeft) => {
        io.to(room.code).emit(
          "timer-update",
          timeLeft
        );
      },

      () => {
        io.to(room.code).emit("round-ended");
      }
    );
  });

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
}