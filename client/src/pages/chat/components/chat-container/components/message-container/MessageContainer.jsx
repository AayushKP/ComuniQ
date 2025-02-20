import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store/slices";
import {
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES,
  HOST,
} from "@/utils/constants";
import moment from "moment/moment";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

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

  // Fetch messages for contacts
  const fetchContactMessages = useCallback(async () => {
    try {
      const response = await apiClient.post(
        GET_ALL_MESSAGES_ROUTE,
        { id: selectedChatData._id },
        { withCredentials: true }
      );
      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching contact messages:", error);
    }
  }, [selectedChatData, setSelectedChatMessages]);

  // Fetch messages for channels
  const fetchChannelMessages = useCallback(async () => {
    try {
      const res = await apiClient.get(
        `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
        { withCredentials: true }
      );
      if (res.data.messages) {
        setSelectedChatMessages(res.data.messages);
      }
    } catch (error) {
      console.error("Error fetching channel messages:", error);
    }
  }, [selectedChatData, setSelectedChatMessages]);

  // Fetch messages when chat data or type changes
  useEffect(() => {
    if (selectedChatData?._id) {
      if (selectedChatType === "contact") fetchContactMessages();
      else if (selectedChatType === "channel") fetchChannelMessages();
    }
  }, [
    selectedChatData,
    selectedChatType,
    fetchContactMessages,
    fetchChannelMessages,
  ]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  // Check if file is an image
  const checkImage = useCallback((filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  }, []);

  // Download file logic
  const downloadFile = useCallback(
    async (url) => {
      setIsDownloading(true);
      setFileDownloadProgress(0);
      try {
        const response = await apiClient.get(url, {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentCompleted = Math.round((100 * loaded) / total);
            setFileDownloadProgress(percentCompleted);
          },
        });
        const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = urlBlob;
        link.setAttribute("download", url.split("/").pop());
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(urlBlob);
      } catch (error) {
        console.error("Download error:", error);
      } finally {
        setIsDownloading(false);
        setFileDownloadProgress(0);
      }
    },
    [setFileDownloadProgress, setIsDownloading]
  );

  // Render direct messages
  const renderDMMessages = useCallback(
    (message) => (
      <div
        className={
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }
      >
        {message.messageType === "text" && (
          <div
            className={`border inline-block p-4 rounded-2xl my-1 max-w-[50%] break-words ${
              message.sender !== selectedChatData._id
                ? "bg-[#328aa9]/5 text-white border-[#bdcd46]/50"
                : "bg-[#2a2b33]/5 text-[white]/90 border-[#ffffff]/20"
            }`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`border inline-block p-4 rounded-2xl my-1 max-w-[50%] break-words ${
              message.sender !== selectedChatData._id
                ? "bg-[#328aa9]/5 text-white border-[#bdcd46]/50"
                : "bg-[#2a2b33]/5 text-[white]/90 border-[#ffffff]/20"
            }`}
          >
            {checkImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img src={message.fileUrl} height={300} width={300} alt="" />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    ),
    [selectedChatData, checkImage, downloadFile]
  );

  // Render channel messages
  const renderChannelMessages = useCallback(
    (message) => (
      <div
        className={`mt-5 ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`border inline-block p-4 rounded-2xl my-1 max-w-[50%] break-words ml-9 ${
              message.sender._id === userInfo.id
                ? "bg-[#328aa9]/5 text-[#c6c451]/90 border-[#bdcd46]/50"
                : "bg-[#2a2b33]/5 text-[white]/90 border-[#ffffff]/20"
            }`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`border inline-block p-4 rounded-2xl my-1 max-w-[50%] break-words ${
              message.sender._id === userInfo._id
                ? "bg-[#328aa9]/5 text-[#c6c451]/90 border-[#bdcd46]/50"
                : "bg-[#2a2b33]/5 text-[white]/90 border-[#ffffff]/20"
            }`}
          >
            {checkImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img src={message.fileUrl} height={300} width={300} alt="" />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={message.sender.image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName[0]
                  : message.sender.email[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">
              {`${message.sender.firstName} ${message.sender.lastName}`}
            </span>
            <span className="text-xs text-white/60">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    ),
    [userInfo, checkImage, downloadFile]
  );

  // Memoize messages for performance
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
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
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
