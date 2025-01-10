const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-api.com' 
    : 'http://localhost:5001',
  basename: process.env.NODE_ENV === 'production' 
    ? '/smartProBonoAPP' 
    : '',
  endpoints: {
    rights: '/api/legal/rights',
    chat: '/api/legal/chat',
    documents: '/api/documents',
    immigration: '/api/immigration'
  }
};

export default config; 