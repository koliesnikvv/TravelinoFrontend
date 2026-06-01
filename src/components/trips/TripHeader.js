import { useState } from 'react';
import { Box, Typography, TextField, Button, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DateRangePicker from '../DateRangePicker';
import dayjs from 'dayjs';

export default function TripHeader({ trip, onSave }) {
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingDates, setEditingDates] = useState(false);
    const [title, setTitle] = useState(trip.title);
    const [startDate, setStartDate] = useState(trip.start_date ? dayjs(trip.start_date) : null);
    const [endDate, setEndDate] = useState(trip.end_date ? dayjs(trip.end_date) : null);
    const [isDirty, setIsDirty] = useState(false);

    function handleTitleChange(e) {
        setTitle(e.target.value);
        setIsDirty(true);
    }

    function handleStartChange(date) {
        setStartDate(date);
        setIsDirty(true);
    }

    function handleEndChange(date) {
        setEndDate(date);
        setIsDirty(true);
    }

    function handleSave() {
        onSave({
            title,
            start_date: startDate ? startDate.format('YYYY-MM-DD') : trip.start_date,
            end_date: endDate ? endDate.format('YYYY-MM-DD') : trip.end_date,
        });
        setIsDirty(false);
        setEditingTitle(false);
        setEditingDates(false);
    }

    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {editingTitle ? (
                    <TextField
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={() => setEditingTitle(false)}
                        autoFocus
                        size="small"
                        variant="standard"
                        inputProps={{ style: { fontSize: '2rem' } }}
                    />
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h4" component="h1">
                            {title}
                        </Typography>
                        <EditIcon
                            fontSize="small"
                            color="action"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => setEditingTitle(true)}
                        />
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Chip label={trip.city_name} variant="outlined" />
                {editingDates ? (
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartChange={handleStartChange}
                        onEndChange={handleEndChange}
                    />
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {trip.start_date} — {trip.end_date}
                        </Typography>
                        <EditIcon
                            fontSize="small"
                            color="action"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => setEditingDates(true)}
                        />
                    </Box>
                )}
            </Box>

            {isDirty && (
                <Button variant="contained" size="small" onClick={handleSave}>
                    Save
                </Button>
            )}
        </Box>
    );
}