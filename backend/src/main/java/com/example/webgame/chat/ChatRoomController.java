package com.example.webgame.chat;

import java.util.Optional;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.webgame.lobby.Lobby;
import com.example.webgame.lobby.LobbyService;

@RestController
@CrossOrigin(origins = "*")
public class ChatRoomController {
	private LobbyService lobbySevice;
	private SimpMessagingTemplate template;

	private ChatHistory globalChat;

	public ChatRoomController(SimpMessagingTemplate template, LobbyService lobbyService) {
		this.template = template;
		this.globalChat = new ChatHistory();
		this.lobbySevice = lobbyService;
	}

	@MessageMapping("/connect/global-chat")
	@SendToUser("/queue/chat/global-chat")
	public ChatHistory connectToGlobalChat(@Header("simpSessionId") String sessionId) {
		return this.globalChat;
	}

	@MessageMapping("/chat/global-chat")
	@SendTo("/topic/chat/global-chat")
	public ChatHistory receiveGlobalChatMessage(ChatMessage message) throws Exception {
		globalChat.addNewMessage(message);
		return globalChat;

	}

	@MessageMapping("/connect/lobby/{lobbyId}")
	@SendToUser("/queue/chat/lobby/{lobbyId}")
	public ChatHistory connectToChatRoom(@Header("simpSessionId") String sessionId,
			@DestinationVariable Integer lobbyId) {
		Optional<Lobby> lobbyOpt = this.lobbySevice.findLobbyById(lobbyId);
		if (lobbyOpt.isPresent()) {
			Lobby lobby = lobbyOpt.get();
			return lobby.getChatHistory();
		}
		return new ChatHistory();
	}

	@MessageMapping("/chat/lobby/{lobbyId}")
	public void receiveNewLobbyMessage(@DestinationVariable Integer lobbyId, ChatMessage message) {
		Optional<Lobby> lobbyOpt = this.lobbySevice.findLobbyById(lobbyId);
		if (lobbyOpt.isPresent()) {
			Lobby lobby = lobbyOpt.get();
			lobby.getChatHistory().addNewMessage(message);
			template.convertAndSend("/topic/chat/lobby/" + lobbyId, lobby.getChatHistory());
		}
	}

}