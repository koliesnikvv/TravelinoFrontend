import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Chip } from '@mui/material';
import client from '../../api/client';
import { parseError } from '../../api/errors';

function TravelPreferencesSection({ preferences: initial, availablePreferences }) {
    const [preferences, setPreferences] = useState(initial);
    const [search, setSearch] = useState('');
    const [focused, setFocused] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const addPreference = (pref) => {
        if (!preferences.includes(pref)) {
            setPreferences((prev) => [...prev, pref]);
        }
        setSearch('');
    };

    const removePreference = (pref) => {
        setPreferences((prev) => prev.filter((p) => p !== pref));
    };

    const filteredOptions = availablePreferences.filter(
        (pref) =>
            pref.toLowerCase().includes(search.toLowerCase()) &&
            !preferences.includes(pref)
    );

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        setError('');
        try {
            await client.put('/users/profile/preferences/', { preferences });
            setMessage('Preferences updated successfully.');
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Travel Preferences</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
                {preferences.map((pref) => (
                    <Chip
                        key={pref}
                        label={pref}
                        onDelete={() => removePreference(pref)}
                    />
                ))}
            </Box>
            <Box position="relative">
                <TextField
                    label="Search preferences..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 150)}
                    fullWidth
                />
                {focused && (
                    <Box
                        position="absolute"
                        top="100%"
                        left={0}
                        right={0}
                        zIndex={10}
                        bgcolor="background.paper"
                        border="1px solid"
                        borderColor="divider"
                        borderRadius={1}
                        maxHeight={200}
                        overflow="auto"
                        boxShadow={2}
                    >
                        {filteredOptions.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ p: 1.5 }}>
                                No results
                            </Typography>
                        ) : (
                            filteredOptions.map((pref) => (
                                <Box
                                    key={pref}
                                    onClick={() => addPreference(pref)}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'action.hover' },
                                    }}
                                >
                                    <Typography variant="body2">{pref}</Typography>
                                </Box>
                            ))
                        )}
                    </Box>
                )}
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
            <Button variant="contained" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
        </Box>
    );
}

export default TravelPreferencesSection;