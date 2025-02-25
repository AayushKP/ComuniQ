import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store/slices";
import {
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES,
  HOST,
} from "@/utils/constants";
import moment from "moment/moment";

function MessageContainer() {
  const scrollRef = useRef(null);
  const {
    selectedChatData,
    selectedChatType,
    selectedChatMessages,
    userInfo,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // Cache messages to reduce latency for revisited chats.
  const messagesCache = useRef({});

  // Fetch messages with caching
  const fetchMessages = useCallback(async () => {
    if (!selectedChatData?._id) return;
    const cacheKey = `${selectedChatType}_${selectedChatData._id}`;
    if (messagesCache.current[cacheKey]) {
      setSelectedChatMessages(messagesCache.current[cacheKey]);
      return;
    }
    try {
      let response;
      if (selectedChatType === "contact") {
        response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
      } else if (selectedChatType === "channel") {
        response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
      }
      if (response.data?.messages) {
        setSelectedChatMessages(response.data.messages);
        messagesCache.current[cacheKey] = response.data.messages;
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  // Fetch messages whenever the selected chat changes.
  useEffect(() => {
    if (selectedChatData?._id) {
      fetchMessages();
    }
  }, [selectedChatData, selectedChatType, fetchMessages]);

  // Auto-scroll to the latest message.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  // Add a new message to the local state and cache
  const addNewMessage = useCallback(
    (newMessage) => {
      const cacheKey = `${selectedChatType}_${selectedChatData._id}`;
      const updatedMessages = [...selectedChatMessages, newMessage];
      setSelectedChatMessages(updatedMessages);
      messagesCache.current[cacheKey] = updatedMessages;
    },
    [
      selectedChatMessages,
      selectedChatData,
      selectedChatType,
      setSelectedChatMessages,
    ]
  );

  // Example function to send a message (you can call this from your message input component)
  const sendMessage = useCallback(
    async (messageContent) => {
      try {
        const response = await apiClient.post(
          "/send-message", // Replace with your send message endpoint
          {
            chatId: selectedChatData._id,
            content: messageContent,
            messageType: "text", // or "file" if applicable
          },
          { withCredentials: true }
        );

        if (response.data?.message) {
          // Add the new message to the local state
          addNewMessage(response.data.message);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [selectedChatData, addNewMessage]
  );

  // Render messages
  const renderedMessages = useMemo(() => {
    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact"
            ? renderDMMessages(message)
            : renderChannelMessages(message)}
        </div>
      );
    });
  }, [
    selectedChatMessages,
    selectedChatType,
    renderDMMessages,
    renderChannelMessages,
  ]);

  return (
    <div className="flex-1 overflow-y-auto auto-hide-scrollbar p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderedMessages}
      <div ref={scrollRef}>
        {showImage && (
          <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
            <div>
              <img src={imageUrl} alt="" className="h-[80vh] w-full bg-cover" />
              <div className="flex gap-5 fixed top-0 mt-5">
                <button
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(imageUrl)}
                >
                  <IoMdArrowRoundDown />
                </button>
                <button
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => {
                    setShowImage(false);
                    setImageUrl(null);
                  }}
                >
                  <IoCloseSharp />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageContainer;
