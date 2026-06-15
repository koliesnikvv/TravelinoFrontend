
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCityDetails, getCityInsights } from '../../api/catalog';
import WeatherWidget from '../../components/city/WeatherWidget';
import SafetyWidget from '../../components/city/SafetyWidget';
import EnvironmentWidget from '../../components/city/EnvironmentWidget';
import EmergencyContacts from '../../components/city/EmergencyContacts';  // ← замість TransportWidget
import Loading from '../../components/animations/Loading';
import './CityDetailPage.css';

export default function CityDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [city, setCity] = useState(null);
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [cityData, insightsData] = await Promise.all([
                    getCityDetails(id),
                    getCityInsights(id)
                ]);
                setCity(cityData);
                setInsights(insightsData);
            } catch (err) {
                console.error('Error loading city data:', err);
                setError('Failed to load city information. Please try again.');
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    const handlePlanTrip = () => {
        navigate('/trips/new', {
            state: {
                city: {
                    id: city.id,
                    city: city.city,
                    country: city.country
                }
            }
        });
    };

    if (loading) return <Loading />;
    if (error) return <div className="error-state">{error}</div>;
    if (!city) return <div className="error-state">City not found</div>;

    console.log('Emergency contacts data:', insights?.emergency_contacts);

    return (
        <div className="city-detail-page">
            {/* Hero секція */}
            <div className="city-hero">
                <h1>{city.city}, {city.country}</h1>
                <p className="city-region">{city.region}</p>
                <div className="city-budget">{city.budget_level}</div>
                <p className="city-description">{city.short_description}</p>
            </div>

            {/* Прогноз погоди */}
            {insights?.weather && <WeatherWidget data={insights.weather} />}

            {/* Метрики: 3 блоки в ряд (Air Quality, Safety, Emergency Contacts) */}
            <div className="metrics-grid">
                {insights?.environment && <EnvironmentWidget data={insights.environment} />}
                {insights?.safety && <SafetyWidget data={insights.safety} />}
                {insights?.emergency_contacts && <EmergencyContacts data={insights.emergency_contacts} />}
            </div>

            {/* Кнопка планування */}
            <div className="plan-trip-section">
                <button className="plan-trip-btn" onClick={handlePlanTrip}>
                     Plan trip to {city.city}
                </button>
            </div>
        </div>
    );
}