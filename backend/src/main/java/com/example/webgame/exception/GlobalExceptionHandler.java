package com.example.webgame.exception;

import java.util.UUID;

import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.ControllerAdvice;

import com.example.webgame.record.InfoPopUp;

@ControllerAdvice
public class GlobalExceptionHandler {

	private SimpMessagingTemplate template;

	public GlobalExceptionHandler(SimpMessagingTemplate template) {
		this.template = template;
	}

	@MessageExceptionHandler({ LoginException.class, LobbyException.class, ChatException.class })
	@SendToUser("/queue/info-pop-up")
	public InfoPopUp handleGeneralException(Exception ex, StompHeaderAccessor headerAccessor) {
		return new InfoPopUp(UUID.randomUUID(), ex.getMessage(), true);
	}

	@MessageExceptionHandler(ChatMessageSpamException.class)
	@SendToUser("/queue/info-pop-up")
	public InfoPopUp handleChatMessageSpamException(ChatMessageSpamException ex, StompHeaderAccessor headerAccessor) {
		if (ex.getRemainingCoolDownInSeconds().isPresent()) {
			this.template.convertAndSend("/queue/disable-chat-user" + headerAccessor.getSessionId(),
					ex.getRemainingCoolDownInSeconds().get());
		}
		return new InfoPopUp(UUID.randomUUID(), ex.getMessage(), true);
	}

	@MessageExceptionHandler(SessionIdNotRegisteredException.class)
	@SendToUser("/queue/reset")
	public String handleSessionNotRegisteredException(Exception ex, StompHeaderAccessor headerAccessor) {
		this.template.convertAndSend("/queue/info-pop-up-user" + headerAccessor.getSessionId(),
				new InfoPopUp(UUID.randomUUID(), ex.getMessage(), true));
		return "";
	}

}
