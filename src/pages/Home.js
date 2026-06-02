import './Home.css';
import { useEffect, useState, useCallback } from 'react';
import { getCities } from '../api/catalog';
import CityCard from '../components/city/CityCard';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBudget, setSelectedBudget] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasPreferences, setHasPreferences] = useState(false);
    const navigate = useNavigate();

    const categories = ['Culture', 'Nature', 'Beaches', 'Nightlife', 'Cuisine', 'Adventure', 'History', 'Shopping'];
    const budgetLevels = ['Low', 'Medium', 'High', 'Luxury'];

    useEffect(() => {
        const loadCities = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getCities();

                if (data && data.length > 0) {
                    setCities(data);
                    setFilteredCities(data);
                } else {
                    setError('No cities found. Please check if the backend server is running.');
                }
            } catch (err) {
                console.error('Error loading cities:', err);
                setError('Failed to load cities. Make sure the backend is running on http://localhost:8000');
            } finally {
                setLoading(false);
            }
        };

        loadCities();
    }, []);

    const applyFilters = useCallback(() => {
        let filtered = [...cities];

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(city =>
                city.name?.toLowerCase().includes(term) ||
                city.country?.toLowerCase().includes(term)
            );
        }

        if (selectedBudget && hasPreferences) {
            filtered = filtered.filter(city => city.budget_level === selectedBudget);
        }

        if (selectedCategories.length > 0 && hasPreferences) {
            filtered = filtered.filter(city =>
                city.categories?.some(cat => selectedCategories.includes(cat))
            );
        }

        setFilteredCities(filtered);
    }, [cities, searchTerm, selectedBudget, selectedCategories, hasPreferences]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const handleCityClick = (cityId) => {
        navigate(`/trips/new?city=${cityId}`);
    };

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const applyPreferences = () => {
        setHasPreferences(true);
        closeModal();
    };

    const clearAllPreferences = () => {
        setSelectedBudget('');
        setSelectedCategories([]);
        setSearchTerm('');
        setHasPreferences(false);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    };
    const handleSearchClick = () => {
        applyFilters();
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading amazing destinations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state">
                <h2>Unable to load destinations</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Discover Your Next Destination</h1>
                <p>Personalized travel planning powered by your preferences</p>
                <button className="preferences-btn" onClick={openModal}>
                    Set your preferences
                </button>
            </div>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search by city or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="search-input"
                />
            </div>
            {hasPreferences && (
                <div className="active-preferences">
                    <div className="preferences-header">
                        <span>Active filters:</span>
                        <button className="clear-all-btn" onClick={clearAllPreferences}>
                            Clear all
                        </button>
                    </div>
                    <div className="preferences-tags">
                        {selectedBudget && (
                            <span className="preference-tag">
                                Budget: {selectedBudget}
                                <button onClick={() => setSelectedBudget('')}>×</button>
                            </span>
                        )}
                        {selectedCategories.map(cat => (
                            <span key={cat} className="preference-tag">
                                {cat}
                                <button onClick={() => toggleCategory(cat)}>×</button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="results-header">
                <div className="results-count">
                    {filteredCities.length} destinations found
                    {searchTerm && ` for "${searchTerm}"`}
                    {hasPreferences ? ' (filtered by your preferences)' : ''}
                </div>
            </div>

            {filteredCities.length === 0 ? (
                <div className="no-results">
                    <p>No destinations match your criteria.</p>
                    <button onClick={clearAllPreferences}>
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="cities-grid">
                    {filteredCities.map(city => (
                        <CityCard
                            key={city.id}
                            city={city}
                            onClick={() => handleCityClick(city.id)}
                        />
                    ))}
                </div>
            )}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Your Travel Preferences</h2>
                            <button className="modal-close" onClick={closeModal}>✕</button>
                        </div>

                        <div className="modal-body">
                            <div className="budget-filter">
                                <div className="budget-label">💰 BUDGET</div>
                                <div className="budget-options">
                                    <button
                                        className={`budget-option ${selectedBudget === '' ? 'active' : ''}`}
                                        onClick={() => setSelectedBudget('')}
                                    >
                                        Any
                                    </button>
                                    {budgetLevels.map(level => (
                                        <button
                                            key={level}
                                            className={`budget-option ${selectedBudget === level ? 'active' : ''}`}
                                            onClick={() => setSelectedBudget(level)}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="categories-filter">
                                <div className="categories-label">INTERESTS</div>
                                <div className="categories-list">
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            className={`category-chip ${selectedCategories.includes(category) ? 'active' : ''}`}
                                            onClick={() => toggleCategory(category)}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-cancel" onClick={closeModal}>
                                Cancel
                            </button>
                            <button className="modal-apply" onClick={applyPreferences}>
                                Apply Preferences
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;