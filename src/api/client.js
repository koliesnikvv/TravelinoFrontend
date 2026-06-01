import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:8000/api',
});

let refreshPromise = null;

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

            if (!refreshPromise) {
                refreshPromise = axios
                    .post('http://localhost:8000/api/users/token/refresh/', { refresh })
                    .then((res) => {
                        localStorage.setItem('access', res.data.access);
                        return res.data.access;
                    })
                    .catch((err) => {
                        localStorage.removeItem('access');
                        localStorage.removeItem('refresh');
                        window.location.href = '/login';
                        return Promise.reject(err);
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            try {
                const newToken = await refreshPromise;
                original.headers.Authorization = `Bearer ${newToken}`;
                return client(original);
            } catch {
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default client;