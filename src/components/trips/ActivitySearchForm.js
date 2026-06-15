import { TextField, Select, MenuItem, FormControl, Chip, Box } from '@mui/material';

const PRICE_OPTIONS = ['budget', 'moderate', 'expensive'];
const VIBE_OPTIONS = ['active', 'relaxed'];
const LOCATION_OPTIONS = ['outdoor', 'indoor'];

const S = {
    glass: {
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(18px)',
        borderRadius: 20,
        padding: 28,
        border: '1px solid rgba(255,255,255,0.75)',
    },
    field: { display: 'flex', flexDirection: 'column', gap: 6, width: '100%' },
    label: { fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2e7d7d' },
    btnPrimary: {
        background: 'linear-gradient(135deg, #4db6ac, #26a69a)',
        color: '#fff',
        borderRadius: 12,
        padding: '13px 28px',
        fontWeight: 600,
        cursor: 'pointer',
        border: 'none',
    },
};

function ChipGroup({ label, options, value, onChange }) {
    return (
        <div style={S.field}>
            <span style={S.label}>{label}</span>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {options.map(opt => (
                    <Chip
                        key={opt}
                        label={opt.charAt(0).toUpperCase() + opt.slice(1)}
                        onClick={() => onChange(value === opt ? '' : opt)}
                        variant={value === opt ? 'filled' : 'outlined'}
                        sx={{
                            borderColor: 'rgba(77,182,172,0.5)',
                            color: value === opt ? '#fff' : '#2e7d7d',
                            bgcolor: value === opt ? '#4db6ac' : 'transparent',
                            fontWeight: 600,
                            '&:hover': { bgcolor: value === opt ? '#26a69a' : 'rgba(77,182,172,0.08)' },
                        }}
                    />
                ))}
            </Box>
        </div>
    );
}

export default function ActivitySearchForm({ query, setQuery, category, setCategory, price, setPrice, vibe, setVibe, locationType, setLocationType, onSearch, loading }) {
    return (
        <div style={S.glass}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={S.field}>
                    <span style={S.label}>What are you looking for?</span>
                    <TextField
                        placeholder="e.g. rooftop bars, street food markets, quiet parks..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && onSearch()}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                </div>

                <div style={S.field}>
                    <span style={S.label}>Category</span>
                    <FormControl fullWidth size="small">
                        <Select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            displayEmpty
                            sx={{ borderRadius: '12px' }}
                        >
                            <MenuItem value="">All</MenuItem>
                            {['Culture', 'Adventure', 'Nature', 'Beaches', 'Nightlife', 'Cuisine', 'Wellness', 'Urban', 'Seclusion'].map(c => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <ChipGroup label="Price" options={PRICE_OPTIONS} value={price} onChange={setPrice} />
                <ChipGroup label="Vibe" options={VIBE_OPTIONS} value={vibe} onChange={setVibe} />
                <ChipGroup label="Location type" options={LOCATION_OPTIONS} value={locationType} onChange={setLocationType} />

                <button style={S.btnPrimary} onClick={onSearch} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>
        </div>
    );
}