package com.example.webgame.chat;

import java.util.Optional;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin(origins = "*")
public class ChatRoomController {
	private final ChatRoomService chatRoomService;

	private final SimpMessagingTemplate template;

	public ChatRoomController(ChatRoomService chatRoomService, SimpMessagingTemplate template) {
		this.chatRoomService = chatRoomService;
		this.template = template;
	}

	@MessageMapping("/connect/global-chat")
	public void connectToGlobalChat(@Header("simpSessionId") String sessionId) {
		this.template.convertAndSend("/queue/chat/global-chat-user" + sessionId,
				this.chatRoomService.getGlobalChat(sessionId));

	}

	@MessageMapping("/chat/global-chat")
	public void receiveGlobalChatMessage(@Header("simpSessionId") String sessionId, String message) {
		Optional<ChatHistory> globalChatOpt = this.chatRoomService.receiveGlobalChatMessage(sessionId, message);
		if (globalChatOpt.isPresent()) {
			this.template.convertAndSend("/topic/chat/global-chat", globalChatOpt.get());
		}
	}

	@MessageMapping("/connect/lobby/{lobbyId}")
	public void connectToLobbyChat(@Header("simpSessionId") String sessionId, @DestinationVariable Integer lobbyId) {
		Optional<ChatHistory> lobbyChatOpt = this.chatRoomService.connectToLobbyChat(sessionId, lobbyId);
		if (lobbyChatOpt.isPresent()) {
			this.template.convertAndSend("/queue/chat/lobby/" + lobbyId + "-user" + sessionId, lobbyChatOpt.get());
		}
	}

	@MessageMapping("/chat/lobby/{lobbyId}")
	public void receiveNewLobbyMessage(@DestinationVariable Integer lobbyId, @Header("simpSessionId") String sessionId,
			String message) {
		Optional<ChatHistory> lobbyChatOpt = this.chatRoomService.receiveNewLobbyMessage(lobbyId, sessionId, message);
		if (lobbyChatOpt.isPresent()) {
			this.template.convertAndSend("/topic/chat/lobby/" + lobbyId, lobbyChatOpt.get());
		}
	}

}