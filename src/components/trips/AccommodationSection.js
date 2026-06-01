import { Box, Typography, IconButton, Button, Card, CardContent, Chip, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';

export default function AccommodationSection({ accommodation, onDelete }) {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Accommodation
            </Typography>

            {accommodation.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No accommodation added yet
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    {accommodation.map((item) => (
                        <Card key={item.id} variant="outlined">
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        {item.accommodation_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.check_in_date} — {item.check_out_date}
                                    </Typography>
                                    <Typography variant="body2">
                                        ${item.price_per_night} / night
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Button
                                        size="small"
                                        // TODO: implement /trips/:id/accommodation/:acc_id page
                                        onClick={() => navigate(`/trips/${id}/accommodation/${item.id}`)}
                                    >
                                        View details
                                    </Button>
                                    <IconButton size="small" onClick={() => onDelete(item.id)}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            <Divider sx={{ mb: 2 }} />

            // TODO: implement /trips/:id/accommodation/search page
            <Button variant="outlined" onClick={() => navigate(`/trips/${id}/accommodation/search`)}>
                Add accommodation
            </Button>
        </Box>
    );
}