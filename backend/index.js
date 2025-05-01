import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const port = 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

let users = {}; // Map socket.id -> socket

io.on("connection", (socket) => {
  // Store the user socket
  users[socket.id] = socket;

  socket.on("admin-join", () => {
    socket.join("admin-room");
  });

  socket.on("user-message", ({ name, email, input }) => {
    // Emit message to admin
    io.to("admin-room").emit("new-user-message", {
      id: socket.id,
      name,
      email,
      input,
    });
  });

  socket.on("admin-reply", ({ toUserId, msg }) => {
    if (users[toUserId]) {
      users[toUserId].emit("admin-reply", msg);
    }
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
  });
});

server.listen(port, () => console.log(`Server running on port ${port}`));
