import './WeatherWidget.css';

const WeatherWidget = ({ data }) => {
    if (!data || !data.length) return null;

    const isWeekend = (day) => day === 'Sat' || day === 'Sun';

    return (
        <div className="weather-widget">
            <h3 className="widget-title">7-Day Weather Forecast</h3>
            <div className="weather-container">
                {data.map((day, idx) => (
                    <div key={idx} className="weather-card">
                        <div className="weather-day">{day.day}</div>
                        <div className={`weather-date ${isWeekend(day.day) ? 'weekend' : ''}`}>
                            {day.date}
                        </div>
                        <div className="weather-month">{day.month}</div>
                        <div className="weather-icon">{day.icon}</div>
                        <div className="weather-temp-row">
                            <div className="weather-temp-col">
                                <div className="weather-label">МІН.</div>
                                <div className="weather-value">{day.temp_min}°</div>
                            </div>
                            <div className="weather-temp-col">
                                <div className="weather-label">МАКС.</div>
                                <div className="weather-value">{day.temp_max}°</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherWidget;