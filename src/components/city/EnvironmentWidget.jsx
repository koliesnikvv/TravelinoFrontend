import './EnvironmentWidget.css';

const getAQIStatus = (aqi) => {
    let status, color, bgColor, message;
    let percentage = Math.min(aqi / 500 * 100, 100).toFixed(0);

    if (aqi <= 50) {
        status = "Good";
        color = "#8BC34A";
        bgColor = "rgba(139, 195, 74, 0.3)";
        message = "Perfect for sightseeing and outdoor activities";
    } else if (aqi <= 100) {
        status = "Moderate";
        color = "#CDDC39";
        bgColor = "rgba(205, 220, 57, 0.3)";
        message = "OK for most people. Sensitive groups should take care.";
    } else if (aqi <= 150) {
        status = "Unhealthy for Sensitive";
        color = "#FFEB3B";
        bgColor = "rgba(255, 235, 59, 0.3)";
        message = "Children, elderly, and people with respiratory issues should limit outdoor time.";
    } else if (aqi <= 200) {
        status = "Unhealthy";
        color = "#FFC107";
        bgColor = "rgba(255, 193, 7, 0.3)";
        message = "Everyone may feel effects. Limit outdoor activities.";
    } else if (aqi <= 300) {
        status = "Very Unhealthy";
        color = "#FF9800";
        bgColor = "rgba(255, 152, 0, 0.3)";
        message = "Health alert. Avoid outdoor activities.";
    } else {
        status = "Hazardous";
        color = "#F44336";
        bgColor = "rgba(244, 67, 54, 0.3)";
        message = "Emergency conditions. Stay indoors with windows closed.";
    }

    return {
        status: status,
        color: color,
        bgColor: bgColor,
        message: message,
        percentage: percentage
    };
};

const AQI_LEVELS = [
    { min: 0, max: 50, color: "#8BC34A", label: "Good" },
    { min: 51, max: 100, color: "#CDDC39", label: "Moderate" },
    { min: 101, max: 150, color: "#FFEB3B", label: "Unhealthy for Sensitive" },
    { min: 151, max: 200, color: "#FFC107", label: "Unhealthy" },
    { min: 201, max: 300, color: "#FF9800", label: "Very Unhealthy" },
    { min: 301, max: 500, color: "#F44336", label: "Hazardous" },
];

const EnvironmentWidget = ({ data }) => {
    if (!data) return null;

    const aqi = data.aqi;
    const { status, color, bgColor, message, percentage } = getAQIStatus(aqi);

    const getPosition = (aqi) => {
        if (aqi <= 50) return (aqi / 50) * 16.6;
        if (aqi <= 100) return 16.6 + ((aqi - 50) / 50) * 16.7;
        if (aqi <= 150) return 33.3 + ((aqi - 100) / 50) * 16.7;
        if (aqi <= 200) return 50 + ((aqi - 150) / 50) * 16.7;
        if (aqi <= 300) return 66.7 + ((aqi - 200) / 100) * 16.7;
        return 83.4 + Math.min((aqi - 300) / 200, 1) * 16.6;
    };

    return (
        <div className="metric-card environment-card">
            <div className="metric-header">
                <span className="metric-title">Air Quality</span>
            </div>

            <div className="aqi-main" style={{ backgroundColor: bgColor }}>
                <div className="aqi-status">
                    <span className="aqi-value">{percentage}%</span>
                    <span className="aqi-label" style={{ color: color }}>{status}</span>
                </div>
            </div>

            <div className="aqi-scale">
                <div className="scale-bar">
                    {AQI_LEVELS.map((level, idx) => (
                        <div
                            key={idx}
                            className="scale-segment"
                            style={{ backgroundColor: level.color }}
                            title={`${level.min}-${level.max}: ${level.label}`}
                        />
                    ))}
                </div>
                <div
                    className="scale-marker"
                    style={{ left: `${getPosition(aqi)}%` }}
                >
                    <div className="marker-dot" style={{ backgroundColor: color }} />
                </div>
            </div>

            <div className="aqi-message">
                <span>{message}</span>
            </div>

            <div className="environment-stats">
                <div className="env-stat">
                    <span className="env-label">PM2.5</span>
                    <span className="env-value">{data.pm25} µg/m³</span>
                </div>
                <div className="env-stat">
                    <span className="env-label">PM10</span>
                    <span className="env-value">{data.pm10} µg/m³</span>
                </div>
            </div>
        </div>
    );
};

export default EnvironmentWidget;