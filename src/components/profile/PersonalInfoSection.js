import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import client from '../../api/client';
import { parseError } from '../../api/errors';
import { validatePhone, validateRequired } from '../../utils/validation';

function PersonalInfoSection({ profile, onUpdate }) {
    const [fields, setFields] = useState({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field, validator) => (e) => {
        const value = e.target.value;
        setFields((prev) => ({ ...prev, [field]: value }));
        if (validator) {
            setErrors((prev) => ({ ...prev, [field]: validator(value) }));
        }
    };

    const handleSave = async () => {
        const newErrors = {
            first_name: validateRequired(fields.first_name, 'First name'),
            last_name: validateRequired(fields.last_name, 'Last name'),
            phone: validatePhone(fields.phone),
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some((e) => e)) return;

        setLoading(true);
        setMessage('');
        try {
            const response = await client.put('/users/profile/', fields);
            onUpdate(response.data);
            setMessage('Profile updated successfully.');
        } catch (err) {
            setErrors({ general: parseError(err) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Personal Info</Typography>
            <Typography variant="body2" color="text.secondary">Email: {profile.email}</Typography>
            <TextField
                label="First name"
                value={fields.first_name}
                onChange={handleChange('first_name', (v) => validateRequired(v, 'First name'))}
                error={!!errors.first_name}
                helperText={errors.first_name}
                fullWidth
            />
            <TextField
                label="Last name"
                value={fields.last_name}
                onChange={handleChange('last_name', (v) => validateRequired(v, 'Last name'))}
                error={!!errors.last_name}
                helperText={errors.last_name}
                fullWidth
            />
            <TextField
                label="Phone (+380...)"
                value={fields.phone}
                onChange={handleChange('phone', validatePhone)}
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
            />
            {errors.general && <Alert severity="error">{errors.general}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
            <Button variant="contained" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
            </Button>
        </Box>
    );
}

export default PersonalInfoSection;