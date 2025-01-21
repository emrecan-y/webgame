package com.example.webgame.dto;

import com.example.webgame.enums.UnoCardColor;

public class PlayerRequestDto {
	public String nickName;

	public int lobbyId;
	public int lobbySize;
	public String lobbyPassword;

	public int cardId;
	public UnoCardColor pickedColor;
}
