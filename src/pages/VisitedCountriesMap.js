import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Select,
    MenuItem,
    Button,
    Chip,
    FormControl,
    InputLabel,
    Alert,
    CircularProgress,
    Divider
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import client from '../api/client';
import 'leaflet/dist/leaflet.css';
import Loading from "../components/animations/Loading";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const countryCoordinates = {
    'UA': { lat: 48.3794, lng: 31.1656, name: 'Ukraine' },
    'US': { lat: 37.0902, lng: -95.7129, name: 'USA' },
    'GB': { lat: 55.3781, lng: -3.4360, name: 'Great Britain' },
    'FR': { lat: 46.6034, lng: 1.8883, name: 'France' },
    'DE': { lat: 51.1657, lng: 10.4515, name: 'Germany' },
    'IT': { lat: 41.8719, lng: 12.5674, name: 'Italy' },
    'ES': { lat: 40.4637, lng: -3.7492, name: 'Spain' },
    'PL': { lat: 51.9194, lng: 19.1451, name: 'Poland' },
    'JP': { lat: 36.2048, lng: 138.2529, name: 'Japan' },
    'CN': { lat: 35.8617, lng: 104.1954, name: 'China' },
    'IN': { lat: 20.5937, lng: 78.9629, name: 'India' },
    'BR': { lat: -14.2350, lng: -51.9253, name: 'Brasil' },
    'AU': { lat: -25.2744, lng: 133.7751, name: 'Australia' },
    'CA': { lat: 56.1304, lng: -106.3468, name: 'Canada' },
    'MX': { lat: 23.6345, lng: -102.5528, name: 'Mexico' },
    'EG': { lat: 26.8206, lng: 30.8025, name: 'Egypt' },
    'ZA': { lat: -30.5595, lng: 22.9375, name: 'SAR' },
    'TR': { lat: 38.9637, lng: 35.2433, name: 'Turkey' },
    'AE': { lat: 23.4241, lng: 53.8478, name: 'UAE' },
    'TH': { lat: 15.8700, lng: 100.9925, name: 'Thailand' },
    'IL': { lat: 31.0461, lng: 34.8516, name: 'Israel' }
};

function VisitedCountriesMap() {
    const [visitedCountries, setVisitedCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVisitedCountries();
    }, []);

    const fetchVisitedCountries = async () => {
        try {
            setLoading(true);
            const response = await client.get('/maps/visited-countries/');
            setVisitedCountries(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching visited countries:', err);
            setError('Cannot load list of countries.');
        } finally {
            setLoading(false);
        }
    };

    const addCountry = async () => {
        if (!selectedCountry) return;

        const country = countryCoordinates[selectedCountry];
        if (!country) return;

        setAdding(true);
        try {
            const response = await client.post('/maps/visited-countries/', {
                country_code: selectedCountry,
                country_name: country.name
            });
            setVisitedCountries([...visitedCountries, response.data]);
            setSelectedCountry('');
            setError(null);
        } catch (err) {
            console.error('Error adding country:', err);
            setError(err.response?.data?.message || 'Error adding country.');
        } finally {
            setAdding(false);
        }
    };

    const removeCountry = async (countryId) => {
        try {
            await client.delete(`/maps/visited-countries/${countryId}/`);
            setVisitedCountries(visitedCountries.filter(c => c.id !== countryId));
            setError(null);
        } catch (err) {
            console.error('Error removing country:', err);
            setError('Could not remove country.');
        }
    };

    const getMarkers = () => {
        return visitedCountries
            .map(country => {
                const coords = countryCoordinates[country.country_code];
                if (coords) {
                    return {
                        id: country.id,
                        position: [coords.lat, coords.lng],
                        name: country.country_name,
                        code: country.country_code
                    };
                }
                return null;
            })
            .filter(marker => marker !== null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                <CircularProgress />
            </Box>
        );
    }
    if (loading) {
        return <Loading />;
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                My visited countries
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Tag countries that you've visited. They will be shown on a map below.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            <Box display="flex" gap={2} mb={4} alignItems="center" flexWrap="wrap">
                <FormControl sx={{ minWidth: 250 }}>
                    <InputLabel>Choose country</InputLabel>
                    <Select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        label="Select country"
                        disabled={adding}
                    >
                        {Object.entries(countryCoordinates)
                            .filter(([code]) => !visitedCountries.some(c => c.country_code === code))
                            .map(([code, data]) => (
                                <MenuItem key={code} value={code}>
                                    {data.name}
                                </MenuItem>
                            ))}
                        {visitedCountries.length === Object.keys(countryCoordinates).length && (
                            <MenuItem disabled>All countries are added!</MenuItem>
                        )}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    onClick={addCountry}
                    disabled={!selectedCountry || adding}
                    sx={{ height: 56 }}
                >
                    {adding ? <CircularProgress size={24} /> : 'Add country'}
                </Button>
            </Box>

            <Box mb={4} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    style={{ height: '450px', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {getMarkers().map(marker => (
                        <Marker key={marker.id} position={marker.position}>
                            <Popup>
                                <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {marker.name}
                                    </Typography>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => removeCountry(marker.id)}
                                        sx={{ mt: 1 }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                    Visited countries ({visitedCountries.length})
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                    {visitedCountries.map(country => (
                        <Chip
                            key={country.id}
                            label={country.country_name}
                            onDelete={() => removeCountry(country.id)}
                            color="primary"
                            variant="outlined"
                        />
                    ))}
                    {visitedCountries.length === 0 && (
                        <Typography color="text.secondary" variant="body2">
                            No country is added now. Select country from the list!
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default VisitedCountriesMap;