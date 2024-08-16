import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Lottie from "react-lottie";
import { animationsDefaultOptions } from "@/lib/utils";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constants";

function NewDM() {
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const searchContacts = async (searchTerm) => {
    try {
      const res = await apiClient.post(
        SEARCH_CONTACTS_ROUTES,
        { searchTerm },
        { withCredentials: true }
      );
      if (res.status === 200 && res.data.contacts) {
        setSearchedContacts(res.data.contacts);
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e border-none mb-2 p-3 text-white">
            Select new Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please Select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-xl p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {
                searchContacts.map((contact)=> )
              }
            </div>
          </ScrollArea>
          {searchedContacts.length <= 0 && (
            <div className="flex-1 mt-5  md:bg-[#181920] md:flex flex-col justify-center  duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationsDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 mt-5 items-center lg:text-2xl text-xl transition-all duration-300 text-center ">
                <h3>
                  Hi <span className="text-[#912a2a]">! </span>Search new{" "}
                  <span className="text-[#bdb220]">Contact.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default NewDM;
