import { Server } from "socket.io";

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

        socket.on("disconnect", () => {
            console.log(`❌ ${socket.id} disconnected`);
        });
    });
}