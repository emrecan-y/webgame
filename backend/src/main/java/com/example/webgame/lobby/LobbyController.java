package com.example.webgame.lobby;

import java.util.List;
import java.util.Optional;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.example.webgame.record.GeneralPlayerRequest;
import com.example.webgame.record.LobbyCreateRequest;

@Controller
public class LobbyController {

	private LobbyService lobbyService;
	private SimpMessagingTemplate template;

	public LobbyController(LobbyService lobbyService, SimpMessagingTemplate template) {
		this.lobbyService = lobbyService;
		this.template = template;
	}

	@MessageMapping("/lobby-list")
	@SendToUser("/queue/lobby-list")
	public List<Lobby> getLobbyList() {
		return this.lobbyService.getLobbyList();
	}

	@MessageMapping("/create-lobby")
	public void createLobby(@Header("simpSessionId") String sessionId, LobbyCreateRequest request) throws Exception {
		Optional<Lobby> lobby = this.lobbyService.createLobby(sessionId, request.lobbyPassword(), request.lobbySize());
		if (lobby.isPresent()) {
			this.template.convertAndSend("/topic/lobby-list", this.lobbyService.getLobbyList());

			// Inform user that the their lobby has changed
			this.template.convertAndSend("/queue/lobby/lobby-id" + "-user" + sessionId, lobby.get().getId());
		}
	}

	@MessageMapping("/lobby/add-player")
	public void addPlayerToLobby(@Header("simpSessionId") String sessionId, GeneralPlayerRequest request) {
		if (this.lobbyService.addPlayerToLobby(request.lobbyId(), request.nickName(), request.lobbyPassword())) {
			this.template.convertAndSend("/topic/lobby-list", this.lobbyService.getLobbyList());

			// Inform user that the their lobby has changed
			this.template.convertAndSend("/queue/lobby/lobby-id" + "-user" + sessionId, request.lobbyId());
		}
	}

}
