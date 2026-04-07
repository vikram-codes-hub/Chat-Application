import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import { mockConversations, mockMessages } from "../data/mockData";
import api from "../services/api";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConvRaw] = useState(() => {
    const saved = localStorage.getItem("activeConversation");
    return saved ? JSON.parse(saved) : null;
  });
  const [messages, setMessages] = useState([]);
  const [isLoadingConvs, setIsLoadingConvs] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [typingMap, setTypingMap] = useState({});

  const seenMsgIds = useRef(new Set());

  // GET /api/conversations
  const fetchConversations = useCallback(async () => {
    setIsLoadingConvs(true);
    try {
      const res = await api.get("/conversations");
      const list = Array.isArray(res.data) ? res.data : (res.data.data ?? []);
      setConversations(list);
    } catch {
      setConversations([]);
    } finally {
      setIsLoadingConvs(false);
    }
  }, []);

  // Restore active conversation on mount
  useEffect(() => {
    const saved = localStorage.getItem("activeConversation");
    if (saved) {
      const conv = JSON.parse(saved);
      // Just fetch messages, don't call setActiveConversation to avoid loop
      setIsLoadingMessages(true);
      api
        .get(`/messages/${conv._id}`)
        .then((res) => {
          const list = Array.isArray(res.data)
            ? res.data
            : (res.data.data ?? []);
          setMessages(list);
        })
        .catch(() => setMessages(mockMessages[conv._id] || []))
        .finally(() => setIsLoadingMessages(false));
    }
  }, []);

  // Set active conversation + GET /api/messages/:conversationId
  const setActiveConversation = useCallback(async (conv) => {
    setActiveConvRaw(conv);
    if (conv) localStorage.setItem("activeConversation", JSON.stringify(conv));
    else localStorage.removeItem("activeConversation");
    setMessages([]);
    if (!conv) return;

    setIsLoadingMessages(true);
    try {
      const res = await api.get(`/messages/${conv._id}`);
      const list = Array.isArray(res.data) ? res.data : (res.data.data ?? []);
      setMessages(list);
    } catch {
      setMessages(mockMessages[conv._id] || []);
    } finally {
      setIsLoadingMessages(false);
    }

    // Clear unread for this conversation
    setConversations((prev) =>
      prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c)),
    );
  }, []);

  // POST /api/messages/:conversationId
  const sendMessage = useCallback(
    async (text, image = null) => {
      if (!activeConversation) return;

      const tempId = `temp_${Date.now()}`;
      const tempMsg = {
        _id: tempId,
        senderId: "me",
        text,
        image,
        createdAt: new Date().toISOString(),
        status: "sending",
      };

      setMessages((prev) => [...prev, tempMsg]);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConversation._id
            ? {
                ...c,
                lastMessage: {
                  text,
                  createdAt: new Date().toISOString(),
                  senderId: "me",
                },
                unreadCount: 0,
              }
            : c,
        ),
      );

      try {
        const res = await api.post(`/messages/${activeConversation._id}`, {
          text,
          image,
        });
        seenMsgIds.current.add(res.data._id);
        setMessages((prev) =>
          prev.map((m) => (m._id === tempId ? res.data : m)),
        );
        // Refetch so sidebar shows new conversation if first message
        fetchConversations();
      } catch {
        setMessages((prev) =>
          prev.map((m) => (m._id === tempId ? { ...m, status: "failed" } : m)),
        );
        toast.error("Failed to send message");
      }
    },
    [activeConversation, fetchConversations],
  );

  // Socket: receive incoming message
const receiveMessage = useCallback(
  (msg) => {
    if (seenMsgIds.current.has(msg._id)) return;
    seenMsgIds.current.add(msg._id);

    // Only append to messages if it belongs to the active conversation
    if (msg.conversationId === activeConversation?._id) {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    }

    setConversations((prev) => {
      const exists = prev.find((c) => c._id === msg.conversationId);
      if (exists) {
        return prev.map((c) =>
          c._id === msg.conversationId
            ? {
                ...c,
                lastMessage: msg,
                unreadCount:
                  c._id === activeConversation?._id
                    ? 0
                    : (c.unreadCount || 0) + 1,
              }
            : c
        );
      }
      fetchConversations();
      return prev;
    });
  },
  [activeConversation, fetchConversations]
);

  // Typing indicators
  const setTyping = useCallback((convId, userId, val) => {
    setTypingMap((prev) => ({ ...prev, [`${convId}_${userId}`]: val }));
  }, []);

  const isTypingInConv = (convId) =>
    Object.entries(typingMap).some(([k, v]) => k.startsWith(`${convId}_`) && v);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        isLoadingConvs,
        isLoadingMessages,
        fetchConversations,
        setActiveConversation,
        sendMessage,
        receiveMessage,
        setTyping,
        isTypingInConv,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
