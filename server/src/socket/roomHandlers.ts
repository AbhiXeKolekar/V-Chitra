import { Socket } from "socket.io";
import { roomManager } from "../services";

export function registerRoomHandlers(socket: Socket) {
    socket.on("create-room", (data: { username: string }) => {
        const room = roomManager.createRoom(data.username, socket.id);

        socket.join(room.code);

        socket.emit("room-created", room);

        console.log(`🏠 Room ${room.code} created by ${data.username}`);
    });

    socket.on(
  "join-room",
  (data: { roomCode: string; username: string }) => {
    const room = roomManager.addPlayer(
      data.roomCode,
      data.username,
      socket.id
    );

    if (!room) {
      socket.emit("room-error", {
        message: "Room not found.",
      });

      return;
    }

    socket.join(room.code);

    socket.emit("room-joined", room);

    socket.to(room.code).emit("player-joined", room);

    console.log(`${data.username} joined ${room.code}`);
  }
);
}