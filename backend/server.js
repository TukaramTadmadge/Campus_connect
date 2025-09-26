require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");

const app = express();

// CORS config
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");
const notesRouter = require("./routes/notes");

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/notes", notesRouter);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Chat + Notes App!", frontend_url: process.env.FRONTEND_URL });
});

// Catch-all invalid routes
app.all("*", (req, res) => res.status(404).json({ error: "Invalid Route" }));

// Error middleware
app.use((err, req, res, next) => res.status(500).json({ message: err.message || "Something went wrong!" }));

// MongoDB connection
mongoose
  .connect(process.env.ATLAS_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// HTTP server
const server = http.createServer(app);

// Socket.IO
const { Server } = require("socket.io");
const io = new Server(server, { pingTimeout: 60000, transports: ["websocket"], cors: corsOptions });

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("setup", (userId) => {
    if (!socket.hasJoined) {
      socket.join(userId);
      socket.hasJoined = true;
      socket.emit("connected");
    }
  });

  socket.on("new message", (msg) => {
    const chat = msg?.chat;
    chat?.users.forEach((user) => {
      if (user._id === msg.sender._id) return;
      socket.in(user._id).emit("message received", msg);
    });
  });

  socket.on("join chat", (room) => {
    if (socket.currentRoom && socket.currentRoom !== room) socket.leave(socket.currentRoom);
    socket.join(room);
    socket.currentRoom = room;
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("disconnect", () => console.log("Disconnected:", socket.id));
});

// Start server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
