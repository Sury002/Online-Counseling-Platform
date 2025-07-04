import axios from 'axios';

// Create the base API instance
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Add a request interceptor to include the auth token if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle 404s for notes endpoints
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;
    
    // Check if this is a notes endpoint and 404 error
    if (config.url.includes('/notes/') && response?.status === 404) {
      // Return a resolved promise with null data for 404 on notes endpoints
      return Promise.resolve({ data: null });
    }
    
    // For all other errors, reject as normal
    return Promise.reject(error);
  }
);

export { API };