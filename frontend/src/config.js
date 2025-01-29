const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  endpoints: {
    rights: '/api/legal/rights',
    chat: '/api/legal/chat',
    documents: '/api/documents',
    immigration: '/api/immigration'
  }
};

export default config; 