package com.example.webgame.name;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/name")
@CrossOrigin(origins = "*")
public class NameController {

	private NameService nameService;

	public NameController(NameService nameService) {
		this.nameService = nameService;
	}

	@GetMapping("/random")
	public ResponseEntity<String> getRandomName() {
		return new ResponseEntity<>(nameService.getRandomName(), HttpStatusCode.valueOf(200));
	}
}
