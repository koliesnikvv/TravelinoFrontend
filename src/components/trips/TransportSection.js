import { Box, Typography, IconButton, Button, Card, CardContent, Chip, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';

export default function TransportSection({ transport, onDelete, canEdit }) {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Transport
            </Typography>

            {transport.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No transport added yet
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    {transport.map((item) => (
                        <Card key={item.id} variant="outlined">
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Chip label={item.transport_type} size="small" />
                                        <Typography variant="body1">
                                            {item.departure_point} → {item.arrival_point}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.departure_datetime}
                                    </Typography>
                                    <Typography variant="body2">
                                        ${item.price} · {item.passengers_count} passenger{item.passengers_count !== 1 ? 's' : ''}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Button
                                        size="small"
                                        // TODO: implement /trips/:id/transport/:transport_id
                                        onClick={() => navigate(`/trips/${id}/transport/${item.id}`)}
                                    >
                                        View details
                                    </Button>
                                    {canEdit && (
                                        <IconButton size="small" onClick={() => onDelete(item.id)}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            <Divider sx={{ mb: 2 }} />

            {canEdit && (
                // TODO: implement /trips/:id/transport/search
                <Button variant="outlined" onClick={() => navigate(`/trips/${id}/transport/search`)}>
                    Add transport
                </Button>
            )}
        </Box>
    );
}