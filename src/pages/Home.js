import './Home.css';
import { useEffect, useState } from 'react';
import { getCities } from '../api/catalog';
import CityCard from '../components/city/CityCard';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBudget, setSelectedBudget] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();

    const categories = ['Culture', 'Nature', 'Beaches', 'Nightlife', 'Cuisine', 'Adventure', 'History', 'Shopping'];
    const budgetLevels = ['Low', 'Medium', 'High', 'Luxury'];
    useEffect(() => {
        const loadCities = async () => {
            try {
                setLoading(true);
                const data = await getCities();
                setCities(data.results || data || []);
                setFilteredCities(data.results || data || []);
            } catch (err) {
                console.error('Error loading cities:', err);
                setCities([]);
                setFilteredCities([]);
            } finally {
                setLoading(false);
            }
        };

        loadCities();
    }, []);

    useEffect(() => {
        let filtered = [...cities];

        if (searchTerm) {
            filtered = filtered.filter(city =>
                city.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                city.country?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedBudget) {
            filtered = filtered.filter(city => city.budget_level === selectedBudget);
        }

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(city =>
                city.categories?.some(cat => selectedCategories.includes(cat))
            );
        }

        setFilteredCities(filtered);
    }, [searchTerm, selectedBudget, selectedCategories, cities]);

    const handleCityClick = (cityId) => {
        navigate(`/create-trip?city=${cityId}`);
    };

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    if (loading) {
        return <div className="loading-state">Loading amazing destinations...</div>;
    }

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Discover Your Next Destination</h1>
                <p>Personalized travel planning powered by your preferences</p>
            </div>

            <div className="filters-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by city or country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="budget-filter">
                    <div className="budget-label">BUDGET</div>
                    <div className="budget-options">
                        <button className={`budget-option ${selectedBudget === '' ? 'active' : ''}`} onClick={() => setSelectedBudget('')}>All</button>
                        {budgetLevels.map(level => (
                            <button key={level} className={`budget-option ${selectedBudget === level ? 'active' : ''}`} onClick={() => setSelectedBudget(level)}>{level}</button>
                        ))}
                    </div>
                </div>

                <div className="categories-filter">
                    <div className="categories-label">INTERESTS</div>
                    <div className="categories-list">
                        {categories.map(category => (
                            <button key={category} className={`category-chip ${selectedCategories.includes(category) ? 'active' : ''}`} onClick={() => toggleCategory(category)}>{category}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="results-header">
                <div className="results-count">{filteredCities.length} destinations found</div>
                {(searchTerm || selectedBudget || selectedCategories.length > 0) && (
                    <button className="clear-filters" onClick={() => { setSearchTerm(''); setSelectedBudget(''); setSelectedCategories([]); }}>
                        Clear all
                    </button>
                )}
            </div>

            <div className="cities-grid">
                {filteredCities.map(city => (
                    <CityCard
                        key={city.id}
                        city={city}
                        onClick={() => handleCityClick(city.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;