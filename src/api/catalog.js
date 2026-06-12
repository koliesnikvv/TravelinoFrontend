import client from './client';

export const getCities = async (params = {}) => {
    try {
        const response = await client.get('/catalog/cities/', { params });
        const data = response.data;

        if (data.results) {
            return data.results;
        }
        if (Array.isArray(data)) {
            return data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
};

export const getCityDetails = async (cityId) => {
    const response = await client.get(`/catalog/cities/${cityId}/`);
    return response.data;
};

export const getRecommendedCities = async () => {
    try {
        const response = await client.get('/catalog/cities/recommended/');
        return response.data;
    } catch (error) {
        console.error('Error fetching recommended cities:', error);
        return getCities();
    }
};