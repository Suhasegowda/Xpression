import axios from 'axios';

// Hardcode the backend URL as a failsafe if env var is missing
let baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://xpression-backend.onrender.com';

// Ensure no trailing slash
if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
}

// Append /api if not present
if (!baseUrl.endsWith('/api')) {
    baseUrl += '/api';
}

console.log('Final Configured API URL:', baseUrl);

const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('API Base URL:', api.defaults.baseURL); // Debug log

// Add a request interceptor to include token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Assuming we store token in localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
