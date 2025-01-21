package com.example.webgame.config;

import java.util.Optional;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.example.webgame.lobby.Lobby;
import com.example.webgame.lobby.LobbyService;
import com.example.webgame.session.SessionService;
import com.example.webgame.session.UserSession;

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
		String sessionId = event.getSessionId();
		Optional<UserSession> userSession = this.sessionService.getBySessionId(sessionId);
		if (userSession.isPresent()) {
			Optional<Lobby> lobbyOpt = this.lobbyService.findLobbyById(userSession.get().getCurrentLobbyId());
			if (lobbyOpt.isPresent()) {
				Lobby lobby = lobbyOpt.get();
				lobby.removeUser(userSession.get().getNickName());
				if (lobby.isEmpty()) {
					this.lobbyService.removeByLobbyId(lobby.getId());
				} else if (lobby.getGameSession() != null) {
					lobby.deleteGameSession();
					template.convertAndSend("/topic/game/" + lobby.getId() + "/stop", "");
				}
			}
			this.sessionService.removeUserBySessionId(sessionId);
			this.template.convertAndSend("/topic/lobby-list", this.lobbyService.getLobbyList());
		}
	}

	@Override
	public void onApplicationEvent(SessionConnectEvent event) {
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
		String sessionId = headerAccessor.getSessionId();
	}
}
