import './WeatherWidget.css';
import { useState, useEffect } from 'react';

const WeatherWidget = ({ data }) => {
    const [realDates, setRealDates] = useState([]);

    useEffect(() => {
        const today = new Date();
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const dates = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(today.getDate() + i);
            return {
                day: weekDays[date.getDay()],
                date: date.getDate(),
                month: months[date.getMonth()],
                fullDate: date,
                isToday: i === 0,
            };
        });
        setRealDates(dates);
    }, []);

    if (!data || !data.length || realDates.length === 0) return null;

    const isWeekend = (day) => day === 'Sat' || day === 'Sun';

    const combinedData = data.map((weatherDay, idx) => ({
        ...weatherDay,
        day: realDates[idx]?.day || weatherDay.day,
        date: realDates[idx]?.date || weatherDay.date,
        month: realDates[idx]?.month || weatherDay.month,
        isToday: realDates[idx]?.isToday || false,
    }));

    return (
        <div className="weather-widget">
            <h3 className="widget-title">
                7-Day Weather Forecast
                {realDates[0] && realDates[6] && (
                    <span className="widget-subtitle">
                        {realDates[0].month} {realDates[0].date} — {realDates[6].month} {realDates[6].date}
                    </span>
                )}
            </h3>
            <div className="weather-container">
                {combinedData.map((day, idx) => (
                    <div key={idx} className={`weather-card ${day.isToday ? 'today' : ''}`}>
                        <div className="weather-day">{day.day}</div>
                        <div className={`weather-date ${isWeekend(day.day) ? 'weekend' : ''}`}>
                            {day.date}
                        </div>
                        <div className="weather-month">{day.month}</div>
                        <div className="weather-icon">{day.icon}</div>
                        <div className="weather-temp-row">
                            <div className="weather-temp-col">
                                <div className="weather-label">MIN.</div>
                                <div className="weather-value">{day.temp_min}°</div>
                            </div>
                            <div className="weather-temp-col">
                                <div className="weather-label">MAX.</div>
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