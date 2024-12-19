package com.example.webgame.chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class ChatRoomController {
	private ChatHistory globalChat;

	public ChatRoomController() {
		this.globalChat = new ChatHistory();

	}

	@MessageMapping("/new-message")
	@SendTo("/topic/chat-history")
	public ChatHistory receiveNewMessage(ChatMessage message) throws Exception {
		globalChat.addNewMessage(message);
		return globalChat;

	}

	@GetMapping("/chat-global")
	public ChatHistory getGlobalChat() {
		return globalChat;
	}

}