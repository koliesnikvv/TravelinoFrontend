import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { parseError } from '../../api/errors';

function DeleteAccountSection() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setError('');
        if (!password) {
            setError('Please enter your password to confirm.');
            return;
        }
        setLoading(true);
        try {
            await client.delete('/users/profile/', { data: { password } });
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            navigate('/login');
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Delete Account</Typography>
            <Typography variant="body2" color="text.secondary">
                This action is irreversible. Enter your password to confirm.
            </Typography>
            <TextField
                label="Your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete Account'}
            </Button>
        </Box>
    );
}

export default DeleteAccountSection;