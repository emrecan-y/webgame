package com.example.webgame.lobby;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.webgame.record.GeneralPlayerRequest;
import com.example.webgame.record.LobbyCreateRequest;

@RestController
@CrossOrigin(origins = "*")
public class LobbyController {

	private LobbyService lobbyService;
	private SimpMessagingTemplate template;

	public LobbyController(LobbyService lobbyService, SimpMessagingTemplate template) {
		this.lobbyService = lobbyService;
		this.template = template;
	}

	@MessageMapping("/create-lobby")
	@SendToUser("/queue/lobby/lobby-id")
	public Integer createLobby(@Header("simpSessionId") String sessionId, LobbyCreateRequest request) throws Exception {
		Optional<Lobby> lobby = this.lobbyService.createLobby(sessionId, request.lobbyPassword(), request.lobbySize());
		if (lobby.isPresent()) {
			this.template.convertAndSend("/topic/lobby-list", this.lobbyService.getLobbyList());
			return lobby.get().getId();
		} else {
			throw new NoSuchElementException("SessionId doesn't exist.");
		}
	}

	@MessageMapping("/lobby-list")
	@SendToUser("/queue/lobby-list")
	public List<Lobby> getLobbyList() {
		return this.lobbyService.getLobbyList();
	}

	@MessageMapping("/lobby/add-player")
	@SendToUser("/queue/lobby/lobby-id")
	public Integer addPlayerToLobby(GeneralPlayerRequest request) {
		if (this.lobbyService.addPlayerToLobby(request.lobbyId(), request.nickName(), request.lobbyPassword())) {
			this.template.convertAndSend("/topic/lobby-list", this.lobbyService.getLobbyList());
			return request.lobbyId();
		}
		return -1;
	}

}
