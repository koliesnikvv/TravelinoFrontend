import './SafetyWidget.css';

const SafetyWidget = ({ data }) => {
    if (!data) return null;

    const warConflict = data.war_conflict || "No active war or conflict";
    const isWarSafe = warConflict.includes("No active war");
    const isCrimeSafe = data.crime_risk === "Low";

    return (
        <div className="safety-card">
            <div className="metric-header">
                <span className="metric-title">Safety Status</span>
            </div>

            <div className="safety-stats">
                <div className={`safety-stat-item ${isWarSafe ? 'safe' : 'warning'}`}>
                    <div className="stat-icon">⚔️</div>
                    <div className={`stat-status ${isWarSafe ? 'safe' : 'warning'}`}>
                        {isWarSafe ? 'SAFE' : 'CAUTION'}
                    </div>
                    <div className="stat-label">War / Conflict</div>
                    <div className="stat-desc">
                        {isWarSafe ? 'No active war in region' : 'Active conflict — check advisories'}
                    </div>
                </div>

                <div className={`safety-stat-item ${isCrimeSafe ? 'safe' : 'warning'}`}>
                    <div className="stat-icon">🛡️</div>
                    <div className={`stat-status ${isCrimeSafe ? 'safe' : 'warning'}`}>
                        {isCrimeSafe ? 'LOW' : 'MEDIUM'}
                    </div>
                    <div className="stat-label">Crime Rate</div>
                    <div className="stat-desc">
                        {isCrimeSafe ? 'Safe for tourists' : 'Be aware of surroundings'}
                    </div>
                </div>
            </div>

            <div className="safety-tip">
                <span className="tip-text">
                    {isCrimeSafe
                        ? "Keep valuables secure in crowded areas"
                        : "Avoid displaying valuables, use hotel safes"}
                </span>
            </div>
        </div>
    );
};

export default SafetyWidget;