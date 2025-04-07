import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002/api';

// Case status and priority enums to match backend
export const CaseStatus = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  UNDER_REVIEW: 'UNDER_REVIEW',
  ON_HOLD: 'ON_HOLD',
  CLOSED: 'CLOSED',
};

export const CasePriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
};

// Helper function to handle API errors
const handleApiError = error => {
  if (error.response) {
    throw new Error(error.response.data.error || 'An error occurred');
  }
  throw error;
};

// Main case service functions
export const getAllCases = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await axios.get(`${API_BASE_URL}/cases?${queryParams.toString()}`, {
      headers: API_HEADERS,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getCaseById = async caseId => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cases/${caseId}`, { headers: API_HEADERS });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createCase = async caseData => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cases`, caseData, { headers: API_HEADERS });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateCase = async (caseId, updateData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/cases/${caseId}`, updateData, {
      headers: API_HEADERS,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// New status workflow functions
export const assignCase = async (caseId, userId, notes = '') => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/cases/${caseId}/assign`,
      { user_id: userId, notes },
      { headers: API_HEADERS }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updatePriority = async (caseId, priority, notes = '') => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/cases/${caseId}/priority`,
      { priority, notes },
      { headers: API_HEADERS }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getCaseHistory = async caseId => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cases/${caseId}/history`, {
      headers: API_HEADERS,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Timeline functions
export const addTimelineEvent = async (caseId, eventData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cases/${caseId}/timeline`, eventData, {
      headers: API_HEADERS,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Document functions
export const addDocument = async (caseId, documentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cases/${caseId}/documents`, documentData, {
      headers: API_HEADERS,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Next steps functions
export const addNextStep = async (caseId, stepData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cases/${caseId}/next-steps`, stepData, {
      headers: API_HEADERS,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateNextStep = async (caseId, stepId, updateData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/cases/${caseId}/next-steps/${stepId}`,
      updateData,
      { headers: API_HEADERS }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
