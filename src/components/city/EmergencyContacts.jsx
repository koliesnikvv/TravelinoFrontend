import './EmergencyContacts.css';

const EmergencyContacts = ({ data }) => {
    if (!data) return null;

    const contacts = [
        { label: "POLICE", value: data.police },
        { label: "AMBULANCE", value: data.ambulance },
        { label: "FIRE", value: data.fire },
        { label: "UNIVERSAL", value: data.universal },
    ];

    return (
        <div className="metric-card">
            <div className="metric-header">
                <span className="metric-title">Emergency Contacts</span>
            </div>

            <div className="emergency-table">
                {contacts.map((contact, idx) => (
                    <div key={idx} className="emergency-row">
                        <span className="emergency-label">{contact.label}</span>
                        <span className="emergency-number">{contact.value}</span>
                    </div>
                ))}

                {data.tourist_police && data.tourist_police !== data.police && data.tourist_police !== data.universal && (
                    <div className="emergency-row">
                        <span className="emergency-label">TOURIST POLICE</span>
                        <span className="emergency-number">{data.tourist_police}</span>
                    </div>
                )}
            </div>

            {data.note && (
                <div className="emergency-note">
                    <span>{data.note}</span>
                </div>
            )}
        </div>
    );
};

export default EmergencyContacts;