"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const db_1 = require("./config/db");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const counsellors_1 = __importDefault(require("./routes/counsellors"));
const appointments_1 = __importDefault(require("./routes/appointments"));
const forum_1 = __importDefault(require("./routes/forum"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const errorHanlder_1 = require("./middleware/errorHanlder");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: "*" },
});
// basic Socket.io hooks for forum real-time (optional)
io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    socket.on("joinCollege", (collegeName) => {
        socket.join(collegeName);
    });
    socket.on("newForumPost", (payload) => {
        const { collegeName } = payload || {};
        if (collegeName)
            io.to(collegeName).emit("newForumPost", payload);
        else
            io.emit("newForumPost", payload);
    });
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// connect db
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sih-db";
(0, db_1.connectDB)(MONGO_URI);
// routes
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/counsellors", counsellors_1.default);
app.use("/api/appointments", appointments_1.default);
app.use("/api/forum", forum_1.default);
app.use("/api/analytics", analytics_1.default);
// health
app.get("/", (req, res) => res.json({ ok: true, now: new Date() }));
// error handler
app.use(errorHanlder_1.errorHandler);
const PORT = Number(process.env.PORT || 3000);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
