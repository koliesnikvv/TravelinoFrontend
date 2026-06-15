// Maps Django field names to human-readable labels shown in error messages.
const FIELD_LABELS = {
    email: 'Email',
    password: 'Password',
    first_name: 'First name',
    last_name: 'Last name',
    phone: 'Phone',
    title: 'Title',
    city: 'City',
    start_date: 'Start date',
    end_date: 'End date',
    scheduled_date: 'Date',
    start_time: 'Start time',
    end_time: 'End time',
    departure_point: 'Departure',
    arrival_point: 'Arrival',
    departure_datetime: 'Departure time',
    arrival_datetime: 'Arrival time',
    price: 'Price',
    passengers_count: 'Passengers',
    check_in_date: 'Check-in date',
    check_out_date: 'Check-out date',
    price_per_night: 'Price per night',
    total_price: 'Total price',
    invitee_email: 'Email',
    access_level: 'Access level',
};

// Generic messages for known Django/DRF error patterns.
// Checked before falling back to field-level messages.
const KNOWN_MESSAGES = {
    'No active account found with the given credentials': 'Incorrect email or password.',
    'This field may not be blank.': 'This field is required.',
    'This field is required.': 'This field is required.',
    'Enter a valid email address.': 'Enter a valid email address.',
    'A user with that email already exists.': 'This email is already registered.',
    'Unable to log in with provided credentials.': 'Incorrect email or password.',
};

function normalizeMessage(msg) {
    if (!msg || typeof msg !== 'string') return null;
    return KNOWN_MESSAGES[msg] ?? msg;
}

export function parseError(err) {
    const data = err.response?.data;
    if (!data) return 'Something went wrong. Please try again.';

    // Plain string response
    if (typeof data === 'string') return 'Something went wrong. Please try again.';

    // { detail: "..." } — DRF auth/permission errors
    if (data.detail) return normalizeMessage(data.detail) ?? 'Something went wrong.';

    // { error: "..." } — custom backend errors
    if (data.error) return normalizeMessage(data.error) ?? 'Something went wrong.';

    // { non_field_errors: ["..."] } — DRF validation errors not tied to a field
    if (data.non_field_errors?.length) {
        return normalizeMessage(data.non_field_errors[0]) ?? 'Something went wrong.';
    }

    // { field_name: ["error text"] } — field-level validation errors
    // Show "Field label: error" for known fields, generic message for unknown ones.
    const firstKey = Object.keys(data)[0];
    if (firstKey) {
        const value = data[firstKey];
        const message = Array.isArray(value) ? value[0] : typeof value === 'string' ? value : null;
        if (message) {
            const label = FIELD_LABELS[firstKey];
            const normalized = normalizeMessage(message);
            if (label) return `${label}: ${normalized}`;
            // Unknown field — show generic message, log key for debugging
            console.error('Unhandled error field:', firstKey, message);
            return normalized ?? 'Something went wrong. Please try again.';
        }
    }

    return 'Something went wrong. Please try again.';
}