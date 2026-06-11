import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';

const DEFAULT_OPTIONS = {
    activities: true,
    transport: true,
    accommodation: true,
};

export default function ExportCalendarModal({ open, onClose, onExport }) {
    const [options, setOptions] = useState(DEFAULT_OPTIONS);

    function handleChange(key) {
        setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    }

    function handleExport() {
        onExport(options);
        onClose();
    }

    // Reset to defaults when modal opens
    function handleEnter() {
        setOptions(DEFAULT_OPTIONS);
    }

    const nothingSelected = !options.activities && !options.transport && !options.accommodation;

    return (
        <Dialog open={open} onClose={onClose} TransitionProps={{ onEnter: handleEnter }} maxWidth="xs" fullWidth>
            <DialogTitle>Export to calendar</DialogTitle>
            <DialogContent>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox checked={options.activities} onChange={() => handleChange('activities')} />}
                        label="Activities"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={options.transport} onChange={() => handleChange('transport')} />}
                        label="Transport"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={options.accommodation} onChange={() => handleChange('accommodation')} />}
                        label="Accommodation"
                    />
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleExport} disabled={nothingSelected}>
                    Export
                </Button>
            </DialogActions>
        </Dialog>
    );
}