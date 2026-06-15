import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert, Button } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TripHeader from '../../components/trips/TripHeader';
import TransportSection from '../../components/trips/TransportSection';
import AccommodationSection from '../../components/trips/AccommodationSection';
import ActivitiesSection from '../../components/trips/ActivitiesSection';
import ParticipantsSection from '../../components/trips/ParticipantsSection';
import CalendarPanel from '../../components/trips/CalendarPanel';
import CalendarResizePanel from '../../components/trips/CalendarResizePanel';
import ExportCalendarModal from '../../components/trips/ExportCalendarModal';
import {
    getTripDetail,
    updateTrip,
    deleteTransportBooking,
    deleteAccommodationBooking,
    deleteTripActivity,
    exportTripICS,
} from '../../api/trips';
import { parseError } from '../../api/errors';

export default function TripPage() {
    const { id } = useParams();

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [saveError, setSaveError] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [exportModalOpen, setExportModalOpen] = useState(false);

    useEffect(() => {
        async function loadTrip() {
            setLoading(true);
            setLoadError(null);
            try {
                const data = await getTripDetail(id);
                setTrip(data);
            } catch (err) {
                setLoadError(parseError(err));
            } finally {
                setLoading(false);
            }
        }
        loadTrip();
    }, [id]);

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

    async function handleExport(options) {
        try {
            await exportTripICS(id, trip.title, options);
        } catch (err) {
            setSaveError(parseError(err));
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (loadError) {
        return (
            <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, mt: 6 }}>
                <Alert severity="error">{loadError}</Alert>
            </Box>
        );
    }

    if (!trip) return null;

    return (
        <Box sx={{ px: 4, mt: 6, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                    onClick={() => setExportModalOpen(true)}
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

            <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                <Box sx={{
                    flex: 1,
                    minWidth: 0,
                    maxWidth: showCalendar ? 'none' : 720,
                    mx: showCalendar ? 0 : 'auto',
                }}>
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
                        trip={trip}
                    />
                    <ParticipantsSection
                        participants={trip.participants}
                        onAdd={handleAddParticipant}
                        onDelete={handleDeleteParticipant}
                        canEdit={canEdit}
                    />
                </Box>

                {showCalendar && (
                    <CalendarResizePanel>
                        <CalendarPanel trip={trip} />
                    </CalendarResizePanel>
                )}
            </Box>

            <ExportCalendarModal
                open={exportModalOpen}
                onClose={() => setExportModalOpen(false)}
                onExport={handleExport}
            />
        </Box>
    );
}