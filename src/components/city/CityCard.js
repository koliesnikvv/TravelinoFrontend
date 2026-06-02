import './CityCard.css';

function CityCard({ city, onClick }) {
    const firstLetter = city.name?.charAt(0).toUpperCase() || '?';
    return (
        <div className="city-card" onClick={onClick}>
            <div className="city-card-content">
                <div className="city-avatar">
                    <span className="city-initial">{firstLetter}</span>
                </div>
                <div className="city-info">
                    <h3 className="city-name">{city.name}</h3>
                    <p className="country">{city.country || 'Destination'}</p>
                    <div className="city-stats">
                        <span className="stat">
                            <span className="stat-icon"></span>
                            {city.budget_level || 'Medium'}
                        </span>
                        <span className="stat">
                            <span className="stat-icon"></span>
                            {city.recommended_duration ||  3} days
                        </span>
                    </div>
                    {city.categories && city.categories.length > 0 && (
                        <div className="city-tags">
                            {city.categories.slice(0, 3).map((cat, idx) => (
                                <span key={idx} className="tag">{cat}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CityCard;