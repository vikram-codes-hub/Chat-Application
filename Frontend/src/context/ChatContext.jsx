import { createContext, useContext, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { mockConversations, mockMessages } from "../data/mockData";
import { getConversationsApi, getMessagesApi, sendMessageApi } from "../services/chat.service";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [conversations,        setConversations]        = useState([]);
  const [activeConversation,   setActiveConversationRaw]= useState(null);
  const [messages,             setMessages]             = useState([]);
  const [isLoadingConvs,       setIsLoadingConvs]       = useState(false);
  const [isLoadingMessages,    setIsLoadingMessages]    = useState(false);
  const [typingMap,            setTypingMap]            = useState({});

  const fetchConversations = useCallback(async () => {
    setIsLoadingConvs(true);
    try {
      const res = await getConversationsApi();
      setConversations(res.data);
    } catch {
      setConversations(mockConversations); // fallback mock
    } finally {
      setIsLoadingConvs(false);
    }
  }, []);

  const setActiveConversation = useCallback(async (conv) => {
    setActiveConversationRaw(conv);
    setMessages([]);
    if (!conv) return;
    setIsLoadingMessages(true);
    try {
      const res = await getMessagesApi(conv._id);
      setMessages(res.data);
    } catch {
      setMessages(mockMessages[conv._id] || []);
    } finally {
      setIsLoadingMessages(false);
    }
    // clear unread
    setConversations((prev) =>
      prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

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
      const res = await sendMessageApi(activeConversation._id, { text, image });
      setMessages((prev) => prev.map((m) => (m._id === tempId ? res.data : m)));
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? { ...m, status: "failed" } : m))
      );
      toast.error("Failed to send");
    }
  }, [activeConversation]);

  // Socket: incoming message
  const receiveMessage = useCallback((msg) => {
    setMessages((prev) => {
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