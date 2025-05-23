package com.example.webgame.chat;

import java.time.LocalDateTime;
import java.util.LinkedList;

public class ChatHistory {
	private final LinkedList<ChatMessage> history;

	public ChatHistory() {
		this.history = new LinkedList<ChatMessage>();
	}

	public LinkedList<ChatMessage> getHistory() {
		return history;
	}

	public void addNewMessage(ChatMessage message) {
		history.add(message);
	}

	public void deleteOldMessages(int timeDeltaInMinutes) {
		LocalDateTime cutOffTime = LocalDateTime.now().minusMinutes(timeDeltaInMinutes);

		while (history.peek() != null && cutOffTime.isAfter(history.peek().getTimeOfCreation())) {
			history.pop();
		}
	}

}
