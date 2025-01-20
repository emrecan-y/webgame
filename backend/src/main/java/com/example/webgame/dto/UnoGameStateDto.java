package com.example.webgame.dto;

import java.util.List;

import com.example.webgame.enums.Direction;
import com.example.webgame.game.UnoCard;
import com.example.webgame.game.UnoGameSession;

public class UnoGameStateDto {
	public String[] users;
	public int currentUserIndex;
	public List<UnoCard> userCards;

	public Direction direction;
	public UnoCard centerCard;

	public UnoGameStateDto(UnoGameSession session, List<UnoCard> userCards) {
		this.users = session.getUsers();
		this.currentUserIndex = session.getCurrentUserIndex();
		this.userCards = userCards;
		this.direction = session.getGameDirection();
		this.centerCard = session.getCenterCard();
	}

}
