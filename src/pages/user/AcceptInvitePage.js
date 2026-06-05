import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Alert, Button, Typography } from '@mui/material';
import { acceptInvite } from '../../api/trips';

export default function AcceptInvitePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const tripId = searchParams.get('trip');
    const participantId = searchParams.get('participant');

    const [status, setStatus] = useState('loading'); // loading | success | error | unauthorized
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access');

        if (!token) {
            navigate(`/login?next=/invite/accept?trip=${tripId}&participant=${participantId}`);
            return;
        }

        if (!tripId || !participantId) {
            setStatus('error');
            setError('Invalid invite link.');
            return;
        }

        async function accept() {
            try {
                await acceptInvite(tripId, participantId);
                setStatus('success');
            } catch (err) {
                setStatus('error');
                setError(err.response?.data?.detail || 'Failed to accept invite.');
            }
        }

        accept();
    }, [tripId, participantId, navigate]);

    if (status === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (status === 'error') {
        return (
            <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, textAlign: 'center' }}>
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                <Button variant="outlined" onClick={() => navigate('/')}>
                    Go to home
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, textAlign: 'center', px: 2 }}>            <Typography variant="h5" sx={{ mb: 2 }}>
                You have joined the trip!
            </Typography>
            <Button variant="contained" onClick={() => navigate(`/trips/${tripId}`)}>
                Open trip
            </Button>
        </Box>
    );
}