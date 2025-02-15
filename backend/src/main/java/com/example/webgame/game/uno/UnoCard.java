package com.example.webgame.game.uno;

import com.example.webgame.enums.UnoCardColor;
import com.example.webgame.enums.UnoCardType;

public class UnoCard {
	private static int idCount = 0;
	private int id;
	private UnoCardColor color;
	private UnoCardType cardType;

	public UnoCard(UnoCardColor color, UnoCardType cardType) {
		this.id = ++idCount;
		this.color = color;
		this.cardType = cardType;
	}

	public int getId() {
		return this.id;
	}

	public UnoCardColor getColor() {
		return color;
	}

	public UnoCardType getCardType() {
		return cardType;
	}

	public boolean isValidMoveOnTop(UnoCard topCard) {
		if (topCard.color.equals(UnoCardColor.BLACK)) {
			return true;
		} else if (topCard.color.equals(color) || topCard.cardType.equals(cardType)) {
			return true;
		} else {
			return false;
		}
	}

	public boolean isValidMoveOnTopRegardlessOfTurn(UnoCard topCard) {
		if (!topCard.isDrawCard() && !topCard.isSpecialCard() && topCard.color.equals(color)
				&& topCard.cardType.equals(cardType)) {
			return true;
		} else {
			return false;
		}
	}

	public boolean isDrawCard() {
		return this.getCardType().equals(UnoCardType.DRAW_FOUR) || this.getCardType().equals(UnoCardType.DRAW_TWO);
	}

	public boolean isSpecialCard() {
		return this.isDrawCard() || this.getColor().equals(UnoCardColor.BLACK)
				|| this.getCardType().equals(UnoCardType.REVERSE) || this.getCardType().equals(UnoCardType.SKIP);
	}

}
