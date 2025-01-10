package com.example.webgame.lobby;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.webgame.dto.LobbyCreateDto;
import com.example.webgame.session.SessionService;
import com.example.webgame.session.UserSession;

@Service
public class LobbyService {
	private Map<Integer, Lobby> lobbyMap;
	private SessionService sessionService;

	public LobbyService(SessionService sessionService) {
		this.sessionService = sessionService;
		this.lobbyMap = new HashMap<>();
	}

	public List<Lobby> getLobbyList() {
		return new ArrayList<>(this.lobbyMap.values());
	}

	public void removeByLobbyId(Integer lobbyId) {
		this.lobbyMap.remove(lobbyId);
		if (this.lobbyMap.isEmpty()) {
			Lobby.resetIdCount();
		}
	}

	public Optional<Lobby> findLobbyById(Integer lobbyId) {
		return Optional.ofNullable(this.lobbyMap.get(lobbyId));
	}

	public boolean containsLobbyId(Integer lobbyId) {
		return this.lobbyMap.containsKey(lobbyId);
	}

	public Optional<Lobby> createLobby(String sessionId, LobbyCreateDto lobbyDto) {
		Optional<UserSession> userSession = this.sessionService.getBySessionId(sessionId);
		if (userSession.isPresent()) {
			Lobby newLobby = new Lobby(lobbyDto.password, lobbyDto.size);
			newLobby.addUser(userSession.get().getNickName());
			lobbyMap.put(newLobby.getId(), newLobby);
			changePlayerLobby(userSession.get().getNickName(), newLobby.getId());
			return Optional.of(newLobby);
		} else {
			return Optional.empty();
		}
	}

	public boolean addPlayerToLobby(Integer lobbyId, String nickName, String password) {
		Lobby lobby = this.lobbyMap.get(lobbyId);
		if (lobby != null && (!lobby.isPrivate() || lobby.isPrivate() && lobby.getPassword().equals(password))) {
			if (lobby.addUser(nickName)) {
				changePlayerLobby(nickName, lobbyId);
				return true;
			}
		}
		return false;
	}

	private void changePlayerLobby(String nickName, Integer newLobbyId) {
		Optional<UserSession> userSessionOpt = this.sessionService.getByNickName(nickName);
		if (userSessionOpt.isPresent()) {
			UserSession userSession = userSessionOpt.get();
			Lobby oldLobby = this.lobbyMap.get(userSession.getCurrentLobbyId());
			if (oldLobby != null) {
				oldLobby.removeUser(nickName);
				if (oldLobby.isEmpty()) {
					this.lobbyMap.remove(oldLobby.getId());
				}
			}
			userSession.setCurrentLobbyId(newLobbyId);

		}
	}
}
