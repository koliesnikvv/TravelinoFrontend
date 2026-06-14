import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import client from '../../api/client';
import { createTransportBooking } from '../../api/trips';
import { parseError } from '../../api/errors';
import FlightIcon from '@mui/icons-material/Flight';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { Avatar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const S = {
  page: {
    minHeight: '100vh',
    padding: '32px 16px 64px',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: '#1a4a4a',
  },
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

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#2e7d7d',
  },
  input: {
    padding: '11px 14px',
    borderRadius: 12,
    border: '1.5px solid rgba(77,182,172,0.45)',
    background: 'rgba(255,255,255,0.70)',
    fontSize: 15,
    color: '#1a4a4a',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },

  btnPrimary: {
    background: 'linear-gradient(135deg, #4db6ac, #26a69a)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '13px 28px',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    letterSpacing: '0.02em',
    transition: 'opacity 0.18s, transform 0.18s',
    boxShadow: '0 4px 14px rgba(38,166,154,0.35)',
  },
  btnOutline: {
    background: 'transparent',
    color: '#2e7d7d',
    border: '1.5px solid rgba(77,182,172,0.55)',
    borderRadius: 12,
    padding: '11px 22px',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'background 0.18s',
  },
  btnSelect: {
    background: 'linear-gradient(135deg, #4db6ac, #26a69a)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 22px',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 3px 10px rgba(38,166,154,0.30)',
    transition: 'opacity 0.18s, transform 0.18s',
  },
  btnCancel: {
    background: 'transparent',
    color: '#555',
    border: '1.5px solid #ddd',
    borderRadius: 12,
    padding: '11px 22px',
    fontSize: 14,
    fontFamily: 'inherit',
    cursor: 'pointer',
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
  },

  badge: (type) => {
    const map = {
      Flight: { bg: '#e0f2fe', color: '#0277bd' },
      Train:  { bg: '#f3e5f5', color: '#7b1fa2' },
      Bus:    { bg: '#e8f5e9', color: '#2e7d32' },
    };
    const c = map[type] || { bg: '#e0f4f4', color: '#2e7d7d' };
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700,
      background: c.bg,
      color: c.color,
      letterSpacing: '0.04em',
    };
  },

  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(10,50,50,0.38)',
    backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
    padding: 16,
  },
  modal: {
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: 24,
    border: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 20px 60px rgba(29,112,112,0.22)',
    padding: '36px 32px',
    width: '100%',
    maxWidth: 460,
  },

  error: {
    background: 'rgba(211,47,47,0.10)',
    border: '1px solid rgba(211,47,47,0.30)',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#b71c1c',
    fontSize: 14,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(77,182,172,0.20)',
    margin: '20px 0',
  },
};

const getTypeIcon = (type) => {
  if (type === 'Flight') return <FlightIcon />;
  if (type === 'Train') return <TrainIcon />;
  if (type === 'Bus') return <DirectionsBusIcon />;
  return <FlightIcon />;
};

export default function TransportSearchPage() {
  const { id: tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const pre = location.state || {};

  const [from, setFrom] = useState(pre.from || '');
  const [to, setTo] = useState(pre.to || '');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('base_price');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [searched, setSearched] = useState(false);

  const [sel, setSel] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [pax, setPax] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState(null);

  const search = useCallback(async () => {
    setErr(null);
    setLoading(true);
    setSearched(true);
    try {
      const p = new URLSearchParams();
      if (from.trim()) p.append('from', from.trim());
      if (to.trim()) p.append('to', to.trim());
      if (type) p.append('type', type);
      if (sort) p.append('sort_by', sort);
      const { data } = await client.get(`/catalog/transport/?${p}`);
      setResults(data.results || data);
    } catch (e) {
      setErr(parseError(e));
    } finally {
      setLoading(false);
    }
  }, [from, to, type, sort]);

  useEffect(() => {
    if (pre.from || pre.to) search();
  }, []);

  function openModal(opt) {
    setSel(opt);
    setDepartureDate(null);
    setPax(1);
    setAddErr(null);
  }

  async function handleAdd() {
    if (!departureDate) {
      setAddErr('Please select departure date.');
      return;
    }
    if (pax < 1) {
      setAddErr('Passengers count must be at least 1.');
      return;
    }

    const depDateTime = departureDate.startOf('day');
    const arrDateTime = departureDate.startOf('day'); 

    setAdding(true);
    setAddErr(null);
    try {
      await createTransportBooking(tripId, {
        departure_point: sel.departure_point,
        arrival_point: sel.arrival_point,
        departure_datetime: depDateTime.toISOString(),
        arrival_datetime: arrDateTime.toISOString(),
        price: parseFloat((parseFloat(sel.base_price) * pax).toFixed(2)),
        passengers_count: pax,
        transport_option: sel.id,
      });
      navigate(`/trips/${tripId}`, { state: { successMessage: 'Transport added!' } });
    } catch (e) {
      setAddErr(parseError(e));
    } finally {
      setAdding(false);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={S.page}>
        <div style={S.wrap}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <button style={{ ...S.btnOutline, padding: '8px 16px', fontSize: 13 }} onClick={() => navigate(`/trips/${tripId}`)}>
              ← Back
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#1a4a4a' }}>Search Transport</h1>
              <p style={{ margin: 0, fontSize: 14, color: '#4a8080', marginTop: 2 }}>Find the best way to get there</p>
            </div>
          </div>

          <div style={S.glass}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div style={S.field}>
                <span style={S.label}>From</span>
                <input style={S.input} placeholder="City of departure" value={from} onChange={e => setFrom(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />
              </div>
              <div style={S.field}>
                <span style={S.label}>To</span>
                <input style={S.input} placeholder="Destination city" value={to} onChange={e => setTo(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />
              </div>
              <div style={S.field}>
                <span style={S.label}>Type</span>
                <FormControl fullWidth size="small">
                  <Select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: '12px', background: 'rgba(255,255,255,0.70)' }}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="Flight"><FlightIcon sx={{ mr: 1, fontSize: 18 }} /> Flight</MenuItem>
                    <MenuItem value="Train"><TrainIcon sx={{ mr: 1, fontSize: 18 }} /> Train</MenuItem>
                    <MenuItem value="Bus"><DirectionsBusIcon sx={{ mr: 1, fontSize: 18 }} /> Bus</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div style={S.field}>
                <span style={S.label}>Sort by</span>
                <FormControl fullWidth size="small">
                  <Select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    sx={{ borderRadius: '12px', background: 'rgba(255,255,255,0.70)' }}
                  >
                    <MenuItem value="base_price">Price ↑</MenuItem>
                    <MenuItem value="-base_price">Price ↓</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <button style={{ ...S.btnPrimary, width: '100%', opacity: loading ? 0.7 : 1 }} onClick={search} disabled={loading}>
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>

          {err && <div style={{ ...S.error, marginTop: 16 }}>{err}</div>}

          {searched && !loading && results.length === 0 && !err && (
            <div style={{ textAlign: 'center', marginTop: 48, color: '#5a9090' }}>
              <p style={{ margin: 0 }}>No options found. Try broader search terms.</p>
            </div>
          )}

          {results.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <p style={{ margin: '0 0 14px', fontSize: 13, color: '#5a9090' }}>{results.length} option{results.length !== 1 ? 's' : ''} found</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {results.map(opt => (
                  <div
                    key={opt.id}
                    style={S.resultCard}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 28px rgba(29,112,112,0.18)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(29,112,112,0.10)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 180 }}>
                      <div style={S.iconAvatar}>{getTypeIcon(opt.transport_type)}</div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={S.badge(opt.transport_type)}>{opt.transport_type}</span>
                          {opt.carrier_name && (
                            <span style={{ fontSize: 13, color: '#5a9090' }}>
                              {opt.carrier_name}{opt.route_number ? ` · ${opt.route_number}` : ''}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#1a4a4a' }}>
                          {opt.departure_point}
                          <span style={{ color: '#4db6ac', margin: '0 8px' }}>→</span>
                          {opt.arrival_point}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#2e7d7d' }}>${opt.base_price}</div>
                        <div style={{ fontSize: 12, color: '#5a9090' }}>per person</div>
                      </div>
                      <button style={S.btnSelect} onClick={() => openModal(opt)}>
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {sel && (
          <div style={S.overlay} onClick={e => e.target === e.currentTarget && setSel(null)}>
            <div style={S.modal}>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#1a4a4a' }}>Confirm booking</h2>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#2e7d7d' }}>
                  {sel.departure_point}<span style={{ color: '#4db6ac', margin: '0 6px' }}>→</span>{sel.arrival_point}
                </div>
                <div style={{ fontSize: 13, color: '#5a9090', marginTop: 2 }}>
                  {sel.transport_type}{sel.carrier_name ? ` · ${sel.carrier_name}` : ''}
                  {sel.route_number ? ` ${sel.route_number}` : ''}
                  {' · '}${sel.base_price} per person
                </div>
              </div>
              <hr style={S.divider} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={S.field}>
                  <span style={S.label}>Departure date</span>
                  <DatePicker
                    value={departureDate}
                    onChange={setDepartureDate}
                    disablePast
                    slotProps={{
                      textField: { size: 'small', fullWidth: true },
                      openPickerButton: {
                        sx: {
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                          minWidth: 0,
                          padding: 0,
                          '& .MuiSvgIcon-root': { fontSize: 20 },
                        },
                      },
                    }}
                  />
                </div>
                <div style={S.field}>
                  <span style={S.label}>Passengers</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                      style={{ ...S.btnOutline, padding: '8px 16px', fontSize: 18, lineHeight: 1 }}
                      onClick={() => setPax(p => Math.max(1, p - 1))}
                    >
                      −
                    </button>
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#1a4a4a', minWidth: 32, textAlign: 'center' }}>
                      {pax}
                    </span>
                    <button
                      style={{ ...S.btnOutline, padding: '8px 16px', fontSize: 18, lineHeight: 1 }}
                      onClick={() => setPax(p => p + 1)}
                    >
                      +
                    </button>
                    <span style={{ fontSize: 13, color: '#5a9090', marginLeft: 8 }}>
                      Total: <strong style={{ color: '#2e7d7d' }}>${(parseFloat(sel.base_price) * pax).toFixed(2)}</strong>
                    </span>
                  </div>
                </div>
              </div>
              {addErr && <div style={{ ...S.error, marginTop: 16 }}>{addErr}</div>}
              <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                <button style={S.btnCancel} onClick={() => setSel(null)} disabled={adding}>
                  Cancel
                </button>
                <button style={{ ...S.btnPrimary, opacity: adding ? 0.7 : 1 }} onClick={handleAdd} disabled={adding}>
                  {adding ? 'Adding…' : 'Add to trip'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
}