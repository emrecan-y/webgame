package com.example.webgame.game;

import java.util.Map;
import java.util.Optional;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.webgame.dto.BirGameStateDto;
import com.example.webgame.game.bir.BirGameSession;
import com.example.webgame.lobby.Lobby;
import com.example.webgame.lobby.LobbyService;
import com.example.webgame.record.GeneralPlayerRequest;
import com.example.webgame.record.PlayerMakeMoveRequest;

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
		if (this.lobbyService.startGame(request.lobbyId(), request.nickName(), request.lobbyPassword())) {
			Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
			if (gameSessionOpt.isPresent()) {
				gameSessionOpt.get().getUserStates().forEach(userState -> this.template
						.convertAndSend("/queue/game/start-user" + userState.getSessionId(), ""));
			}
		}
	}

	@MessageMapping("/game/restart")
	public void restartGame(GeneralPlayerRequest request) {
		if (this.lobbyService.restartGame(request.lobbyId(), request.nickName(), request.lobbyPassword())) {
			Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
			if (gameSessionOpt.isPresent()) {
				sendGameStateToAllUsers(gameSessionOpt.get());
			}
		}
	}

	@MessageMapping("/game/exit")
	public void exitGame(GeneralPlayerRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		Optional<Lobby> lobbyOpt = this.lobbyService.findLobbyById(request.lobbyId());
		if (gameSessionOpt.isPresent() && lobbyOpt.isPresent()) {
			lobbyOpt.get().deleteGameSession();
			template.convertAndSend("/topic/game/" + request.lobbyId() + "/stop", "");
		}
	}

	@MessageMapping("/game/state")
	public void getGameState(GeneralPlayerRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			sendGameStateToAllUsers(gameSessionOpt.get());
		}
	}

	@MessageMapping("/game/make-move")
	public void makeMove(PlayerMakeMoveRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			BirGameSession gameSession = gameSessionOpt.get();
			if (gameSession.makeMove(request.nickName(), request.cardId(), request.pickedColor())) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	@MessageMapping("/game/draw-card")
	public void drawCard(GeneralPlayerRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			BirGameSession gameSession = gameSessionOpt.get();
			if (gameSession.drawCard(request.nickName())) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	@MessageMapping("/game/draw-cards")
	public void drawCards(GeneralPlayerRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			BirGameSession gameSession = gameSessionOpt.get();
			if (gameSession.drawCards(request.nickName())) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	@MessageMapping("/game/pass")
	public void pass(GeneralPlayerRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			BirGameSession gameSession = gameSessionOpt.get();
			if (gameSession.pass(request.nickName())) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	@MessageMapping("/game/bir")
	public void bir(GeneralPlayerRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(request);
		if (gameSessionOpt.isPresent()) {
			BirGameSession gameSession = gameSessionOpt.get();
			gameSession.bir(request.nickName());
			sendGameStateToAllUsers(gameSession);
		}
	}

	private void sendGameStateToAllUsers(BirGameSession gameSession) {
		Optional<Map<String, BirGameStateDto>> sessionIdToGameStateOpt = this.lobbyService
				.getSessionIdToGameStateMap(gameSession);
		if (sessionIdToGameStateOpt.isPresent()) {
			sessionIdToGameStateOpt.get().entrySet().stream().forEach(e -> {
				this.template.convertAndSend("/queue/game/state-user" + e.getKey(), e.getValue());
			});
		}
	}
}
