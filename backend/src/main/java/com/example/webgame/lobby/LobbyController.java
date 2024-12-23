package com.example.webgame.lobby;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.webgame.dto.LobbyCreateDto;

@RestController
@CrossOrigin(origins = "*")
public class LobbyController {

	private SimpMessagingTemplate template;
	private LobbyService lobbyService;

	public LobbyController(LobbyService lobbyService, SimpMessagingTemplate template) {
		this.lobbyService = lobbyService;
		this.template = template;
	}

	@MessageMapping("/create-lobby")
	@SendTo("/topic/lobby-list")
	public List<Lobby> createLobby(@Header("simpSessionId") String sessionId, LobbyCreateDto lobbyDto)
			throws Exception {
		if (this.lobbyService.createLobby(sessionId, lobbyDto)) {
			return this.lobbyService.getLobbyList();
		} else {
			throw new NoSuchElementException("SessionId doesn't exist.");
		}
	}

	@GetMapping("/lobby-list")
	public List<Lobby> getLobbyList() {
		return this.lobbyService.getLobbyList();
	}

	@PutMapping("/lobby-list")
	public ResponseEntity<?> joinLobby(@RequestParam Integer lobbyId, @RequestParam String playerName,
			@RequestParam String password) {
		if (this.lobbyService.containsLobbyId(lobbyId)) {
			if (this.lobbyService.addPlayerToLobby(lobbyId, playerName, password)) {
				this.template.convertAndSend("/topic/lobby-list", this.lobbyService.getLobbyList());
				return new ResponseEntity<>("Player succesfully added to lobby.", HttpStatusCode.valueOf(200));
			} else {
				return new ResponseEntity<>("Player already in lobby or lobby full.", HttpStatusCode.valueOf(403));
			}
		} else {
			return new ResponseEntity<>("Lobby with the id doesnt exist.", HttpStatusCode.valueOf(400));
		}
	}
}
