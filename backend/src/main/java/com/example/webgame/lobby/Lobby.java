package com.example.webgame.lobby;

import java.util.Arrays;
import java.util.stream.Stream;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Lobby {
	private static int idCount = 0;
	private int id;
	private boolean privateLobby;
	@JsonIgnore
	private String password;
	private String[] users;

	public Lobby(String password, int size) {
		this.id = idCount++;
		this.password = password;
		this.privateLobby = password.equals("") ? false : true;
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

	public boolean isPrivate() {
		return privateLobby;
	}

	public void setPrivate(boolean privateLobby) {
		this.privateLobby = privateLobby;
	}

	public boolean containsUser(String userName) {
		return Stream.of(this.users).anyMatch((u) -> u != null && u.equals(userName));
	}

	public boolean addUser(String newUserName) {
		if (this.containsUser(newUserName)) {
			return false;
		}
		for (int i = 0; i < users.length; i++) {
			if (users[i] == null) {
				users[i] = newUserName;
				return true;
			}
		}
		return false;
	}

	public boolean removeUser(String nickName) {
		for (int i = 0; i < users.length; i++) {
			if (users[i].equals(nickName)) {
				users[i] = null;
				return true;
			}
		}
		return false;
	}

	public boolean isEmpty() {
		for (int i = 0; i < users.length; i++) {
			if (users[i] != null) {
				return false;
			}
		}
		return true;
	}

}
