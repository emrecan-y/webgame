package com.example.webgame.chat;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.webgame.lobby.Lobby;
import com.example.webgame.lobby.LobbyService;
import com.example.webgame.session.SessionService;
import com.example.webgame.session.UserSession;

@Service
public class ChatRoomService {
	private final LobbyService lobbySevice;
	private final SessionService sessionService;

	private final ChatHistory globalChat;

	public ChatRoomService(LobbyService lobbyService, SessionService sessionService) {
		this.globalChat = new ChatHistory();
		this.lobbySevice = lobbyService;
		this.sessionService = sessionService;
	}

	public ChatHistory getGlobalChat(String sessionId) {
		this.sessionService.isSessionIdRegistered(sessionId);

		return this.globalChat;
	}

	public Optional<ChatHistory> receiveGlobalChatMessage(String sessionId, String message) {
		this.sessionService.isSessionIdRegistered(sessionId);

		Optional<UserSession> sessionOpt = this.sessionService.getBySessionId(sessionId);
		if (sessionOpt.isPresent()) {
			ChatMessage chatMessage = new ChatMessage(sessionOpt.get().getNickName(), message);
			globalChat.addNewMessage(chatMessage);
			return Optional.of(globalChat);
		}
		return Optional.empty();
	}

	public Optional<ChatHistory> connectToLobbyChat(String sessionId, Integer lobbyId) {
		this.sessionService.isSessionIdRegistered(sessionId);

		Optional<Lobby> lobbyOpt = this.lobbySevice.findLobbyById(lobbyId);
		Optional<UserSession> sessionOpt = this.sessionService.getBySessionId(sessionId);
		if (lobbyOpt.isPresent() && sessionOpt.isPresent()) {
			Lobby lobby = lobbyOpt.get();
			UserSession userSession = sessionOpt.get();
			if (lobby.getId() == userSession.getCurrentLobbyId()) {
				return Optional.of(lobby.getChatHistory());
			}
		}
		return Optional.empty();
	}

	public Optional<ChatHistory> receiveNewLobbyMessage(Integer lobbyId, String sessionId, String message) {
		this.sessionService.isSessionIdRegistered(sessionId);

		Optional<Lobby> lobbyOpt = this.lobbySevice.findLobbyById(lobbyId);
		Optional<UserSession> sessionOpt = this.sessionService.getBySessionId(sessionId);
		if (lobbyOpt.isPresent() && sessionOpt.isPresent()) {
			Lobby lobby = lobbyOpt.get();
			UserSession userSession = sessionOpt.get();
			if (lobby.getId() == userSession.getCurrentLobbyId()) {
				ChatMessage chatMessage = new ChatMessage(userSession.getNickName(), message);
				lobby.getChatHistory().addNewMessage(chatMessage);
				return Optional.of(lobby.getChatHistory());
			}
		}
		return Optional.empty();
	}

}
