import { useState } from 'react';
import client from '../../api/client';
import { parseError } from '../../api/errors';

function TravelPreferencesSection({ preferences: initial, availablePreferences }) {
    const [preferences, setPreferences] = useState(initial);
    const [search, setSearch] = useState('');
    const [focused, setFocused] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const addPreference = (pref) => {
        if (!preferences.includes(pref)) {
            setPreferences((prev) => [...prev, pref]);
        }
        setSearch('');
    };

    const removePreference = (pref) => {
        setPreferences((prev) => prev.filter((p) => p !== pref));
    };

    const filteredOptions = availablePreferences.filter(
        (pref) =>
            pref.toLowerCase().includes(search.toLowerCase()) &&
            !preferences.includes(pref)
    );

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        setError('');
        try {
            await client.put('/users/profile/preferences/', { preferences });
            setMessage('Preferences updated successfully.');
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2>Travel Preferences</h2>
            <div className="preferences-selected">
                {preferences.map((pref) => (
                    <span key={pref} className="preference-tag preference-tag--selected">
                        {pref}
                        <button className="preference-tag-remove" onClick={() => removePreference(pref)}>×</button>
                    </span>
                ))}
            </div>
            <input
                placeholder="Search preferences..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
            />
            {focused && (
                <div className="preferences-dropdown">
                    {filteredOptions.length === 0 && (
                        <p className="preferences-empty">No results</p>
                    )}
                    {filteredOptions.map((pref) => (
                        <div
                            key={pref}
                            className="preferences-dropdown-item"
                            onClick={() => addPreference(pref)}
                        >
                            {pref}
                        </div>
                    ))}
                </div>
            )}
            {error && <p className="form-error">{error}</p>}
            {message && <p className="form-success">{message}</p>}
            <button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Preferences'}
            </button>
        </section>
    );
}

export default TravelPreferencesSection;