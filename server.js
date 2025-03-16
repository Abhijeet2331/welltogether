const { createServer } = require("http");
const { Server } = require("socket.io");

// Create an HTTP server
const httpServer = createServer();

// Create a WebSocket server (Socket.io)
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all clients (Adjust for production security)
    methods: ["GET", "POST"],
  },
});

// Handle new client connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle message sending
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message); // Debugging log
    io.emit("receiveMessage", message); // Broadcast to all clients
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the WebSocket server on port 3001
httpServer.listen(3001, () => {
  console.log("🚀 Socket.io server running on port 3001");
});
