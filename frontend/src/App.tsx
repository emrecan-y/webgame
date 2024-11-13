import Chat from "./Chat";

function App() {
  return <Chat></Chat>;
}

// function App() {
//   return (
//     //Initialize Stomp connection, will use SockJS for http(s) and WebSocket for ws(s)
//     //The Connection can be used by all child components via the hooks or hocs.
//     <StompSessionProvider
//       url={"ws://localhost:8080/chat"}
//       //All options supported by @stomp/stompjs can be used here
//     >
//       <SubscribingComponent />
//       <SendingMessages />
//     </StompSessionProvider>
//   );
// }

// function SubscribingComponent() {
//   const [lastMessage, setLastMessage] = useState("No message received yet");

//   //Subscribe to /topic/test, and use handler for all received messages
//   //Note that all subscriptions made through the library are automatically removed when their owning component gets unmounted.
//   //If the STOMP connection itself is lost they are however restored on reconnect.
//   //You can also supply an array as the first parameter, which will subscribe to all destinations in the array
//   useSubscription("/topic/chat-history", (message) =>
//     setLastMessage(message.body)
//   );

//   return <div>Last Message: {lastMessage}</div>;
// }

// export function SendingMessages() {
//   //Get Instance of StompClient
//   //This is the StompCLient from @stomp/stompjs
//   //Note: This will be undefined if the client is currently not connected
//   const stompClient = useStompClient();
//   const newMessage = { senderName: "hans", message: "Halloooo" };
//   const sendMessage = () => {
//     if (stompClient) {
//       //Send Message
//       stompClient.publish({
//         destination: "/app/new-message",
//         body: JSON.stringify(newMessage),
//       });
//     } else {
//       //Handle error
//     }
//   };

//   return <button onClick={sendMessage}>Send Message</button>;
// }

export default App;
