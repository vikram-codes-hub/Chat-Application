import express        from "express";
import { createServer } from "http";
import { Server }      from "socket.io";
import cors            from "cors";
import cookieParser    from "cookie-parser";
import dotenv          from "dotenv";

import connectDB       from "./config/db.js";
import corsOptions     from "./config/corsOptions.js";
import initSocket      from "./sockets/index.socket.js";

import authRoutes         from "./routes/auth.routes.js";
import userRoutes         from "./routes/user.routes.js";
import messageRoutes      from "./routes/message.routes.js";
import roomRoutes         from "./routes/room.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";

import { errorHandler, notFound } from "./middleware/error.middleware.js";

dotenv.config();

const app    = express();
const server = createServer(app);
const io     = new Server(server, {
  cors: corsOptions,
  pingTimeout: 60000,
});

// ── Connect DB ──
connectDB();

// ── Make io accessible in controllers via req.app.locals.io ──
app.locals.io = io;

// ── Global middleware ──
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ── Health check ──
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "PulseChat", timestamp: new Date().toISOString() });
});

// ── Routes ──
app.use("/api/auth",          authRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/messages",      messageRoutes);
app.use("/api/rooms",         roomRoutes);
app.use("/api/conversations",  conversationRoutes);

// ── Socket.io ──
initSocket(io);

// ── Error handling (must be last) ──
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 PulseChat server running on port ${PORT}`);
});