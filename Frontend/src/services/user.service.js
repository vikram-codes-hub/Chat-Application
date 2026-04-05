export const updateProfileApi = async (data) => {
  console.log('Mock updateProfileApi call', data);
  return new Promise((resolve) => setTimeout(() => resolve({ data: { user: { id: '1', name: data.name || 'Test User' } } }), 500));
};