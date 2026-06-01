import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import client from '../../api/client';
import { parseError } from '../../api/errors';
import { validateEmail } from '../../utils/validation';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const message = location.state?.message;

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async () => {
        const emailError = validateEmail(email);

        if (emailError) {
            setErrors({ email: emailError });
            return;
        }

        setLoading(true);
        try {
            const response = await client.post('/users/login/', { email, password });
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            navigate('/');
        } catch (err) {
            setErrors({ general: parseError(err) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h1>Sign In</h1>
            {message && <p className="form-success">{message}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
            />
            {errors.general && <p className="form-error">{errors.general}</p>}
            <button onClick={handleLogin} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <button className="form-link" onClick={() => navigate('/register')}>
                Don't have an account? Sign Up
            </button>
            <button className="form-link" onClick={() => navigate('/forgot-password')}>
                Forgot password?
            </button>
        </div>
    );
}

export default LoginPage;