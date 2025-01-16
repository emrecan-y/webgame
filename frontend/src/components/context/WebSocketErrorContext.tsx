import { createContext, useState, PropsWithChildren } from "react";

interface WebSocketErrorContextType {
  webSocketError: boolean;
  setWebSocketError: (error: boolean) => void;
}

export const WebSocketErrorContext = createContext<WebSocketErrorContextType>({
  webSocketError: false,
  setWebSocketError: () => {},
});

export function WebSocketErrorProvider({ children }: PropsWithChildren) {
  const [webSocketError, setWebSocketError] = useState<boolean>(true);

  return (
    <WebSocketErrorContext.Provider value={{ webSocketError, setWebSocketError }}>
      {children}
    </WebSocketErrorContext.Provider>
  );
}
