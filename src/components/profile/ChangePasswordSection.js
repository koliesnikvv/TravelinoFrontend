import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import client from '../../api/client';
import { parseError } from '../../api/errors';
import { validatePassword, validateRequired } from '../../utils/validation';

function ChangePasswordSection() {
    const [fields, setFields] = useState({
        current_password: '',
        new_password: '',
        new_password_check: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFields((prev) => ({ ...prev, [field]: value }));

        if (field === 'new_password') {
            setErrors((prev) => ({ ...prev, new_password: validatePassword(value) }));
        }
        if (field === 'new_password_check') {
            setErrors((prev) => ({
                ...prev,
                new_password_check: value !== fields.new_password ? 'Passwords do not match.' : null,
            }));
        }
    };

    const handleSave = async () => {
        const newErrors = {
            current_password: validateRequired(fields.current_password, 'Current password'),
            new_password: validatePassword(fields.new_password),
            new_password_check: fields.new_password !== fields.new_password_check
                ? 'Passwords do not match.'
                : null,
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some((e) => e)) return;

        setLoading(true);
        setMessage('');
        try {
            const response = await client.post('/users/profile/change-password/', {
                current_password: fields.current_password,
                new_password: fields.new_password,
            });
            setMessage(response.data.message);
            setFields({ current_password: '', new_password: '', new_password_check: '' });
        } catch (err) {
            setErrors({ general: parseError(err) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Change Password</Typography>
            <TextField
                label="Current password"
                type="password"
                value={fields.current_password}
                onChange={handleChange('current_password')}
                error={!!errors.current_password}
                helperText={errors.current_password}
                fullWidth
            />
            <TextField
                label="New password"
                type="password"
                value={fields.new_password}
                onChange={handleChange('new_password')}
                error={!!errors.new_password}
                helperText={errors.new_password}
                fullWidth
            />
            <TextField
                label="Confirm new password"
                type="password"
                value={fields.new_password_check}
                onChange={handleChange('new_password_check')}
                error={!!errors.new_password_check}
                helperText={errors.new_password_check}
                fullWidth
            />
            {errors.general && <Alert severity="error">{errors.general}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
            <Button variant="contained" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Change Password'}
            </Button>
        </Box>
    );
}

export default ChangePasswordSection;