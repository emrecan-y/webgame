package com.example.webgame.dto;

public class LobbyCreateRequest {
	private int lobbySize;
	private String lobbyPassword;

	public LobbyCreateRequest() {
	}

	public int getLobbySize() {
		return lobbySize;
	}

	public void setLobbySize(int lobbySize) {
		this.lobbySize = lobbySize;
	}

	public String getLobbyPassword() {
		return lobbyPassword;
	}

	public void setLobbyPassword(String lobbyPassword) {
		this.lobbyPassword = lobbyPassword;
	}

}
