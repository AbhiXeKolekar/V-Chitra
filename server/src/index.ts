import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./socket";

const app = express();

// Wrap Express inside an HTTP server
const httpServer = createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
    },
});

const PORT = 3000;

app.get("/", (_, res) => {
    res.send("Server Running 🚀");
});

// Listen for client connections
registerSocketHandlers(io);

httpServer.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});