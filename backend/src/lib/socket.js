// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"],
//   },
// });

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// // used to store online users
// const userSocketMap = {}; // {userId: socketId}

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId) userSocketMap[userId] = socket.id;

//   // io.emit() is used to send events to all the connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { io, app, server };

import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js"; // IMPORT THE MESSAGE MODEL HERE

const app = express();
const server = http.createServer(app);

// Store connected users: { userId: socketId }
const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users list to everyone
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ Handle group joining
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User ${userId} joined group ${groupId}`);
  });

  // ✅ Optional: Handle group leaving
  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
    console.log(`User ${userId} left group ${groupId}`);
  });

  // ✅ Handle delivered messages
  socket.on("message:delivered", async ({ messageId, senderId }) => {
    console.log(`Message ${messageId} was delivered.`);
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageStatusUpdated", {
        messageId,
        status: "delivered",
      });
    }

    await Message.findByIdAndUpdate(messageId, { status: "delivered" });
  });

  // ✅ Handle read messages
  socket.on("message:read", async ({ messageId, senderId }) => {
    console.log(`Message ${messageId} was read.`);
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageStatusUpdated", {
        messageId,
        status: "read",
      });
    }

    await Message.findByIdAndUpdate(messageId, { status: "read", seen: true });
  });

  // ✅ Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
