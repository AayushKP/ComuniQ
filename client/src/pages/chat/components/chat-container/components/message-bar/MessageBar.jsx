import { useSocket } from "@/context/SocketContext";
import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store/slices";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

function MessageBar() {
  const emojiRef = useRef(null);
  const socket = useSocket();
  const fileInputRef = useRef();

  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();

  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = () => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }

    if (message.trim()) {
      const messageData = {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
      };

      if (selectedChatType === "contact") {
        messageData.recipient = selectedChatData._id;
        console.log("Sending text message:", messageData);
        socket.emit("sendMessage", messageData);
      } else if (selectedChatType === "channel") {
        messageData.channelId = selectedChatData._id;
        console.log("Sending text message to channel:", messageData);
        socket.emit("send-channel-message", messageData);
      }

      setMessage("");
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);

        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });

        if (response.status === 200 && response.data && response.data.fileUrl) {
          const fileUrl = response.data.fileUrl;
          setIsUploading(false);

          const fileMessageData = {
            sender: userInfo.id,
            content: undefined,
            messageType: "file",
            fileUrl, // Ensure this is defined
            ...(selectedChatType === "contact"
              ? { recipient: selectedChatData._id }
              : { channelId: selectedChatData._id }),
          };

          console.log("Sending file message:", fileMessageData);

          if (selectedChatType === "contact") {
            socket.emit("sendMessage", fileMessageData);
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", fileMessageData);
          }
        } else {
          console.error("File upload failed or `fileUrl` is missing.");
          setIsUploading(false);
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.error("File upload error:", error);
    }
  };

  return (
    <div className="h-[10vh] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-gray-900 rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && message.trim() !== "") {
              handleSendMessage();
            }
          }}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          {emojiPickerOpen && (
            <div className="absolute bottom-16 right-0" ref={emojiRef}>
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => {
          if (message.trim() !== "") {
            handleSendMessage();
          }
        }}
        className="bg-yellow-400 flex items-center justify-center p-5 gap-2 rounded-xl hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
        aria-label="Send Message"
      >
        <IoSend className="text-2xl text-white" />
      </button>
    </div>
  );
}

export default MessageBar;
