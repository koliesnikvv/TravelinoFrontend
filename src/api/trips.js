export async function createTrip(data) {
    return {
        id: 'mock-trip-id-123',
        title: data.title,
        city_id: data.city_id,
        city_name: data.city_name,
        start_date: data.start_date,
        end_date: data.end_date,
        transport: [],
        accommodation: [],
        activities: [],
    };
}

export async function getTripDetail(tripId) {
    return {
        id: tripId,
        title: 'My trip',
        city_name: 'Paris',
        start_date: '2026-07-01',
        end_date: '2026-07-07',
        transport: [],
        accommodation: [],
        activities: [],
    };
}

export async function updateTrip(tripId, data) {
    return { id: tripId, ...data };
}