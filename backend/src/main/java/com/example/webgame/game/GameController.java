package com.example.webgame.game;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.webgame.dto.BirGameStateDto;
import com.example.webgame.game.bir.BirGameSession;
import com.example.webgame.lobby.Lobby;
import com.example.webgame.lobby.LobbyService;
import com.example.webgame.record.GeneralPlayerRequest;
import com.example.webgame.record.InfoPopUp;
import com.example.webgame.record.PlayerMakeMoveRequest;

@Controller
public class GameController {
	private LobbyService lobbyService;
	private SimpMessagingTemplate template;

	public GameController(LobbyService lobbyService, SimpMessagingTemplate template) {
		this.lobbyService = lobbyService;
		this.template = template;
	}

	@MessageMapping("/game/start")
	public void startGame(@Header("simpSessionId") String sessionId, GeneralPlayerRequest request) {
		if (this.lobbyService.startGame(sessionId, request.lobbyId(), request.nickName(), request.lobbyPassword())) {
			Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(sessionId,
					request);
			if (gameSessionOpt.isPresent()) {
				gameSessionOpt.get().getUserStates().forEach(userState -> this.template
						.convertAndSend("/queue/game/start-user" + userState.getSessionId(), ""));
			}
		}
	}

	@MessageMapping("/game/restart")
	public void restartGame(@Header("simpSessionId") String sessionId, GeneralPlayerRequest request) {
		if (this.lobbyService.restartGame(sessionId, request.lobbyId(), request.nickName(), request.lobbyPassword())) {
			Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(sessionId,
					request);
			if (gameSessionOpt.isPresent()) {
				sendGameStateToAllUsers(gameSessionOpt.get());
			}
		}
	}

	@MessageMapping("/game/exit")
	public void exitGame(@Header("simpSessionId") String sessionId, GeneralPlayerRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(sessionId,
				request);
		Optional<Lobby> lobbyOpt = this.lobbyService.findLobbyById(request.lobbyId());
		if (gameSessionOpt.isPresent() && lobbyOpt.isPresent()) {
			lobbyOpt.get().deleteGameSession();
			template.convertAndSend("/topic/game/" + request.lobbyId() + "/stop", "");
		}
	}

	@MessageMapping("/game/state")
	public void getGameState(@Header("simpSessionId") String sessionId, GeneralPlayerRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(sessionId,
				request);
		if (gameSessionOpt.isPresent()) {
			sendGameStateToAllUsers(gameSessionOpt.get());
		}
	}

	@MessageMapping("/game/make-move")
	public void makeMove(@Header("simpSessionId") String sessionId, PlayerMakeMoveRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(sessionId,
				request);
		if (gameSessionOpt.isPresent()) {
			BirGameSession gameSession = gameSessionOpt.get();
			if (gameSession.makeMove(request.nickName(), request.cardId(), request.pickedColor())) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	@MessageMapping("/game/draw-card")
	public void drawCard(@Header("simpSessionId") String sessionId, GeneralPlayerRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(sessionId,
				request);
		if (gameSessionOpt.isPresent()) {
			BirGameSession gameSession = gameSessionOpt.get();
			if (gameSession.drawCard(request.nickName())) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	@MessageMapping("/game/draw-cards")
	public void drawCards(@Header("simpSessionId") String sessionId, GeneralPlayerRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(sessionId,
				request);
		if (gameSessionOpt.isPresent()) {
			BirGameSession gameSession = gameSessionOpt.get();
			if (gameSession.drawCards(request.nickName())) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	@MessageMapping("/game/pass")
	public void pass(@Header("simpSessionId") String sessionId, GeneralPlayerRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(sessionId,
				request);
		if (gameSessionOpt.isPresent()) {
			BirGameSession gameSession = gameSessionOpt.get();
			if (gameSession.pass(request.nickName())) {
				sendGameStateToAllUsers(gameSession);
			}
		}
	}

	@MessageMapping("/game/bir")
	public void bir(@Header("simpSessionId") String sessionId, GeneralPlayerRequest request) {
		Optional<BirGameSession> gameSessionOpt = this.lobbyService.findGameSessionFromPlayerRequest(sessionId,
				request);
		if (gameSessionOpt.isPresent()) {
			BirGameSession gameSession = gameSessionOpt.get();
			if (gameSession.bir(request.nickName())) {
				this.template.convertAndSend("/queue/info-pop-up-user" + sessionId,
						new InfoPopUp(UUID.randomUUID(), "Invalid BIR press! +2 as a penalty.", false));
			}
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
