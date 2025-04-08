package com.example.webgame.lobby;

import java.util.List;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.example.webgame.record.GeneralPlayerRequest;
import com.example.webgame.record.LobbyCreateRequest;
import com.example.webgame.record.LobbyPlayerModifyResult;

@Controller
public class LobbyController {

	private LobbyService lobbyService;
	private SimpMessagingTemplate template;

	public LobbyController(LobbyService lobbyService, SimpMessagingTemplate template) {
		this.lobbyService = lobbyService;
		this.template = template;
	}

	@MessageMapping("/lobby-list")
	@SendToUser("/queue/lobby-list")
	public List<Lobby> getLobbyList(@Header("simpSessionId") String sessionId) {
		return this.lobbyService.getLobbyListIfSessionValid(sessionId);
	}

	@MessageMapping("/create-lobby")
	public void createLobby(@Header("simpSessionId") String sessionId, LobbyCreateRequest request) {
		LobbyPlayerModifyResult result = this.lobbyService.createLobby(sessionId, request.lobbyPassword(),
				request.lobbySize());

		sendLobbyPlayerModifyResult(result, sessionId);

	}

	@MessageMapping("/lobby/add-player")
	public void addPlayerToLobby(@Header("simpSessionId") String sessionId, GeneralPlayerRequest request) {
		LobbyPlayerModifyResult result = this.lobbyService.addPlayerToLobby(sessionId, request.lobbyId(),
				request.nickName(), request.lobbyPassword());

		sendLobbyPlayerModifyResult(result, sessionId);

	}

	@MessageMapping("/lobby/remove-player")
	public void removePlayerFromLobby(@Header("simpSessionId") String sessionId) {
		LobbyPlayerModifyResult result = this.lobbyService.removePlayerFromLobbyAndStopGame(sessionId);

		sendLobbyPlayerModifyResult(result, sessionId);
	}

	private void sendLobbyPlayerModifyResult(LobbyPlayerModifyResult result, String sessionId) {
		if (result != null && result.updatedLobbies() != null) {
			this.template.convertAndSend("/topic/lobby-list", result.updatedLobbies());
			if (result.oldPlayerLobbyId() != null) {
				template.convertAndSend("/topic/game/" + result.oldPlayerLobbyId() + "/stop", "");
			}
			this.playerLobbyHasChanged(sessionId, result.newPlayerLobbyId() == null ? -1 : result.newPlayerLobbyId());
		}
	}

	private void playerLobbyHasChanged(String sessionId, int newLobbyId) {
		this.template.convertAndSend("/queue/lobby/lobby-id" + "-user" + sessionId, newLobbyId);
	}

}
