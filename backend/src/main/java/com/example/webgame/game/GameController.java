package com.example.webgame.game;

import java.util.Map;
import java.util.Optional;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.webgame.dto.GeneralPlayerRequest;
import com.example.webgame.dto.PlayerMakeMoveRequest;
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
	public void startGame(GeneralPlayerRequest request) {
		if (this.lobbyService.startGame(request.getLobbyId(), request.getNickName(), request.getLobbyPassword())) {
			Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
			if (gameSessionOpt.isPresent()) {
				gameSessionOpt.get().getUserStates().forEach(userState -> this.template
						.convertAndSend("/queue/game/start-user" + userState.getSessionId(), ""));
			}
		}
	}

	@MessageMapping("/game/restart")
	public void restartGame(GeneralPlayerRequest request) {
		Optional<Lobby> lobbyOpt = this.lobbyService.findLobbyById(request.getLobbyId());
		if (lobbyOpt.isPresent()) {
			lobbyOpt.get().deleteGameSession();
		}
		if (this.lobbyService.startGame(request.getLobbyId(), request.getNickName(), request.getLobbyPassword())) {
			Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
			if (gameSessionOpt.isPresent()) {
				sendGameStateToAllUsers(gameSessionOpt.get());
			}
		}
	}

	@MessageMapping("/game/exit")
	public void exitGame(GeneralPlayerRequest request) {
		Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		Optional<Lobby> lobbyOpt = this.lobbyService.findLobbyById(request.getLobbyId());
		if (gameSessionOpt.isPresent() && lobbyOpt.isPresent()) {
			lobbyOpt.get().deleteGameSession();
			template.convertAndSend("/topic/game/" + request.getLobbyId() + "/stop", "");
		}
	}

	@MessageMapping("/game/state")
	public void getGameState(GeneralPlayerRequest request) {
		Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			sendGameStateToAllUsers(gameSessionOpt.get());
		}
	}

	@MessageMapping("/game/make-move")
	public void makeMove(PlayerMakeMoveRequest request) {
		Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			UnoGameSession gameSession = gameSessionOpt.get();
			if (gameSession.makeMove(request.getNickName(), request.getCardId(), request.getPickedColor())) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	@MessageMapping("/game/draw-card")
	public void drawCard(GeneralPlayerRequest request) {
		Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			UnoGameSession gameSession = gameSessionOpt.get();
			if (gameSession.drawCard(request.getNickName())) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	@MessageMapping("/game/draw-cards")
	public void drawCards(GeneralPlayerRequest request) {
		Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			UnoGameSession gameSession = gameSessionOpt.get();
			if (gameSession.drawCards(request.getNickName())) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	@MessageMapping("/game/pass")
	public void pass(GeneralPlayerRequest request) {
		Optional<UnoGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			UnoGameSession gameSession = gameSessionOpt.get();
			if (gameSession.pass(request.getNickName())) {
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
