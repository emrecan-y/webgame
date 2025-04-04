package com.example.webgame.chat;

import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.webgame.exception.ChatException;
import com.example.webgame.lobby.Lobby;
import com.example.webgame.lobby.LobbyService;
import com.example.webgame.session.SessionService;
import com.example.webgame.session.UserSession;

@Service
public class ChatRoomService {
	private static final int MIN_CHAT_LENGTH = 1;
	private static final int MAX_CHAT_LENGTH = 180;

	private final LobbyService lobbySevice;
	private final SessionService sessionService;

	private final ChatRoomSpamManager chatSpammerManager;

	private final ChatHistory globalChat;

	public ChatRoomService(LobbyService lobbyService, SessionService sessionService,
			ChatRoomSpamManager chatSpammerManager) {
		this.globalChat = new ChatHistory();
		this.lobbySevice = lobbyService;
		this.sessionService = sessionService;
		this.chatSpammerManager = chatSpammerManager;
	}

	public ChatHistory getGlobalChatIfRegistered(String sessionId) {
		this.sessionService.isSessionIdRegistered(sessionId);

		return this.globalChat;
	}

	public ChatHistory getGlobalChat() {
		return this.globalChat;
	}

	public Optional<ChatHistory> receiveGlobalChatMessage(String sessionId, String message) {
		this.sessionService.isSessionIdRegistered(sessionId);
		message = this.validateChatMessage(message);

		Optional<UserSession> sessionOpt = this.sessionService.getBySessionId(sessionId);
		if (sessionOpt.isPresent()) {
			ChatMessage chatMessage = new ChatMessage(sessionOpt.get().getNickName(), message);
			this.chatSpammerManager.checkSpam(chatMessage, this.globalChat);
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
		message = this.validateChatMessage(message);

		Optional<Lobby> lobbyOpt = this.lobbySevice.findLobbyById(lobbyId);
		Optional<UserSession> sessionOpt = this.sessionService.getBySessionId(sessionId);
		if (lobbyOpt.isPresent() && sessionOpt.isPresent()) {
			Lobby lobby = lobbyOpt.get();
			UserSession userSession = sessionOpt.get();
			if (lobby.getId() == userSession.getCurrentLobbyId()) {
				ChatMessage chatMessage = new ChatMessage(userSession.getNickName(), message);
				this.chatSpammerManager.checkSpam(chatMessage, lobby.getChatHistory());
				lobby.getChatHistory().addNewMessage(chatMessage);
				return Optional.of(lobby.getChatHistory());
			}
		}
		return Optional.empty();
	}

	public Map<Integer, ChatHistory> deleteOldLobbyMessages(int timeDeltaInMinutes) {
		return this.lobbySevice.deleteOldLobbyMessages(timeDeltaInMinutes);
	}

	private String validateChatMessage(String message) {
		String strippedMessage;
		if (message == null || (strippedMessage = message.strip()) == "") {
			throw new ChatException("Chat message can`t be empty.");
		}
		if (strippedMessage.length() < MIN_CHAT_LENGTH) {
			throw new ChatException(
					String.format("Chat message is too short, minimum %d characters.", MIN_CHAT_LENGTH));
		} else if (strippedMessage.length() > MAX_CHAT_LENGTH) {
			throw new ChatException(String.format("Chat message is too long, maximum %d characters.", MAX_CHAT_LENGTH));
		}
		return strippedMessage;
	}

}
