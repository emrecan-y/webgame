package com.example.webgame.lobby;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.webgame.dto.LobbyCreateDto;
import com.example.webgame.dto.PlayerRequestDto;
import com.example.webgame.dto.UnoGameStateDto;
import com.example.webgame.game.UnoGameSession;
import com.example.webgame.session.SessionService;

@RestController
@CrossOrigin(origins = "*")
public class LobbyController {

	private LobbyService lobbyService;
	private SessionService sessionService;
	private SimpMessagingTemplate template;

	public LobbyController(LobbyService lobbyService, SessionService sessionService, SimpMessagingTemplate template) {
		this.lobbyService = lobbyService;
		this.sessionService = sessionService;
		this.template = template;
	}

	@MessageMapping("/create-lobby")
	@SendToUser("/queue/lobby/lobby-id")
	public Integer createLobby(@Header("simpSessionId") String sessionId, LobbyCreateDto lobbyDto) throws Exception {
		Optional<Lobby> lobby = this.lobbyService.createLobby(sessionId, lobbyDto);
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
	public Integer addPlayerToLobby(PlayerRequestDto request) {
		if (this.lobbyService.addPlayerToLobby(request.lobbyId, request.nickName, request.password)) {
			this.template.convertAndSend("/topic/lobby-list", this.lobbyService.getLobbyList());
			return request.lobbyId;
		}
		return -1;
	}

	@MessageMapping("/game/start")
	public void startGame(PlayerRequestDto request) {
		if (this.lobbyService.startGame(request.lobbyId, request.nickName, request.password)) {
			Optional<Map<String, UnoGameStateDto>> sessionIdToGameStateOpt = this.lobbyService
					.getSessionIdToGameStateMap(request.lobbyId);
			if (sessionIdToGameStateOpt.isPresent()) {
				sessionIdToGameStateOpt.get().entrySet().stream().forEach(e -> {
					this.template.convertAndSend("/queue/game/start-user" + e.getKey(), "");
				});
			}
		}
	}

	@MessageMapping("/game/state")
	public void getPlayerDeck(PlayerRequestDto request) {
		if (this.lobbyService.startGame(request.lobbyId, request.nickName, request.password)) {
			Optional<Map<String, UnoGameStateDto>> sessionIdToGameStateOpt = this.lobbyService
					.getSessionIdToGameStateMap(request.lobbyId);
			if (sessionIdToGameStateOpt.isPresent()) {
				sessionIdToGameStateOpt.get().entrySet().stream().forEach(e -> {
					this.template.convertAndSend("/queue/game/state-user" + e.getKey(), e.getValue());
				});
			}
		}
	}

	@MessageMapping("/game/make-move")
	public void makeMove(PlayerRequestDto request) {
		Optional<Lobby> lobbyOpt = this.lobbyService.findLobbyById(request.lobbyId);
		if (lobbyOpt.isPresent()) {
			Lobby lobby = lobbyOpt.get();
			if (lobby.containsUser(request.nickName)
					&& (!lobby.isPrivate() || lobby.isPrivate() && lobby.getPassword().equals(request.password))) {
				UnoGameSession gameSession = lobby.getGameSession();
				gameSession.makeMove(request.nickName, request.cardId);

				Optional<Map<String, UnoGameStateDto>> sessionIdToGameStateOpt = this.lobbyService
						.getSessionIdToGameStateMap(request.lobbyId);
				if (sessionIdToGameStateOpt.isPresent()) {
					sessionIdToGameStateOpt.get().entrySet().stream().forEach(e -> {
						this.template.convertAndSend("/queue/game/state-user" + e.getKey(), e.getValue());
					});
				}
			}
		}
	}
}
