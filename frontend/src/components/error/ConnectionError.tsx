import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WebSocketErrorContext } from "../context/WebSocketErrorContext";
import ErrorPopUp from "./ErrorPopUp";

function ConnectionError() {
  const { webSocketError } = useContext(WebSocketErrorContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!webSocketError) {
      navigate("/");
    }
  }, [webSocketError]);

  return <ErrorPopUp mainText="The connection to the server is faulty." />;
}

export default ConnectionError;
