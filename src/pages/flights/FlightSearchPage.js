import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FlightSearchPage.css';
import { searchFlights } from '../../api/flights';

function FlightSearchPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        adults: 1,
    });
    const [originSuggestions, setOriginSuggestions] = useState([]);
    const [destSuggestions, setDestSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleAirportSearch = async (field, value) => {
        if (value.length < 2) {
            if (field === 'origin') setOriginSuggestions([]);
            else setDestSuggestions([]);
            return;
        }

        const results = await searchFlights(value);
        if (field === 'origin') {
            setOriginSuggestions(results);
        } else {
            setDestSuggestions(results);
        }
    };

    const selectAirport = (field, airport) => {
        handleInputChange(field, airport.iataCode);
        if (field === 'origin') setOriginSuggestions([]);
        else setDestSuggestions([]);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.origin) newErrors.origin = 'Origin is required';
        if (!formData.destination) newErrors.destination = 'Destination is required';
        if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';
        if (formData.origin === formData.destination) {
            newErrors.destination = 'Origin and destination cannot be the same';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSearch = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const results = await searchFlights(formData);
            navigate('/flights/results', { state: { results, searchParams: formData } });
        } catch (error) {
            setErrors({ general: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flight-search-page">
            <div className="flight-search-hero">
                <h1>Search Flights</h1>
                <p>Find the best deals for your next adventure</p>
            </div>

            <div className="flight-search-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>From</label>
                        <input
                            type="text"
                            placeholder="City or airport"
                            value={formData.origin}
                            onChange={(e) => {
                                handleInputChange('origin', e.target.value);
                                handleAirportSearch('origin', e.target.value);
                            }}
                            className={errors.origin ? 'error' : ''}
                        />
                        {originSuggestions.length > 0 && (
                            <ul className="suggestions">
                                {originSuggestions.map(airport => (
                                    <li key={airport.iataCode} onClick={() => selectAirport('origin', airport)}>
                                        <strong>{airport.iataCode}</strong> - {airport.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {errors.origin && <span className="error-text">{errors.origin}</span>}
                    </div>

                    <div className="form-group">
                        <label>To</label>
                        <input
                            type="text"
                            placeholder="City or airport"
                            value={formData.destination}
                            onChange={(e) => {
                                handleInputChange('destination', e.target.value);
                                handleAirportSearch('destination', e.target.value);
                            }}
                            className={errors.destination ? 'error' : ''}
                        />
                        {destSuggestions.length > 0 && (
                            <ul className="suggestions">
                                {destSuggestions.map(airport => (
                                    <li key={airport.iataCode} onClick={() => selectAirport('destination', airport)}>
                                        <strong>{airport.iataCode}</strong> - {airport.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {errors.destination && <span className="error-text">{errors.destination}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Departure Date</label>
                        <input
                            type="date"
                            value={formData.departureDate}
                            onChange={(e) => handleInputChange('departureDate', e.target.value)}
                            className={errors.departureDate ? 'error' : ''}
                        />
                        {errors.departureDate && <span className="error-text">{errors.departureDate}</span>}
                    </div>

                    <div className="form-group">
                        <label>Return Date (optional)</label>
                        <input
                            type="date"
                            value={formData.returnDate}
                            onChange={(e) => handleInputChange('returnDate', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Passengers</label>
                        <input
                            type="number"
                            min="1"
                            max="9"
                            value={formData.adults}
                            onChange={(e) => handleInputChange('adults', parseInt(e.target.value))}
                        />
                    </div>
                </div>

                {errors.general && <div className="error-general">{errors.general}</div>}

                <button className="search-btn" onClick={handleSearch} disabled={loading}>
                    {loading ? 'Searching...' :  'Search Flights'}
                </button>
            </div>
        </div>
    );
}

export default FlightSearchPage;