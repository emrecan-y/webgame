package com.example.webgame.chat;

import java.util.Optional;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.webgame.lobby.Lobby;
import com.example.webgame.lobby.LobbyService;
import com.example.webgame.session.SessionService;
import com.example.webgame.session.UserSession;

@RestController
@CrossOrigin(origins = "*")
public class ChatRoomController {
	private LobbyService lobbySevice;
	private SessionService sessionService;

	private ChatHistory globalChat;

	public ChatRoomController(LobbyService lobbyService, SessionService sessionService) {
		this.globalChat = new ChatHistory();
		this.lobbySevice = lobbyService;
		this.sessionService = sessionService;
	}

	@MessageMapping("/connect/global-chat")
	@SendToUser("/queue/chat/global-chat")
	public ChatHistory connectToGlobalChat(@Header("simpSessionId") String sessionId) {
		if (this.sessionService.getBySessionId(sessionId).isPresent()) {
			return this.globalChat;
		}
		return new ChatHistory();
	}

	@MessageMapping("/chat/global-chat")
	@SendTo("/topic/chat/global-chat")
	public ChatHistory receiveGlobalChatMessage(@Header("simpSessionId") String sessionId, String message)
			throws Exception {
		Optional<UserSession> sessionOpt = this.sessionService.getBySessionId(sessionId);
		if (sessionOpt.isPresent()) {
			ChatMessage chatMessage = new ChatMessage(sessionOpt.get().getNickName(), message);
			globalChat.addNewMessage(chatMessage);
			return globalChat;
		}
		return new ChatHistory();
	}

	@MessageMapping("/connect/lobby/{lobbyId}")
	@SendToUser("/queue/chat/lobby/{lobbyId}")
	public ChatHistory connectToChatRoom(@Header("simpSessionId") String sessionId,
			@DestinationVariable Integer lobbyId) {
		Optional<Lobby> lobbyOpt = this.lobbySevice.findLobbyById(lobbyId);
		Optional<UserSession> sessionOpt = this.sessionService.getBySessionId(sessionId);
		if (lobbyOpt.isPresent() && sessionOpt.isPresent()) {
			Lobby lobby = lobbyOpt.get();
			UserSession userSession = sessionOpt.get();
			if (lobby.getId() == userSession.getCurrentLobbyId()) {
				return lobby.getChatHistory();
			}
		}
		return new ChatHistory();
	}

	@MessageMapping("/chat/lobby/{lobbyId}")
	@SendTo("/topic/chat/lobby/{lobbyId}")
	public ChatHistory receiveNewLobbyMessage(@DestinationVariable Integer lobbyId,
			@Header("simpSessionId") String sessionId, String message) {
		Optional<Lobby> lobbyOpt = this.lobbySevice.findLobbyById(lobbyId);
		Optional<UserSession> sessionOpt = this.sessionService.getBySessionId(sessionId);
		if (lobbyOpt.isPresent() && sessionOpt.isPresent()) {
			Lobby lobby = lobbyOpt.get();
			UserSession userSession = sessionOpt.get();
			if (lobby.getId() == userSession.getCurrentLobbyId()) {
				ChatMessage chatMessage = new ChatMessage(userSession.getNickName(), message);
				lobby.getChatHistory().addNewMessage(chatMessage);
				return lobby.getChatHistory();
			}
		}
		return new ChatHistory();
	}

}