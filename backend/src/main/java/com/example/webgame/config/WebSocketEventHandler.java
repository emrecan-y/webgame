package com.example.webgame.config;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.example.webgame.session.SessionService;

@Component
public class WebSocketEventHandler implements ApplicationListener<SessionConnectEvent> {

	private SessionService sessionService;

	public WebSocketEventHandler(SessionService sessionService) {
		this.sessionService = sessionService;
	}

	@EventListener
	public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
		String sessionId = event.getSessionId();
		this.sessionService.deleteUserBySessionId(sessionId);
		System.out.println(this.sessionService.getUserNameToSessionId());
	}

	@Override
	public void onApplicationEvent(SessionConnectEvent event) {
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
		String sessionId = headerAccessor.getSessionId();
	}
}
