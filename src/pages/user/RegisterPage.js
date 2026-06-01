import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { parseError } from '../../api/errors';
import { validateEmail, validatePassword, validatePhone, validateRequired } from '../../utils/validation';

function RegisterPage() {
    const [fields, setFields] = useState({
        firstName: '', lastName: '', email: '', phone: '', password: '', passwordCheck: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (field, validator) => (e) => {
        const value = e.target.value;
        setFields((prev) => ({ ...prev, [field]: value }));
        if (validator) {
            setErrors((prev) => ({ ...prev, [field]: validator(value) }));
        }
    };

    const handlePasswordCheckChange = (e) => {
        const value = e.target.value;
        setFields((prev) => ({ ...prev, passwordCheck: value }));
        setErrors((prev) => ({
            ...prev,
            passwordCheck: value !== fields.password ? 'Passwords do not match.' : null,
        }));
    };

    const validate = () => {
        const newErrors = {
            firstName: validateRequired(fields.firstName, 'First name'),
            lastName: validateRequired(fields.lastName, 'Last name'),
            email: validateEmail(fields.email),
            phone: validatePhone(fields.phone),
            password: validatePassword(fields.password),
            passwordCheck: fields.password !== fields.passwordCheck ? 'Passwords do not match.' : null,
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((e) => !e);
    };

    const handleRegister = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await client.post('/users/register/', {
                first_name: fields.firstName,
                last_name: fields.lastName,
                email: fields.email,
                phone: fields.phone,
                password: fields.password,
                password_check: fields.passwordCheck,
            });
            navigate('/login', { state: { message: 'Registration successful. Please check your email to verify your account.' } });
        } catch (err) {
            setErrors((prev) => ({ ...prev, general: parseError(err) }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h1>Sign Up</h1>
            <input
                placeholder="First name"
                value={fields.firstName}
                onChange={handleChange('firstName', (v) => validateRequired(v, 'First name'))}
            />
            {errors.firstName && <p className="form-error">{errors.firstName}</p>}
            <input
                placeholder="Last name"
                value={fields.lastName}
                onChange={handleChange('lastName', (v) => validateRequired(v, 'Last name'))}
            />
            {errors.lastName && <p className="form-error">{errors.lastName}</p>}
            <input
                type="email"
                placeholder="Email"
                value={fields.email}
                onChange={handleChange('email', validateEmail)}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
            <input
                placeholder="Phone (+380...)"
                value={fields.phone}
                onChange={handleChange('phone', validatePhone)}
            />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
            <input
                type="password"
                placeholder="Password"
                value={fields.password}
                onChange={handleChange('password', validatePassword)}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
            <input
                type="password"
                placeholder="Confirm password"
                value={fields.passwordCheck}
                onChange={handlePasswordCheckChange}
            />
            {errors.passwordCheck && <p className="form-error">{errors.passwordCheck}</p>}
            {errors.general && <p className="form-error">{errors.general}</p>}
            <button onClick={handleRegister} disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <button className="form-link" onClick={() => navigate('/login')}>
                Already have an account? Sign In
            </button>
        </div>
    );
}

export default RegisterPage;