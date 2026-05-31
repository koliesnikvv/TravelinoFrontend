import { useState, useEffect } from 'react';
import client from '../../api/client';
import PersonalInfoSection from '../../components/profile/PersonalInfoSection';
import ChangePasswordSection from '../../components/profile/ChangePasswordSection';
import TravelPreferencesSection from '../../components/profile/TravelPreferencesSection';
import DeleteAccountSection from '../../components/profile/DeleteAccountSection';

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [preferences, setPreferences] = useState([]);
    const [availablePreferences, setAvailablePreferences] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, preferencesRes, optionsRes] = await Promise.all([
                    client.get('/users/profile/'),
                    client.get('/users/profile/preferences/'),
                    client.get('/users/profile/preferences/options/'),
                ]);
                setProfile(profileRes.data);
                setPreferences(preferencesRes.data.preferences);
                setAvailablePreferences(optionsRes.data.preferences);
            } catch (err) {
                console.error('Failed to load profile:', err);
            }
        };
        fetchData();
    }, []);

    if (!profile) return <p>Loading...</p>;

    return (
        <div className="page-container">
            <h1>Profile</h1>
            <PersonalInfoSection profile={profile} onUpdate={setProfile} />
            <ChangePasswordSection />
            <TravelPreferencesSection preferences={preferences} availablePreferences={availablePreferences} />
            <DeleteAccountSection />
        </div>
    );
}

export default ProfilePage;