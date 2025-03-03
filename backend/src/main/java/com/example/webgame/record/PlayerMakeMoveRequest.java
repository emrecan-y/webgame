package com.example.webgame.record;

import com.example.webgame.enums.BirCardColor;

public record PlayerMakeMoveRequest(int lobbyId, String lobbyPassword, String nickName, int cardId,
		BirCardColor pickedColor) implements PlayerRequest {
}
