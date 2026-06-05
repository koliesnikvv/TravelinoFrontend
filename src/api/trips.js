import client from './client';

// GET /api/trips/
export async function getTrips() {
    const response = await client.get('/trips/');
    return response.data;
}

// POST /api/trips/
// data: { title, city_id, start_date, end_date }
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
// data: { title?, start_date?, end_date? }
export async function updateTrip(tripId, data) {
    const response = await client.patch(`/trips/${tripId}/`, data);
    return response.data;
}

// DELETE /api/trips/{id}/
export async function deleteTrip(tripId) {
    await client.delete(`/trips/${tripId}/`);
    return null;
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
// data: { invitee_email, access_level: 'View' | 'Edit' }
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