import api from "./api";

// GET /api/conversations
export const getConversationsApi = () => api.get("/conversations");

// POST /api/conversations
export const createConversationApi = (data) => api.post("/conversations", data);

// POST /api/conversations/group
export const createGroupApi = (data) => api.post("/conversations/group", data);

// DELETE /api/conversations/:id
export const deleteConversationApi = (id) => api.delete(`/conversations/${id}`);

// GET /api/messages/:conversationId
export const getMessagesApi = (conversationId) =>
  api.get(`/messages/${conversationId}`);

// POST /api/messages/:conversationId
export const sendMessageApi = (conversationId, data) =>
  api.post(`/messages/${conversationId}`, data);

// PUT /api/messages/:messageId/seen
export const markSeenApi = (messageId) =>
  api.put(`/messages/${messageId}/seen`);