const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};


export const searchAirports = async (term) => {
    if (!term || term.length < 2) {
        return [];
    }

    try {
        console.log(`Searching airports for: ${term}`);

        const response = await fetch(`${API_URL}/trips/airports/search/?term=${encodeURIComponent(term)}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            console.error('Airport search failed:', response.status);
            return [];
        }

        const data = await response.json();
        console.log('Airport search results:', data);
        return data || [];

    } catch (error) {
        console.error('Error searching airports:', error);
        return [];
    }
};


export const searchFlights = async (searchParams) => {
    try {
        const requestBody = {
            Origin: searchParams.origin?.toUpperCase(),
            Destination: searchParams.destination?.toUpperCase(),
            Departuredate: searchParams.departureDate,
            adults: searchParams.adults || 1,
        };

        if (searchParams.returnDate) {
            requestBody.Returndate = searchParams.returnDate;
        }

        console.log('Sending to backend:', requestBody);

        const token = localStorage.getItem('access');
        const response = await fetch(`${API_URL}/trips/flights/search/`, {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const responseText = await response.text();
        console.log('Response status:', response.status);
        console.log('Response body:', responseText);

        if (!response.ok) {
            throw new Error(responseText || `HTTP ${response.status}`);
        }

        return JSON.parse(responseText);

    } catch (error) {
        console.error('Error searching flights:', error);
        throw error;
    }
};