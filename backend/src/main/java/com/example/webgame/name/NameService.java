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
	List<String> adjectives = new ArrayList<>();
	List<String> names = new ArrayList<>();

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
		sb.append(adjectives.get(r.nextInt(adjectives.size())));
		sb.append(names.get(r.nextInt(names.size())));
		if (r.nextBoolean()) {
			sb.append(r.nextInt(10, 99));
		}
		return sb.toString();
	}

}
