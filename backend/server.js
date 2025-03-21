import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config()


const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

const app = express();
const server = createServer(app);

app.use(cors({ origin: FRONTEND_URL }));

const io = new Server(server, { cors: { origin: FRONTEND_URL } });

const AvailableUsersQueue = []; // Queue for users waiting for a match
const ConnectedUsers = new Map(); // Stores active connections

const matchUsers = () => {
  while (AvailableUsersQueue.length >= 2) {
    const user1 = AvailableUsersQueue.shift();
    const user2 = AvailableUsersQueue.shift();

    ConnectedUsers.set(user1.id, user2.id);
    ConnectedUsers.set(user2.id, user1.id);

    io.to(user1.id).emit("remoteId", user2.id);
    io.to(user2.id).emit("approach", [user1.name, user1.id, user2.id]);
  }
};

io.on("connection", (socket) => {
  socket.on("AnyUser", (data) => {
    const [name] = data;
    console.log(name)
    socket.emit("myId", socket.id);
    
    if (name) {
      AvailableUsersQueue.push({ id: socket.id, name });
      matchUsers();
    }
  });

  socket.on("call", (data) => {
    const [, offervalue, iceCandidate, , remoteId] = data;
    socket.to(remoteId).emit("call", data);
  });

  socket.on("answerCall", (data) => {
    const [, answer, iceCandidate, remoteId] = data;
    socket.to(remoteId).emit("answerCall", data);
  });


  socket.on("connectionEnd", ({ userLeftId }) => {
    const remoteId = ConnectedUsers.get(userLeftId);

    if (remoteId) {
      socket.to(remoteId).emit("connectionEnd", "User left",);
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
    AvailableUsersQueue.splice(
      AvailableUsersQueue.findIndex((user) => user.id === socket.id),
      1
    );
  });
});

server.listen(PORT, () => {
  console.log("Server is running on port 5000");
});
