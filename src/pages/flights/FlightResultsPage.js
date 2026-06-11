import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FlightResultsPage.css';

function FlightResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { results, searchParams } = location.state || {};
    const [sortBy, setSortBy] = useState('price');
    const [selectedFlight, setSelectedFlight] = useState(null);

    if (!results) {
        return (
            <div className="results-container">
                <p>No search results. Please go back and search again.</p>
                <button onClick={() => navigate('/flights')}>Search Flights</button>
            </div>
        );
    }

    const flightOffers = results.flight_offers || [];
    const metrics = results.metrics || {};

    const sortedFlights = [...flightOffers].sort((a, b) => {
        if (sortBy === 'price') return parseFloat(a.price) - parseFloat(b.price);
        if (sortBy === 'duration') return a.FlightTotalDuration.localeCompare(b.FlightTotalDuration);
        return 0;
    });

    const selectFlight = (flight) => {
        setSelectedFlight(flight);
        alert(`Flight selected: ${flight.price} USD`);
    };

    return (
        <div className="flight-results-page">
            <div className="results-header">
                <h1>Flight Results</h1>
                <p>{searchParams?.origin} → {searchParams?.destination}</p>
                <p>{searchParams?.departureDate} {searchParams?.returnDate && `→ ${searchParams?.returnDate}`}</p>
            </div>

            <div className="results-stats">
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">Cheapest</span>
                        <span className="stat-value">${metrics.cheapest || 'N/A'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Average</span>
                        <span className="stat-value">${metrics.min && metrics.max ? Math.round((metrics.min + metrics.max) / 2) : 'N/A'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Found</span>
                        <span className="stat-value">{flightOffers.length} flights</span>
                    </div>
                </div>
            </div>

            <div className="results-controls">
                <div className="sort-control">
                    <label>Sort by:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="price">Price (lowest first)</option>
                        <option value="duration">Duration (shortest first)</option>
                    </select>
                </div>
            </div>

            <div className="flights-list">
                {sortedFlights.map((flight, idx) => (
                    <div key={idx} className="flight-card" onClick={() => selectFlight(flight)}>
                        <div className="flight-header">
                            <div className="flight-airline">
                                <img
                                    src={flight[`0_firstFlightAirlineLogo`]}
                                    alt={flight[`0_firstFlightAirline`]}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <span>{flight[`0_firstFlightAirline`]}</span>
                            </div>
                            <div className="flight-price">
                                <span className="price">${flight.price}</span>
                                <span className="price-label">per person</span>
                            </div>
                        </div>

                        <div className="flight-route">
                            <div className="route-point">
                                <strong>{flight[`0_firstFlightDepartureAirport`]}</strong>
                                <span>{flight[`0_firstFlightDepartureDate`]}</span>
                            </div>
                            <div className="route-line">
                                <span>{flight.FlightTotalDuration}</span>
                            </div>
                            <div className="route-point">
                                <strong>{flight[`0_firstFlightArrivalAirport`]}</strong>
                                <span>{flight[`0_firstFlightArrivalDate`]}</span>
                            </div>
                        </div>

                        {flight[`0_stop_time`] && (
                            <div className="flight-stop">
                                Stop: {flight[`0_stop_time`]}
                            </div>
                        )}

                        <button className="select-flight-btn">Select Flight</button>
                    </div>
                ))}
            </div>

            {flightOffers.length === 0 && (
                <div className="no-results">
                    <p>No flights found for your search criteria.</p>
                    <button onClick={() => navigate('/flights')}>Try New Search</button>
                </div>
            )}
        </div>
    );
}

export default FlightResultsPage;