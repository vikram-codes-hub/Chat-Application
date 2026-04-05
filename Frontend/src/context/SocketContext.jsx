import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { authUser }    = useAuth();
  const socketRef       = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket]           = useState(null);

  useEffect(() => {
    if (!authUser) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      setOnlineUsers([]);
      return;
    }

    const s = io(SOCKET_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
    });

    s.on("connect",     () => { socketRef.current = s; setSocket(s); });
    s.on("onlineUsers", (users) => setOnlineUsers(users));
    s.on("disconnect",  () => setSocket(null));

    return () => { s.disconnect(); };
  }, [authUser]);

  const emitTyping     = (convId) => socketRef.current?.emit("typing",     { conversationId: convId });
  const emitStopTyping = (convId) => socketRef.current?.emit("stopTyping", { conversationId: convId });
  const isUserOnline   = (userId) => onlineUsers.includes(userId);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, emitTyping, emitStopTyping, isUserOnline }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);