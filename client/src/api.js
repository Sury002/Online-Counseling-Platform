import axios from 'axios';


const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


API.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;
    
    
    if (config.url.includes('/notes/') && response?.status === 404) {
      
      return Promise.resolve({ data: null });
    }
    
    
    return Promise.reject(error);
  }
);

export { API };