import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

export const staysService = {
  checkIn: async (data) => {
    const response = await api.post('/stays/check-in', data);
    return response.data;
  },
  checkOut: async (data) => {
    const response = await api.post('/stays/check-out', data);
    return response.data;
  },
  getActive: async () => {
    const response = await api.get('/stays/active');
    return response.data;
  },
  getAll: async (skip = 0, take = 20) => {
    const response = await api.get(`/stays?skip=${skip}&take=${take}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/stays/${id}`);
    return response.data;
  },
};

export const slotsService = {
  getAll: async () => {
    const response = await api.get('/slots');
    return response.data;
  },
  getOccupancy: async () => {
    const response = await api.get('/slots/occupancy');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/slots', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/slots/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/slots/${id}`);
    return response.data;
  },
};

export const paymentsService = {
  create: async (data) => {
    const response = await api.post('/payments', data);
    return response.data;
  },
  getAll: async (skip = 0, take = 20) => {
    const response = await api.get(`/payments?skip=${skip}&take=${take}`);
    return response.data;
  },
};

export const vehiclesService = {
  getAll: async (skip = 0, take = 20) => {
    const response = await api.get(`/vehicles?skip=${skip}&take=${take}`);
    return response.data;
  },
  search: async (query) => {
    const response = await api.get(`/vehicles/search?q=${query}`);
    return response.data;
  },
  getByPlate: async (plate) => {
    const response = await api.get(`/vehicles/${plate}`);
    return response.data;
  },
};

export const subscribersService = {
  getAll: async (skip = 0, take = 20) => {
    const response = await api.get(`/subscribers?skip=${skip}&take=${take}`);
    return response.data;
  },
  getActive: async () => {
    const response = await api.get('/subscribers/active');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/subscribers', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/subscribers/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/subscribers/${id}`);
    return response.data;
  },
};

export const pricingService = {
  getActive: async () => {
    const response = await api.get('/pricing/active');
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/pricing');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/pricing', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/pricing/${id}`, data);
    return response.data;
  },
};

export const reportsService = {
  getRevenue: async (startDate, endDate) => {
    const response = await api.get(`/reports/revenue?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },
  getDaily: async (date) => {
    const response = await api.get(`/reports/daily?date=${date}`);
    return response.data;
  },
  getOccupancyHistory: async (startDate, endDate) => {
    const response = await api.get(`/reports/occupancy-history?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },
};

export default api;
