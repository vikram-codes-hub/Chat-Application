export const loginApi = async (data) => {
  console.log('Mock loginApi call', data);
  return new Promise((resolve) => setTimeout(() => resolve({ data: { user: { id: '1', name: 'Test User' }, token: 'mock-token' } }), 500));
};

export const registerApi = async (data) => {
  console.log('Mock registerApi call', data);
  return new Promise((resolve) => setTimeout(() => resolve({ data: { user: { id: '1', name: data.name || 'Test User' }, token: 'mock-token' } }), 500));
};

export const logoutApi = async () => {
  console.log('Mock logoutApi call');
  return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 500));
};

export const getMeApi = async () => {
  console.log('Mock getMeApi call');
  return new Promise((resolve) => setTimeout(() => resolve({ data: { user: { id: '1', name: 'Test User' } } }), 500));
};