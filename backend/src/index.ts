import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import counsellorRoutes from "./routes/counsellors";
import appointmentRoutes from "./routes/appointments";
import forumRoutes from "./routes/forum";
import analyticsRoutes from "./routes/analytics";
import { errorHandler } from "./middleware/errorHanlder";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*" }
});

// basic Socket.io hooks for forum real-time (optional)
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinCollege", (collegeName: string) => {
    socket.join(collegeName);
  });

  socket.on("newForumPost", (payload) => {
    // broadcast to the room
    const { collegeName } = payload || {};
    if (collegeName) io.to(collegeName).emit("newForumPost", payload);
    else io.emit("newForumPost", payload);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.use(cors());
app.use(express.json());

// connect db
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sih-db";
connectDB(MONGO_URI);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/counsellors", counsellorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/analytics", analyticsRoutes);

// health
app.get("/", (req, res) => res.json({ ok: true, now: new Date() }));

// error handler
app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
