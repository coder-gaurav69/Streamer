import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://streamer123.netlify.app";

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

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

    io.to(user1.id).emit("remoteId", user2.id);
    io.to(user2.id).emit("approach", [user1.name, user1.id, user2.id]);
  }
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("AnyUser", (data) => {
    const [name] = data;
    console.log("New user:", name);

    socket.emit("myId", socket.id);

    if (name) {
      AvailableUsersQueue.push({ id: socket.id, name });
      matchUsers();
    }
  });

  socket.on("call", ([name, offervalue, myId, remoteId]) => {
    io.to(remoteId).emit("call", [name, offervalue, myId, remoteId]);
  });

  socket.on("answerCall", ([name, answer, remoteId, myId]) => {
    io.to(remoteId).emit("answerCall", [name, answer, remoteId, myId]);
  });


    // Handle ICE candidate exchange
  socket.on("ice-candidate", ({ candidate, remoteId }) => {
    console.log(`ICE Candidate received from ${socket.id} to ${remoteId}`);
    
    if (remoteId) {
      io.to(remoteId).emit("ice-candidate", { candidate });
    }
  });

  socket.on("connectionEnd", ({ userLeftId }) => {
    const remoteId = ConnectedUsers.get(userLeftId);

    if (remoteId) {
      io.to(remoteId).emit("connectionEnd", "User left");
      ConnectedUsers.delete(userLeftId);
      ConnectedUsers.delete(remoteId);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    const remoteId = ConnectedUsers.get(socket.id);
    if (remoteId) {
      io.to(remoteId).emit("connectionEnd", "User left");
      ConnectedUsers.delete(socket.id);
      ConnectedUsers.delete(remoteId);
    }

    const index = AvailableUsersQueue.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      AvailableUsersQueue.splice(index, 1);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
