package com.example.webgame.exception;

public class ChatMessageSpamException extends RuntimeException {

	private static final long serialVersionUID = 3027105552942371733L;

	private int remainingCoolDownInSeconds;

	public ChatMessageSpamException(String message, int remainingCoolDownInSeconds) {
		super(message);
		this.remainingCoolDownInSeconds = remainingCoolDownInSeconds;
	}

	public int getRemainingCoolDownInSeconds() {
		return remainingCoolDownInSeconds;
	}
}
