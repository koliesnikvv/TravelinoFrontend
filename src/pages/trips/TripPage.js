import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, CircularProgress, Alert, Button } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TripHeader from '../../components/trips/TripHeader';
import TransportSection from '../../components/trips/TransportSection';
import AccommodationSection from '../../components/trips/AccommodationSection';
import ActivitiesSection from '../../components/trips/ActivitiesSection';
import CalendarPanel from '../../components/trips/CalendarPanel';
import { getTripDetail, updateTrip } from '../../api/trips';
import { parseError } from '../../api/errors';

export default function TripPage() {
    const { id } = useParams();

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        async function loadTrip() {
            setLoading(true);
            setError(null);
            try {
                const data = await getTripDetail(id);
                setTrip(data);
            } catch (err) {
                setError(parseError(err));
            } finally {
                setLoading(false);
            }
        }

        loadTrip();
    }, [id]);

    async function handleSave(data) {
        try {
            const updated = await updateTrip(id, data);
            setTrip((prev) => ({ ...prev, ...updated }));
        } catch (err) {
            setError(parseError(err));
        }
    }

    function handleDeleteTransport(itemId) {
        setTrip((prev) => ({
            ...prev,
            transport: prev.transport.filter((t) => t.id !== itemId),
        }));
    }

    function handleDeleteAccommodation(itemId) {
        setTrip((prev) => ({
            ...prev,
            accommodation: prev.accommodation.filter((a) => a.id !== itemId),
        }));
    }

    function handleDeleteActivity(itemId) {
        setTrip((prev) => ({
            ...prev,
            activities: prev.activities.filter((a) => a.id !== itemId),
        }));
    }

    function handleExport() {
        console.log('export to calendar');
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 6 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!trip) return null;

    return (
        <Container maxWidth={showCalendar ? 'xl' : 'md'}>
            <Box sx={{ mt: 6, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleExport}
                    >
                        Export to calendar
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<CalendarMonthIcon />}
                        onClick={() => setShowCalendar((prev) => !prev)}
                    >
                        {showCalendar ? 'Hide calendar' : 'Show calendar'}
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <TripHeader trip={trip} onSave={handleSave} />
                        <TransportSection transport={trip.transport} onDelete={handleDeleteTransport} />
                        <AccommodationSection accommodation={trip.accommodation} onDelete={handleDeleteAccommodation} />
                        <ActivitiesSection activities={trip.activities} onDelete={handleDeleteActivity} />
                    </Box>

                    {showCalendar && (
                        <Box sx={{ width: 400, flexShrink: 0 }}>
                            <CalendarPanel />
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
}