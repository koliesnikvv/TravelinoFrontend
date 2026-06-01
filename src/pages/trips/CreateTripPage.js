import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import CitySearch from '../../components/trips/CitySearch';
import DateRangePicker from '../../components/DateRangePicker';
import { createTrip } from '../../api/trips';
import { parseError } from '../../api/errors';

export default function CreateTripPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedCity, setSelectedCity] = useState(location.state?.city || null);
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    function handleCityChange(city) {
        setSelectedCity(city);
        if (city && !title) {
            setTitle(`Trip to ${city.city}`);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!selectedCity) {
            setError('Please select a city');
            return;
        }
        if (!startDate || !endDate) {
            setError('Please select travel dates');
            return;
        }
        if (endDate.isBefore(startDate)) {
            setError('End date must be after start date');
            return;
        }

        setSubmitting(true);
        try {
            const trip = await createTrip({
                title: title || `Trip to ${selectedCity.city}`,
                city_id: selectedCity.id,
                city_name: selectedCity.city,
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate.format('YYYY-MM-DD'),
            });
            navigate(`/trips/${trip.id}`);
        } catch (err) {
            setError(parseError(err));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 6, mb: 4, display: 'flex', flexDirection: 'column', gap: 3 }}
            >
                <Typography variant="h4" component="h1">
                    Create a new trip
                </Typography>

                <CitySearch
                    value={selectedCity}
                    onChange={handleCityChange}
                    onError={setError}
                />

                <TextField
                    label="Trip name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    helperText="Leave empty to auto-generate from city name"
                />

                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onStartChange={setStartDate}
                    onEndChange={setEndDate}
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={submitting}
                >
                    {submitting ? <CircularProgress size={24} /> : 'Create trip'}
                </Button>
            </Box>
        </Container>
    );
}