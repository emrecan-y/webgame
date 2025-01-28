package com.example.webgame.dto;

public class GeneralPlayerRequest {
	private int lobbyId;
	private String lobbyPassword;
	private String nickName;

	public GeneralPlayerRequest() {
	}

	public int getLobbyId() {
		return lobbyId;
	}

	public void setLobbyId(int lobbyId) {
		this.lobbyId = lobbyId;
	}

	public String getLobbyPassword() {
		return lobbyPassword;
	}

	public void setLobbyPassword(String lobbyPassword) {
		this.lobbyPassword = lobbyPassword;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

}
