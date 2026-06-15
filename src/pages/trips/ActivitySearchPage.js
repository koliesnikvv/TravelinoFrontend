import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getActivities, getActivityDetail } from '../../api/catalog';
import { createTripActivity } from '../../api/trips';
import { parseError } from '../../api/errors';
import ActivitySearchForm from '../../components/trips/ActivitySearchForm';
import ActivityResultCard from '../../components/trips/ActivityResultCard';
import ActivityDetailModal from '../../components/trips/ActivityDetailModal';
import ActivityScheduleModal from '../../components/trips/ActivityScheduleModal';
import Loading from '../../components/animations/Loading';

const PROGRESS_MESSAGES = [
    'Analyzing your request...',
    'Searching places...',
    'Ranking results by relevance...',
    'Almost done...',
];

const S = {
    page: { minHeight: '100vh', padding: '32px 16px 64px', fontFamily: "'Segoe UI', sans-serif", color: '#1a4a4a' },
    wrap: { maxWidth: 760, margin: '0 auto' },
    btnOutline: {
        background: 'transparent',
        color: '#2e7d7d',
        border: '1.5px solid rgba(77,182,172,0.55)',
        borderRadius: 12,
        padding: '11px 22px',
        fontWeight: 600,
        cursor: 'pointer',
    },
    btnLoadMore: {
        background: 'transparent',
        color: '#2e7d7d',
        border: '1.5px solid rgba(77,182,172,0.55)',
        borderRadius: 12,
        padding: '11px 28px',
        fontWeight: 600,
        cursor: 'pointer',
        width: '100%',
        marginTop: 16,
    },
    error: {
        background: 'rgba(211,47,47,0.10)',
        border: '1px solid rgba(211,47,47,0.30)',
        borderRadius: 10,
        padding: '10px 14px',
        color: '#b71c1c',
        fontSize: 14,
    },
    progressWrap: { textAlign: 'center', padding: '48px 0', color: '#2e7d7d' },
    progressText: { fontSize: 16, fontWeight: 600, marginTop: 16 },
    spinner: {
        width: 40,
        height: 40,
        border: '3px solid rgba(77,182,172,0.2)',
        borderTop: '3px solid #4db6ac',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto',
    },
    aiBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'linear-gradient(135deg, rgba(77,182,172,0.15), rgba(38,166,154,0.1))',
        border: '1px solid rgba(77,182,172,0.35)',
        borderRadius: 20,
        padding: '4px 12px',
        fontSize: 12,
        fontWeight: 600,
        color: '#2e7d7d',
        letterSpacing: '0.03em',
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    overlayText: {
        fontSize: 16,
        fontWeight: 600,
        color: '#2e7d7d',
        fontFamily: "'Segoe UI', sans-serif",
    },
};

export default function ActivitySearchPage() {
    const { id: tripId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const cityId = location.state?.cityId;

    // Search form state
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [vibe, setVibe] = useState('');
    const [locationType, setLocationType] = useState('');

    // Results state
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searched, setSearched] = useState(false);
    const [err, setErr] = useState(null);
    const [progressMsg, setProgressMsg] = useState(PROGRESS_MESSAGES[0]);

    // Detail modal state
    const [detailPlace, setDetailPlace] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailErr, setDetailErr] = useState(null);

    // Schedule modal state
    const [schedulePlace, setSchedulePlace] = useState(null);
    const [scheduledDate, setScheduledDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [adding, setAdding] = useState(false);
    const [addErr, setAddErr] = useState(null);

    const progressInterval = useRef(null);

    const startProgress = () => {
        let i = 0;
        setProgressMsg(PROGRESS_MESSAGES[0]);
        progressInterval.current = setInterval(() => {
            i = (i + 1) % PROGRESS_MESSAGES.length;
            setProgressMsg(PROGRESS_MESSAGES[i]);
        }, 1500);
    };

    const stopProgress = () => {
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
        }
    };

    useEffect(() => () => stopProgress(), []);

    const buildParams = (pageNum = 1) => {
        const params = { city: cityId, page: pageNum };
        if (query.trim()) params.query = query.trim();
        if (category) params.category = category;
        if (price) params.price = price;
        if (vibe) params.vibe = vibe;
        if (locationType) params.location_type = locationType;
        return params;
    };

    const search = async () => {
        if (!cityId) { setErr('City not found. Go back and try again.'); return; }
        setLoading(true);
        setSearched(true);
        setErr(null);
        setResults([]);
        setPage(1);
        startProgress();
        try {
            const data = await getActivities(buildParams(1));
            setResults(data.results);
            setPage(data.page);
            setTotal(data.total);
            setHasNext(data.has_next);
        } catch (e) {
            setErr(parseError(e));
        } finally {
            setLoading(false);
            stopProgress();
        }
    };

    const loadMore = async () => {
        if (!cityId || loadingMore) return;
        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const data = await getActivities(buildParams(nextPage));
            setResults(prev => [...prev, ...data.results]);
            setPage(data.page);
            setHasNext(data.has_next);
        } catch (e) {
            setErr(parseError(e));
        } finally {
            setLoadingMore(false);
        }
    };

    const openDetail = async (act) => {
        setDetailErr(null);
        setDetailLoading(true);
        setDetailPlace({ xid: act.xid, name: act.name, kinds: act.kinds, labels: act.labels, rate: act.rate });
        try {
            const detail = await getActivityDetail(act.xid);
            setDetailPlace(detail);
        } catch (e) {
            setDetailErr(parseError(e));
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetail = () => {
        setDetailPlace(null);
        setDetailErr(null);
        setDetailLoading(false);
    };

    const openSchedule = () => {
        setSchedulePlace(detailPlace);
        setScheduledDate(null);
        setStartTime(null);
        setEndTime(null);
        setAddErr(null);
        closeDetail();
    };

    const handleAdd = async () => {
        if (!scheduledDate || !startTime || !endTime) { setAddErr('Fill all fields'); return; }

        setAdding(true);
        try {
            await createTripActivity(tripId, {
                activity: null,
                activity_name: schedulePlace.name,
                activity_details_id: schedulePlace.xid,
                scheduled_date: scheduledDate.format('YYYY-MM-DD'),
                start_time: startTime.format('HH:mm:ss'),
                end_time: endTime.format('HH:mm:ss'),
            });
            navigate(`/trips/${tripId}`, { state: { successMessage: 'Activity added!' } });
        } catch (e) {
            setAddErr(parseError(e));
        } finally {
            setAdding(false);
        }
    };

    // First auto-search — blocks the whole page with overlay
    useEffect(() => {
        if (!cityId) return;
        const runInitial = async () => {
            setInitialLoading(true);
            setSearched(true);
            setErr(null);
            try {
                const data = await getActivities(buildParams(1));
                setResults(data.results);
                setPage(data.page);
                setTotal(data.total);
                setHasNext(data.has_next);
            } catch (e) {
                setErr(parseError(e));
            } finally {
                setInitialLoading(false);
            }
        };
        runInitial();
    }, [cityId]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Full-page blocking overlay for the first auto-search only */}
            {initialLoading && (
                <div style={S.overlay}>
                    <Loading />
                    <div style={S.overlayText}>Finding the best places for you...</div>
                </div>
            )}

            <div style={S.page}>
                <div style={S.wrap}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <button style={S.btnOutline} onClick={() => navigate(`/trips/${tripId}`)}>← Back</button>
                        <h1 style={{ margin: 0 }}>Search Activities</h1>
                        {/* AI badge */}
                        <div style={S.aiBadge}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1 0-6h1V6a4 4 0 0 1 4-4z"/>
                            </svg>
                            Powered by AI
                        </div>
                    </div>

                    <ActivitySearchForm
                        query={query} setQuery={setQuery}
                        category={category} setCategory={setCategory}
                        price={price} setPrice={setPrice}
                        vibe={vibe} setVibe={setVibe}
                        locationType={locationType} setLocationType={setLocationType}
                        onSearch={search}
                        loading={loading}
                    />

                    {err && <div style={{ ...S.error, marginTop: 16 }}>{err}</div>}

                    {loading && (
                        <div style={S.progressWrap}>
                            <div style={S.spinner} />
                            <div style={S.progressText}>{progressMsg}</div>
                        </div>
                    )}

                    {!loading && !initialLoading && searched && results.length === 0 && !err && (
                        <div style={{ textAlign: 'center', marginTop: 48, color: '#5a9090' }}>
                            No activities found
                        </div>
                    )}

                    {results.length > 0 && (
                        <div style={{ marginTop: 24 }}>
                            <p style={{ margin: '0 0 14px', fontSize: 13, color: '#5a9090' }}>
                                Showing {results.length} of {total} places
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {results.map(act => (
                                    <ActivityResultCard
                                        key={act.xid}
                                        activity={act}
                                        onClick={openDetail}
                                    />
                                ))}
                            </div>

                            {hasNext && (
                                <button style={S.btnLoadMore} onClick={loadMore} disabled={loadingMore}>
                                    {loadingMore ? 'Loading...' : `Load more (${total - results.length} remaining)`}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ActivityDetailModal
                place={detailPlace}
                loading={detailLoading}
                error={detailErr}
                onClose={closeDetail}
                onAddToTrip={openSchedule}
            />

            <ActivityScheduleModal
                place={schedulePlace}
                scheduledDate={scheduledDate} setScheduledDate={setScheduledDate}
                startTime={startTime} setStartTime={setStartTime}
                endTime={endTime} setEndTime={setEndTime}
                onCancel={() => setSchedulePlace(null)}
                onAdd={handleAdd}
                adding={adding}
                error={addErr}
            />
        </LocalizationProvider>
    );
}