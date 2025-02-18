package com.example.webgame.dto;

import java.util.ArrayList;
import java.util.List;

import com.example.webgame.enums.Direction;
import com.example.webgame.enums.BirCardColor;
import com.example.webgame.game.bir.BirCard;
import com.example.webgame.game.bir.BirGameSession;
import com.example.webgame.game.bir.BirUserState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class BirGameStateDto {
	private List<BirUserDto> users;
	private String currentUser;

	private List<BirCard> userCards;

	private Direction direction;
	private BirCard centerCard;
	private boolean isDrawPossible;
	private BirCardColor colorOverride;
	private int drawCount;
	private boolean isGameOver;

	public BirGameStateDto() {
	}

	public BirGameStateDto(BirGameSession session, List<BirCard> userCards) {
		this.users = new ArrayList<>();
		for (BirUserState userState : session.getUserStates()) {
			users.add(new BirUserDto(userState.getUserNickName(), userState.getUserCards().size(),
					userState.getWinCount(), userState.hasAttemptedToDeclareBir()));
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

	public List<BirUserDto> getUsers() {
		return users;
	}

	public void setUsers(List<BirUserDto> users) {
		this.users = users;
	}

	public String getCurrentUser() {
		return currentUser;
	}

	public void setCurrentUser(String currentUser) {
		this.currentUser = currentUser;
	}

	public List<BirCard> getUserCards() {
		return userCards;
	}

	public void setUserCards(List<BirCard> userCards) {
		this.userCards = userCards;
	}

	public Direction getDirection() {
		return direction;
	}

	public void setDirection(Direction direction) {
		this.direction = direction;
	}

	public BirCard getCenterCard() {
		return centerCard;
	}

	public void setCenterCard(BirCard centerCard) {
		this.centerCard = centerCard;
	}

	@JsonProperty("isDrawPossible")
	public boolean isDrawPossible() {
		return isDrawPossible;
	}

	public void setDrawPossible(boolean isDrawPossible) {
		this.isDrawPossible = isDrawPossible;
	}

	public BirCardColor getColorOverride() {
		return colorOverride;
	}

	public void setColorOverride(BirCardColor colorOverride) {
		this.colorOverride = colorOverride;
	}

	public int getDrawCount() {
		return drawCount;
	}

	public void setDrawCount(int drawCount) {
		this.drawCount = drawCount;
	}

	@JsonProperty("isGameOver")
	public boolean isGameOver() {
		return isGameOver;
	}

	public void setGameOver(boolean isGameOver) {
		this.isGameOver = isGameOver;
	}

	private class BirUserDto {
		private String name;
		private int cardCount;
		private int winCount;
		private boolean hasAttemptedToDeclareBir;

		public BirUserDto(String userName, int cardCount, int winCount, boolean hasAttemptedToDeclareBir) {
			this.name = userName;
			this.cardCount = cardCount;
			this.winCount = winCount;
			this.hasAttemptedToDeclareBir = hasAttemptedToDeclareBir;
		}

		public String getName() {
			return this.name;
		}

		public int getCardCount() {
			return this.cardCount;
		}

		public int getWinCount() {
			return this.winCount;
		}

		@JsonProperty("hasAttemptedToDeclareBir")
		public boolean hasAttemptedToDeclareBir() {
			return hasAttemptedToDeclareBir;
		}

	}
}
