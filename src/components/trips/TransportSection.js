import { Box, Typography, IconButton, Button, Card, CardContent, Chip, Divider, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlightIcon from '@mui/icons-material/Flight';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

export default function TransportSection({ transport = [], onDelete, canEdit, trip }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleAddTransport = () => {
        navigate(`/trips/${id}/transport/search`, {
            state: {
                from: '',
                to: trip?.city_name || '',
                departureDate: trip?.start_date || null,
                passengers: 1,
            },
        });
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Flight': return <FlightIcon sx={{ fontSize: 22 }} />;
            case 'Train': return <TrainIcon sx={{ fontSize: 22 }} />;
            case 'Bus': return <DirectionsBusIcon sx={{ fontSize: 22 }} />;
            default: return <FlightIcon sx={{ fontSize: 22 }} />;
        }
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
                <FlightIcon sx={{ transform: 'rotate(45deg)', color: '#1a4a4a', fontSize: 20 }} /> 
                Transport
            </Typography>

            {transport.length === 0 ? (
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
                        No transport added yet. Experience your journey by adding tickets.
                    </Typography>
                </Card>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {transport.map((item) => {
                        const totalPrice = (parseFloat(item.price || 0) * (item.passengers_count || 1)).toFixed(2);
                        const departureDate = item.departure_datetime ? dayjs(item.departure_datetime).format('MMM D, YYYY') : 'Date TBD';
                        
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
                                                {getTypeIcon(item.transport_type)}
                                            </Avatar>
                                            
                                            <Box sx={{ minWidth: 0 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a4a4a', lineHeight: 1.2 }}>
                                                        {item.departure_point}
                                                    </Typography>
                                                    <ArrowRightAltIcon sx={{ color: '#8aa8a8', fontSize: 18 }} />
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a4a4a', lineHeight: 1.2 }}>
                                                        {item.arrival_point}
                                                    </Typography>
                                                    <Chip 
                                                        label={item.transport_type} 
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

                                                <Typography variant="body2" sx={{ color: '#5a7a7a' }}>
                                                    {departureDate}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ textAlign: 'center', px: { xs: 1, sm: 2 } }}>
                                            <Typography variant="h6" sx={{ color: '#1a4a4a', fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                                                ${totalPrice}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#8aa8a8', display: 'block', mt: 0.3, whiteSpace: 'nowrap' }}>
                                                {item.passengers_count} passenger{item.passengers_count !== 1 ? 's' : ''}
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
                        onClick={handleAddTransport}
                        startIcon={<FlightIcon sx={{ transform: 'rotate(45deg)' }} />}
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
                        Add transport
                    </Button>
                </>
            )}
        </Box>
    );
}