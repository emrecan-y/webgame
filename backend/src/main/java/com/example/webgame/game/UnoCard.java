package com.example.webgame.game;

import com.example.webgame.enums.UnoCardColor;
import com.example.webgame.enums.UnoCardType;

public class UnoCard {
	private UnoCardColor color;
	private UnoCardType cardType;

	public UnoCard(UnoCardColor color, UnoCardType cardType) {
		this.color = color;
		this.cardType = cardType;
	}

	public UnoCardColor getColor() {
		return color;
	}

	public UnoCardType getCardType() {
		return cardType;
	}

}
