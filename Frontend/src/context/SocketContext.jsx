import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { authUser }  = useAuth();
  const socketRef     = useRef(null);
  const [socket,      setSocket]      = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!authUser) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      setOnlineUsers([]);
      return;
    }

    const s = io(SOCKET_URL, {
      withCredentials: true,           // sends httpOnly cookie
      query: { userId: authUser._id }, // dev fallback
    });

    s.on("connect", () => {
      socketRef.current = s;
      setSocket(s);
      s.emit("setOnline");
      console.log("Socket connected:", s.id);
    });

    s.on("onlineUsers",        (users) => setOnlineUsers(users));
    s.on("userStatusChanged",  ({ userId, status }) => {
      // Could update individual user statuses here if needed
    });
    s.on("disconnect", () => {
      setSocket(null);
    });

    return () => {
      s.emit("setOffline");
      s.disconnect();
    };
  }, [authUser]);

  const emitTyping     = (convId) => socketRef.current?.emit("typing",          { conversationId: convId });
  const emitStopTyping = (convId) => socketRef.current?.emit("stopTyping",      { conversationId: convId });
  const joinConversation  = (convId) => socketRef.current?.emit("joinConversation",  { conversationId: convId });
  const leaveConversation = (convId) => socketRef.current?.emit("leaveConversation", { conversationId: convId });
  const markSeen = (convId, msgId) => socketRef.current?.emit("markSeen", { conversationId: convId, messageId: msgId });
  const isUserOnline = (userId) => onlineUsers.includes(userId);

  return (
    <SocketContext.Provider value={{
      socket, onlineUsers,
      emitTyping, emitStopTyping,
      joinConversation, leaveConversation,
      markSeen, isUserOnline,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);