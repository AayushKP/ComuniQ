import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";
import Loader from "@/components/ui/Loader";
import { useAppStore } from "@/store/slices";

function Chat() {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();

  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please Setup Profile to continue");
      navigate("/profile");
    }

    const loadComponents = async () => {
      await Promise.all([
        new Promise((res) => setTimeout(res, 2500)),
        new Promise((res) => setTimeout(res, 2500)),
      ]);
      setIsLoaded(true);
    };

    loadComponents();
  }, [userInfo, navigate]);

  if (!isLoaded) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Uploading File</h5>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {fileDownloadProgress}%
        </div>
      )}
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
}

export default Chat;
