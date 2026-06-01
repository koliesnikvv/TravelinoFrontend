const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const getCities = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams(params).toString();
        const url = `${API_URL}/catalog/cities/${queryParams ? `?${queryParams}` : ''}`;

        const response = await fetch(url, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
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
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching recommended cities:', error);
        throw error;
    }
};