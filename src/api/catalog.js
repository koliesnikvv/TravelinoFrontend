const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

export const getCities = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams(params).toString();
        const url = `${API_URL}/catalog/cities/${queryParams ? `?${queryParams}` : ''}`;
        
        console.log('Fetching cities from:', url);
        
        const response = await fetch(url, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Cities received:', data);
        
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
    try {
        const response = await fetch(`${API_URL}/catalog/cities/${cityId}/`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching city details:', error);
        throw error;
    }
};

export const getRecommendedCities = async () => {
    try {
        const response = await fetch(`${API_URL}/catalog/cities/recommended/`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            return await getCities();
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching recommended cities:', error);
        return await getCities();
    }
};