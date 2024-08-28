import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { HOST } from "@/utils/constants";
import { useAppStore } from "@/store/slices";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to the socket server");
        setLoading(false);
      });
      const handleReceiveMessage = (message) => {
        const { selectedChatData, selectedChatType } = useAppStore.getState();
        if (
          selectedChatType !== null &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          console.log("Message received:", message);
          setSelectedChatMessages((messages) => [
            ...messages,
            {
              ...message,
              recipient:
                selectedChatType === "channel"
                  ? message.recipient
                  : message.recipient._id,
              sender:
                selectedChatType === "channel"
                  ? message.sender
                  : message.sender._id,
            },
          ]);
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage); // Ensure event name matches

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
