import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfoComponent from "./components/profile-info";
import apiClient from "@/lib/api-client";
import {
  GET_DM_CONTACTS_ROUTES,
  GET_USER_CHANNELS_ROUTE,
} from "@/utils/constants";
import ContactList from "@/components/ui/contact-list";
import { useAppStore } from "@/store/slices";
import CreateChannel from "./components/create-channel";

function ContactsContainer() {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,
  } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    };
    const getChannels = async () => {
      const res = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
      });
      setChannels(res.data.channels);
    };
    getContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContacts]);

  return (
    <div className="relative md:w-[30vw] bg-gradient-to-b from-gray-800 to-gray-950 lg:w-[25vw] xl:w-[20vw] border-r-2 border-[#2f303b] w-full flex flex-col h-screen">
      {/* Logo Section */}
      <div className="pt-3">
        <Logo />
      </div>

      {/* Direct Messages Section */}
      <div className="my-5 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        {/* Fixed height container for Direct Messages */}
        <div className="max-h-[31vh] overflow-y-auto auto-hide-scrollbar">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>

      {/* Channels Section */}
      <div className="my-5 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        {/* Fixed height container for Channels */}
        <div className="max-h-[31vh] overflow-y-auto auto-hide-scrollbar">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="mt-auto">
        <ProfileInfoComponent />
      </div>
    </div>
  );
}

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5 justify-start md:justify-around items-center md:gap-1 gap-5">
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-6xl"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"
          fill="#bdb220"
        ></path>
        <path
          d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"
          fill="#a6370b"
        ></path>
      </svg>
      <span className="text-4xl md:text-3xl font-bold font-poppins text-[#bdb220]">
        Com<span className="text-[#912a2a]">u</span>niQ
      </span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-videst text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
