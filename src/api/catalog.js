import client from './client';

export const getCities = async (params = {}) => {
    try {
        const response = await client.get('/catalog/cities/', { params });
        const data = response.data;
        if (data.results) return data.results;
        if (Array.isArray(data)) return data;
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

// GET /api/catalog/activities/?city=uuid&query=text&category=name&page=1
// Returns: { results: [...], page, total, has_next }
export const getActivities = async (params = {}) => {
    const response = await client.get('/catalog/activities/', { params });
    const data = response.data;
    if (data.results !== undefined) return data;
    if (Array.isArray(data)) return { results: data, page: 1, total: data.length, has_next: false };
    return { results: [], page: 1, total: 0, has_next: false };
};

// GET /api/catalog/activities/<xid>/
// Returns: { xid, name, description, kinds, image, address, otm_url }
export const getActivityDetail = async (xid) => {
    const response = await client.get(`/catalog/activities/${xid}/`);
    return response.data;
};