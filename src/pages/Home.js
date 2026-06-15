import './Home.css';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getCities, getRecommendedCities } from '../api/catalog';
import CityCard from '../components/city/CityCard';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/animations/Loading';

const DEBOUNCE_MS = 400;

const CATEGORY_OPTIONS = [
    { label: 'Culture',    value: 'culture' },
    { label: 'Adventure',  value: 'adventure' },
    { label: 'Nature',     value: 'nature' },
    { label: 'Beaches',    value: 'beaches' },
    { label: 'Nightlife',  value: 'nightlife' },
    { label: 'Cuisine',    value: 'cuisine' },
    { label: 'Wellness',   value: 'wellness' },
    { label: 'Urban',      value: 'urban' },
    { label: 'Seclusion',  value: 'seclusion' },
];

const BUDGET_OPTIONS = [
    { label: 'Budget',    value: 'Budget' },
    { label: 'Mid-range', value: 'Mid-range' },
    { label: 'Luxury',    value: 'Luxury' },
];

const PAGE_SIZE = 12;

function Home() {
    const [cities, setCities] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [page, setPage] = useState(1);

    const [recommendedCities, setRecommendedCities] = useState([]);
    const [recommendedLoading, setRecommendedLoading] = useState(false);
    const isLoggedIn = !!localStorage.getItem('access');

    const [searchTerm, setSearchTerm] = useState('');
    const [committedSearch, setCommittedSearch] = useState('');
    const [selectedBudget, setSelectedBudget] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const debounceTimer = useRef(null);
    const navigate = useNavigate();

    const buildParams = useCallback((pageNum, search, budget, categories) => {
        const params = { page: pageNum, page_size: PAGE_SIZE };
        if (search.trim()) params.search = search.trim();
        if (budget) params.budget_level = budget;
        if (categories.length > 0) params.categories = categories.join(',');
        return params;
    }, []);

    const fetchCities = useCallback(async (search, budget, categories) => {
        setLoading(true);
        setError(null);
        try {
            const params = buildParams(1, search, budget, categories);
            const data = await getCities(params);
            setCities(data.results || []);
            setTotalCount(data.count || 0);
            setHasNext(!!data.next);
            setPage(1);
        } catch (err) {
            console.error('Error loading cities:', err);
            setError('Failed to load cities.');
        } finally {
            setLoading(false);
        }
    }, [buildParams]);

    const fetchMore = useCallback(async () => {
        if (loadingMore || !hasNext) return;
        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const params = buildParams(nextPage, committedSearch, selectedBudget, selectedCategories);
            const data = await getCities(params);
            setCities(prev => [...prev, ...(data.results || [])]);
            setHasNext(!!data.next);
            setPage(nextPage);
        } catch (err) {
            console.error('Error loading more cities:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, hasNext, page, committedSearch, selectedBudget, selectedCategories, buildParams]);

    useEffect(() => {
        if (!isLoggedIn) return;
        setRecommendedLoading(true);
        getRecommendedCities()
            .then(data => setRecommendedCities(Array.isArray(data) ? data : []))
            .catch(() => setRecommendedCities([]))
            .finally(() => setRecommendedLoading(false));
    }, []);

    useEffect(() => {
        fetchCities('', '', []);
    }, []);

    useEffect(() => {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setCommittedSearch(searchTerm);
            fetchCities(searchTerm, selectedBudget, selectedCategories);
        }, DEBOUNCE_MS);
        return () => clearTimeout(debounceTimer.current);
    }, [searchTerm]);

    const handleCityClick = (cityId) => {
        navigate(`/trips/new?city=${cityId}`);
    };

    const handleCreateTrip = () => {
        navigate('/trips/new');
    };

    const toggleCategory = (value) => {
        setSelectedCategories(prev =>
            prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
        );
    };

    const applyPreferences = () => {
        setIsModalOpen(false);
        fetchCities(committedSearch, selectedBudget, selectedCategories);
    };

    const clearAllPreferences = () => {
        setSelectedBudget('');
        setSelectedCategories([]);
        setSearchTerm('');
        setCommittedSearch('');
        fetchCities('', '', []);
    };

    const hasActiveFilters = selectedBudget || selectedCategories.length > 0;

    if (loading) return <Loading />;

    if (error) {
        return (
            <div className="error-state">
                <h2>Unable to load destinations</h2>
                <p>{error}</p>
                <button onClick={() => fetchCities(committedSearch, selectedBudget, selectedCategories)} className="retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Discover Your Next Destination</h1>
                <p>Personalized travel planner!</p>
                <div className="hero-actions">
                    {isLoggedIn && (
                        <button className="create-trip-btn" onClick={handleCreateTrip}>
                            Plan a trip
                        </button>
                    )}
                </div>
            </div>

            {isLoggedIn && (recommendedLoading || recommendedCities.length > 0) && (
                <div className="recommended-section">
                    <div className="recommended-header">
                        <h2 className="recommended-title">Recommended for you</h2>
                    </div>
                    {recommendedLoading ? (
                        <div className="recommended-loading">
                            <div className="loading-spinner" />
                        </div>
                    ) : (
                        <div className="recommended-scroll">
                            {recommendedCities.map(city => (
                                <div className="recommended-card-wrap" key={city.id}>
                                    <CityCard
                                        city={city}
                                        onClick={() => handleCityClick(city.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search by city or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button className="preferences-btn" onClick={() => setIsModalOpen(true)}>
                    Set your preferences
                </button>
            </div>

            {hasActiveFilters && (
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
                                <button onClick={() => {
                                    setSelectedBudget('');
                                    fetchCities(committedSearch, '', selectedCategories);
                                }}>×</button>
                            </span>
                        )}
                        {selectedCategories.map(cat => (
                            <span key={cat} className="preference-tag">
                                {CATEGORY_OPTIONS.find(c => c.value === cat)?.label || cat}
                                <button onClick={() => {
                                    const next = selectedCategories.filter(c => c !== cat);
                                    setSelectedCategories(next);
                                    fetchCities(committedSearch, selectedBudget, next);
                                }}>×</button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="results-header">
                <div className="results-count">
                    {totalCount} destination{totalCount !== 1 ? 's' : ''} found
                    {committedSearch && ` for "${committedSearch}"`}
                    {hasActiveFilters ? ' (filtered)' : ''}
                </div>
            </div>

            {cities.length === 0 ? (
                <div className="no-results">
                    <p>No destinations match your criteria.</p>
                    <button onClick={clearAllPreferences}>Clear all filters</button>
                </div>
            ) : (
                <>
                    <div className="cities-grid">
                        {cities.map(city => (
                            <CityCard
                                key={city.id}
                                city={city}
                                onClick={() => handleCityClick(city.id)}
                            />
                        ))}
                    </div>

                    {hasNext && (
                        <div className="load-more-section">
                            <button
                                className="load-more-btn"
                                onClick={fetchMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? 'Loading...' : 'Load more'}
                            </button>
                        </div>
                    )}
                </>
            )}

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Your travel preferences</h2>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>

                        <div className="modal-body">
                            <div className="budget-filter">
                                <div className="budget-label">BUDGET</div>
                                <div className="budget-options">
                                    <button
                                        className={`budget-option ${selectedBudget === '' ? 'active' : ''}`}
                                        onClick={() => setSelectedBudget('')}
                                    >
                                        Any
                                    </button>
                                    {BUDGET_OPTIONS.map(({ label, value }) => (
                                        <button
                                            key={value}
                                            className={`budget-option ${selectedBudget === value ? 'active' : ''}`}
                                            onClick={() => setSelectedBudget(value)}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="categories-filter">
                                <div className="categories-label">INTERESTS</div>
                                <div className="categories-list">
                                    {CATEGORY_OPTIONS.map(({ label, value }) => (
                                        <button
                                            key={value}
                                            className={`category-chip ${selectedCategories.includes(value) ? 'active' : ''}`}
                                            onClick={() => toggleCategory(value)}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-cancel" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </button>
                            <button className="modal-apply" onClick={applyPreferences}>
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;