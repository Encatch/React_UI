import axios from 'axios';

// Set your local backend URL here
const BASE_URL = 'http://localhost:3002/api/';

const api = axios.create({
  baseURL: BASE_URL,
 // withCredentials: true, // if you need to send cookies/auth headers
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiGet = (endpoint, config = {}) => api.get(endpoint, config).then(res => res.data);
export const apiPost = (endpoint, data, config = {}) => api.post(endpoint, data, config).then(res => res.data);
export const apiPut = (endpoint, data, config = {}) => api.put(endpoint, data, config).then(res => res.data);
export const apiDelete = (endpoint, config = {}) => api.delete(endpoint, config).then(res => res.data);

export default api; 