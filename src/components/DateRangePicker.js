import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function DateRangePicker({ startDate, endDate, onStartChange, onEndChange }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <DatePicker
                    label="Start date"
                    value={startDate}
                    onChange={onStartChange}
                    disablePast
                    slotProps={{ textField: { required: true } }}
                />
                <DatePicker
                    label="End date"
                    value={endDate}
                    onChange={onEndChange}
                    disablePast
                    minDate={startDate || undefined}
                    slotProps={{ textField: { required: true } }}
                />
            </Box>
        </LocalizationProvider>
    );
}