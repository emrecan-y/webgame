package com.example.webgame.dto;

import java.util.ArrayList;
import java.util.List;

import com.example.webgame.enums.Direction;
import com.example.webgame.enums.UnoCardColor;
import com.example.webgame.game.UnoCard;
import com.example.webgame.game.UnoGameSession;
import com.example.webgame.game.UnoUserState;

public class UnoGameStateDto {
	public List<UnoUserDto> users;
	public String currentUser;

	public List<UnoCard> userCards;

	public Direction direction;
	public UnoCard centerCard;
	public boolean isDrawPossible;
	public UnoCardColor colorOverride;
	public int drawCount;

	public UnoGameStateDto(UnoGameSession session, List<UnoCard> userCards) {
		this.users = new ArrayList<>();
		for (UnoUserState userState : session.getUserStates()) {
			users.add(new UnoUserDto(userState.getUserNickName(), userState.getUserCards().size()));
		}
		this.currentUser = session.getUsers()[session.getCurrentUserIndex()];
		this.direction = session.getGameDirection();
		this.centerCard = session.getCenterCard();
		this.isDrawPossible = session.isDrawPossible();
		this.colorOverride = session.getColorOverride();
		this.drawCount = session.getDrawCount();

		this.userCards = userCards;
	}

	private class UnoUserDto {
		public String name;
		public int cardCount;

		public UnoUserDto(String userName, int cardCount) {
			this.name = userName;
			this.cardCount = cardCount;
		}

	}
}
