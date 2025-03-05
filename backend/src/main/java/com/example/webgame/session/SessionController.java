package com.example.webgame.session;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.example.webgame.exception.LoginException;
import com.example.webgame.record.LoginRequest;

@Controller
public class SessionController {

	private SessionService sessionService;

	public SessionController(SessionService sessionService) {
		this.sessionService = sessionService;
	}

	@MessageMapping("/login")
	@SendToUser("/queue/login/user-name")
	public String login(@Header("simpSessionId") String sessionId, LoginRequest request) throws LoginException {
		if (this.sessionService.addUser(sessionId, request.nickName())) {
			return request.nickName();
		} else {
			return "";
		}
	}

}
