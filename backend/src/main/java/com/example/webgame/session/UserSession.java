package com.example.webgame.session;

import java.util.Objects;

public class UserSession {
	private String sessionId;
	private String nickName;
	private Integer currentLobbyId;

	public UserSession(String sessionId, String nickName) {
		this.sessionId = sessionId;
		this.nickName = nickName;
	}

	public String getSessionId() {
		return sessionId;
	}

	public String getNickName() {
		return nickName;
	}

	public Integer getCurrentLobbyId() {
		return currentLobbyId;
	}

	public void setCurrentLobbyId(Integer currentLobbyId) {
		this.currentLobbyId = currentLobbyId;
	}

	@Override
	public int hashCode() {
		return Objects.hash(nickName);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		UserSession other = (UserSession) obj;
		return Objects.equals(nickName, other.nickName);
	}

}
