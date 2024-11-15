import express from "express";
import { Server } from "socket.io";
const app = express();
const server = app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join-room", (roomId) => {
    console.log(`User joined room ${roomId}`);
    socket.join(roomId);
  });

  socket.on("leave-room", (roomId) => {
    console.log(`User left room ${roomId}`);
    socket.leave(roomId);
  });

  socket.on("send-coordinates", ({ coordinates, roomId }) => {
    console.log(
      `Received coordinates: ${coordinates.latitude} ${coordinates.longitude}`
    );
    socket.to(roomId).emit("receive-coordinates", coordinates);
  });

  io.on("disconnect", () => {
    console.log("User disconnected");
  });

  io.on("chat message", (msg) => {
    console.log("Message received:", msg);
    io.emit("chat message", msg);
  });
});
