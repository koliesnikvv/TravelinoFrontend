import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrips } from '../api/trips';

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
        return <div className="loading-state">Loading your trips...</div>;
    }

    return (
        <div className="trips-container">
            <h1>My Trips</h1>
            {trips.length === 0 ? (
                <div className="no-trips">
                    <p>You haven't created any trips yet.</p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Start planning your first trip
                    </button>
                </div>
            ) : (
                <div className="trips-grid">
                    {trips.map(trip => (
                        <div key={trip.id} className="trip-card">
                            <h3>{trip.title}</h3>
                            <p>{trip.city_name}</p>
                            <p>{trip.start_date} → {trip.end_date}</p>
                            <button onClick={() => navigate(`/trips/${trip.id}`)}>
                                View Trip
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TripsPage;