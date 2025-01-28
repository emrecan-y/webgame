package com.example.webgame.dto;

import com.example.webgame.enums.UnoCardColor;

public class PlayerMakeMoveRequest extends GeneralPlayerRequest {
	private int cardId;
	private UnoCardColor pickedColor;

	public PlayerMakeMoveRequest() {
	}

	public int getCardId() {
		return cardId;
	}

	public void setCardId(int cardId) {
		this.cardId = cardId;
	}

	public UnoCardColor getPickedColor() {
		return pickedColor;
	}

	public void setPickedColor(UnoCardColor pickedColor) {
		this.pickedColor = pickedColor;
	}

}
