package com.example.webgame.chat;

import java.time.LocalDateTime;

public class ChatMessage {

	private final String senderName;
	private final String message;
	private final LocalDateTime timeOfCreation;

	public ChatMessage(String senderName, String message) {
		this.senderName = senderName;
		this.message = message;
		this.timeOfCreation = LocalDateTime.now();
	}

	public String getSenderName() {
		return senderName;
	}

	public String getMessage() {
		return message;
	}

	public LocalDateTime getTimeOfCreation() {
		return timeOfCreation;
	}

}