import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Send, Smile, X } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import { useSocket } from "../../hooks/useSocket";

const MessageInput = ({ conversationId }) => {
  const [text,         setText]         = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending,    setIsSending]    = useState(false);
  const fileRef       = useRef(null);
  const typingTimeout = useRef(null);

  const { sendMessage }              = useChat();
  const { emitTyping, emitStopTyping } = useSocket() || {};

  const handleChange = (val) => {
    setText(val);
    emitTyping?.(conversationId);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitStopTyping?.(conversationId), 1500);
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSend = useCallback(async () => {
    if (!text.trim() && !imagePreview) return;
    setIsSending(true);
    emitStopTyping?.(conversationId);
    await sendMessage(text.trim(), imagePreview);
    setText("");
    setImagePreview(null);
    setIsSending(false);
  }, [text, imagePreview, conversationId, sendMessage, emitStopTyping]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const canSend = (text.trim() || imagePreview) && !isSending;

  return (
    <div style={{ padding: "10px 16px 14px", borderTop: "1px solid var(--border-base)", background: "var(--bg-header)", flexShrink: 0 }}>
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: 8, position: "relative", display: "inline-block" }}
          >
            <img src={imagePreview} alt="preview" style={{ height: 72, borderRadius: 8, objectFit: "cover", border: "1px solid var(--border-subtle)" }} />
            <button onClick={() => setImagePreview(null)}
              style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#ef4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={11} color="#fff" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => fileRef.current?.click()}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
        >
          <Paperclip size={15} color="var(--text-muted)" />
        </motion.button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImage} />

        <div style={{ flex: 1, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: 22, padding: "9px 14px", display: "flex", alignItems: "flex-end", gap: 8 }}>
          <textarea
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message..."
            rows={1}
            style={{ flex: 1, background: "transparent", border: "none", color: "var(--text-primary)", fontSize: 14, outline: "none", resize: "none", lineHeight: 1.5, fontFamily: "var(--font-sans)", maxHeight: 120, overflowY: "auto" }}
          />
          <Smile size={16} color="var(--text-muted)" style={{ cursor: "pointer", flexShrink: 0, marginBottom: 1 }} />
        </div>

        <motion.button
          whileHover={{ scale: canSend ? 1.08 : 1 }} whileTap={{ scale: canSend ? 0.92 : 1 }}
          onClick={handleSend}
          disabled={!canSend}
          style={{ width: 38, height: 38, borderRadius: "50%", background: canSend ? "var(--accent)" : "var(--bg-elevated)", border: canSend ? "none" : "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", cursor: canSend ? "pointer" : "default", flexShrink: 0, transition: "background 0.2s" }}
        >
          <Send size={15} color={canSend ? "#fff" : "var(--text-muted)"} />
        </motion.button>
      </div>
    </div>
  );
};

export default MessageInput;