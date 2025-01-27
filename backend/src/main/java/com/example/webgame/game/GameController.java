package com.example.webgame.game;

import java.util.Map;
import java.util.Optional;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.webgame.dto.PlayerRequestDto;
import com.example.webgame.dto.UnoGameStateDto;
import com.example.webgame.game.uno.UnoGameSession;
import com.example.webgame.lobby.Lobby;
import com.example.webgame.lobby.LobbyService;

@RestController
@CrossOrigin(origins = "*")
public class GameController {
	private LobbyService lobbyService;
	private SimpMessagingTemplate template;

	public GameController(LobbyService lobbyService, SimpMessagingTemplate template) {
		this.lobbyService = lobbyService;
		this.template = template;
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
