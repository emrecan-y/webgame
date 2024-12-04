package com.example.webgame.lobby;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
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

	public LobbyController() {
		this.lobbies = new ArrayList<>();
	}

	@MessageMapping("/create-lobby")
	@SendTo("/topic/lobby-list")
	public List<Lobby> createLobby(LobbyCreateDto newLobby) throws Exception {
		System.out.println(newLobby.size);
		lobbies.add(new Lobby(newLobby.password, newLobby.size));
		return lobbies;

	}

	@GetMapping("/lobby-list")
	public List<Lobby> getLobbyList() {
		return lobbies;
	}

	@PutMapping("/lobby-list")
	public void joinLobby(@RequestParam Integer lobbyId, @RequestParam String playerName) {
		Optional<Lobby> lobbyById = this.lobbies.stream().filter(c -> c.id == lobbyId).findFirst();
		if (lobbyById.isPresent() && lobbyById.get().addUser(playerName)) {
			// this.client.convertAndSend("/topic/lobby-list", this.lobbies);
		}
	}
}
