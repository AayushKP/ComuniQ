import { atomFamily } from "recoil";
import { selectorFamily } from "recoil";

// Atom family to manage chat states based on chatId
export const chatInfoAtomFamily = atomFamily({
  key: "chatInfoAtomFamily",
  default: {
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
  },
});

// Selector family to provide setter functions and closeChat action
export const chatActionsSelectorFamily = selectorFamily({
  key: "chatActionsSelectorFamily",
  get:
    (chatId) =>
    ({ get }) => {
      const chatInfo = get(chatInfoAtomFamily(chatId));
      return chatInfo;
    },
  set:
    (chatId) =>
    ({ set }) => ({
      setSelectedChatType: (selectedChatType) => {
        set(chatInfoAtomFamily(chatId), (prev) => ({
          ...prev,
          selectedChatType,
        }));
      },
      setSelectedChatData: (selectedChatData) => {
        set(chatInfoAtomFamily(chatId), (prev) => ({
          ...prev,
          selectedChatData,
        }));
      },
      setSelectedChatMessages: (selectedChatMessages) => {
        set(chatInfoAtomFamily(chatId), (prev) => ({
          ...prev,
          selectedChatMessages,
        }));
      },
      closeChat: () => {
        set(chatInfoAtomFamily(chatId), {
          selectedChatType: undefined,
          selectedChatData: undefined,
          selectedChatMessages: [],
        });
      },
    }),
});