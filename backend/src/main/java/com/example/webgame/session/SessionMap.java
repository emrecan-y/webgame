package com.example.webgame.session;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

public class SessionMap {
	private Map<String, String> sessionIdToNickNameMap;

	private Map<String, UserSession> nickNameToUserSessionMap;

	public SessionMap() {
		this.nickNameToUserSessionMap = new HashMap<>();
		this.sessionIdToNickNameMap = new HashMap<>();
	}

	public void put(String sessionIdKey, String nickNameKey) {
		UserSession user = new UserSession(sessionIdKey, nickNameKey);

		this.sessionIdToNickNameMap.put(sessionIdKey, nickNameKey);
		this.nickNameToUserSessionMap.put(nickNameKey, user);
	}

	public Set<String> getActiveNickNames() {
		return this.nickNameToUserSessionMap.keySet();
	}

	public Optional<UserSession> getBySessionId(String sessionId) {
		String nickName = this.sessionIdToNickNameMap.get(sessionId);
		if (nickName != null) {
			return Optional.of(this.nickNameToUserSessionMap.get(nickName));
		}
		return Optional.empty();
	}

	public Optional<UserSession> getByNickName(String nickName) {
		return Optional.ofNullable(this.nickNameToUserSessionMap.get(nickName));
	}

	public void removeBySessionId(String sessionId) {
		String nickName = this.sessionIdToNickNameMap.remove(sessionId);
		if (nickName != null) {
			this.nickNameToUserSessionMap.remove(nickName);
		}
	}

	public void removeByNickName(String nickName) {
		UserSession userSession = this.nickNameToUserSessionMap.remove(nickName);
		if (userSession != null) {
			this.sessionIdToNickNameMap.remove(userSession.getSessionId());
		}
	}

}
