import { create } from "zustand/react";

type ChatStore = {
  chats: Record<string, boolean>;
  setShowChat: (chatName: string, isVisible: boolean) => void;
  getShowState: (chatName: string) => boolean;
  removeChat: (chatName: string) => void;
  isAnyChatActive: () => boolean;
  hideAllChats: () => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: {},

  setShowChat: (chatName, isVisible) => {
    get().hideAllChats();
    if (isVisible) {
      set((state) => ({
        chats: {
          ...state.chats,
          [chatName]: true,
        },
      }));
    }
  },

  getShowState(chatName) {
    const state = get();
    return state.chats[chatName] ?? false;
  },

  removeChat(chatName) {
    const newChats: Record<string, boolean> = {};
    const { chats } = get();
    for (const chat of Object.keys(chats)) {
      if (chatName !== chat) {
        newChats[chat] = chats[chat];
      }
    }
    set(() => ({
      chats: newChats,
    }));
  },

  isAnyChatActive() {
    const { chats } = get();
    for (const chat of Object.keys(get().chats)) {
      if (chats[chat]) {
        return true;
      }
    }
    return false;
  },

  hideAllChats() {
    const newChats: Record<string, boolean> = {};
    for (const chat of Object.keys(get().chats)) {
      newChats[chat] = false;
    }
    set(() => ({
      chats: newChats,
    }));
  },
}));
