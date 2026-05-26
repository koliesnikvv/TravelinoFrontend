import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:8000/api',
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            const refresh = localStorage.getItem('refresh');
            if (!refresh) {
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post('http://localhost:8000/api/users/token/refresh/', { refresh });
                localStorage.setItem('access', response.data.access);
                original.headers.Authorization = `Bearer ${response.data.access}`;
                return client(original);
            } catch {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default client;