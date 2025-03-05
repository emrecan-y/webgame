package com.example.webgame.exception;

import java.util.UUID;

import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.ControllerAdvice;

import com.example.webgame.record.InfoPopUp;

@ControllerAdvice
public class GlobalExceptionHandler {

	@MessageExceptionHandler({ LoginException.class, LobbyException.class })
	@SendToUser("/queue/info-pop-up")
	public InfoPopUp handleGeneralException(Exception ex, StompHeaderAccessor headerAccessor) {
		return new InfoPopUp(UUID.randomUUID(), ex.getMessage(), true);
	}

}
