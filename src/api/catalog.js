import client from './client';

export async function getCities(params = {}) {
    const response = await client.get('/catalog/cities/', { params });
    return response.data;
}
