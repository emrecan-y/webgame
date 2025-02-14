package com.example.webgame.enums;

public enum UnoCardType {
	ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, DRAW_TWO, SKIP, REVERSE, SELECT_COLOR, DRAW_FOUR;

	public boolean isRegularType() {
		if (!this.equals(DRAW_FOUR) && !this.equals(DRAW_TWO) && !this.equals(REVERSE) && !this.equals(SKIP)
				&& !this.equals(SELECT_COLOR)) {
			return true;
		} else {
			return false;
		}
	}
}
