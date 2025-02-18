package com.example.webgame.game.bir;

import com.example.webgame.enums.BirCardColor;
import com.example.webgame.enums.BirCardType;

public class BirCard {
	private static int idCount = 0;
	private int id;
	private BirCardColor color;
	private BirCardType cardType;

	public BirCard(BirCardColor color, BirCardType cardType) {
		this.id = ++idCount;
		this.color = color;
		this.cardType = cardType;
	}

	public int getId() {
		return this.id;
	}

	public BirCardColor getColor() {
		return color;
	}

	public BirCardType getCardType() {
		return cardType;
	}

	public boolean isValidMoveOnTop(BirCard topCard) {
		if (topCard.color.equals(BirCardColor.BLACK)) {
			return true;
		} else if (topCard.color.equals(color) || topCard.cardType.equals(cardType)) {
			return true;
		} else {
			return false;
		}
	}

	public boolean isValidMoveOnTopRegardlessOfTurn(BirCard topCard) {
		if (!topCard.isDrawCard() && !topCard.isSpecialCard() && topCard.color.equals(color)
				&& topCard.cardType.equals(cardType)) {
			return true;
		} else {
			return false;
		}
	}

	public boolean isDrawCard() {
		return this.getCardType().equals(BirCardType.DRAW_FOUR) || this.getCardType().equals(BirCardType.DRAW_TWO);
	}

	public boolean isSpecialCard() {
		return this.isDrawCard() || this.getColor().equals(BirCardColor.BLACK)
				|| this.getCardType().equals(BirCardType.REVERSE) || this.getCardType().equals(BirCardType.SKIP);
	}

}
