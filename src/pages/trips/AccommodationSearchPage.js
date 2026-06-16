import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import client from '../../api/client';
import { createAccommodationBooking } from '../../api/trips';
import { parseError } from '../../api/errors';
import HotelIcon from '@mui/icons-material/Hotel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add';
import { Select, MenuItem, FormControl, InputLabel, Rating, Slider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const S = {
    page: { minHeight: '100vh', padding: '32px 16px 64px', fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a4a4a' },
    wrap: { maxWidth: 760, margin: '0 auto' },
    glass: {
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.75)',
        boxShadow: '0 8px 32px rgba(29,112,112,0.12)',
        padding: 28,
    },
    resultCard: {
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.80)',
        boxShadow: '0 4px 16px rgba(29,112,112,0.10)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        cursor: 'default',
    },
    siteCard: {
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.80)',
        boxShadow: '0 4px 16px rgba(29,112,112,0.10)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    field: { display: 'flex', flexDirection: 'column', gap: 6 },
    label: { fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2e7d7d' },
    input: {
        padding: '11px 14px', borderRadius: 12, border: '1.5px solid rgba(77,182,172,0.45)',
        background: 'rgba(255,255,255,0.70)', fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box',
    },
    btnPrimary: {
        background: 'linear-gradient(135deg, #4db6ac, #26a69a)', color: '#fff', border: 'none',
        borderRadius: 12, padding: '13px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
    },
    btnOutline: {
        background: 'transparent', color: '#2e7d7d', border: '1.5px solid rgba(77,182,172,0.55)',
        borderRadius: 12, padding: '11px 22px', fontSize: 14, fontWeight: 600,
        fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
    },
    btnSelect: {
        background: 'linear-gradient(135deg, #4db6ac, #26a69a)', color: '#fff', border: 'none',
        borderRadius: 10, padding: '10px 22px', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
        boxShadow: '0 3px 10px rgba(38,166,154,0.30)', cursor: 'pointer',
    },
    btnCancel: {
        background: 'transparent', color: '#555', border: '1.5px solid #ddd',
        borderRadius: 12, padding: '11px 22px', fontSize: 14, cursor: 'pointer',
    },
    iconAvatar: {
        width: 44, height: 44, backgroundColor: '#e0f2fe', color: '#1a4a4a',
        display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px',
    },
    badge: () => ({
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
        background: '#e0f4f4', color: '#2e7d7d', letterSpacing: '0.04em',
    }),
    overlay: {
        position: 'fixed', inset: 0, background: 'rgba(10,50,50,0.38)',
        backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
    },
    modal: {
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(24px)',
        borderRadius: 24, border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 20px 60px rgba(29,112,112,0.22)', padding: '36px 32px', width: '100%', maxWidth: 460,
    },
    error: {
        background: 'rgba(211,47,47,0.10)', border: '1px solid rgba(211,47,47,0.30)',
        borderRadius: 10, padding: '10px 14px', color: '#b71c1c', fontSize: 14,
    },
    divider: { border: 'none', borderTop: '1px solid rgba(77,182,172,0.20)', margin: '20px 0' },
    sectionTitle: { margin: '0 0 12px', fontSize: 13, color: '#5a9090', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' },
};

const ACCOMMODATION_SITES = [
    {
        name: 'Booking.com',
        description: 'Hotels, apartments, hostels',
        iconBg: '#003580',
        iconText: 'B',
        getUrl: (city, checkIn, checkOut) => {
            const ci = checkIn ? dayjs(checkIn).format('YYYY-MM-DD') : '';
            const co = checkOut ? dayjs(checkOut).format('YYYY-MM-DD') : '';
            return `https://www.booking.com/search.html?ss=${encodeURIComponent(city)}&checkin=${ci}&checkout=${co}`;
        },
    },
    {
        name: 'Airbnb',
        description: 'Apartments and private rooms',
        iconBg: '#ff5a5f',
        iconText: 'A',
        getUrl: (city, checkIn, checkOut) => {
            const ci = checkIn ? dayjs(checkIn).format('YYYY-MM-DD') : '';
            const co = checkOut ? dayjs(checkOut).format('YYYY-MM-DD') : '';
            return `https://www.airbnb.com/s/${encodeURIComponent(city)}/homes?checkin=${ci}&checkout=${co}`;
        },
    },
    {
        name: 'Hostelworld',
        description: 'Hostels and budget accommodation',
        iconBg: '#f57c00',
        iconText: 'H',
        getUrl: (city, checkIn, checkOut) => {
            const ci = checkIn ? dayjs(checkIn).format('YYYY-MM-DD') : '';
            const co = checkOut ? dayjs(checkOut).format('YYYY-MM-DD') : '';
            return `https://www.hostelworld.com/search?search_keywords=${encodeURIComponent(city)}&arrival=${ci}&departure=${co}&number_of_guests=1`;
        },
    },
];

export default function AccommodationSearchPage() {
    const { id: tripId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const pre = location.state || {};

    const [city, setCity] = useState(pre.city || '');
    const [checkIn, setCheckIn] = useState(pre.checkIn ? dayjs(pre.checkIn) : null);
    const [checkOut, setCheckOut] = useState(pre.checkOut ? dayjs(pre.checkOut) : null);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500);
    const [sortBy, setSortBy] = useState('price_per_night');

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const [searched, setSearched] = useState(false);

    // catalog modal state
    const [sel, setSel] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [adding, setAdding] = useState(false);
    const [addErr, setAddErr] = useState(null);

    // manual form state
    const [showManual, setShowManual] = useState(false);
    const [manualData, setManualData] = useState({
        accommodation_name: '',
        check_in_date: pre.checkIn ? dayjs(pre.checkIn) : null,
        check_out_date: pre.checkOut ? dayjs(pre.checkOut) : null,
        price_per_night: '',
    });
    const [manualAdding, setManualAdding] = useState(false);
    const [manualErr, setManualErr] = useState(null);

    const search = useCallback(async () => {
        if (!city.trim()) { setErr('Please enter a city'); return; }
        if (!checkIn || !checkOut) { setErr('Please select check-in and check-out dates'); return; }
        setErr(null); setLoading(true); setSearched(true);
        try {
            const params = new URLSearchParams();
            params.append('city', pre.cityId || '');
            if (minPrice > 0) params.append('min_price', minPrice);
            if (maxPrice < 500) params.append('max_price', maxPrice);
            params.append('sort_by', sortBy);
            const response = await client.get(`/catalog/accommodations/?${params}`);
            setResults(response.data.results || response.data);
        } catch (e) { setErr(parseError(e)); }
        finally { setLoading(false); }
    }, [city, checkIn, checkOut, minPrice, maxPrice, sortBy, pre.cityId]);

    useEffect(() => { if (pre.city) search(); }, []);

    function openModal(opt) {
        setSel(opt);
        setCheckInDate(checkIn || dayjs().add(1, 'day'));
        setCheckOutDate(checkOut || dayjs().add(3, 'day'));
        setAddErr(null);
    }

    async function handleAddFromCatalog() {
        if (!checkInDate || !checkOutDate) { setAddErr('Select dates'); return; }
        if (checkOutDate.isBefore(checkInDate)) { setAddErr('Check-out must be after check-in'); return; }
        const nights = checkOutDate.diff(checkInDate, 'day');
        const totalPrice = (parseFloat(sel.price_per_night) * nights).toFixed(2);
        setAdding(true);
        try {
            await createAccommodationBooking(tripId, {
                accommodation_name: sel.name,
                check_in_date: checkInDate.format('YYYY-MM-DD'),
                check_out_date: checkOutDate.format('YYYY-MM-DD'),
                price_per_night: sel.price_per_night,
                total_price: totalPrice,
                accommodation_option: sel.id,
            });
            navigate(`/trips/${tripId}`, { state: { successMessage: 'Accommodation added!' } });
        } catch (e) { setAddErr(parseError(e)); }
        finally { setAdding(false); }
    }

    function handleManualChange(field, value) {
        setManualData(prev => ({ ...prev, [field]: value }));
    }

    async function handleAddManual() {
        setManualErr(null);
        if (!manualData.accommodation_name.trim()) { setManualErr('Enter accommodation name.'); return; }
        if (!manualData.check_in_date) { setManualErr('Select check-in date.'); return; }
        if (!manualData.check_out_date) { setManualErr('Select check-out date.'); return; }
        if (manualData.check_out_date.isBefore(manualData.check_in_date) || manualData.check_out_date.isSame(manualData.check_in_date)) {
            setManualErr('Check-out must be after check-in.');
            return;
        }
        if (!manualData.price_per_night || isNaN(parseFloat(manualData.price_per_night)) || parseFloat(manualData.price_per_night) <= 0) {
            setManualErr('Enter a valid price per night.');
            return;
        }
        const nights = manualData.check_out_date.diff(manualData.check_in_date, 'day');
        const pricePerNight = parseFloat(parseFloat(manualData.price_per_night).toFixed(2));
        const totalPrice = parseFloat((pricePerNight * nights).toFixed(2));
        setManualAdding(true);
        try {
            await createAccommodationBooking(tripId, {
                accommodation_name: manualData.accommodation_name.trim(),
                check_in_date: manualData.check_in_date.format('YYYY-MM-DD'),
                check_out_date: manualData.check_out_date.format('YYYY-MM-DD'),
                price_per_night: pricePerNight,
                total_price: totalPrice,
                accommodation_option: null,
            });
            navigate(`/trips/${tripId}`);
        } catch (e) {
            setManualErr(parseError(e));
        } finally {
            setManualAdding(false);
        }
    }

    const manualNights = manualData.check_in_date && manualData.check_out_date
        ? manualData.check_out_date.diff(manualData.check_in_date, 'day')
        : 0;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={S.page}>
                <div style={S.wrap}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                        <button style={{ ...S.btnOutline, padding: '8px 16px', fontSize: 13 }} onClick={() => navigate(`/trips/${tripId}`)}>← Back</button>
                        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#1a4a4a' }}>Search Accommodation</h1>
                    </div>

                    {/* Catalog search */}
                    <div style={S.glass}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 16 }}>
                            <div style={S.field}>
                                <span style={S.label}>City</span>
                                <input style={S.input} placeholder="e.g. Paris" value={city} onChange={e => setCity(e.target.value)} />
                            </div>
                            <div style={S.field}>
                                <span style={S.label}>Check-in</span>
                                <DatePicker value={checkIn} onChange={setCheckIn} disablePast
                                            slotProps={{ textField: { fullWidth: true, size: 'small' }, openPickerButton: { sx: { borderRadius: '50%', width: 32, height: 32, minWidth: 0, padding: 0, '& .MuiSvgIcon-root': { fontSize: 20 } } } }} />
                            </div>
                            <div style={S.field}>
                                <span style={S.label}>Check-out</span>
                                <DatePicker value={checkOut} onChange={setCheckOut} disablePast minDate={checkIn || undefined}
                                            slotProps={{ textField: { fullWidth: true, size: 'small' }, openPickerButton: { sx: { borderRadius: '50%', width: 32, height: 32, minWidth: 0, padding: 0, '& .MuiSvgIcon-root': { fontSize: 20 } } } }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <span style={S.label}>Price per night ($)</span>
                            <Slider value={[minPrice, maxPrice]} onChange={(e, v) => { setMinPrice(v[0]); setMaxPrice(v[1]); }} min={0} max={500} />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, color: '#5a7a7a' }}>${minPrice}</span>
                                <span style={{ fontSize: 12, color: '#5a7a7a' }}>${maxPrice}</span>
                            </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Sort by</InputLabel>
                                <Select value={sortBy} label="Sort by" onChange={e => setSortBy(e.target.value)}>
                                    <MenuItem value="price_per_night">Price ↑</MenuItem>
                                    <MenuItem value="-price_per_night">Price ↓</MenuItem>
                                    <MenuItem value="rating">Rating ↑</MenuItem>
                                    <MenuItem value="-rating">Rating ↓</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <button style={{ ...S.btnPrimary, width: '100%' }} onClick={search} disabled={loading}>
                            {loading ? 'Searching…' : 'Search'}
                        </button>
                    </div>

                    {err && <div style={S.error}>{err}</div>}
                    {searched && !loading && results.length === 0 && !err && (
                        <div style={{ textAlign: 'center', marginTop: 48, color: '#5a9090' }}>
                            <div style={{ fontSize: 40 }}>🏨</div>
                            <p>No accommodations found. Try different filters.</p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div style={{ marginTop: 24 }}>
                            <p style={{ margin: '0 0 14px', fontSize: 13, color: '#5a9090' }}>{results.length} option{results.length !== 1 ? 's' : ''} found</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {results.map(opt => (
                                    <div key={opt.id} style={S.resultCard}
                                         onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(29,112,112,0.18)'; }}
                                         onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(29,112,112,0.10)'; }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 180 }}>
                                            <div style={S.iconAvatar}><HotelIcon /></div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                                    <span style={S.badge()}>Hotel</span>
                                                    <Rating value={opt.rating} readOnly size="small" />
                                                </div>
                                                <div style={{ fontSize: 18, fontWeight: 700, color: '#1a4a4a' }}>{opt.name}</div>
                                                <div style={{ fontSize: 13, color: '#5a9090' }}>{opt.address}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: 22, fontWeight: 700, color: '#2e7d7d' }}>${opt.price_per_night}</div>
                                                <div style={{ fontSize: 12, color: '#5a9090' }}>/ night</div>
                                            </div>
                                            <button style={S.btnSelect} onClick={() => openModal(opt)}>Select</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* External sites */}
                    <div style={{ marginTop: 40 }}>
                        <p style={S.sectionTitle}>Search for current prices on external sites</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {ACCOMMODATION_SITES.map(site => (
                                <div key={site.name} style={S.siteCard}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{ width: 44, height: 44, background: site.iconBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20 }}>
                                            {site.iconText}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a4a4a' }}>{site.name}</div>
                                            <div style={{ fontSize: 13, color: '#5a9090' }}>{site.description}</div>
                                        </div>
                                    </div>
                                    <button style={S.btnOutline} onClick={() => {
                                        const url = site.getUrl(city || pre.city || '', checkIn, checkOut);
                                        window.open(url, '_blank', 'noopener,noreferrer');
                                    }}>
                                        Open <OpenInNewIcon sx={{ fontSize: 16 }} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Manual add */}
                    <div style={{ ...S.glass, marginTop: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showManual ? 20 : 0 }}>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#1a4a4a' }}>Add manually</div>
                                <div style={{ fontSize: 13, color: '#5a9090', marginTop: 2 }}>Found something on an external site? Enter the details here</div>
                            </div>
                            {!showManual && (
                                <button style={S.btnOutline} onClick={() => setShowManual(true)}>
                                    <AddIcon sx={{ fontSize: 18 }} /> Add
                                </button>
                            )}
                        </div>

                        {showManual && (
                            <div>
                                <div style={{ marginBottom: 16 }}>
                                    <div style={S.field}>
                                        <span style={S.label}>Accommodation name</span>
                                        <input style={S.input} placeholder="e.g. Hilton Paris Opera"
                                               value={manualData.accommodation_name}
                                               onChange={e => handleManualChange('accommodation_name', e.target.value)} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                    <div style={S.field}>
                                        <span style={S.label}>Check-in</span>
                                        <DatePicker value={manualData.check_in_date} onChange={v => handleManualChange('check_in_date', v)}
                                                    slotProps={{ textField: { size: 'small', fullWidth: true }, openPickerButton: { sx: { borderRadius: '50%', width: 32, height: 32, minWidth: 0, padding: 0, '& .MuiSvgIcon-root': { fontSize: 20 } } } }} />
                                    </div>
                                    <div style={S.field}>
                                        <span style={S.label}>Check-out</span>
                                        <DatePicker value={manualData.check_out_date} onChange={v => handleManualChange('check_out_date', v)}
                                                    minDate={manualData.check_in_date || undefined}
                                                    slotProps={{ textField: { size: 'small', fullWidth: true }, openPickerButton: { sx: { borderRadius: '50%', width: 32, height: 32, minWidth: 0, padding: 0, '& .MuiSvgIcon-root': { fontSize: 20 } } } }} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                    <div style={S.field}>
                                        <span style={S.label}>Price per night ($)</span>
                                        <input style={S.input} type="number" min="0" step="0.01" placeholder="e.g. 85.00"
                                               value={manualData.price_per_night}
                                               onChange={e => handleManualChange('price_per_night', e.target.value)} />
                                    </div>
                                    <div style={S.field}>
                                        <span style={S.label}>Total</span>
                                        <div style={{ padding: '11px 14px', fontSize: 15, fontWeight: 700, color: '#2e7d7d' }}>
                                            {manualNights > 0 && manualData.price_per_night
                                                ? `$${(parseFloat(manualData.price_per_night) * manualNights).toFixed(2)} (${manualNights} night${manualNights !== 1 ? 's' : ''})`
                                                : '—'
                                            }
                                        </div>
                                    </div>
                                </div>

                                {manualErr && <div style={{ ...S.error, marginBottom: 16 }}>{manualErr}</div>}

                                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                    <button style={S.btnCancel} onClick={() => { setShowManual(false); setManualErr(null); }}>Cancel</button>
                                    <button style={{ ...S.btnPrimary, opacity: manualAdding ? 0.7 : 1 }} onClick={handleAddManual} disabled={manualAdding}>
                                        {manualAdding ? 'Adding…' : 'Add to trip'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Catalog booking modal */}
                {sel && (
                    <div style={S.overlay} onClick={e => e.target === e.currentTarget && setSel(null)}>
                        <div style={S.modal}>
                            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#1a4a4a' }}>Confirm booking</h2>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#2e7d7d' }}>{sel.name}</div>
                            <div style={{ fontSize: 13, color: '#5a9090', marginTop: 2 }}>{sel.address}</div>
                            <hr style={S.divider} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={S.field}>
                                    <span style={S.label}>Check-in</span>
                                    <DatePicker value={checkInDate} onChange={setCheckInDate} disablePast
                                                slotProps={{ textField: { fullWidth: true, size: 'small' }, openPickerButton: { sx: { borderRadius: '50%', width: 32, height: 32, minWidth: 0, padding: 0, '& .MuiSvgIcon-root': { fontSize: 20 } } } }} />
                                </div>
                                <div style={S.field}>
                                    <span style={S.label}>Check-out</span>
                                    <DatePicker value={checkOutDate} onChange={setCheckOutDate} disablePast minDate={checkInDate || undefined}
                                                slotProps={{ textField: { fullWidth: true, size: 'small' }, openPickerButton: { sx: { borderRadius: '50%', width: 32, height: 32, minWidth: 0, padding: 0, '& .MuiSvgIcon-root': { fontSize: 20 } } } }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Nights: {checkOutDate?.diff(checkInDate, 'day') || 0}</span>
                                    <span style={{ fontWeight: 600, color: '#1a4a4a' }}>Total: ${(sel.price_per_night * (checkOutDate?.diff(checkInDate, 'day') || 0)).toFixed(2)}</span>
                                </div>
                                {addErr && <div style={S.error}>{addErr}</div>}
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                    <button style={S.btnCancel} onClick={() => setSel(null)}>Cancel</button>
                                    <button style={S.btnPrimary} onClick={handleAddFromCatalog} disabled={adding}>
                                        {adding ? 'Adding...' : 'Add to trip'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </LocalizationProvider>
    );
}