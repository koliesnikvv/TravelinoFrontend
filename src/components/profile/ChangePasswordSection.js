import { useState } from 'react';
import client from '../../api/client';
import { parseError } from '../../api/errors';
import { validatePassword, validateRequired } from '../../utils/validation';

function ChangePasswordSection() {
    const [fields, setFields] = useState({
        current_password: '',
        new_password: '',
        new_password_check: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFields((prev) => ({ ...prev, [field]: value }));

        if (field === 'new_password') {
            setErrors((prev) => ({ ...prev, new_password: validatePassword(value) }));
        }
        if (field === 'new_password_check') {
            setErrors((prev) => ({
                ...prev,
                new_password_check: value !== fields.new_password ? 'Passwords do not match.' : null,
            }));
        }
    };

    const handleSave = async () => {
        const newErrors = {
            current_password: validateRequired(fields.current_password, 'Current password'),
            new_password: validatePassword(fields.new_password),
            new_password_check: fields.new_password !== fields.new_password_check
                ? 'Passwords do not match.'
                : null,
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some((e) => e)) return;

        setLoading(true);
        setMessage('');
        try {
            const response = await client.post('/users/profile/change-password/', {
                current_password: fields.current_password,
                new_password: fields.new_password,
            });
            setMessage(response.data.message);
            setFields({ current_password: '', new_password: '', new_password_check: '' });
        } catch (err) {
            setErrors({ general: parseError(err) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2>Change Password</h2>
            <input
                type="password"
                placeholder="Current password"
                value={fields.current_password}
                onChange={handleChange('current_password')}
            />
            {errors.current_password && <p className="form-error">{errors.current_password}</p>}
            <input
                type="password"
                placeholder="New password"
                value={fields.new_password}
                onChange={handleChange('new_password')}
            />
            {errors.new_password && <p className="form-error">{errors.new_password}</p>}
            <input
                type="password"
                placeholder="Confirm new password"
                value={fields.new_password_check}
                onChange={handleChange('new_password_check')}
            />
            {errors.new_password_check && <p className="form-error">{errors.new_password_check}</p>}
            {errors.general && <p className="form-error">{errors.general}</p>}
            {message && <p className="form-success">{message}</p>}
            <button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Change Password'}
            </button>
        </section>
    );
}

export default ChangePasswordSection;