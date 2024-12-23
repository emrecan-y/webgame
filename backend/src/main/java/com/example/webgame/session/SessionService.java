package com.example.webgame.session;

import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class SessionService {

	private SessionMap sessionMap = new SessionMap();

	public SessionService() {
	}

	public boolean userExists(String nickName) {
		return this.sessionMap.getActiveNickNames().contains(nickName);
	}

	public boolean addUser(String sessionId, String nickName) {
		if (!userExists(nickName)) {
			this.sessionMap.put(sessionId, nickName);
			return true;
		}
		return false;
	}

	public void removeUserBySessionId(String sessionId) {
		this.sessionMap.removeBySessionId(sessionId);
	}

	public void removeUserByNickName(String nickName) {
		this.sessionMap.removeByNickName(nickName);
	}

	public Optional<UserSession> getBySessionId(String sessionId) {
		return this.sessionMap.getBySessionId(sessionId);
	}

	public Optional<UserSession> getByNickName(String nickName) {
		return this.sessionMap.getByNickName(nickName);
	}

}
