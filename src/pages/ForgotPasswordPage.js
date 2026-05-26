import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { parseError } from '../api/errors';
import { validateEmail } from '../utils/validation';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    };

    const handleSubmit = async () => {
        const emailError = validateEmail(email);
        if (emailError) {
            setErrors({ email: emailError });
            return;
        }

        setLoading(true);
        try {
            const response = await client.post('/users/forgot-password/', { email });
            setMessage(response.data.message);
        } catch (err) {
            setErrors({ general: parseError(err) });
        } finally {
            setLoading(false);
        }
    };

    if (message) {
        return (
            <div className="form-container">
                <h1>Check Your Email</h1>
                <p className="form-success">{message}</p>
                <p>Follow the link in the email to reset your password.</p>
                <button onClick={() => navigate('/login')}>Back to Sign In</button>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h1>Forgot Password</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
            {errors.general && <p className="form-error">{errors.general}</p>}
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button className="form-link" onClick={() => navigate('/login')}>
                Back to Sign In
            </button>
        </div>
    );
}

export default ForgotPasswordPage;