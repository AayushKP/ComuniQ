export const createChatSlice = (set, get) => ({
  sleectedChatType: undefined,
  selectedChatData: undefined,
  setSelectedChatType: (slectedChatType) => set({ slectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),

  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
});
