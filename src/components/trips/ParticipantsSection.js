import { useState } from 'react';
import { Box, Typography, IconButton, Button, Card, CardContent, Chip, Divider, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';
import { inviteParticipant, removeParticipant } from '../../api/trips';

export default function ParticipantsSection({ participants, onAdd, onDelete, canEdit }) {
    const { id } = useParams();
    const [email, setEmail] = useState('');
    const [accessLevel, setAccessLevel] = useState('View');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleInvite() {
        if (!email.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const participant = await inviteParticipant(id, { invitee_email: email.trim(), access_level: accessLevel });
            onAdd(participant);
            setEmail('');
            setAccessLevel('View');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to send invite.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(participantId) {
        try {
            await removeParticipant(id, participantId);
            onDelete(participantId);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to remove participant.');
        }
    }

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Participants
            </Typography>

            {participants.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No participants yet
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    {participants.map((item) => (
                        <Card key={item.id} variant="outlined">
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="body1">
                                        {item.invitee_email}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                        <Chip label={item.access_level} size="small" />
                                        <Chip
                                            label={item.status}
                                            size="small"
                                            color={item.status === 'Accepted' ? 'success' : 'default'}
                                        />
                                    </Box>
                                </Box>
                                {canEdit && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(item.id)}
                                        sx={{ alignSelf: 'center', flexShrink: 0 }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            <Divider sx={{ mb: 2 }} />

            {canEdit && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <TextField
                        label="Email"
                        size="small"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                        sx={{ flex: 1, minWidth: 200 }}
                        error={!!error}
                        helperText={error || ''}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Access</InputLabel>
                        <Select
                            value={accessLevel}
                            label="Access"
                            onChange={(e) => setAccessLevel(e.target.value)}
                        >
                            <MenuItem value="View">View</MenuItem>
                            <MenuItem value="Edit">Edit</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        onClick={handleInvite}
                        disabled={loading || !email.trim()}
                    >
                        Invite
                    </Button>
                </Box>
            )}
        </Box>
    );
}