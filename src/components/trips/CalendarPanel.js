import { Box, Typography } from '@mui/material';

export default function CalendarPanel() {
    return (
        <Box
            sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
            }}
        >
            <Typography variant="body2" color="text.secondary">
                Calendar coming soon
            </Typography>
        </Box>
    );
}