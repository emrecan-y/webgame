package com.example.webgame.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatRoomController {
	private SimpMessagingTemplate template;
	private ChatHistory globalChat;

	public ChatRoomController(SimpMessagingTemplate template) {
		this.template = template;
		this.globalChat = new ChatHistory();
	}

	@MessageMapping("/new-message")
	@SendTo("/topic/chat-history")
	public ChatHistory greeting(ChatMessage message) throws Exception {
		globalChat.addNewMessage(message);
		return globalChat;

	}

//  send from a method	
//	
//	public void sendMessage(int i) throws Exception {
//		Thread.sleep(100);
//		this.template.convertAndSend("/topic/chat-history", new ChatHistory(i + "This is Send From Server"));
//	}
}