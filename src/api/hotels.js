const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

export const searchHotels = async (searchParams) => {
    try {
        const response = await fetch(`${API_URL}/trips/hotels/search/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(searchParams),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to search hotels');
        }

        return await response.json();
    } catch (error) {
        console.error('Error searching hotels:', error);
        throw error;
    }
};