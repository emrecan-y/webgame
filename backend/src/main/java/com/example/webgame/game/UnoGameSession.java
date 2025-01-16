package com.example.webgame.game;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Stack;

import com.example.webgame.enums.Direction;
import com.example.webgame.enums.UnoCardColor;
import com.example.webgame.enums.UnoCardType;

public class UnoGameSession {
	private static final List<UnoCard> INITIAL_CARD_DECK = readUnoCardCsv();

	private Stack<UnoCard> cardDeck;

	private String[] users;
	private int currentUserIndex;
	private HashMap<String, List<UnoCard>> userCards;

	private Direction gameDirection = Direction.CLOCKWISE;

	public UnoGameSession() {
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
