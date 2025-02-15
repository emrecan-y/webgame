package com.example.webgame.game.uno;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class UnoUserState {
	private String userNickName;
	private String sessionId;
	private int winCount;
	private boolean hasSuccessfullyDeclaredBir;
	private boolean hasAttemptedToDeclareBir;

	private List<UnoCard> userCards;

	public UnoUserState(String userNickName, String sessionId) {
		this.userNickName = userNickName;
		this.sessionId = sessionId;
		this.winCount = 0;
		this.userCards = new ArrayList<>();
	}

	public String getUserNickName() {
		return userNickName;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void incrementWinCount() {
		this.winCount++;
	}

	public int getWinCount() {
		return this.winCount;
	}

	public List<UnoCard> getUserCards() {
		return userCards;
	}

	public boolean removeCard(UnoCard cardToRemove) {
		return this.userCards.remove(cardToRemove);
	}

	public boolean addCard(UnoCard cardToAdd) {
		return this.userCards.add(cardToAdd);
	}

	public void removeAllCards() {
		this.userCards.clear();
	}

	public void declareBir(boolean value) {
		this.hasAttemptedToDeclareBir = true;
		this.hasSuccessfullyDeclaredBir = value;
	}

	public void resetBir() {
		this.hasAttemptedToDeclareBir = false;
		this.hasSuccessfullyDeclaredBir = false;
	}

	public boolean hasSuccessfullyDeclaredBir() {
		return this.hasSuccessfullyDeclaredBir;
	}

	public boolean hasAttemptedToDeclareBir() {
		return this.hasAttemptedToDeclareBir;
	}

	public Optional<UnoCard> findCardById(int id) {
		return this.userCards.stream().filter(card -> card.getId() == id).findAny();
	}

}
