import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WebSocketErrorContext } from "../context/WebSocketErrorContext";
import InfoPage from "../info/InfoPage";

function ConnectionError() {
  const { webSocketError } = useContext(WebSocketErrorContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!webSocketError) {
      navigate("/");
    }
  }, [webSocketError]);

  return (
    <InfoPage
      isError
      message="The connection to the server is faulty."
      autoRenewConnection
    />
  );
}

export default ConnectionError;
