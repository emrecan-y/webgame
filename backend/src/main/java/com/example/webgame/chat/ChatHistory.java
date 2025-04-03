package com.example.webgame.chat;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import com.example.webgame.exception.ChatMessageSpamException;

public class ChatHistory {

	private final LinkedList<ChatMessage> history;

	private static final int MAX_MESSAGES_IN_TIME_FRAME = 7;
	private static final int TIME_FRAME_IN_SECONDS = 30;

	public ChatHistory() {
		this.history = new LinkedList<ChatMessage>();
	}

	public List<ChatMessage> getHistory() {
		return history;
	}

	public void addNewMessage(ChatMessage message) {
		checkSpam(message);
		history.add(message);
	}

	public void deleteOldMessages(int timeDeltaInMinutes) {
		LocalDateTime cutOffTime = LocalDateTime.now().minusMinutes(timeDeltaInMinutes);

		while (history.peek() != null && cutOffTime.isAfter(history.peek().getTimeOfCreation())) {
			history.pop();
		}
	}

	private void checkSpam(ChatMessage newMessage) {
		String senderName = newMessage.getSenderName();
		LocalDateTime timeWindowLimit = newMessage.getTimeOfCreation().minusSeconds(TIME_FRAME_IN_SECONDS);

		Iterator<ChatMessage> iterator = history.descendingIterator();
		int senderTimeFrameMessageCount = 0;
		while (iterator.hasNext()) {
			ChatMessage message = iterator.next();
			if (message.getTimeOfCreation().isBefore(timeWindowLimit)) {
				break;
			}
			if (message.getSenderName().equals(senderName)) {
				senderTimeFrameMessageCount++;
			}
			if (senderTimeFrameMessageCount >= MAX_MESSAGES_IN_TIME_FRAME) {
				int secondsToWait = (int) Duration.between(timeWindowLimit, message.getTimeOfCreation()).toSeconds();
				throw new ChatMessageSpamException(String
						.format("Please don't spam in the chat! Wait %ds before the next message.", secondsToWait),
						secondsToWait);
			}
		}

	}

}
