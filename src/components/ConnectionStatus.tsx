import { useEffect, useState } from "react";
import { socketService } from "../services/socket.service";

export const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const socket = socketService.getSocket();

    setIsConnected(socket.connected);
    setIsReconnecting(!socket.connected);

    const handleConnect = () => {
      setIsConnected(true);
      setIsReconnecting(false);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setIsReconnecting(true); // Start showing reconnecting immediately
    };

    const handleReconnectAttempt = () => {
      setIsReconnecting(true);
    };

    const handleReconnectFailed = () => {
      setIsReconnecting(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect_attempt", handleReconnectAttempt);
    socket.on("reconnect_failed", handleReconnectFailed);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect_attempt", handleReconnectAttempt);
      socket.off("reconnect_failed", handleReconnectFailed);
    };
  }, []);

  const statusClass = isConnected
    ? "connected"
    : isReconnecting
    ? "reconnecting"
    : "disconnected";

  const statusText = isReconnecting
    ? "🔄 Reconnecting..."
    : isConnected
    ? "🟢 Connected"
    : "🔴 Disconnected";

  return <div className={`connection-status ${statusClass}`}>{statusText}</div>;
};
