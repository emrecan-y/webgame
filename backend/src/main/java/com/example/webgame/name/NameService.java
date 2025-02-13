package com.example.webgame.name;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;

@Service
public class NameService {
	private static final int MIN_NAME_LENGTH = 4;
	private static final int MAX_NAME_LENGTH = 14;
	private List<String> adjectives = new ArrayList<>();
	private List<String> names = new ArrayList<>();

	public NameService() {
		try (InputStream inputStream = NameService.class.getResourceAsStream("/names.csv");
				BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
			String[] adjectives = reader.readLine().split(";");
			String[] names = reader.readLine().split(";");

			IntStream.range(1, adjectives.length).forEach((i) -> this.adjectives.add(adjectives[i]));
			IntStream.range(1, names.length).forEach((i) -> this.names.add(names[i]));

		} catch (IOException ioe) {
			System.err.println("Error reading file: " + ioe.getMessage());
			adjectives.addAll(List.of(new String[] { "Grumpy", "Chubby" }));
			names.addAll(List.of(new String[] { "Banana", "Apple" }));
		}
	}

	public String getRandomName() {
		StringBuilder sb = new StringBuilder();
		Random r = new Random();

		while (true) {
			sb.append(adjectives.get(r.nextInt(adjectives.size())));
			sb.append(names.get(r.nextInt(names.size())));
			if (r.nextBoolean()) {
				sb.append(r.nextInt(1, 99));
			}
			String name = sb.toString();
			if (name.length() >= MIN_NAME_LENGTH && name.length() <= MAX_NAME_LENGTH) {
				return name;
			} else {
				sb = new StringBuilder();
			}
		}
	}

	public static int getMaxNameLength() {
		return MAX_NAME_LENGTH;
	}

	public static int getMinNameLength() {
		return MIN_NAME_LENGTH;
	}

}
