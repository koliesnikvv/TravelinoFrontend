function CityCard({ city, onClick }) {
    return (
        <div className="city-card" onClick={onClick}>
            <div className="city-image">
                <img src={city.image_url || '/default-city.jpg'} alt={city.name} />
            </div>
            <div className="city-info">
                <h3>{city.name}</h3>
                <p className="country">{city.country}</p>
                <div className="city-details">
                    <span className="budget">{city.budget_level || 'Medium'}</span>
                    <span className="duration">{city.recommended_duration || 3} days</span>
                </div>
                <div className="city-categories">
                    {city.categories?.slice(0, 3).map(cat => (
                        <span key={cat} className="category-tag">{cat}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default CityCard;