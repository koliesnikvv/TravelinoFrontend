import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import client from '../../api/client';
import { createTripActivity } from '../../api/trips';
import { parseError } from '../../api/errors';
import { Autocomplete, TextField, Select, MenuItem, FormControl, InputLabel, Avatar } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TourIcon from '@mui/icons-material/Tour';

const S = {
    page: { minHeight: '100vh', padding: '32px 16px 64px', fontFamily: "'Segoe UI', sans-serif", color: '#1a4a4a' },
    wrap: { maxWidth: 760, margin: '0 auto' },
    glass: { background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(18px)', borderRadius: 20, padding: 28, border: '1px solid rgba(255,255,255,0.75)' },
    resultCard: { background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(12px)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 },
    field: { display: 'flex', flexDirection: 'column', gap: 6, width: '100%' },
    label: { fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2e7d7d' },
    btnPrimary: { background: 'linear-gradient(135deg, #4db6ac, #26a69a)', color: '#fff', borderRadius: 12, padding: '13px 28px', fontWeight: 600, cursor: 'pointer', border: 'none' },
    btnOutline: { background: 'transparent', color: '#2e7d7d', border: '1.5px solid rgba(77,182,172,0.55)', borderRadius: 12, padding: '11px 22px', fontWeight: 600, cursor: 'pointer' },
    btnSelect: { background: 'linear-gradient(135deg, #4db6ac, #26a69a)', color: '#fff', borderRadius: 10, padding: '10px 22px', fontWeight: 600, cursor: 'pointer', border: 'none' },
    btnCancel: { background: 'transparent', color: '#555', border: '1.5px solid #ddd', borderRadius: 12, padding: '11px 22px', cursor: 'pointer' },
    iconAvatar: { width: 44, height: 44, backgroundColor: '#e0f2fe', color: '#1a4a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' },
    badge: (cat) => ({ display: 'inline-flex', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: '#e0f4f4', color: '#2e7d7d' }),
    overlay: { position: 'fixed', inset: 0, background: 'rgba(10,50,50,0.38)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(24px)', borderRadius: 24, padding: '36px 32px', maxWidth: 460, width: '100%' },
    error: { background: 'rgba(211,47,47,0.10)', border: '1px solid rgba(211,47,47,0.30)', borderRadius: 10, padding: '10px 14px', color: '#b71c1c', fontSize: 14 },
    divider: { border: 'none', borderTop: '1px solid rgba(77,182,172,0.20)', margin: '20px 0' },
};

export default function ActivitySearchPage() {
    const { id: tripId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const pre = location.state || {};

    const [cityInput, setCityInput] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [category, setCategory] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const [searched, setSearched] = useState(false);
    const [sel, setSel] = useState(null);
    const [scheduledDate, setScheduledDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [adding, setAdding] = useState(false);
    const [addErr, setAddErr] = useState(null);

    useEffect(() => {
        const fetchCities = async () => {
            if (cityInput.length < 2) { setCities([]); return; }
            try {
                const res = await client.get(`/catalog/cities/?search=${cityInput}`);
                setCities(res.data.results || res.data);
            } catch (e) { console.error(e); }
        };
        fetchCities();
    }, [cityInput]);

    const search = async () => {
        if (!selectedCity) { setErr('Select a city'); return; }
        setLoading(true); setSearched(true); setErr(null);
        try {
            const params = new URLSearchParams({ city: selectedCity.id });
            if (category) params.append('category', category);
            const res = await client.get(`/catalog/activities/?${params}`);
            setResults(res.data.results || res.data);
        } catch (e) { setErr(parseError(e)); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (selectedCity) search(); }, [selectedCity, category]);

    const handleAdd = async () => {
        if (!scheduledDate || !startTime || !endTime) { setAddErr('Fill all fields'); return; }
        if (endTime.isBefore(startTime)) { setAddErr('End time after start time'); return; }
        setAdding(true);
        try {
            await createTripActivity(tripId, {
                activity: sel.id,
                scheduled_date: scheduledDate.format('YYYY-MM-DD'),
                start_time: startTime.format('HH:mm:ss'),
                end_time: endTime.format('HH:mm:ss'),
            });
            navigate(`/trips/${tripId}`, { state: { successMessage: 'Activity added!' } });
        } catch (e) { setAddErr(parseError(e)); }
        finally { setAdding(false); }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={S.page}>
                <div style={S.wrap}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                        <button style={S.btnOutline} onClick={() => navigate(`/trips/${tripId}`)}>← Back</button>
                        <h1 style={{ margin: 0 }}>Search Activities</h1>
                    </div>
                    <div style={S.glass}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={S.field}>
                                <span style={S.label}>City</span>
                                <Autocomplete
                                    options={cities}
                                    getOptionLabel={(opt) => `${opt.city}, ${opt.country}`}
                                    value={selectedCity}
                                    onChange={(e, v) => setSelectedCity(v)}
                                    onInputChange={(e, v) => setCityInput(v)}
                                    renderInput={(params) => <TextField {...params} placeholder="Type city name..." size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />}
                                />
                            </div>
                            <div style={S.field}>
                                <span style={S.label}>Category</span>
                                <FormControl fullWidth size="small">
                                    <Select value={category} onChange={e => setCategory(e.target.value)} displayEmpty>
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="Culture">Culture</MenuItem>
                                        <MenuItem value="Adventure">Adventure</MenuItem>
                                        <MenuItem value="Nature">Nature</MenuItem>
                                        <MenuItem value="Beaches">Beaches</MenuItem>
                                        <MenuItem value="Nightlife">Nightlife</MenuItem>
                                        <MenuItem value="Cuisine">Cuisine</MenuItem>
                                        <MenuItem value="Wellness">Wellness</MenuItem>
                                        <MenuItem value="Urban">Urban</MenuItem>
                                        <MenuItem value="Seclusion">Seclusion</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <button style={S.btnPrimary} onClick={search} disabled={loading}>Search</button>
                        </div>
                    </div>
                    {err && <div style={S.error}>{err}</div>}
                    {searched && !loading && results.length === 0 && !err && <div style={{ textAlign: 'center', marginTop: 48 }}>No activities found</div>}
                    {results.length > 0 && (
                        <div style={{ marginTop: 24 }}>
                            <p style={{ margin: '0 0 14px', fontSize: 13, color: '#5a9090' }}>
                                {results.length} activity{results.length !== 1 ? 'ies' : ''} found
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                {results.map(act => (
                                    <div key={act.id} style={S.resultCard}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={S.iconAvatar}><TourIcon /></div>
                                            <div>
                                                <span style={S.badge(act.category)}>{act.category}</span>
                                                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{act.title}</div>
                                                <div style={{ fontSize: 13, color: '#5a9090', marginTop: 4 }}>{act.description?.substring(0, 80)}...</div>
                                            </div>
                                        </div>
                                        <button style={S.btnSelect} onClick={() => setSel(act)}>Select</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {sel && (
                <div style={S.overlay} onClick={e => e.target === e.currentTarget && setSel(null)}>
                    <div style={S.modal}>
                        <h2>Schedule activity</h2>
                        <div style={{ fontWeight: 600 }}>{sel.title}</div>
                        <hr style={S.divider} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <DatePicker 
                                label="Date" 
                                value={scheduledDate} 
                                onChange={setScheduledDate} 
                                disablePast
                                slotProps={{ 
                                    textField: { size: 'small' },
                                    openPickerButton: { 
                                        sx: { 
                                            borderRadius: '50%',
                                            width: 32,
                                            height: 32,
                                            minWidth: 0,
                                            padding: 0,
                                            '& .MuiSvgIcon-root': { fontSize: 20 }
                                        } 
                                    }
                                }} 
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
                            {addErr && <div style={S.error}>{addErr}</div>}
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                <button style={S.btnCancel} onClick={() => setSel(null)}>Cancel</button>
                                <button style={S.btnPrimary} onClick={handleAdd} disabled={adding}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </LocalizationProvider>
    );
}