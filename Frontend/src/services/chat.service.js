export const getConversationsApi = async () => {
  console.log('Mock getConversationsApi call');
  return new Promise((resolve) => setTimeout(() => resolve({ 
    data: [
      { _id: '1', name: 'General Room', lastMessage: { content: 'Hello!' }, updatedAt: new Date().toISOString() },
      { _id: '2', name: 'Dev Team', lastMessage: { content: 'Deploying now...' }, updatedAt: new Date().toISOString() }
    ] 
  }), 500));
};

export const getMessagesApi = async (conversationId) => {
  console.log('Mock getMessagesApi call for', conversationId);
  return new Promise((resolve) => setTimeout(() => resolve({ 
    data: [
      { _id: 'm1', content: 'Hey there!', sender: { _id: '2', name: 'John Doe' }, createdAt: new Date(Date.now() - 100000).toISOString() },
      { _id: 'm2', content: 'Ready for the meeting?', sender: { _id: '1', name: 'Test User' }, createdAt: new Date().toISOString() }
    ] 
  }), 500));
};

export const sendMessageApi = async (data) => {
  console.log('Mock sendMessageApi call', data);
  return new Promise((resolve) => setTimeout(() => resolve({ 
    data: { 
      _id: Math.random().toString(36).substring(7), 
      content: data.content || 'New message', 
      sender: { _id: '1', name: 'Test User' },
      conversationId: data.chatId,
      createdAt: new Date().toISOString() 
    } 
  }), 500));
};
