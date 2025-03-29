export type ChatMessage = {
  senderName: string;
  message: string;
  timeOfCreation: Date;
};

export type ChatHistory = {
  history: ChatMessage[];
};
