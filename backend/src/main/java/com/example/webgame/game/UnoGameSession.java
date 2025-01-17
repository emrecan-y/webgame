package com.example.webgame.game;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Random;
import java.util.Stack;

import com.example.webgame.enums.Direction;
import com.example.webgame.enums.UnoCardColor;
import com.example.webgame.enums.UnoCardType;

public class UnoGameSession {
	private static final List<UnoCard> INITIAL_CARD_DECK = readUnoCardCsv();
	private static final Random RANDOM = new Random();
	private static final int START_CARD_COUNT = 7;

	private Stack<UnoCard> cardDeck;

	private String[] users;
	private int currentUserIndex;
	private HashMap<String, List<UnoCard>> userCards;

	private Direction gameDirection;

	public UnoGameSession(String[] users) {

		this.users = users;
		this.currentUserIndex = RANDOM.nextInt(0, this.users.length - 1);
		this.gameDirection = Direction.CLOCKWISE;
		this.userCards = new HashMap<>();

		copyDeckAndShuffle();
		dealCardsToUsers(START_CARD_COUNT);
	}

	private void copyDeckAndShuffle() {
		List<UnoCard> deckCopy = new ArrayList<>(INITIAL_CARD_DECK);
		Collections.shuffle(deckCopy);
		cardDeck = new Stack<>();
		cardDeck.addAll(deckCopy);
	}

	private void dealCardsToUsers(int cardCount) {
		for (int i = 0; i < cardCount; i++) {
			for (String user : this.users) {
				if (user != null) {
					UnoCard currentCard = cardDeck.pop();
					userCards.merge(user, new ArrayList<>(List.of(currentCard)), (list, newValue) -> {
						list.addAll(newValue);
						return list;
					});
				}
			}
		}
	}

	public HashMap<String, List<UnoCard>> getUserCards() {
		return userCards;
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
