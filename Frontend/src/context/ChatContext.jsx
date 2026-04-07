import { createContext, useContext, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { mockConversations, mockMessages } from "../data/mockData";
import api from "../services/api";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [conversations,      setConversations]      = useState([]);
  const [activeConversation, setActiveConvRaw]      = useState(null);
  const [messages,           setMessages]           = useState([]);
  const [isLoadingConvs,     setIsLoadingConvs]     = useState(false);
  const [isLoadingMessages,  setIsLoadingMessages]  = useState(false);
  const [typingMap,          setTypingMap]          = useState({});

  // Tracks delivered message IDs so duplicate socket events (e.g. room + direct
  // emit) never increment unreadCount more than once per message.
  const seenMsgIds = useRef(new Set());

  // GET /api/conversations
  const fetchConversations = useCallback(async () => {
    setIsLoadingConvs(true);
    try {
      const res = await api.get("/conversations");
      setConversations(res.data.data ?? []);
    } catch {
      setConversations(mockConversations);
    } finally {
      setIsLoadingConvs(false);
    }
  }, []);

  // Set active conversation + GET /api/messages/:conversationId
  const setActiveConversation = useCallback(async (conv) => {
    setActiveConvRaw(conv);
    setMessages([]);
    if (!conv) return;

    setIsLoadingMessages(true);
    try {
      const res = await api.get(`/messages/${conv._id}`);
      setMessages(res.data.data ?? []);
    } catch {
      setMessages(mockMessages[conv._id] || []);
    } finally {
      setIsLoadingMessages(false);
    }

    // Clear unread for this conversation
    setConversations((prev) =>
      prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  // POST /api/messages/:conversationId
  const sendMessage = useCallback(async (text, image = null) => {
    if (!activeConversation) return;

    const tempId = `temp_${Date.now()}`;
    const tempMsg = {
      _id: tempId, senderId: "me", text, image,
      createdAt: new Date().toISOString(), status: "sending",
    };

    setMessages((prev) => [...prev, tempMsg]);
    setConversations((prev) =>
      prev.map((c) =>
        c._id === activeConversation._id
          ? { ...c, lastMessage: { text, createdAt: new Date().toISOString(), senderId: "me" }, unreadCount: 0 }
          : c
      )
    );

    try {
      const res = await api.post(`/messages/${activeConversation._id}`, { text, image });
      seenMsgIds.current.add(res.data._id);
      setMessages((prev) => prev.map((m) => (m._id === tempId ? res.data : m)));
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? { ...m, status: "failed" } : m))
      );
      toast.error("Failed to send message");
    }
  }, [activeConversation]);

  // Socket: receive incoming message
  const receiveMessage = useCallback((msg) => {
    // Guard 1: seenMsgIds ref — blocks duplicates from double socket emits
    // (room broadcast + direct emit) and messages the sender already received
    // via HTTP response.
    if (seenMsgIds.current.has(msg._id)) return;
    seenMsgIds.current.add(msg._id);

    setMessages((prev) => {
      // Guard 2: if the _id already exists in the list (race: socket beat HTTP
      // response, REST code replaced tempMsg first), silently skip.
      if (prev.some((m) => m._id === msg._id)) return prev;
      return [...prev, msg];
    });
    setConversations((prev) =>
      prev.map((c) =>
        c._id === msg.conversationId
          ? { ...c, lastMessage: msg, unreadCount: (c.unreadCount || 0) + 1 }
          : c
      )
    );
  }, []);

  // Typing indicators
  const setTyping = useCallback((convId, userId, val) => {
    setTypingMap((prev) => ({ ...prev, [`${convId}_${userId}`]: val }));
  }, []);

  const isTypingInConv = (convId) =>
    Object.entries(typingMap).some(([k, v]) => k.startsWith(`${convId}_`) && v);

  return (
    <ChatContext.Provider value={{
      conversations, activeConversation, messages,
      isLoadingConvs, isLoadingMessages,
      fetchConversations, setActiveConversation,
      sendMessage, receiveMessage,
      setTyping, isTypingInConv,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);