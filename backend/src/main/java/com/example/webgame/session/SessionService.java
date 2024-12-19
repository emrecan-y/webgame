package com.example.webgame.session;

import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class SessionService {

	private HashMap<String, String> userNameToSessionId = new HashMap<>();

	public SessionService() {
	}

	public boolean userExists(String userName) {
		return this.userNameToSessionId.containsKey(userName);
	}

	public boolean addUser(String userName, String sessionId) {
		if (userExists(userName)) {
			return false;
		} else {
			this.userNameToSessionId.put(userName, sessionId);
			return true;
		}
	}

	public void deleteUserBySessionId(String sessionId) {
		Optional<Entry<String, String>> entry = userNameToSessionId.entrySet().stream()
				.filter(e -> e.getValue().equals(sessionId)).findAny();
		if (entry.isPresent()) {
			userNameToSessionId.remove(entry.get().getKey());
		}
	}

	public HashMap<String, String> getUserNameToSessionId() {
		return userNameToSessionId;
	}

}
