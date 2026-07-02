import { Socket } from "socket.io";

export function registerConnectionHandlers(socket: Socket) {
    console.log(`✅ ${socket.id} connected`);

    socket.on("disconnect", () => {
        console.log(`❌ ${socket.id} disconnected`);
    });
}