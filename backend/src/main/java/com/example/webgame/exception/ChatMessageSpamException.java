package com.example.webgame.exception;

import java.util.Optional;

public class ChatMessageSpamException extends RuntimeException {

	private static final long serialVersionUID = 3027105552942371733L;

	private Optional<Integer> remainingCoolDownInSeconds;

	public ChatMessageSpamException(String message) {
		super(message);
		this.remainingCoolDownInSeconds = Optional.empty();
	}

	public ChatMessageSpamException(String message, Integer remainingCoolDownInSeconds) {
		super(message);
		this.remainingCoolDownInSeconds = Optional.ofNullable(remainingCoolDownInSeconds);
	}

	public Optional<Integer> getRemainingCoolDownInSeconds() {
		return remainingCoolDownInSeconds;
	}
}
