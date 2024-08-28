import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const handleDisconnect = (socket) => {
    console.log(`Client disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);
    const createdMessage = await Message.create(message);
    console.log("Message created:", createdMessage);

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName image color")
      .populate("recipient", "id email firstName image color");

    console.log("Message data:", messageData);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData); // Ensure event name is correct
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData); // Ensure event name is correct
    }
  };

  io.on("connection", (socket) => {
    console.log(`Connected to socket with ID: ${socket.id}`);
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }

    socket.on("sendMessage", (message) => {
      sendMessage(message);
    });

    socket.on("disconnect", () => {
      handleDisconnect(socket);
    });
  });
};

export default setupSocket;
