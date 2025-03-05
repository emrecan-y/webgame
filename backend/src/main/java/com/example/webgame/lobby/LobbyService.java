package com.example.webgame.lobby;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

import org.springframework.stereotype.Service;

import com.example.webgame.dto.BirGameStateDto;
import com.example.webgame.exception.LobbyException;
import com.example.webgame.game.bir.BirGameSession;
import com.example.webgame.game.bir.BirUserState;
import com.example.webgame.record.PlayerRequest;
import com.example.webgame.session.SessionService;
import com.example.webgame.session.UserSession;

@Service
public class LobbyService {
	private Map<Integer, Lobby> lobbyMap;
	private SessionService sessionService;

	public LobbyService(SessionService sessionService) {
		this.sessionService = sessionService;
		this.lobbyMap = new TreeMap<>();
	}

	public List<Lobby> getLobbyList() {
		return new ArrayList<>(this.lobbyMap.values());
	}

	public void removeByLobbyId(Integer lobbyId) {
		if (lobbyId != null) {
			this.lobbyMap.remove(lobbyId);
			if (this.lobbyMap.isEmpty()) {
				Lobby.resetIdCount();
			}
		}
	}

	public Optional<Lobby> findLobbyById(Integer lobbyId) {
		if (lobbyId != null) {
			return Optional.ofNullable(this.lobbyMap.get(lobbyId));
		}
		return Optional.empty();
	}

	public boolean containsLobbyId(Integer lobbyId) {
		return lobbyId != null && this.lobbyMap.containsKey(lobbyId);
	}

	public Optional<Lobby> createLobby(String sessionId, String password, int size) {
		Optional<UserSession> userSession = this.sessionService.getBySessionId(sessionId);
		if (userSession.isPresent()) {
			Lobby newLobby = new Lobby(password, size);
			newLobby.addUser(userSession.get().getNickName());
			lobbyMap.put(newLobby.getId(), newLobby);
			changePlayerLobby(userSession.get().getNickName(), newLobby.getId());
			return Optional.of(newLobby);
		} else {
			return Optional.empty();
		}
	}

	public boolean addPlayerToLobby(Integer lobbyId, String nickName, String password) throws LobbyException {
		if (lobbyId != null) {
			Lobby lobby = this.lobbyMap.get(lobbyId);
			if (lobby == null) {
				throw new LobbyException("The lobby with id " + lobbyId + " doesn't exist");
			} else if (lobby.isPrivate() && !lobby.getPassword().equals(password)) {
				throw new LobbyException("Wrong lobby password!");
			} else if (lobby.containsUser(nickName)) {
				throw new LobbyException(nickName + " already inside lobby.");
			} else if (lobby.addUser(nickName)) {
				changePlayerLobby(nickName, lobbyId);
				return true;
			} else {
				throw new LobbyException("The lobby is full!");
			}
		} else {
			throw new LobbyException("The lobby id is missing.");
		}
	}

	private void changePlayerLobby(String nickName, Integer newLobbyId) {
		Optional<UserSession> userSessionOpt = this.sessionService.getByNickName(nickName);
		if (userSessionOpt.isPresent()) {
			UserSession userSession = userSessionOpt.get();
			if (userSession.getCurrentLobbyId() != null) {
				Lobby oldLobby = this.lobbyMap.get(userSession.getCurrentLobbyId());
				if (oldLobby != null) {
					oldLobby.removeUser(nickName);
					if (oldLobby.isEmpty()) {
						this.lobbyMap.remove(oldLobby.getId());
					}
				}
			}
			userSession.setCurrentLobbyId(newLobbyId);
		}
	}

	public boolean startGame(Integer lobbyId, String nickName, String password) {
		if (lobbyId != null) {
			Lobby lobby = this.lobbyMap.get(lobbyId);
			if (lobby != null && (!lobby.isPrivate() || lobby.isPrivate() && lobby.getPassword().equals(password))) {
				if (lobby.containsUser(nickName)) {
					String[] users = lobby.getUsers();
					HashMap<String, String> userToSessionIdMap = new LinkedHashMap<>();
					for (String userNickName : users) {
						userToSessionIdMap.put(userNickName,
								this.sessionService.getByNickName(userNickName).get().getSessionId());
					}
					lobby.startGame(userToSessionIdMap);
					return true;
				}
			}
		}
		return false;
	}

	public boolean restartGame(Integer lobbyId, String nickName, String password) {
		if (lobbyId != null) {
			Lobby lobby = this.lobbyMap.get(lobbyId);
			if (lobby != null && (!lobby.isPrivate() || lobby.isPrivate() && lobby.getPassword().equals(password))) {
				if (lobby.containsUser(nickName)) {
					lobby.getGameSession().restart();
					return true;
				}
			}
		}
		return false;
	}

	public Optional<BirGameSession> findGameSessionFromPlayerRequest(PlayerRequest request) {
		Optional<Lobby> lobbyOpt = this.findLobbyById(request.lobbyId());
		if (lobbyOpt.isPresent()) {
			Lobby lobby = lobbyOpt.get();
			if (lobby.containsUser(request.nickName()) && (!lobby.isPrivate()
					|| lobby.isPrivate() && lobby.getPassword().equals(request.lobbyPassword()))) {
				return Optional.of(lobby.getGameSession());
			}
		}
		return Optional.empty();
	}

	public Optional<Map<String, BirGameStateDto>> getSessionIdToGameStateMap(BirGameSession gameSession) {
		if (gameSession != null) {
			List<BirUserState> userStates = gameSession.getUserStates();
			Map<String, BirGameStateDto> sessionIdToGameStateMap = new HashMap<>();

			userStates.stream().forEach(userState -> {
				String sessionId = userState.getSessionId();
				sessionIdToGameStateMap.put(sessionId, new BirGameStateDto(gameSession, userState.getUserCards()));
			});
			return Optional.of(sessionIdToGameStateMap);
		} else {
			return Optional.empty();
		}
	}

}
