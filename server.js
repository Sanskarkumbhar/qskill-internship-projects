 
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const connectDB = require("./config/db");
const Conversation = require("./models/Conversation");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// REST API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

// API test route
app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CHAT & COLLABORATION REST API is working!",
  });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Real-Time Chat & Collaboration API",
  });
});

// Authenticate Socket.IO connections with JWT
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;

    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
});

// Socket.IO connection and conversation rooms
io.on("connection", (socket) => {
  console.log("Authenticated user connected:", socket.userId);

  socket.on("joinConversation", async (conversationId, callback) => {
    try {
      if (
        typeof conversationId !== "string" ||
        !/^[0-9a-fA-F]{24}$/.test(conversationId)
      ) {
        return callback?.({
          success: false,
          message: "Invalid conversation ID.",
        });
      }

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.userId,
      });

      if (!conversation) {
        return callback?.({
          success: false,
          message: "Conversation not found or access denied.",
        });
      }

      socket.join(`conversation:${conversationId}`);

      callback?.({ success: true });
    } catch (error) {
      console.error("Join conversation error:", error.message);

      callback?.({
        success: false,
        message: "Unable to join conversation.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });
});

// Start server after MongoDB connects
const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server, io };
