package com.example.webgame.game;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Stack;

import com.example.webgame.enums.Direction;
import com.example.webgame.enums.UnoCardColor;
import com.example.webgame.enums.UnoCardType;

public class UnoGameSession {
	private static final List<UnoCard> INITIAL_CARD_DECK = readUnoCardCsv();
	private static final Random RANDOM = new Random();
	private static final int START_CARD_COUNT = 7;

	private Stack<UnoCard> drawStack;
	private Stack<UnoCard> discardStack;

	private List<UnoUserState> userStates;
	private int currentUserIndex;
	private boolean isDrawPossible;
	private int drawCount;

	private UnoCardColor colorOverride;
	private Direction gameDirection;

	public UnoGameSession(HashMap<String, String> userToSessionIdMap) {
		this.userStates = new ArrayList<>();
		userToSessionIdMap.entrySet().stream().forEach(e -> userStates.add(new UnoUserState(e.getKey(), e.getValue())));

		this.currentUserIndex = RANDOM.nextInt(0, this.userStates.size() - 1);
		this.isDrawPossible = true;
		this.drawCount = 0;
		this.gameDirection = Direction.CLOCKWISE;
		this.discardStack = new Stack<>();

		copyDeckAndShuffle();
		dealCardsToUsers(START_CARD_COUNT);
		drawCenterCard();
	}

	private void drawCenterCard() {
		UnoCard card = drawCardFromStack();
		List<UnoCard> specialCards = new ArrayList<>();
		while (!isSpecialCard(card)) {
			specialCards.add(card);
			card = drawCardFromStack();
		}
		this.drawStack.addAll(specialCards);
		this.discardStack.add(drawCardFromStack());
	}

	private UnoCard drawCardFromStack() {
		if (!this.drawStack.isEmpty()) {
			return drawStack.pop();
		} else {
			UnoCard centerCard = this.discardStack.pop();
			this.drawStack.addAll(this.discardStack);
			this.discardStack.clear();
			Collections.shuffle(this.drawStack);
			this.discardStack.add(centerCard);
			return drawStack.pop();
		}
	}

	public boolean makeMove(String user, int cardId, UnoCardColor color) {
		for (int i = 0; i < userStates.size(); i++) {
			UnoUserState userState = userStates.get(i);
			boolean isUserTurn = i == currentUserIndex;
			if (userState.getUserNickName().equals(user) && isUserTurn) {
				Optional<UnoCard> cardOpt = userState.findCardById(cardId);
				if (cardOpt.isPresent()) {
					UnoCard card = cardOpt.get();
					UnoCard centerCard = getCenterCard();
					if (centerCard.isValidMoveOnTop(card) || card.getColor().equals(colorOverride)) {
						if (drawCount == 0 || isDrawCard(card)) {
							userState.removeCard(card);
							discardStack.add(card);
							checkForSpecialEffects(card);
							nextUser();
							this.colorOverride = color;
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	private boolean isDrawCard(UnoCard card) {
		return card.getCardType().equals(UnoCardType.DRAW_FOUR) || card.getCardType().equals(UnoCardType.DRAW_TWO);
	}

	private boolean isSpecialCard(UnoCard card) {
		return isDrawCard(card) || card.getColor().equals(UnoCardColor.BLACK)
				|| card.getCardType().equals(UnoCardType.REVERSE) || card.getCardType().equals(UnoCardType.SKIP);
	}

	private void checkForSpecialEffects(UnoCard card) {
		switch (card.getCardType()) {
		case DRAW_FOUR:
			this.drawCount += 4;
			this.isDrawPossible = false;
			break;
		case DRAW_TWO:
			this.drawCount += 2;
			break;
		case SKIP:
			nextUser();
			break;
		case REVERSE:
			this.gameDirection = this.gameDirection.equals(Direction.CLOCKWISE) ? Direction.ANTI_CLOCKWISE
					: Direction.CLOCKWISE;
			if (this.userStates.size() == 2) {
				nextUser();
			}
			break;
		default:
			break;
		}
	}

	public boolean drawCard(String user) {
		if (this.isDrawPossible && this.drawCount == 0) {
			for (int i = 0; i < userStates.size(); i++) {
				UnoUserState userState = userStates.get(i);
				boolean isUserTurn = i == currentUserIndex;
				if (userState.getUserNickName().equals(user) && isUserTurn) {
					userState.addCard(drawCardFromStack());
					this.isDrawPossible = false;
					return true;
				}
			}
		}
		return false;
	}

	public boolean drawCards(String user) {
		if (this.isDrawPossible) {
			for (int i = 0; i < userStates.size(); i++) {
				UnoUserState userState = userStates.get(i);
				boolean isUserTurn = i == currentUserIndex;
				if (userState.getUserNickName().equals(user) && isUserTurn) {
					for (; this.drawCount > 0; this.drawCount--) {
						userState.addCard(drawCardFromStack());
					}
					this.isDrawPossible = false;
					return true;
				}
			}
		}
		return false;
	}

	public boolean pass(String user) {
		if (!this.isDrawPossible) {
			for (int i = 0; i < userStates.size(); i++) {
				UnoUserState userState = userStates.get(i);
				boolean isUserTurn = i == currentUserIndex;
				if (userState.getUserNickName().equals(user) && isUserTurn) {
					nextUser();
					return true;
				}
			}
		}
		return false;
	}

	public void nextUser() {
		if (this.gameDirection.equals(Direction.CLOCKWISE)) {
			if (currentUserIndex < userStates.size() - 1) {
				currentUserIndex++;
			} else {
				currentUserIndex = 0;
			}
		} else if (this.gameDirection.equals(Direction.ANTI_CLOCKWISE)) {
			if (currentUserIndex > 0) {
				currentUserIndex--;
			} else {
				currentUserIndex = userStates.size() - 1;
			}
		}
		this.isDrawPossible = true;
	}

	public UnoCard getCenterCard() {
		return this.discardStack.peek();
	}

	public Stack<UnoCard> getDrawStack() {
		return drawStack;
	}

	public Stack<UnoCard> getDiscardStack() {
		return discardStack;
	}

	public String[] getUsers() {
		return this.userStates.stream().map(userState -> userState.getUserNickName()).toArray(String[]::new);
	}

	public List<UnoUserState> getUserStates() {
		return userStates;
	}

	public int getCurrentUserIndex() {
		return currentUserIndex;
	}

	public Direction getGameDirection() {
		return gameDirection;
	}

	public boolean isDrawPossible() {
		return isDrawPossible;
	}

	public UnoCardColor getColorOverride() {
		return this.colorOverride;
	}

	public int getDrawCount() {
		return this.drawCount;
	}

	private void copyDeckAndShuffle() {
		List<UnoCard> deckCopy = new ArrayList<>(INITIAL_CARD_DECK);
		Collections.shuffle(deckCopy);
		this.drawStack = new Stack<>();
		this.drawStack.addAll(deckCopy);
	}

	private void dealCardsToUsers(int cardCount) {
		for (int i = 0; i < cardCount; i++) {
			for (UnoUserState userState : this.userStates) {
				if (userState != null) {
					UnoCard currentCard = drawCardFromStack();
					userState.addCard(currentCard);
				}
			}
		}
	}

	private static List<UnoCard> readUnoCardCsv() {
		List<UnoCard> cardDeck = new ArrayList<>();
		try (BufferedReader reader = Files.newBufferedReader(Paths.get("./src/main/resources/unoCards.csv"))) {
			// skip first line
			String line = reader.readLine();
			while ((line = reader.readLine()) != null) {
				String[] cells = line.split(";");
				int count = Integer.parseInt(cells[2]);
				for (int i = 0; i < count; i++) {
					cardDeck.add(new UnoCard(UnoCardColor.valueOf(cells[0]), UnoCardType.valueOf(cells[1])));
				}

			}
		} catch (IOException ioe) {
			System.err.println("Error reading file: " + ioe.getMessage());
		}
		return cardDeck;
	}

}
