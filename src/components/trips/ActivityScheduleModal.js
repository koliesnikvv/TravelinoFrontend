import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const S = {
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,50,50,0.38)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
    },
    modal: {
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(24px)',
        borderRadius: 24,
        maxWidth: 520,
        width: '100%',
    },
    modalBody: { padding: '28px 32px 32px' },
    error: {
        background: 'rgba(211,47,47,0.10)',
        border: '1px solid rgba(211,47,47,0.30)',
        borderRadius: 10,
        padding: '10px 14px',
        color: '#b71c1c',
        fontSize: 14,
    },
    divider: { border: 'none', borderTop: '1px solid rgba(77,182,172,0.20)', margin: '20px 0' },
    btnPrimary: {
        background: 'linear-gradient(135deg, #4db6ac, #26a69a)',
        color: '#fff',
        borderRadius: 12,
        padding: '13px 28px',
        fontWeight: 600,
        cursor: 'pointer',
        border: 'none',
    },
    btnCancel: {
        background: 'transparent',
        color: '#555',
        border: '1.5px solid #ddd',
        borderRadius: 12,
        padding: '11px 22px',
        cursor: 'pointer',
    },
};

export default function ActivityScheduleModal({ place, scheduledDate, setScheduledDate, startTime, setStartTime, endTime, setEndTime, onCancel, onAdd, adding, error }) {
    if (!place) return null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={S.overlay} onClick={e => e.target === e.currentTarget && onCancel()}>
                <div style={S.modal}>
                    <div style={S.modalBody}>
                        <h2 style={{ margin: '0 0 8px' }}>Schedule activity</h2>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{place.name}</div>
                        <hr style={S.divider} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <DatePicker
                                label="Date"
                                value={scheduledDate}
                                onChange={setScheduledDate}
                                disablePast
                                slotProps={{ textField: { size: 'small' } }}
                            />
                            <TimePicker
                                label="Start time"
                                value={startTime}
                                onChange={setStartTime}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                            <TimePicker
                                label="End time"
                                value={endTime}
                                onChange={setEndTime}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                            {error && <div style={S.error}>{error}</div>}
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                <button style={S.btnCancel} onClick={onCancel}>Cancel</button>
                                <button style={S.btnPrimary} onClick={onAdd} disabled={adding}>
                                    {adding ? 'Adding...' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LocalizationProvider>
    );
}