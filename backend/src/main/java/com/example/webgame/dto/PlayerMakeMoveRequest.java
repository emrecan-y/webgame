package com.example.webgame.dto;

import com.example.webgame.enums.BirCardColor;

public class PlayerMakeMoveRequest extends GeneralPlayerRequest {
	private int cardId;
	private BirCardColor pickedColor;

	public PlayerMakeMoveRequest() {
	}

	public int getCardId() {
		return cardId;
	}

	public void setCardId(int cardId) {
		this.cardId = cardId;
	}

	public BirCardColor getPickedColor() {
		return pickedColor;
	}

	public void setPickedColor(BirCardColor pickedColor) {
		this.pickedColor = pickedColor;
	}

}
