import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
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

    if (!profile) return <Typography sx={{ p: 4 }}>Loading...</Typography>;

    return (
        <Box maxWidth={800} mx="auto" px={4} py={5}>
            <Typography variant="h4" mb={4}>Profile</Typography>
            <Box display="flex" flexDirection="column" gap={3}>
                <Paper sx={{ p: 4 }}>
                    <PersonalInfoSection profile={profile} onUpdate={setProfile} />
                </Paper>
                <Paper sx={{ p: 4 }}>
                    <ChangePasswordSection />
                </Paper>
                <Paper sx={{ p: 4 }}>
                    <TravelPreferencesSection
                        preferences={preferences}
                        availablePreferences={availablePreferences}
                    />
                </Paper>
                <Paper sx={{ p: 4 }}>
                    <DeleteAccountSection />
                </Paper>
            </Box>
        </Box>
    );
}

export default ProfilePage;