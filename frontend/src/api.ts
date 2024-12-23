import { ChatMessage } from "./models/chat";
import { Lobby } from "./models/lobby";

export const urlDomain = "localhost";
export const urlBackendPort = "8080";

export async function getLobbyList(): Promise<Lobby[]> {
  const response = await fetch(`http://${urlDomain}:${urlBackendPort}/lobby-list`);
  if (!response.ok) {
    console.error(`Error fetching lobby list: ${response.statusText}`);
    return [];
  }
  const lobbyList: Lobby[] = await response.json();
  return lobbyList;
}

export async function getRandomName(): Promise<string> {
  const response = await fetch(`http://${urlDomain}:${urlBackendPort}/name/random`);
  if (!response.ok) {
    console.error(`Error fetching random name: ${response.statusText}`);
    return "";
  }
  const randomName: string = await response.text();
  return randomName;
}

export async function getGlobalChatHistory(): Promise<ChatMessage[]> {
  const response = await fetch(`http://${urlDomain}:${urlBackendPort}/chat-global`);
  if (!response.ok) {
    console.error(`Error fetching chat history: ${response.statusText}`);
    return [];
  }
  const chatHistory: ChatMessage[] = (await response.json()).history;
  return chatHistory;
}

export async function addPlayerToLobby(lobbyId: number, playerName: string, password: string) {
  const response = await fetch(
    `http://${urlDomain}:${urlBackendPort}/lobby-list?lobbyId=${lobbyId}&playerName=${playerName}&password=${password}`,
    {
      method: "PUT",
      headers: { "Content-type": "application/json" },
    }
  );
  if (!response.ok) {
    console.error(`Error adding player ${playerName} to lobby ${lobbyId}: ${response.statusText}`);
  }
}
