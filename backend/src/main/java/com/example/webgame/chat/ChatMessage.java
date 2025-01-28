package com.example.webgame.chat;

public class ChatMessage {

	private String senderName;
	private String message;

	public ChatMessage(String senderName, String message) {
		this.senderName = senderName;
		this.message = message;
	}

	public String getSenderName() {
		return senderName;
	}

	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}