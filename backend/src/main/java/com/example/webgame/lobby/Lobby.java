package com.example.webgame.lobby;

import java.util.Arrays;

public class Lobby {
	private static int idCount = 0;
	int id;
	String password;
	String[] users;

	public Lobby(String password, int size) {
		this.id = idCount++;
		this.password = password;
		this.users = new String[size];
	}

	@Override
	public String toString() {
		return "Lobby [id=" + id + ", password=" + password + ", users=" + Arrays.toString(users) + "]";
	}

	public int getId() {
		return id;
	}

	public String getPassword() {
		return password;
	}

	public String[] getUsers() {
		return users;
	}

}
