package com.example.webgame.config;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.example.webgame.lobby.LobbyService;
import com.example.webgame.record.LobbyPlayerModifyResult;
import com.example.webgame.session.SessionService;

@Component
public class WebSocketEventHandler implements ApplicationListener<SessionConnectEvent> {

	private SessionService sessionService;
	private LobbyService lobbyService;
	private SimpMessagingTemplate template;

	public WebSocketEventHandler(SimpMessagingTemplate template, SessionService sessionService,
			LobbyService lobbyService) {
		this.template = template;
		this.sessionService = sessionService;
		this.lobbyService = lobbyService;
	}

	@EventListener
	public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
		try {
			String sessionId = event.getSessionId();
			LobbyPlayerModifyResult result = this.lobbyService.removePlayerFromLobbyAndStopGame(sessionId);

			if (result != null && result.updatedLobbies() != null) {
				this.template.convertAndSend("/topic/lobby-list", result.updatedLobbies());
				if (result.oldPlayerLobbyId() != null) {
					template.convertAndSend("/topic/game/" + result.oldPlayerLobbyId() + "/stop", "");
				}
			}

			this.sessionService.removeUserBySessionId(sessionId);
		} catch (Exception e) {
		}
	}

	@Override
	public void onApplicationEvent(SessionConnectEvent event) {
//		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//		String sessionId = headerAccessor.getSessionId();
	}
}
