import { Server, Socket } from "socket.io";

type DrawLineData = {
  roomCode: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
};

export function registerDrawingHandlers(
  io: Server,
  socket: Socket
) {
  socket.on("draw-line", (data: DrawLineData) => {
    socket.to(data.roomCode).emit("draw-line", {
      from: data.from,
      to: data.to,
    });
  });
}