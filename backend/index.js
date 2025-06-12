import dotenv from "dotenv"
import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import connectDB from "./src/db/index.js";
import setupSocket from "./src/socket/SocketHandler.js";

dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    const server = http.createServer(app);

    // Setup Socket.IO
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true
      }
    });

    // Delegate socket logic
    setupSocket(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed:", err);
  });
