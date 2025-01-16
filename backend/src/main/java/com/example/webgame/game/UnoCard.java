package com.example.webgame.game;

public class UnoCard {
	private UnoCardColor color;
	private UnoCardType cardType;

	public UnoCard(UnoCardColor color, UnoCardType cardType) {
		this.color = color;
		this.cardType = cardType;
	}

	public enum UnoCardType {
		ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, DRAW_TWO, SELECT_COLOR, DRAW_FOUR
	}

	public enum UnoCardColor {
		RED, BLUE, GREEN, YELLOW, BLACK
	}

}
