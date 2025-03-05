package com.example.webgame.session;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.webgame.exception.LoginException;
import com.example.webgame.name.NameService;

@Service
public class SessionService {

	private SessionMap sessionMap = new SessionMap();

	public SessionService() {
	}

	public boolean userExists(String nickName) {
		return this.sessionMap.getActiveNickNames().contains(nickName);
	}

	public boolean addUser(String sessionId, String nickName) throws LoginException {
		if (userExists(nickName)) {
			throw new LoginException("This name is already taken.");
		} else if (nickName.length() > NameService.getMaxNameLength()) {
			throw new LoginException("This name is too long.");
		} else if (nickName.length() < NameService.getMinNameLength()) {
			throw new LoginException("This name is too short.");
		} else {
			this.sessionMap.put(sessionId, nickName);
			return true;
		}
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
