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
const ConnectionStates = new Map(); // Track connection states to prevent race conditions

const matchUsers = () => {
  while (AvailableUsersQueue.length >= 2) {
    const user1 = AvailableUsersQueue.shift();
    const user2 = AvailableUsersQueue.shift();

    // Verify both users are still connected
    const socket1 = io.sockets.sockets.get(user1.id);
    const socket2 = io.sockets.sockets.get(user2.id);

    if (!socket1 || !socket2) {
      console.log("One or both users disconnected before matching");
      continue;
    }

    // Set connection state to prevent duplicate matching
    ConnectedUsers.set(user1.id, user2.id);
    ConnectedUsers.set(user2.id, user1.id);
    ConnectionStates.set(user1.id, "connecting");
    ConnectionStates.set(user2.id, "connecting");

    console.log(`Matching ${user1.name} (${user1.id}) with ${user2.name} (${user2.id})`);

    if (user1.chooseType === "videoChat" && user2.chooseType === "videoChat") {
      // For video chat: user1 initiates the call
      io.to(user1.id).emit("matched", { remoteId: user2.id, remoteName: user2.name, isInitiator: true });
      io.to(user2.id).emit("matched", { remoteId: user1.id, remoteName: user1.name, isInitiator: false });
    } else {
      // For text chat
      io.to(user1.id).emit("remoteId", user2.id);
      io.to(user2.id).emit("connection", [user1.name, user1.id, user2.id]);
    }
  }
};

io.on("connection", (socket) => {
  let userData = null; // Save user-specific data
  console.log(`User connected: ${socket.id}`);

  socket.on("AnyUser", (data) => {
    const [name, category, choice] = data;

    // Prevent duplicate queue entries
    if (ConnectedUsers.has(socket.id) || ConnectionStates.has(socket.id)) {
      console.log(`User ${socket.id} already in queue or connected`);
      return;
    }

    // Remove from queue if already exists
    const existingIndex = AvailableUsersQueue.findIndex((user) => user.id === socket.id);
    if (existingIndex !== -1) {
      AvailableUsersQueue.splice(existingIndex, 1);
    }

    socket.emit("myId", socket.id);

    if (name && choice) {
      userData = { id: socket.id, name, chooseType: choice };
      AvailableUsersQueue.push(userData);
      console.log(`User ${name} (${socket.id}) added to queue. Queue length: ${AvailableUsersQueue.length}`);
      matchUsers();
    }
  });

  socket.on("call", (data) => {
    const [name, offervalue, myId, remoteId] = data;
    console.log(`Call from ${myId} to ${remoteId}`);
    socket.to(remoteId).emit("call", data);
  });

  socket.on("answerCall", (data) => {
    const [name, createdAnswer, remoteId, myId] = data;
    console.log(`Answer from ${myId} to ${remoteId}`);
    socket.to(remoteId).emit("answerCall", data);

    // Mark connection as established
    ConnectionStates.set(myId, "connected");
    ConnectionStates.set(remoteId, "connected");
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
      ConnectionStates.delete(userLeftId);
      ConnectionStates.delete(remoteId);
      console.log(`Connection ended between ${userLeftId} and ${remoteId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    const remoteId = ConnectedUsers.get(socket.id);
    if (remoteId) {
      socket.to(remoteId).emit("connectionEnd", "User left");
      ConnectedUsers.delete(socket.id);
      ConnectedUsers.delete(remoteId);
      ConnectionStates.delete(socket.id);
      ConnectionStates.delete(remoteId);
    }

    // Remove from connection states
    ConnectionStates.delete(socket.id);

    // Remove from queue
    const index = AvailableUsersQueue.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      AvailableUsersQueue.splice(index, 1);
      console.log(`Removed ${socket.id} from queue. Queue length: ${AvailableUsersQueue.length}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
