export function parseError(err) {
    const data = err.response?.data;
    if (!data) return 'Something went wrong';

    if (typeof data === 'string') return data;

    if (data.error) return data.error;

    if (data.non_field_errors) return data.non_field_errors[0];

    const firstKey = Object.keys(data)[0];
    if (firstKey) {
        const value = data[firstKey];
        if (Array.isArray(value)) return value[0];
        if (typeof value === 'string') return value;
    }

    return 'Something went wrong';
}