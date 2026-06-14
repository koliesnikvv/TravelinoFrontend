import { Box, Typography, IconButton, Button, Card, CardContent, Chip, Divider, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HotelIcon from '@mui/icons-material/Hotel';
import BedIcon from '@mui/icons-material/Bed';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

export default function AccommodationSection({ accommodation = [], onDelete, canEdit, trip }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleAddAccommodation = () => {
        navigate(`/trips/${id}/accommodation/search`, {
            state: {
                city: trip?.city_name,
                cityId: trip?.city?.id,
                checkIn: trip?.start_date,
                checkOut: trip?.end_date,
            },
        });
    };

    const getNights = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        return dayjs(checkOut).diff(dayjs(checkIn), 'day');
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
                <HotelIcon sx={{ color: '#1a4a4a', fontSize: 20 }} /> 
                Accommodation
            </Typography>

            {accommodation.length === 0 ? (
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
                        No accommodation added yet. Find a place to stay.
                    </Typography>
                </Card>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {accommodation.map((item) => {
                        const totalPrice = parseFloat(item.total_price).toFixed(2);
                        const nights = getNights(item.check_in_date, item.check_out_date);
                        
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
                                                <HotelIcon />
                                            </Avatar>
                                            
                                            <Box sx={{ minWidth: 0 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a4a4a', lineHeight: 1.2 }}>
                                                        {item.accommodation_name}
                                                    </Typography>
                                                    <Chip 
                                                        label="Hotel" 
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
                                                </Box>

                                                <Typography variant="body2" sx={{ color: '#5a7a7a', display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                                    <DateRangeIcon sx={{ fontSize: 14, color: '#8aa8a8' }} />
                                                    {dayjs(item.check_in_date).format('MMM D')} — {dayjs(item.check_out_date).format('MMM D')}
                                                    <Box component="span" sx={{ bgcolor: 'rgba(77, 182, 172, 0.15)', color: '#2e7d72', px: 1, py: 0.2, borderRadius: 1.5, fontSize: '0.75rem', fontWeight: 600, ml: 1 }}>
                                                        {nights} {nights === 1 ? 'night' : 'nights'}
                                                    </Box>
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ textAlign: 'center', px: { xs: 1, sm: 2 } }}>
                                            <Typography variant="h6" sx={{ color: '#1a4a4a', fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                                                ${totalPrice}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#8aa8a8', display: 'block', mt: 0.3, whiteSpace: 'nowrap' }}>
                                                ${item.price_per_night}/night
                                            </Typography>
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
                        onClick={handleAddAccommodation}
                        startIcon={<HotelIcon />}
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
                        Add accommodation
                    </Button>
                </>
            )}
        </Box>
    );
}