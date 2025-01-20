package com.example.webgame.game;

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

}
