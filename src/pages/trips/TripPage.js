import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Box, Container, CircularProgress, Alert, Button, Typography, Card, CardContent} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TripHeader from '../../components/trips/TripHeader';
import TransportSection from '../../components/trips/TransportSection';
import AccommodationSection from '../../components/trips/AccommodationSection';
import ActivitiesSection from '../../components/trips/ActivitiesSection';
import ParticipantsSection from '../../components/trips/ParticipantsSection';
import CalendarPanel from '../../components/trips/CalendarPanel';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import CloseIcon from '@mui/icons-material/Close';
import { Modal, TextField, IconButton } from '@mui/material';
import { searchFlights, searchAirports} from '../../api/flights';
import { addTransportBooking } from '../../api/trips';
import {
    getTripDetail,
    updateTrip,
    deleteTransportBooking,
    deleteAccommodationBooking,
    deleteTripActivity,
} from '../../api/trips';
import { parseError } from '../../api/errors';


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 800,
    maxHeight: '85vh',
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    overflow: 'auto',
    p: 0,
};

export default function TripPage() {
    const { id } = useParams();

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [saveError, setSaveError] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [flightModalOpen, setFlightModalOpen] = useState(false);
    const [flightSearchParams, setFlightSearchParams] = useState({
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        adults: 1
    });
    const [flightResults, setFlightResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [originSuggestions, setOriginSuggestions] = useState([]);
    const [destSuggestions, setDestSuggestions] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [addingFlight, setAddingFlight] = useState(false);


    useEffect(() => {
        async function loadTrip() {
            setLoading(true);
            setLoadError(null);
            try {
                const data = await getTripDetail(id);
                setTrip(data);
                if (data.city?.name) {
                    setFlightSearchParams(prev => ({
                        ...prev,
                        destination: data.city.name
                    }));
                }
            } catch (err) {
                setLoadError(parseError(err));
            } finally {
                setLoading(false);
            }
        }

        loadTrip();
    }, [id]);

        //     } catch (err) {
        //         setLoadError(parseError(err));
        //     } finally {
        //         setLoading(false);
        //     }
        // }

    //     loadTrip();
    // }, [id]);

    // current_user_role is returned by the backend as 'owner', 'edit', or 'view'
    const canEdit = trip?.current_user_role === 'owner' || trip?.current_user_role === 'edit';

    async function handleSave(data) {
        setSaveError(null);
        try {
            const updated = await updateTrip(id, data);
            setTrip((prev) => ({ ...prev, ...updated }));
        } catch (err) {
            setSaveError(parseError(err));
        }
    }

    async function handleDeleteTransport(itemId) {
        try {
            await deleteTransportBooking(id, itemId);
            setTrip((prev) => ({
                ...prev,
                transport: prev.transport.filter((t) => t.id !== itemId),
            }));
        } catch (err) {
            setSaveError(parseError(err));
        }
    }

    async function handleDeleteAccommodation(itemId) {
        try {
            await deleteAccommodationBooking(id, itemId);
            setTrip((prev) => ({
                ...prev,
                accommodation: prev.accommodation.filter((a) => a.id !== itemId),
            }));
        } catch (err) {
            setSaveError(parseError(err));
        }
    }

    async function handleDeleteActivity(itemId) {
        try {
            await deleteTripActivity(id, itemId);
            setTrip((prev) => ({
                ...prev,
                activities: prev.activities.filter((a) => a.id !== itemId),
            }));
        } catch (err) {
            setSaveError(parseError(err));
        }
    }

    function handleAddParticipant(participant) {
        setTrip((prev) => ({
            ...prev,
            participants: [...prev.participants, participant],
        }));
    }

    function handleDeleteParticipant(participantId) {
        setTrip((prev) => ({
            ...prev,
            participants: prev.participants.filter((p) => p.id !== participantId),
        }));
    }

    function handleExport() {
        console.log('export to calendar');
    }

   const handleAirportSearch = async (field, value) => {
    if (value.length < 2) {
        if (field === 'origin') setOriginSuggestions([]);
        else setDestSuggestions([]);
        return;
    }

    try {
        const results = await searchAirports(value);
        console.log(`Got ${results.length} results for ${field}:`, results);

        if (field === 'origin') {
            setOriginSuggestions(results);
        } else {
            setDestSuggestions(results);
        }
    } catch (error) {
        console.error(`Error searching ${field}:`, error);
        if (field === 'origin') setOriginSuggestions([]);
        else setDestSuggestions([]);
    }
};
    const selectAirport = (field, airport) => {
        console.log(`Selected ${field}:`, airport);
        setFlightSearchParams(prev => ({
        ...prev,
        [field]: airport.iataCode
        }));
        if (field === 'origin') setOriginSuggestions([]);
        else setDestSuggestions([]);
    };

    const searchFlightsHandler = async () => {
    console.log('Search params before validation:', flightSearchParams);

    const isIataCode = (code) => {
        if (!code) return false;
        const upperCode = code.toUpperCase();
        return /^[A-Z]{2,3}$/.test(upperCode);
    };

    if (!flightSearchParams.origin || !flightSearchParams.destination || !flightSearchParams.departureDate) {
        setSaveError('Please fill in origin, destination and departure date');
        return;
    }

    if (!isIataCode(flightSearchParams.origin)) {
        setSaveError(`"${flightSearchParams.origin}" is not a valid airport code. Please select an airport from the suggestions.`);
        return;
    }

    if (!isIataCode(flightSearchParams.destination)) {
        setSaveError(`"${flightSearchParams.destination}" is not a valid airport code. Please select an airport from the suggestions.`);
        return;
    }

    setSearching(true);
    setFlightResults([]);
    try {
        const results = await searchFlights({
            origin: flightSearchParams.origin.toUpperCase(),
            destination: flightSearchParams.destination.toUpperCase(),
            departureDate: flightSearchParams.departureDate,
            returnDate: flightSearchParams.returnDate || undefined,
            adults: flightSearchParams.adults
        });

        console.log('Flight search results:', results);

        if (results.flight_offers?.length === 0) {
            setSaveError('No flights found for these criteria');
        } else if (results.flight_offers?.length > 0) {
            setFlightResults(results.flight_offers);
            setSaveError(null);
        }
    } catch (error) {
        console.error('Error searching flights:', error);
        setSaveError('Failed to search flights. Please try again.');
    } finally {
        setSearching(false);
    }
};

    const selectFlightHandler = (flight) => {
        setSelectedFlight(selectedFlight === flight ? null : flight);
    };

    const addFlightToTrip = async () => {
        if (!selectedFlight) {
            setSaveError('Please select a flight first');
            return;
        }
         setAddingFlight(true);
        try {
            const transportData = {
                type: 'flight',
                title: `${selectedFlight[`0_firstFlightAirline`] || 'Flight'} - ${selectedFlight[`0_firstFlightDepartureAirport`]} → ${selectedFlight[`0_firstFlightArrivalAirport`]}`,
                description: `Departure: ${selectedFlight[`0_firstFlightDepartureDate`]} | Arrival: ${selectedFlight[`0_firstFlightArrivalDate`]}`,
                price: parseFloat(selectedFlight.price),
                departure_airport: selectedFlight[`0_firstFlightDepartureAirport`],
                arrival_airport: selectedFlight[`0_firstFlightArrivalAirport`],
                departure_time: selectedFlight[`0_firstFlightDepartureDate`],
                arrival_time: selectedFlight[`0_firstFlightArrivalDate`],
                airline: selectedFlight[`0_firstFlightAirline`],
                flight_number: selectedFlight.id,
                booking_reference: selectedFlight.id
            };
            const newTransport = await addTransportBooking(id, transportData);
            setTrip((prev) => ({
                ...prev,
                transport: [...(prev.transport || []), newTransport],
            }));
            setFlightModalOpen(false);
            setSelectedFlight(null);
            setFlightResults([]);
            setFlightSearchParams({
                origin: '',
                destination: trip?.city?.name || '',
                departureDate: '',
                returnDate: '',
                adults: 1
            });
            setSaveError(null);
        } catch (err) {
            console.error('Error adding flight:', err);
            setSaveError(parseError(err));
        } finally {
            setAddingFlight(false);
        }
    };


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (loadError) {
        return (
            <Container maxWidth="md" sx={{ mt: 6 }}>
                <Alert severity="error">{loadError}</Alert>
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
                        {saveError && (
                            <Alert
                                severity="error"
                                onClose={() => setSaveError(null)}
                                sx={{ mb: 2 }}
                            >
                                {saveError}
                            </Alert>
                        )}

                        <TripHeader trip={trip} onSave={handleSave} canEdit={canEdit} />
                        <TransportSection
                            transport={trip.transport}
                            onDelete={handleDeleteTransport}
                            canEdit={canEdit}
                            onAddFlight={() => setFlightModalOpen(true)}
                        />
                        <AccommodationSection
                            accommodation={trip.accommodation}
                            onDelete={handleDeleteAccommodation}
                            canEdit={canEdit}
                        />
                        <ActivitiesSection
                            activities={trip.activities}
                            onDelete={handleDeleteActivity}
                            canEdit={canEdit}
                        />
                        <ParticipantsSection
                            participants={trip.participants}
                            onAdd={handleAddParticipant}
                            onDelete={handleDeleteParticipant}
                            canEdit={canEdit}
                        />
                    </Box>

                    {showCalendar && (
                        <Box sx={{ width: 400, flexShrink: 0 }}>
                            <CalendarPanel />
                        </Box>
                    )}
                </Box>
            </Box>
             <Modal
                open={flightModalOpen}
                onClose={() => setFlightModalOpen(false)}
                aria-labelledby="flight-search-modal"
            >
                <Box sx={modalStyle}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderBottom: 1,
                        borderColor: 'divider'
                    }}>
                        <Typography variant="h6" component="h2">
                            <FlightTakeoffIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Search Flights
                        </Typography>
                        <IconButton onClick={() => setFlightModalOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Box sx={{ flex: 1, position: 'relative' }}>
                                    <Typography variant="caption" color="text.secondary">From ✈️</Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="City or airport"
                                        value={flightSearchParams.origin}
                                        onChange={(e) => {
                                            setFlightSearchParams(prev => ({ ...prev, origin: e.target.value }));
                                            handleAirportSearch('origin', e.target.value);
                                        }}
                                    />
                                    {originSuggestions.length > 0 && (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            bgcolor: 'white',
                                            boxShadow: 3,
                                            zIndex: 10,
                                            borderRadius: 1,
                                            maxHeight: 200,
                                            overflow: 'auto'
                                        }}>
                                            {originSuggestions.map(airport => (
                                                <Box
                                                    key={airport.iataCode}
                                                    sx={{ p: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f0f5f5' } }}
                                                    onClick={() => selectAirport('origin', airport)}
                                                >
                                                    <Typography variant="body2">
                                                        <strong>{airport.iataCode}</strong> - {airport.name}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                                <Box sx={{ flex: 1, position: 'relative' }}>
                                    <Typography variant="caption" color="text.secondary">To 🎯</Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="City or airport"
                                        value={flightSearchParams.destination}
                                        onChange={(e) => {
                                            setFlightSearchParams(prev => ({ ...prev, destination: e.target.value }));
                                            handleAirportSearch('destination', e.target.value);
                                        }}
                                    />
                                    {destSuggestions.length > 0 && (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            bgcolor: 'white',
                                            boxShadow: 3,
                                            zIndex: 10,
                                            borderRadius: 1,
                                            maxHeight: 200,
                                            overflow: 'auto'
                                        }}>
                                            {destSuggestions.map(airport => (
                                                <Box
                                                    key={airport.iataCode}
                                                    sx={{ p: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f0f5f5' } }}
                                                    onClick={() => selectAirport('destination', airport)}
                                                >
                                                    <Typography variant="body2">
                                                        <strong>{airport.iataCode}</strong> - {airport.name}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" color="text.secondary">Departure Date</Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        value={flightSearchParams.departureDate}
                                        onChange={(e) => setFlightSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" color="text.secondary">Return Date (optional)</Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        value={flightSearchParams.returnDate}
                                        onChange={(e) => setFlightSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Box>
                                <Box sx={{ flex: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">Passengers</Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        min={1}
                                        max={9}
                                        value={flightSearchParams.adults}
                                        onChange={(e) => setFlightSearchParams(prev => ({ ...prev, adults: parseInt(e.target.value) }))}
                                    />
                                </Box>
                            </Box>

                            <Button
                                variant="contained"
                                onClick={searchFlightsHandler}
                                disabled={searching}
                                sx={{ bgcolor: '#1a4a4a', '&:hover': { bgcolor: '#2d6a6a' } }}
                            >
                                {searching ? <CircularProgress size={24} /> : '🔍 Search Flights'}
                            </Button>
                        </Box>

                        {flightResults.length > 0 && (
                            <Box>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    Available Flights ({flightResults.length})
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 400, overflow: 'auto' }}>
                                    {flightResults.map((flight, idx) => (
                                        <Card
                                            key={idx}
                                            sx={{
                                                cursor: 'pointer',
                                                border: selectedFlight === flight ? '2px solid #1a4a4a' : '1px solid #e0ecec',
                                                bgcolor: selectedFlight === flight ? '#f5faf5' : 'white',
                                                '&:hover': { boxShadow: 3 }
                                            }}
                                            onClick={() => selectFlightHandler(flight)}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="h6" color="#1a4a4a">
                                                        {flight[`0_firstFlightAirline`] || 'Airline'}
                                                    </Typography>
                                                    <Typography variant="h6" color="#1a4a4a">
                                                        ${flight.price}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="body1" fontWeight="bold">
                                                            {flight[`0_firstFlightDepartureAirport`]}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {flight[`0_firstFlightDepartureDate`]}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2"> →</Typography>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="body1" fontWeight="bold">
                                                            {flight[`0_firstFlightArrivalAirport`]}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {flight[`0_firstFlightArrivalDate`]}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                {flight[`0_stop_time`] && (
                                                    <Typography variant="caption" color="#ff6b6b" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                                                        Stop: {flight[`0_stop_time`]}
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        p: 2,
                        borderTop: 1,
                        borderColor: 'divider'
                    }}>
                        <Button variant="outlined" onClick={() => setFlightModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={addFlightToTrip}
                            disabled={!selectedFlight || addingFlight}
                            sx={{ bgcolor: '#1a4a4a', '&:hover': { bgcolor: '#2d6a6a' } }}
                        >
                            {addingFlight ? <CircularProgress size={24} /> : 'Add Selected Flight'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
}