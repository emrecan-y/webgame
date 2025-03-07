package com.example.webgame.exception;

public class SessionIdNotRegisteredException extends RuntimeException {

	private static final long serialVersionUID = -3662816575405955217L;

	public SessionIdNotRegisteredException(String message) {
		super(message);
	}

}
