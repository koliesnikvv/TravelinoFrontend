import { CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    modalBody: { padding: '28px 32px 32px' },
    badge: {
        display: 'inline-flex',
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        background: '#e0f4f4',
        color: '#2e7d7d',
        marginRight: 4,
    },
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

function formatAddress(address) {
    if (!address) return null;
    return [address.pedestrian, address.suburb, address.city].filter(Boolean).join(', ');
}

export default function ActivityDetailModal({ place, loading, error, onClose, onAddToTrip }) {
    if (!place) return null;

    const labels = place.labels?.length
        ? place.labels
        : [place.kinds?.split(',')[0]?.replace(/_/g, ' ') || 'Place'];

    return (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={S.modal}>
                {place.image && (
                    <img
                        src={place.image}
                        alt={place.name}
                        style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: '24px 24px 0 0' }}
                        // Hide broken images instead of showing alt text
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                )}
                <div style={S.modalBody}>
                    <div>
                        {labels.map(label => (
                            <span key={label} style={S.badge}>{label}</span>
                        ))}
                    </div>
                    <h2 style={{ margin: '8px 0 4px', fontSize: 22 }}>{place.name}</h2>

                    {formatAddress(place.address) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#5a9090', fontSize: 13, marginBottom: 12 }}>
                            <LocationOnIcon sx={{ fontSize: 16 }} />
                            {formatAddress(place.address)}
                        </div>
                    )}

                    {loading && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5a9090', margin: '12px 0' }}>
                            <CircularProgress size={16} sx={{ color: '#4db6ac' }} />
                            <span style={{ fontSize: 13 }}>Loading description...</span>
                        </div>
                    )}

                    {place.description && (
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: '#2e4a4a', margin: '12px 0' }}>
                            {place.description}
                        </p>
                    )}

                    {error && <div style={{ ...S.error, marginBottom: 12 }}>{error}</div>}

                    {/* otm_url removed — links were unreliable */}

                    <hr style={S.divider} />
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                        <button style={S.btnCancel} onClick={onClose}>Cancel</button>
                        <button style={S.btnPrimary} onClick={onAddToTrip}>Add to trip</button>
                    </div>
                </div>
            </div>
        </div>
    );
}