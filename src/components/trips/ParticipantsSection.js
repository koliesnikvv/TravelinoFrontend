import { useState } from 'react';
import { Box, Typography, IconButton, Chip, Divider, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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
            <Typography
                variant="h6"
                sx={{
                    mb: 2.5,
                    color: '#1a4a4a',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: '1.15rem',
                }}
            >
                <PeopleAltIcon sx={{ color: '#1a4a4a', fontSize: 20 }} />
                Travellers
            </Typography>

            {/* Invite CTA block — shown when no participants yet */}
            {participants.length === 0 && canEdit && (
                <Box
                    sx={{
                        borderRadius: 4,
                        border: '1.5px dashed rgba(77,182,172,0.45)',
                        bgcolor: 'rgba(77,182,172,0.04)',
                        p: 3,
                        mb: 2.5,
                        textAlign: 'center',
                    }}
                >
                    <PeopleAltIcon sx={{ fontSize: 36, color: 'rgba(77,182,172,0.6)', mb: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a4a4a', mb: 0.5 }}>
                        Plan together
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5a7a7a', maxWidth: 320, mx: 'auto' }}>
                        Invite friends or family to view or edit this trip. Everyone stays on the same page.
                    </Typography>
                </Box>
            )}

            {/* Participant list */}
            {participants.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2.5 }}>
                    {participants.map((item) => (
                        <Box
                            key={item.id}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderRadius: 3,
                                border: '1px solid rgba(255,255,255,0.6)',
                                bgcolor: 'rgba(255,255,255,0.8)',
                                backdropFilter: 'blur(12px)',
                                boxShadow: '0 2px 12px rgba(26,74,74,0.04)',
                                px: 2.5,
                                py: 1.5,
                            }}
                        >
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a4a4a' }}>
                                    {item.invitee_email}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                    <Chip
                                        label={item.access_level}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(77,182,172,0.12)',
                                            color: '#2e7d7d',
                                            fontWeight: 600,
                                            fontSize: 11,
                                            height: 20,
                                        }}
                                    />
                                    <Chip
                                        label={item.status}
                                        size="small"
                                        sx={{
                                            bgcolor: item.status === 'Accepted'
                                                ? 'rgba(56,142,60,0.12)'
                                                : 'rgba(158,158,158,0.12)',
                                            color: item.status === 'Accepted' ? '#388e3c' : '#757575',
                                            fontWeight: 600,
                                            fontSize: 11,
                                            height: 20,
                                        }}
                                    />
                                </Box>
                            </Box>
                            {canEdit && (
                                <IconButton
                                    size="small"
                                    onClick={() => handleDelete(item.id)}
                                    sx={{
                                        color: '#8aa8a8',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'rgba(196,122,122,0.15)', color: '#c47a7a' },
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                </Box>
            )}

            {/* Invite form */}
            {canEdit && (
                <>
                    <Divider sx={{ mb: 2, borderColor: 'rgba(26,74,74,0.08)' }} />
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <TextField
                            label="Email address"
                            size="small"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                            sx={{
                                flex: 1,
                                minWidth: 200,
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                            }}
                            error={!!error}
                            helperText={error || ''}
                        />
                        <FormControl size="small" sx={{ minWidth: 110 }}>
                            <InputLabel>Access</InputLabel>
                            <Select
                                value={accessLevel}
                                label="Access"
                                onChange={(e) => setAccessLevel(e.target.value)}
                                sx={{ borderRadius: '12px' }}
                            >
                                <MenuItem value="View">View</MenuItem>
                                <MenuItem value="Edit">Edit</MenuItem>
                            </Select>
                        </FormControl>
                        <Box
                            component="button"
                            onClick={handleInvite}
                            disabled={loading || !email.trim()}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                background: 'linear-gradient(135deg, #4db6ac, #26a69a)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                px: 2.5,
                                py: '8.5px',
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
                                opacity: loading || !email.trim() ? 0.6 : 1,
                                transition: 'all 0.2s',
                                fontFamily: 'inherit',
                                '&:hover:not(:disabled)': {
                                    background: 'linear-gradient(135deg, #26a69a, #00897b)',
                                },
                            }}
                        >
                            <PersonAddIcon sx={{ fontSize: 17 }} />
                            {loading ? 'Sending...' : 'Invite'}
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
}