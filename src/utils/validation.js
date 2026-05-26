export function validateEmail(email) {
    if (!email) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format.';
    return null;
}

export function validatePassword(password) {
    if (!password) return 'Password is required.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!/\d/.test(password)) return 'Password must contain at least one number.';
    if (/^\d+$/.test(password)) return 'Password cannot be entirely numeric.';
    return null;
}

export function validatePhone(phone) {
    if (!phone) return 'Phone is required.';
    if (!/^\+380\d{9}$/.test(phone)) return 'Phone must start with +380 and contain 9 more digits.';
    return null;
}

export function validateRequired(value, fieldName) {
    if (!value) return `${fieldName} is required.`;
    return null;
}