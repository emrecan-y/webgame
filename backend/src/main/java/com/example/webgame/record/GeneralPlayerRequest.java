package com.example.webgame.record;

public record GeneralPlayerRequest(int lobbyId, String lobbyPassword, String nickName) implements PlayerRequest {
}
