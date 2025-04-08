import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";

const app = express();
const server = createServer(app);

app.use(cors({ origin: FRONTEND_URL }));

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

const AvailableUsersQueue = [];
const ConnectedUsers = new Map();

const matchUsers = () => {
  while (AvailableUsersQueue.length >= 2) {
    const user1 = AvailableUsersQueue.shift();
    const user2 = AvailableUsersQueue.shift();

    ConnectedUsers.set(user1.id, user2.id);
    ConnectedUsers.set(user2.id, user1.id);

    if (user1.chooseType === "videoChat" && user2.chooseType === "videoChat") {
      io.to(user1.id).emit("remoteId", user2.id);
      io.to(user2.id).emit("approach", [user1.name, user1.id, user2.id]);
    } else {
      io.to(user1.id).emit("remoteId", user2.id);
      io.to(user2.id).emit("connection", [user1.name, user1.id, user2.id]);
    }
  }
};

io.on("connection", (socket) => {
  let userData = null; // Save user-specific data

  socket.on("AnyUser", (data) => {
    const [name, category, choice] = data;
    socket.emit("myId", socket.id);

    if (name && choice) {
      userData = { id: socket.id, name, chooseType: choice };
      AvailableUsersQueue.push(userData);
      matchUsers();
    }
  });

  socket.on("call", (data) => {
    const [name, offervalue, myId, remoteId] = data;
    socket.to(remoteId).emit("call", data);
  });

  socket.on("answerCall", (data) => {
    const [name, createdAnswer, remoteId, myId] = data;
    socket.to(remoteId).emit("answerCall", data);
  });

  socket.on("iceCandidate", (data) => {
    const [candidate, remoteId] = data;
    socket.to(remoteId).emit("receiveCandidate", candidate);
  });

  socket.on("sendMessage", (data) => {
    const { remoteId, msg, type } = data;
    socket.to(remoteId).emit("receiveMessage", { msg, type: "receiver" });
  });

  socket.on("connectionEnd", ({ userLeftId }) => {
    const remoteId = ConnectedUsers.get(userLeftId);
    if (remoteId) {
      socket.to(remoteId).emit("connectionEnd", "User left");
      ConnectedUsers.delete(userLeftId);
      ConnectedUsers.delete(remoteId);
    }
  });

  socket.on("disconnect", () => {
    const remoteId = ConnectedUsers.get(socket.id);
    if (remoteId) {
      socket.to(remoteId).emit("connectionEnd", "User left");
      ConnectedUsers.delete(socket.id);
      ConnectedUsers.delete(remoteId);
    }

    const index = AvailableUsersQueue.findIndex((user) => user.id === socket.id);
    if (index !== -1) AvailableUsersQueue.splice(index, 1);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
