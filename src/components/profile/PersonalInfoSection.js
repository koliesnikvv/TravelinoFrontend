import { useState } from 'react';
import client from '../../api/client';
import { parseError } from '../../api/errors';
import { validatePhone, validateRequired } from '../../utils/validation';

function PersonalInfoSection({ profile, onUpdate }) {
    const [fields, setFields] = useState({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field, validator) => (e) => {
        const value = e.target.value;
        setFields((prev) => ({ ...prev, [field]: value }));
        if (validator) {
            setErrors((prev) => ({ ...prev, [field]: validator(value) }));
        }
    };

    const handleSave = async () => {
        const newErrors = {
            first_name: validateRequired(fields.first_name, 'First name'),
            last_name: validateRequired(fields.last_name, 'Last name'),
            phone: validatePhone(fields.phone),
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some((e) => e)) return;

        setLoading(true);
        setMessage('');
        try {
            const response = await client.put('/users/profile/', fields);
            onUpdate(response.data);
            setMessage('Profile updated successfully.');
        } catch (err) {
            setErrors({ general: parseError(err) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2>Personal Info</h2>
            <p>Email: {profile.email}</p>
            <input
                placeholder="First name"
                value={fields.first_name}
                onChange={handleChange('first_name', (v) => validateRequired(v, 'First name'))}
            />
            {errors.first_name && <p className="form-error">{errors.first_name}</p>}
            <input
                placeholder="Last name"
                value={fields.last_name}
                onChange={handleChange('last_name', (v) => validateRequired(v, 'Last name'))}
            />
            {errors.last_name && <p className="form-error">{errors.last_name}</p>}
            <input
                placeholder="Phone (+380...)"
                value={fields.phone}
                onChange={handleChange('phone', validatePhone)}
            />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
            {errors.general && <p className="form-error">{errors.general}</p>}
            {message && <p className="form-success">{message}</p>}
            <button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </section>
    );
}

export default PersonalInfoSection;