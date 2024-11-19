package com.example.webgame.chat;

import java.util.LinkedList;
import java.util.List;

public class ChatHistory {

	private List<ChatMessage> history;

	public ChatHistory() {
		this.history = new LinkedList<ChatMessage>();
	}

	public List<ChatMessage> getHistory() {
		return history;
	}

	public void addNewMessage(ChatMessage message) {
		history.add(message);
	}

}
