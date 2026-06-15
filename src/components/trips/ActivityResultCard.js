import TourIcon from '@mui/icons-material/Tour';

const S = {
    card: {
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(12px)',
        borderRadius: 16,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
    },
    iconAvatar: {
        width: 44,
        height: 44,
        backgroundColor: '#e0f2fe',
        color: '#1a4a4a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        flexShrink: 0,
    },
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
};

export default function ActivityResultCard({ activity, onClick }) {
    // activity.labels is an array like ["Restaurant", "Bar"] from the backend.
    // Fall back to a single label derived from kinds if labels is missing (cache from before the backend update).
    const labels = activity.labels?.length
        ? activity.labels
        : [activity.kinds?.split(',')[0]?.replace(/_/g, ' ') || 'Place'];

    const thumbnailUrl = `https://source.unsplash.com/80x80/?${encodeURIComponent(activity.name)}`;

    return (
        <div style={S.card} onClick={() => onClick(activity)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                    src={thumbnailUrl}
                    alt=""
                    style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
                    onError={e => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextSibling.style.display = 'flex';
                    }}
                />
                <div style={{ ...S.iconAvatar, display: 'none' }}><TourIcon /></div>
                <div>
                    <div>
                        {labels.map(label => (
                            <span key={label} style={S.badge}>{label}</span>
                        ))}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{activity.name}</div>
                    <div style={{ fontSize: 13, color: '#5a9090', marginTop: 2 }}>
                        rating {activity.rate}
                    </div>
                </div>
            </div>
            <span style={{ fontSize: 13, color: '#4db6ac', fontWeight: 600 }}>View details →</span>
        </div>
    );
}