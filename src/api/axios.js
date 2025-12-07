import axios from 'axios';

// Byt till den bas-URL som din Backend körs på (t.ex. 7091)
const api = axios.create({
    baseURL: 'https://localhost:7091/api', 
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor: Lägger till JWT-token i alla utgående förfrågningar
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Lägger till token i headern som 'Authorization: Bearer <token>'
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;