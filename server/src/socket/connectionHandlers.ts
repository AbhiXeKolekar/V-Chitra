import { Socket } from "socket.io";
import { roomManager } from "../services";

export function registerConnectionHandlers(socket: Socket) {
  console.log(`✅ ${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log(`❌ ${socket.id} disconnected`);

    const room = roomManager.removePlayer(socket.id);

    if (!room) {
      return;
    }

    socket.to(room.code).emit("player-left", room);

    console.log(
      `Player removed from room ${room.code}`
    );
  });
}