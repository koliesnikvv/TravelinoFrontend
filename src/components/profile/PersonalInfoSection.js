import { useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Alert, Avatar, CircularProgress } from '@mui/material';
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

    const [photo, setPhoto] = useState(profile.photo || null);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [photoError, setPhotoError] = useState('');
    const fileInputRef = useRef(null);

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

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPhotoError('');
        setPhotoLoading(true);

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const response = await client.post('/users/profile/photo/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setPhoto(response.data.photo);
        } catch (err) {
            setPhotoError(parseError(err));
        } finally {
            setPhotoLoading(false);
            // Reset input so same file can be re-selected
            e.target.value = '';
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Personal Info</Typography>

            {/* Photo upload */}
            <Box display="flex" alignItems="center" gap={2}>
                <Box position="relative" sx={{ cursor: 'pointer' }} onClick={handlePhotoClick}>
                    <Avatar
                        src={photo || undefined}
                        sx={{ width: 80, height: 80, fontSize: 32 }}
                    >
                        {!photo && (fields.first_name?.[0] || '?')}
                    </Avatar>
                    {photoLoading && (
                        <Box
                            position="absolute"
                            top={0} left={0} right={0} bottom={0}
                            display="flex" alignItems="center" justifyContent="center"
                            sx={{ bgcolor: 'rgba(0,0,0,0.4)', borderRadius: '50%' }}
                        >
                            <CircularProgress size={24} sx={{ color: '#fff' }} />
                        </Box>
                    )}
                </Box>
                <Box>
                    <Button variant="outlined" size="small" onClick={handlePhotoClick} disabled={photoLoading}>
                        {photo ? 'Change photo' : 'Upload photo'}
                    </Button>
                    <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                        JPEG, PNG, WEBP or GIF · max 5MB
                    </Typography>
                </Box>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    style={{ display: 'none' }}
                    onChange={handlePhotoChange}
                />
            </Box>

            {photoError && <Alert severity="error">{photoError}</Alert>}

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