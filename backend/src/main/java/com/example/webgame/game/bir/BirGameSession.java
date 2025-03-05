package com.example.webgame.game.bir;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Stack;

import com.example.webgame.enums.BirCardColor;
import com.example.webgame.enums.BirCardType;
import com.example.webgame.enums.Direction;

public class BirGameSession {
	private static final List<BirCard> INITIAL_CARD_DECK = readBirCardCsv();
	private static final Random RANDOM = new Random();
	private static final int START_CARD_COUNT = 7;

	private Stack<BirCard> drawStack;
	private Stack<BirCard> discardStack;

	private List<BirUserState> userStates;
	private int currentUserIndex;
	private boolean isDrawPossible;
	private int drawCount;

	private BirCardColor colorOverride;
	private Direction gameDirection;
	private boolean isGameOver;

	public BirGameSession(HashMap<String, String> userToSessionIdMap) {
		this.userStates = new ArrayList<>();
		userToSessionIdMap.entrySet().stream().forEach(e -> userStates.add(new BirUserState(e.getKey(), e.getValue())));
		init();
	}

	private void init() {
		this.currentUserIndex = RANDOM.nextInt(0, this.userStates.size());
		this.isDrawPossible = true;
		this.drawCount = 0;
		this.gameDirection = Direction.CLOCKWISE;
		this.discardStack = new Stack<>();
		this.isGameOver = false;
		this.userStates.forEach(userState -> userState.resetBir());

		copyDeckAndShuffle();
		dealCardsToUsers(START_CARD_COUNT);
		drawCenterCard();
	}

	public void restart() {
		userStates.forEach(userState -> userState.removeAllCards());
		init();
	}

	public boolean makeMove(String user, int cardId, BirCardColor color) {
		for (int i = 0; i < userStates.size(); i++) {
			BirUserState userState = userStates.get(i);
			boolean isUserTurn = i == currentUserIndex;

			if (userState.getUserNickName().equals(user)) {
				Optional<BirCard> cardOpt = userState.findCardById(cardId);
				if (cardOpt.isPresent()) {
					BirCard card = cardOpt.get();
					BirCard centerCard = getCenterCard();

					boolean isValidRegularMove = isUserTurn
							&& (centerCard.isValidMoveOnTop(card) || card.getColor().equals(colorOverride))
							&& (drawCount == 0 || card.isDrawCard());

					if (isValidRegularMove || centerCard.isValidMoveOnTopRegardlessOfTurn(card)) {
						userState.removeCard(card);
						discardStack.add(card);
						this.colorOverride = color.equals(BirCardColor.BLACK) ? null : color;
						checkForGameOver();
						if (isGameOver) {
							return true;
						} else {
							this.currentUserIndex = i;
							checkForSpecialEffects(card);
							nextUser();
							userState.resetBir();
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	public boolean drawCard(String user) {
		if (this.isDrawPossible && this.drawCount == 0) {
			for (int i = 0; i < userStates.size(); i++) {
				BirUserState userState = userStates.get(i);
				boolean isUserTurn = i == currentUserIndex;
				if (userState.getUserNickName().equals(user) && isUserTurn) {
					drawCardsForUser(userState, 1);
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
				BirUserState userState = userStates.get(i);
				boolean isUserTurn = i == currentUserIndex;
				if (userState.getUserNickName().equals(user) && isUserTurn) {
					drawCardsForUser(userState, this.drawCount);
					this.drawCount = 0;
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
				BirUserState userState = userStates.get(i);
				boolean isUserTurn = i == currentUserIndex;
				if (userState.getUserNickName().equals(user) && isUserTurn) {
					nextUser();
					userState.resetBir();
					return true;
				}
			}
		}
		return false;
	}

	public boolean bir(String user) {
		for (int i = 0; i < userStates.size(); i++) {
			BirUserState userState = userStates.get(i);
			if (userState.getUserNickName().equals(user) && !userState.hasAttemptedToDeclareBir()) {
				if (userState.getUserCards().size() == 1) {
					userState.declareBir(true);
					break;
				} else {
					userState.declareBir(false);
					drawCardsForUser(userState, 2);
					return true;
				}
			}
		}
		return false;
	}

	public BirCard getCenterCard() {
		return this.discardStack.peek();
	}

	public Stack<BirCard> getDrawStack() {
		return drawStack;
	}

	public Stack<BirCard> getDiscardStack() {
		return discardStack;
	}

	public String[] getUsers() {
		return this.userStates.stream().map(userState -> userState.getUserNickName()).toArray(String[]::new);
	}

	public List<BirUserState> getUserStates() {
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

	public BirCardColor getColorOverride() {
		return this.colorOverride;
	}

	public int getDrawCount() {
		return this.drawCount;
	}

	public boolean isGameOver() {
		return isGameOver;
	}

	private void drawCardsForUser(BirUserState userState, int drawCount) {
		while (drawCount > 0) {
			userState.addCard(drawCardFromStack());
			drawCount--;
		}
	}

	private void nextUser() {
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

	private void checkForSpecialEffects(BirCard card) {
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

	private void drawCenterCard() {
		BirCard card = drawCardFromStack();
		List<BirCard> specialCards = new ArrayList<>();
		while (card.isSpecialCard()) {
			specialCards.add(card);
			card = drawCardFromStack();
		}
		this.drawStack.addAll(specialCards);
		this.discardStack.add(card);
	}

	private BirCard drawCardFromStack() {
		if (!this.drawStack.isEmpty()) {
			return drawStack.pop();
		} else {
			BirCard centerCard = this.discardStack.pop();
			this.drawStack.addAll(this.discardStack);
			this.discardStack.clear();
			Collections.shuffle(this.drawStack);
			this.discardStack.add(centerCard);
			return drawStack.pop();
		}
	}

	private void checkForGameOver() {
		for (BirUserState userState : this.userStates) {
			if (userState.getUserCards().size() == 0) {
				if (userState.hasSuccessfullyDeclaredBir()) {
					userState.incrementWinCount();
					this.isGameOver = true;
				} else {
					drawCardsForUser(userState, 2);
				}
			}
		}
	}

	private void copyDeckAndShuffle() {
		List<BirCard> deckCopy = new ArrayList<>(INITIAL_CARD_DECK);
		Collections.shuffle(deckCopy);
		this.drawStack = new Stack<>();
		this.drawStack.addAll(deckCopy);
	}

	private void dealCardsToUsers(int cardCount) {
		for (int i = 0; i < cardCount; i++) {
			for (BirUserState userState : this.userStates) {
				if (userState != null) {
					userState.addCard(drawCardFromStack());
				}
			}
		}
	}

	private static List<BirCard> readBirCardCsv() {
		List<BirCard> cardDeck = new ArrayList<>();
		try (InputStream inputStream = BirGameSession.class.getResourceAsStream("/birCards.csv");
				BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
			// skip first line
			String line = reader.readLine();
			while ((line = reader.readLine()) != null) {
				String[] cells = line.split(";");
				int count = Integer.parseInt(cells[2]);
				for (int i = 0; i < count; i++) {
					cardDeck.add(new BirCard(BirCardColor.valueOf(cells[0]), BirCardType.valueOf(cells[1])));
				}

			}
		} catch (IOException ioe) {
			System.err.println("Error reading file: " + ioe.getMessage());
		}
		return cardDeck;
	}

}
