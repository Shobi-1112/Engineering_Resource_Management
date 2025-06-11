import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Projects API
export const projects = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  create: async (projectData: any) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  update: async (id: string, projectData: any) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// Assignments API
export const assignments = {
  getAll: async () => {
    const response = await api.get('/assignments');
    return response.data;
  },
  getMyAssignments: async () => {
    const response = await api.get('/assignments/my-assignments');
    return response.data;
  },
  create: async (assignmentData: any) => {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  },
  update: async (id: string, assignmentData: any) => {
    const response = await api.put(`/assignments/${id}`, assignmentData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },
};

export { api };
export default api; 