// Make sure API_BASE_URL includes the context path
const API_BASE_URL = "http://localhost:8081/api";

// Auth endpoints
const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  GOOGLE: `${API_BASE_URL}/auth/google` ,
};

// User endpoints
const USER_ENDPOINTS = {
  GET_PROFILE: `${API_BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
};

// Export all API endpoints
export {
  API_BASE_URL,
  AUTH_ENDPOINTS,
  USER_ENDPOINTS
};

export const RESOURCES = {
  LIST:    `${API_BASE_URL}/resources`,
  UPLOAD:  `${API_BASE_URL}/resources/upload`,
  UPDATE:  (id) => `${API_BASE_URL}/resources/${id}`,
  DELETE:  (id) => `${API_BASE_URL}/resources/${id}`,
  UPDATE_UPLOAD: (id) => `${API_BASE_URL}/resources/${id}/upload`,
};

