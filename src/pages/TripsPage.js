import './TripsPage.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrips } from '../api/trips';

function formatDateRange(start, end) {
    if (!start && !end) return null;
    const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (start && end) return `${fmt(start)} — ${fmt(end)}`;
    if (start) return `From ${fmt(start)}`;
    return `Until ${fmt(end)}`;
}

function TripCard({ trip, onClick }) {
    const dateRange = formatDateRange(trip.start_date, trip.end_date);
    const isOwner = !trip.current_user_role || trip.current_user_role === 'owner';

    return (
        <div className="trip-card" onClick={onClick}>
            {trip.city_image_url ? (
                <img
                    className="trip-card-image"
                    src={trip.city_image_url}
                    alt={trip.city_name || trip.title}
                />
            ) : (
                <div className="trip-card-image-placeholder">✈️</div>
            )}
            <div className="trip-card-body">
                <div className="trip-card-title">{trip.title}</div>
                {trip.city_name && (
                    <div className="trip-card-city">{trip.city_name}</div>
                )}
                {dateRange && (
                    <div className="trip-card-dates">
                        <span>📅</span>
                        <span>{dateRange}</span>
                    </div>
                )}
                <div className="trip-card-footer">
                    <span className={`trip-role-badge ${isOwner ? 'owner' : 'participant'}`}>
                        {isOwner ? 'My trip' : 'Shared with me'}
                    </span>
                    <button className="view-trip-btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
                        Open →
                    </button>
                </div>
            </div>
        </div>
    );
}

function TripsPage() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchTrips();
    }, [navigate]);

    const fetchTrips = async () => {
        try {
            const data = await getTrips();
            setTrips(data.results || data);
        } catch (error) {
            console.error('Error fetching trips:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner" />
                <div>Loading your trips...</div>
            </div>
        );
    }

    return (
        <div className="trips-container">
            <div className="trips-header">
                <h1>My Trips</h1>
                <p>All your travel plans in one place</p>
                <button className="new-trip-btn" onClick={() => navigate('/')}>
                    + Plan a new trip
                </button>
            </div>

            {trips.length === 0 ? (
                <div className="no-trips">
                    <p>You haven't created any trips yet.</p>
                    <button className="start-planning-btn" onClick={() => navigate('/')}>
                        Start planning your first trip
                    </button>
                </div>
            ) : (
                <div className="trips-grid">
                    {trips.map(trip => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                            onClick={() => navigate(`/trips/${trip.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default TripsPage;