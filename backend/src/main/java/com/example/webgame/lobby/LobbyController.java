package com.example.webgame.lobby;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
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
	private List<Lobby> lobbies;
	private SimpMessagingTemplate template;

	public LobbyController(SimpMessagingTemplate template) {
		this.lobbies = new ArrayList<>();
		this.template = template;
	}

	@MessageMapping("/create-lobby")
	@SendTo("/topic/lobby-list")
	public List<Lobby> createLobby(LobbyCreateDto newLobby) throws Exception {
		lobbies.add(new Lobby(newLobby.password, newLobby.size));
		return lobbies;

	}

	@GetMapping("/lobby-list")
	public List<Lobby> getLobbyList() {
		return lobbies;
	}

	@PutMapping("/lobby-list")
	public ResponseEntity<?> joinLobby(@RequestParam Integer lobbyId, @RequestParam String playerName) {
		Optional<Lobby> lobbyById = this.lobbies.stream().filter(c -> c.id == lobbyId).findFirst();
		if (lobbyById.isPresent()) {
			Lobby lobby = lobbyById.get();
			if (!lobby.isPrivate && lobby.addUser(playerName)) {
				this.template.convertAndSend("/topic/lobby-list", this.lobbies);
				return new ResponseEntity<>(HttpStatusCode.valueOf(200));
			} else {
				return new ResponseEntity<>(HttpStatusCode.valueOf(403));
			}
		} else {
			return new ResponseEntity<>(HttpStatusCode.valueOf(400));
		}
	}
}
