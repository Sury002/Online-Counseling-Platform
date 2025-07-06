const ChatMessage = require("./models/ChatMessage");

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("join", (roomId) => {
      socket.join(roomId);
      console.log(`🟣 Joined room: ${roomId}`);
    });

    socket.on("send-message", ({ roomId, message }) => {
      io.to(roomId).emit("receive-message", message);
      console.log("📨 Message sent to room:", roomId);
    });

    socket.on("typing", ({ roomId, userId }) => {
      socket.to(roomId).emit("user-typing", userId);
    });

    socket.on("message-read", async ({ roomId, messageId, readerId }) => {
      try {
        const updated = await ChatMessage.findByIdAndUpdate(messageId, {
          read: true,
        });
        if (updated) {
          io.to(roomId).emit("message-read", { messageId, readerId });
          console.log("✅ Marked as read:", messageId);
        }
      } catch (err) {
        console.error("❌ Failed to mark message as read:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected:", socket.id);
    });
  });
}

module.exports = socketHandler;
