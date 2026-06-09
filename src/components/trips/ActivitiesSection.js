import { Box, Typography, IconButton, Button, Card, CardContent, Chip, Divider, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TourIcon from '@mui/icons-material/Tour';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

export default function ActivitiesSection({ activities = [], onDelete, canEdit, trip }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleAddActivity = () => {
        navigate(`/trips/${id}/activities/search`, {
            state: {
                cityId: trip?.city?.id,
                tripStart: trip?.start_date,
            },
        });
    };

    const formatDuration = (start, end) => {
        const diff = end.diff(start, 'minute');
        if (diff <= 0) return null;
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        return hours === 0 ? `${minutes} min` : `${hours}h ${minutes}m`;
    };

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
                    fontSize: '1.15rem'
                }}
            >
                <TourIcon sx={{ color: '#1a4a4a', fontSize: 20 }} /> 
                Activities
            </Typography>

            {activities.length === 0 ? (
                <Card 
                    variant="outlined" 
                    sx={{ 
                        borderRadius: 4, 
                        borderColor: 'rgba(26, 74, 74, 0.12)', 
                        bgcolor: 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(8px)',
                        p: 3, 
                        textAlign: 'center' 
                    }}
                >
                    <Typography variant="body2" sx={{ color: '#5a7a7a', fontStyle: 'italic' }}>
                        No activities added yet. Discover things to do.
                    </Typography>
                </Card>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {activities.map((item) => {
                        const activityTitle = item.activity_title || 'Custom Activity';
                        const start = dayjs(`${item.scheduled_date}T${item.start_time}`);
                        const end = dayjs(`${item.scheduled_date}T${item.end_time}`);
                        const duration = formatDuration(start, end);
                        
                        return (
                            <Card 
                                key={item.id} 
                                sx={{ 
                                    borderRadius: 4, 
                                    border: '1px solid rgba(255, 255, 255, 0.6)',
                                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: '0 4px 20px rgba(26, 74, 74, 0.04)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 30px rgba(26, 74, 74, 0.08)',
                                        bgcolor: '#ffffff'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: '20px !important' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: { xs: 1, sm: 2 } }}>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                                            <Avatar 
                                                sx={{ 
                                                    bgcolor: '#1a4a4a', 
                                                    color: '#ffffff', 
                                                    width: 44, 
                                                    height: 44,
                                                    boxShadow: '0 4px 10px rgba(26, 74, 74, 0.15)',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <TourIcon />
                                            </Avatar>
                                            
                                            <Box sx={{ minWidth: 0 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a4a4a', lineHeight: 1.2 }}>
                                                        {activityTitle}
                                                    </Typography>
                                                    {item.activity?.category && (
                                                        <Chip 
                                                            label={item.activity.category} 
                                                            size="small" 
                                                            sx={{ 
                                                                bgcolor: 'rgba(26, 74, 74, 0.06)', 
                                                                color: '#1a4a4a',
                                                                fontWeight: 600,
                                                                fontSize: '0.7rem',
                                                                height: 20,
                                                                ml: 0.5
                                                            }} 
                                                        />
                                                    )}
                                                </Box>

                                                <Typography variant="body2" sx={{ color: '#5a7a7a', display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                                    <ScheduleIcon sx={{ fontSize: 14, color: '#8aa8a8' }} />
                                                    {dayjs(item.scheduled_date).format('MMM D')} · {item.start_time} — {item.end_time}
                                                    {duration && (
                                                        <Box component="span" sx={{ bgcolor: 'rgba(77, 182, 172, 0.15)', color: '#2e7d72', px: 1, py: 0.2, borderRadius: 1.5, fontSize: '0.75rem', fontWeight: 600, ml: 1 }}>
                                                            {duration}
                                                        </Box>
                                                    )}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {canEdit && (
                                            <Box sx={{ flexShrink: 0, ml: 1 }}>
                                                <IconButton 
                                                    onClick={() => onDelete(item.id)} 
                                                    disableRipple 
                                                    sx={{ 
                                                        color: '#8aa8a8',
                                                        p: 0, 
                                                        transition: 'all 0.3s ease',
                                                        borderRadius: '50%',
                                                        padding: '6px',
                                                        '&:hover': { 
                                                            backgroundColor: 'rgba(196, 122, 122, 0.15)',
                                                            color: '#c47a7a',
                                                            transform: 'scale(1.15)'
                                                        }
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Box>
            )}

            {canEdit && (
                <>
                    <Divider sx={{ my: 2.5, borderColor: 'rgba(26, 74, 74, 0.08)' }} />
                    <Button
                        variant="contained"
                        onClick={handleAddActivity}
                        startIcon={<TourIcon />}
                        sx={{ 
                            borderRadius: 8, 
                            bgcolor: '#1a4a4a', 
                            color: '#ffffff', 
                            textTransform: 'none', 
                            px: 3.5,
                            py: 1,
                            fontWeight: 600,
                            boxShadow: '0 4px 14px rgba(26, 74, 74, 0.2)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                bgcolor: '#2c6b6b',
                                boxShadow: '0 6px 20px rgba(26, 74, 74, 0.3)',
                                transform: 'translateY(-1px)'
                            },
                            '&:active': {
                                transform: 'translateY(0)'
                            }
                        }}
                    >
                        Add activity
                    </Button>
                </>
            )}
        </Box>
    );
}