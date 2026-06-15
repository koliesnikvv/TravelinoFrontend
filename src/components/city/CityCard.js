import './CityCard.css';

const BUDGET_LABELS = {
    'Budget': 'Budget',
    'Mid-range': 'Mid-range',
    'Luxury': 'Luxury',
};

const formatDuration = (idealDurations) => {
    if (!idealDurations || idealDurations.length === 0) return null;
    return idealDurations[0];
};

const CATEGORY_FIELDS = [
    'culture', 'adventure', 'nature', 'beaches',
    'nightlife', 'cuisine', 'wellness', 'urban', 'seclusion',
];

const getTopCategories = (city, limit = 3) => {
    return CATEGORY_FIELDS
        .map(field => ({ label: field.charAt(0).toUpperCase() + field.slice(1), score: city[field] || 0 }))
        .filter(c => c.score >= 5)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(c => c.label);
};

function CityCard({ city, onClick }) {
    const cityName = city.city || city.name || 'Unknown';
    const firstLetter = cityName.charAt(0).toUpperCase();
    const duration = formatDuration(city.ideal_durations);
    const topCategories = getTopCategories(city);
    const hasImage = !!city.image_url;

    return (
        <div className="city-card" onClick={onClick}>
            <div className="city-card-image">
                {hasImage ? (
                    <img
                        src={city.image_url}
                        alt={cityName}
                        className="city-image"
                        loading="lazy"
                        onError={(e) => {
                            // якщо фото не завантажилось — показати fallback
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className="city-avatar"
                    style={{ display: hasImage ? 'none' : 'flex' }}
                >
                    <span className="city-initial">{firstLetter}</span>
                </div>
            </div>

            <div className="city-card-content">
                <div className="city-info">
                    <h3 className="city-name">{cityName}</h3>
                    <p className="country">{city.country || 'Destination'}</p>
                    <div className="city-stats">
                        <span className="stat">
                            {BUDGET_LABELS[city.budget_level] || 'Mid-range'}
                        </span>
                        {duration && (
                            <span className="stat">{duration}</span>
                        )}
                    </div>
                    {topCategories.length > 0 && (
                        <div className="city-tags">
                            {topCategories.map((cat, idx) => (
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