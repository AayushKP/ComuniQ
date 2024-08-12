import NewDM from "./components/new-dm";
import ProfileInfoComponent from "./components/profile-info";
import { LuMessagesSquare } from "react-icons/lu";

function ContactsContainer() {
  return (
    <div className="relative md:w-[30vw] lg:w-[25vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
        </div>
      </div>
      <ProfileInfoComponent />
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
          fill="#912a2a"
        ></path>
      </svg>

      <span className="text-4xl md:text-3xl font-bold text-[#bdb220]">
        COm<span className="text-[#912a2a]">U</span>niQ
      </span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-videst text-neutral-400 pl-10 font-light text-opacity-90 text-sm ">
      {text}
    </h6>
  );
};
