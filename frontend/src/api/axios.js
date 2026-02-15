import axios from 'axios';

// Hardcoded URLs to prevent environment variable issues
const PRODUCTION_URL = 'https://xpression-backend.onrender.com/api';
const LOCAL_URL = 'http://localhost:5000/api';

// Determine URL based on hostname
const baseURL = window.location.hostname === 'localhost' ? LOCAL_URL : PRODUCTION_URL;

console.log('CRITICAL: Forcing API URL to:', baseURL);

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
