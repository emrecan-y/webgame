package com.example.webgame.session;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.webgame.record.LoginRequest;

@RestController
@CrossOrigin(origins = "*")
public class SessionController {

	private SessionService sessionService;

	public SessionController(SessionService sessionService) {
		this.sessionService = sessionService;
	}

	@MessageMapping("/login")
	@SendToUser("/queue/login/user-name")
	public String login(@Header("simpSessionId") String sessionId, LoginRequest request) throws Exception {
		if (this.sessionService.addUser(sessionId, request.nickName())) {
			return request.nickName();
		} else {
			return "";
		}
	}

}
