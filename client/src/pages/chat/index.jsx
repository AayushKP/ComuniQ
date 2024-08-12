import { userSelector } from "@/store/auth-atom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

function Chat() {
  const userInfo = useRecoilValue(userSelector);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please Setup Profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh] text-white overflow-hidden ">
      <ContactsContainer />
      {/* <EmptyChatContainer /> */}
      /* <ChatContainer />
    </div>
  );
}

export default Chat;
