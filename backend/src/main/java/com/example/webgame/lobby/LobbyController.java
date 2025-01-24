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

import com.example.webgame.dto.PlayerRequestDto;
import com.example.webgame.dto.UnoGameStateDto;
import com.example.webgame.game.UnoGameSession;

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
	public Integer createLobby(@Header("simpSessionId") String sessionId, PlayerRequestDto request) throws Exception {
		Optional<Lobby> lobby = this.lobbyService.createLobby(sessionId, request.lobbyPassword, request.lobbySize);
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
		if (this.lobbyService.addPlayerToLobby(request.lobbyId, request.nickName, request.lobbyPassword)) {
			this.template.convertAndSend("/topic/lobby-list", this.lobbyService.getLobbyList());
			return request.lobbyId;
		}
		return -1;
	}

	@MessageMapping("/game/start")
	public void startGame(PlayerRequestDto request) {
		if (this.lobbyService.startGame(request.lobbyId, request.nickName, request.lobbyPassword)) {
			Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
			if (gameSessionOpt.isPresent()) {
				gameSessionOpt.get().getUserStates().forEach(userState -> this.template
						.convertAndSend("/queue/game/start-user" + userState.getSessionId(), ""));
			}
		}
	}

	@MessageMapping("/game/restart")
	public void restartGame(PlayerRequestDto request) {
		if (this.lobbyService.startGame(request.lobbyId, request.nickName, request.lobbyPassword)) {
			Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
			if (gameSessionOpt.isPresent()) {
				sendGameStateToAllUsers(gameSessionOpt.get());
			}
		}
	}

	@MessageMapping("/game/exit")
	public void exitGame(PlayerRequestDto request) {
		Optional<Lobby> lobbyOpt = this.lobbyService.findLobbyById(request.lobbyId);
		if (lobbyOpt.isPresent() && lobbyOpt.get().containsUser(request.nickName)
				&& (!lobbyOpt.get().isPrivate() || lobbyOpt.get().getPassword().equals(request.lobbyPassword))) {
			this.template.convertAndSend("/topic/game-" + request.lobbyId + "/exit", "");
		}
	}

	@MessageMapping("/game/state")
	public void getPlayerDeck(PlayerRequestDto request) {
		Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			sendGameStateToAllUsers(gameSessionOpt.get());
		}
	}

	@MessageMapping("/game/make-move")
	public void makeMove(PlayerRequestDto request) {
		Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			UnoGameSession gameSession = gameSessionOpt.get();
			if (gameSession.makeMove(request.nickName, request.cardId, request.pickedColor)) {
				sendGameStateToAllUsers(gameSession);
				if (gameSession.isGameOver()) {
					this.lobbyService.findLobbyById(request.lobbyId).get().deleteGameSession();
				}
			}
		}
	}

	@MessageMapping("/game/draw-card")
	public void drawCard(PlayerRequestDto request) {
		Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			UnoGameSession gameSession = gameSessionOpt.get();
			if (gameSession.drawCard(request.nickName)) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	@MessageMapping("/game/draw-cards")
	public void drawCards(PlayerRequestDto request) {
		Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			UnoGameSession gameSession = gameSessionOpt.get();
			if (gameSession.drawCards(request.nickName)) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	@MessageMapping("/game/pass")
	public void pass(PlayerRequestDto request) {
		Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			UnoGameSession gameSession = gameSessionOpt.get();
			if (gameSession.pass(request.nickName)) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	private void sendGameStateToAllUsers(UnoGameSession gameSession) {
		Optional<Map<String, UnoGameStateDto>> sessionIdToGameStateOpt = this.lobbyService
				.getSessionIdToGameStateMap(gameSession);
		if (sessionIdToGameStateOpt.isPresent()) {
			sessionIdToGameStateOpt.get().entrySet().stream().forEach(e -> {
				this.template.convertAndSend("/queue/game/state-user" + e.getKey(), e.getValue());
			});
		}
	}
}
