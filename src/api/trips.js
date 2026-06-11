import client from './client';

// GET /api/trips/
export async function getTrips() {
    const response = await client.get('/trips/');
    return response.data;
}

// POST /api/trips/
export async function createTrip(data) {
    const response = await client.post('/trips/', {
        title: data.title,
        city: data.city_id,
        start_date: data.start_date,
        end_date: data.end_date,
    });
    return response.data;
}

// GET /api/trips/{id}/
export async function getTripDetail(tripId) {
    const response = await client.get(`/trips/${tripId}/`);
    return response.data;
}

// PATCH /api/trips/{id}/
export async function updateTrip(tripId, data) {
    const response = await client.patch(`/trips/${tripId}/`, data);
    return response.data;
}

// DELETE /api/trips/{id}/
export async function deleteTrip(tripId) {
    await client.delete(`/trips/${tripId}/`);
    return null;
}

// GET /api/trips/{id}/export/?activities=true&transport=true&accommodation=true
// Returns a .ics file blob and triggers browser download.
// options: { activities: bool, transport: bool, accommodation: bool }
export async function exportTripICS(tripId, tripTitle, options) {
    const params = new URLSearchParams({
        activities: String(options.activities),
        transport: String(options.transport),
        accommodation: String(options.accommodation),
    });

    const response = await client.get(`/trips/${tripId}/export/?${params}`, {
        responseType: 'blob',
    });

    // If the server returned an error, the blob will be JSON — parse and throw it.
    if (response.data.type === 'application/json') {
        const text = await response.data.text();
        throw new Error(JSON.parse(text)?.detail || 'Export failed');
    }

    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tripTitle || 'trip'}.ics`;
    link.click();
    URL.revokeObjectURL(url);
}

// POST /api/trips/{tripId}/transport/
export async function createTransportBooking(tripId, data) {
    const response = await client.post(`/trips/${tripId}/transport/`, data);
    return response.data;
}

// DELETE /api/trips/{tripId}/transport/{itemId}/
export async function deleteTransportBooking(tripId, itemId) {
    await client.delete(`/trips/${tripId}/transport/${itemId}/`);
    return null;
}

// POST /api/trips/{tripId}/accommodation/
export async function createAccommodationBooking(tripId, data) {
    const response = await client.post(`/trips/${tripId}/accommodation/`, data);
    return response.data;
}

// DELETE /api/trips/{tripId}/accommodation/{itemId}/
export async function deleteAccommodationBooking(tripId, itemId) {
    await client.delete(`/trips/${tripId}/accommodation/${itemId}/`);
    return null;
}

// POST /api/trips/{tripId}/activities/
export async function createTripActivity(tripId, data) {
    const response = await client.post(`/trips/${tripId}/activities/`, data);
    return response.data;
}

// DELETE /api/trips/{tripId}/activities/{itemId}/
export async function deleteTripActivity(tripId, itemId) {
    await client.delete(`/trips/${tripId}/activities/${itemId}/`);
    return null;
}

// POST /api/trips/{tripId}/participants/
export async function inviteParticipant(tripId, data) {
    const response = await client.post(`/trips/${tripId}/participants/`, data);
    return response.data;
}

// DELETE /api/trips/{tripId}/participants/{participantId}/
export async function removeParticipant(tripId, participantId) {
    await client.delete(`/trips/${tripId}/participants/${participantId}/`);
    return null;
}

// POST /api/trips/{tripId}/participants/{participantId}/accept/
export async function acceptInvite(tripId, participantId) {
    const response = await client.post(`/trips/${tripId}/participants/${participantId}/accept/`);
    return response.data;
}