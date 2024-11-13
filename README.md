# webgame

I want to use this repository to build a Webgame using Spring-Boot and React. My goal is to get to learn more about bidirectional communication in Web-Development

# Requirements

The requirements i chose for this project are;

- a lobby system, where you can create or joint existing lobbies
- a lobby chat
- simple multiplayer game

# development journey

## chat

Because i never used a websocket, i wanted to start implementig simple chatting function to test out a websocket using STOMP.
ToDo;

- implementing websocket in react and spring
- a buffer mechanism to only load the latest messages and only get the older ones if needed
