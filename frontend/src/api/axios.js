import axios from 'axios';

// Hardcoded URLs as fallback
const PRODUCTION_URL = 'https://xpression-backend.onrender.com';
const LOCAL_URL = 'http://localhost:5000';

// priority: 1. Env Var, 2. Production URL (if not localhost), 3. Local URL
let currentUrl = import.meta.env.VITE_API_BASE_URL;

if (!currentUrl) {
    currentUrl = window.location.hostname === 'localhost' ? LOCAL_URL : PRODUCTION_URL;
}

// Remove trailing slash if present
if (currentUrl.endsWith('/')) {
    currentUrl = currentUrl.slice(0, -1);
}

// FORCE append /api if not present
if (!currentUrl.endsWith('/api')) {
    currentUrl += '/api';
}

console.log('CRITICAL DEBUG: Final API URL is:', currentUrl);

const api = axios.create({
    baseURL: currentUrl,
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
