import { create } from "zustand/react";

type ChatStore = {
  chats: Record<string, boolean>;
  setShowChat: (chatName: string, isVisible: boolean) => void;
  getShowState: (chatName: string) => boolean;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: {},

  setShowChat: (chatName, isVisible) => {
    if (isVisible) {
      // hide all other chatwindows
      const newChats: Record<string, boolean> = {};
      for (const chat of Object.keys(get().chats)) {
        newChats[chat] = chat === chatName;
      }
      set(() => ({
        chats: newChats,
      }));
    } else {
      set((state) => ({
        chats: {
          ...state.chats,
          [chatName]: false,
        },
      }));
    }
  },

  getShowState(chatName) {
    const state = get();
    return state.chats[chatName] ?? false;
  },
}));
