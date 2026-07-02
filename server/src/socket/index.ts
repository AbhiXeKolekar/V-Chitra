import { Server } from "socket.io";
import { roomManager } from "../services";

export function registerSocketHandlers(io: Server) {
    io.on("connection", (socket) => {
        console.log(`✅ ${socket.id} connected`);

        // Listen for a custom event from the client
        socket.on("hello-server", (message: string) => {
            console.log(message);

            socket.emit("welcome", {
                message: "Welcome to Draw Together!",
            });
        });

        socket.on("create-room", (data: { username: string }) => {
            const room = roomManager.createRoom(data.username, socket.id);

            socket.join(room.code);

            socket.emit("room-created", room);

            console.log(`🏠 Room ${room.code} created by ${data.username}`);
        });

        socket.on("disconnect", () => {
            console.log(`❌ ${socket.id} disconnected`);
        });
    });
}