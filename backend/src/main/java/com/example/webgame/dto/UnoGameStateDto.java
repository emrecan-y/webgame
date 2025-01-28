package com.example.webgame.dto;

import java.util.ArrayList;
import java.util.List;

import com.example.webgame.enums.Direction;
import com.example.webgame.enums.UnoCardColor;
import com.example.webgame.game.uno.UnoCard;
import com.example.webgame.game.uno.UnoGameSession;
import com.example.webgame.game.uno.UnoUserState;

public class UnoGameStateDto {
	private List<UnoUserDto> users;
	private String currentUser;

	private List<UnoCard> userCards;

	private Direction direction;
	private UnoCard centerCard;
	private boolean isDrawPossible;
	private UnoCardColor colorOverride;
	private int drawCount;
	private boolean isGameOver;

	public UnoGameStateDto() {
	}

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
		this.isGameOver = session.isGameOver();

		this.userCards = userCards;
	}

	public List<UnoUserDto> getUsers() {
		return users;
	}

	public void setUsers(List<UnoUserDto> users) {
		this.users = users;
	}

	public String getCurrentUser() {
		return currentUser;
	}

	public void setCurrentUser(String currentUser) {
		this.currentUser = currentUser;
	}

	public List<UnoCard> getUserCards() {
		return userCards;
	}

	public void setUserCards(List<UnoCard> userCards) {
		this.userCards = userCards;
	}

	public Direction getDirection() {
		return direction;
	}

	public void setDirection(Direction direction) {
		this.direction = direction;
	}

	public UnoCard getCenterCard() {
		return centerCard;
	}

	public void setCenterCard(UnoCard centerCard) {
		this.centerCard = centerCard;
	}

	public boolean isDrawPossible() {
		return isDrawPossible;
	}

	public void setDrawPossible(boolean isDrawPossible) {
		this.isDrawPossible = isDrawPossible;
	}

	public UnoCardColor getColorOverride() {
		return colorOverride;
	}

	public void setColorOverride(UnoCardColor colorOverride) {
		this.colorOverride = colorOverride;
	}

	public int getDrawCount() {
		return drawCount;
	}

	public void setDrawCount(int drawCount) {
		this.drawCount = drawCount;
	}

	public boolean isGameOver() {
		return isGameOver;
	}

	public void setGameOver(boolean isGameOver) {
		this.isGameOver = isGameOver;
	}

	private class UnoUserDto {
		private String name;
		private int cardCount;

		public UnoUserDto(String userName, int cardCount) {
			this.name = userName;
			this.cardCount = cardCount;
		}

		public String getName() {
			return name;
		}

		public int getCardCount() {
			return cardCount;
		}

	}
}
