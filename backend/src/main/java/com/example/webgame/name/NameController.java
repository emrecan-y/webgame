package com.example.webgame.name;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
public class NameController {

	private NameService nameService;

	public NameController(NameService nameService) {
		this.nameService = nameService;
	}

	@MessageMapping("/random-name")
	@SendToUser("/queue/random-name")
	public String getRandomName() {
		return nameService.getRandomName();
	}
}
