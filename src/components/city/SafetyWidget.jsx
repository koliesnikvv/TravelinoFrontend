import './CityMetrics.css';

const SafetyWidget = ({ data }) => {
    if (!data) return null;

    const warConflict = data.war_conflict || "No active war or conflict";
    const isWarSafe = warConflict.includes("No active war");
    const isCrimeSafe = data.crime_risk === "Low";

    return (
        <div className="metric-card">
            <div className="metric-header">
                <span className="metric-icon">🛡️</span>
                <span className="metric-title">Safety Status</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{
                    background: 'rgba(77,182,172,0.08)',
                    borderRadius: '16px',
                    padding: '16px 12px',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>⚔️</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px' }} className={isWarSafe ? 'status-safe' : 'status-warning'}>
                        {isWarSafe ? 'SAFE' : 'CAUTION'}
                    </div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#8aa8a8', textTransform: 'uppercase', marginBottom: '6px' }}>War / Conflict</div>
                    <div style={{ fontSize: '0.7rem', color: '#5a7a7a' }}>
                        {isWarSafe ? 'No active war in region' : 'Active conflict — check advisories'}
                    </div>
                </div>
                
                <div style={{
                    background: 'rgba(77,182,172,0.08)',
                    borderRadius: '16px',
                    padding: '16px 12px',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🔒</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px' }} className={isCrimeSafe ? 'status-low' : 'status-medium'}>
                        {isCrimeSafe ? 'LOW' : 'MEDIUM'}
                    </div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#8aa8a8', textTransform: 'uppercase', marginBottom: '6px' }}>Crime Rate</div>
                    <div style={{ fontSize: '0.7rem', color: '#5a7a7a' }}>
                        {isCrimeSafe ? 'Safe for tourists' : 'Be aware of surroundings'}
                    </div>
                </div>
            </div>
            
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(77,182,172,0.1)',
                borderRadius: '14px',
                padding: '12px 16px',
                marginTop: '16px',
            }}>
                <span style={{ fontSize: '1rem' }}>💡</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 500, color: '#2e7d7d' }}>
                    {isCrimeSafe ? 'Keep valuables secure in crowded areas' : 'Avoid displaying valuables, use hotel safes'}
                </span>
            </div>
        </div>
    );
};

export default SafetyWidget;