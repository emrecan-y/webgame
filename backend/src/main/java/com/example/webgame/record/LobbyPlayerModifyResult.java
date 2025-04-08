package com.example.webgame.record;

import java.util.List;

import com.example.webgame.lobby.Lobby;

public record LobbyPlayerModifyResult(List<Lobby> updatedLobbies, Integer oldPlayerLobbyId, Integer newPlayerLobbyId) {
}
