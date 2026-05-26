import client from './client';

export async function refreshAccessToken() {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) return null;

    try {
        const response = await client.post('/users/token/refresh/', { refresh });
        localStorage.setItem('access', response.data.access);
        return response.data.access;
    } catch {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return null;
    }
}