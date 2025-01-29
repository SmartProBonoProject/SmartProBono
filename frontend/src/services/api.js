import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://smartprobono.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Legal Rights API
export const legalRightsApi = {
  getRights: async (category) => {
    try {
      const response = await api.get(`/api/legal/rights/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching legal rights:', error);
      throw error;
    }
  },
};

// Legal Chat API
export const legalChatApi = {
  sendMessage: async (message) => {
    try {
      const response = await api.post('/api/legal/chat', { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
};

// Documents API
export const documentsApi = {
  generateDocument: async (template, data) => {
    try {
      const response = await api.post('/api/documents/generate', {
        template,
        data,
      });
      return response.data;
    } catch (error) {
      console.error('Error generating document:', error);
      throw error;
    }
  },
  
  getTemplates: async () => {
    try {
      const response = await api.get('/api/documents/templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  // New document endpoints
  saveDocument: async (documentData) => {
    try {
      const response = await api.post('/api/documents/save', documentData);
      return response.data;
    } catch (error) {
      console.error('Error saving document:', error);
      throw error;
    }
  },

  getDocumentHistory: async () => {
    try {
      const response = await api.get('/api/documents/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching document history:', error);
      throw error;
    }
  },

  submitToEFiling: async (documentId, courtInfo) => {
    try {
      const response = await api.post(`/api/documents/${documentId}/efile`, courtInfo);
      return response.data;
    } catch (error) {
      console.error('Error submitting to e-filing:', error);
      throw error;
    }
  }
};

// Immigration Services API
export const immigrationApi = {
  getVisaRequirements: async (visaType) => {
    try {
      const response = await api.get(`/api/immigration/visa-requirements/${visaType}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching visa requirements:', error);
      throw error;
    }
  },
  
  submitVisaApplication: async (applicationData) => {
    try {
      const response = await api.post('/api/immigration/apply', applicationData);
      return response.data;
    } catch (error) {
      console.error('Error submitting visa application:', error);
      throw error;
    }
  },
};

// Expungement Services API
export const expungementApi = {
  checkEligibility: async (caseData) => {
    try {
      const response = await api.post('/api/expungement/check-eligibility', caseData);
      return response.data;
    } catch (error) {
      console.error('Error checking expungement eligibility:', error);
      throw error;
    }
  },

  getStateRules: async (state) => {
    try {
      const response = await api.get(`/api/expungement/rules/${state}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching state rules:', error);
      throw error;
    }
  },

  startExpungementProcess: async (caseData) => {
    try {
      const response = await api.post('/api/expungement/start', caseData);
      return response.data;
    } catch (error) {
      console.error('Error starting expungement process:', error);
      throw error;
    }
  },

  saveProgress: async (caseId, progressData) => {
    try {
      const response = await api.put(`/api/expungement/${caseId}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  },

  getRequiredDocuments: async (state, caseType) => {
    try {
      const response = await api.get(`/api/expungement/documents/${state}/${caseType}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching required documents:', error);
      throw error;
    }
  }
};

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access');
          break;
        case 403:
          // Handle forbidden
          console.error('Forbidden access');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        case 500:
          // Handle server error
          console.error('Server error');
          break;
        default:
          console.error('API error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 