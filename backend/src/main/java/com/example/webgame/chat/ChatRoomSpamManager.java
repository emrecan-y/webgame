package com.example.webgame.chat;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Component;

import com.example.webgame.exception.ChatMessageSpamException;

@Component
public class ChatRoomSpamManager {
	private static final int MAX_MESSAGES_IN_TIME_FRAME = 4;
	private static final int TIME_FRAME_IN_SECONDS = 10;
	private static final int SPAMMER_TIMEOUT_IN_SECONDS = 30;

	private HashMap<String, LocalDateTime> nickNameSet = new HashMap<>();
	private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

	public void addSpammer(ChatMessage message, int coolDownInSeconds) {
		this.nickNameSet.put(message.getSenderName(), message.getTimeOfCreation());

		scheduler.schedule(() -> {
			this.nickNameSet.remove(message.getSenderName());
		}, coolDownInSeconds, TimeUnit.SECONDS);
	}

	public Optional<Integer> getRemainigCoolDownInSeconds(String nickName, int coolDownInSeconds) {
		LocalDateTime coolDownStart = nickNameSet.get(nickName);
		if (coolDownStart != null) {
			return Optional
					.of(coolDownInSeconds - (int) Duration.between(coolDownStart, LocalDateTime.now()).getSeconds());
		}
		return Optional.empty();
	}

	public void checkSpam(ChatMessage newMessage, ChatHistory history) {
		checkSenderCoolDown(newMessage.getSenderName());
		checkMessageFrequencyForSpam(newMessage, history);
	}

	private void checkSenderCoolDown(String senderName) {
		Optional<Integer> remainingCoolDownInSecondsOpt = this.getRemainigCoolDownInSeconds(senderName,
				SPAMMER_TIMEOUT_IN_SECONDS);

		if (remainingCoolDownInSecondsOpt.isPresent()) {
			int seconds = remainingCoolDownInSecondsOpt.get();
			throw new ChatMessageSpamException(
					String.format("You have spammed in the chat, %s seconds remaining.", seconds));
		}
	}

	private void checkMessageFrequencyForSpam(ChatMessage newMessage, ChatHistory history) {
		String senderName = newMessage.getSenderName();
		LocalDateTime timeWindowLimit = newMessage.getTimeOfCreation().minusSeconds(TIME_FRAME_IN_SECONDS);

		Iterator<ChatMessage> iterator = history.getHistory().descendingIterator();
		int senderTimeFrameMessageCount = 0;

		while (iterator.hasNext()) {
			ChatMessage message = iterator.next();
			if (message.getTimeOfCreation().isBefore(timeWindowLimit)) {
				break;
			}
			if (message.getSenderName().equals(senderName)) {
				senderTimeFrameMessageCount++;
			}
			if (senderTimeFrameMessageCount >= MAX_MESSAGES_IN_TIME_FRAME) {
				this.addSpammer(message, SPAMMER_TIMEOUT_IN_SECONDS);
				throw new ChatMessageSpamException(
						String.format("Please don't spam in the chat! Wait %ds before the next message.",
								SPAMMER_TIMEOUT_IN_SECONDS),
						SPAMMER_TIMEOUT_IN_SECONDS);
			}
		}
	}
}
