import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import contactRoutes from "./routes/contact.routes.js"
import groupRoutes from "./routes/group.routes.js"
import groupMessageRoutes from "./routes/groupMessage.routes.js"
import statusRoutes from "./routes/status.routes.js"
import { app, server } from "./lib/socket.js";
import aboutRoutes from "./routes/about.routes.js";

dotenv.config();

const PORT = process.env.PORT||5000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "process.env.FRONTEND_URL",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/contacts", contactRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/groupmsgs', groupMessageRoutes);
app.use("/api/status",statusRoutes);
app.use("/api",aboutRoutes);



server.listen(PORT, () => {
  connectDB();
  console.log("server is running on PORT:" + PORT);
  
});