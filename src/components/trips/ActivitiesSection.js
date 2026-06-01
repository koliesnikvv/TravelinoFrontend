import { Box, Typography, IconButton, Button, Divider, List, ListItem, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';

export default function ActivitiesSection({ activities, onDelete }) {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Activities
            </Typography>

            {activities.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No activities added yet
                </Typography>
            ) : (
                <List
                    sx={{
                        maxHeight: 300,
                        overflow: 'auto',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 2,
                    }}
                >
                    {activities.map((item) => (
                        <ListItem
                            key={item.id}
                            secondaryAction={
                                <IconButton size="small" onClick={() => onDelete(item.id)}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            }
                            divider
                        >
                            <ListItemText
                                primary={item.activity_title}
                                secondary={`${item.scheduled_date} · ${item.start_time} — ${item.end_time}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}

            <Divider sx={{ mb: 2 }} />

            // TODO: implement /trips/:id/activities page to add/edit activities in more detail
            <Button variant="outlined" onClick={() => navigate(`/trips/${id}/activities`)}>
                Edit activities
            </Button>
        </Box>
    );
}