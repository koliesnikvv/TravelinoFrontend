import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../../api/client';
import { parseError } from '../../api/errors';
import { validatePassword } from '../../utils/validation';

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { uid, token } = useParams();

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    };

    const handlePasswordCheckChange = (e) => {
        const value = e.target.value;
        setPasswordCheck(value);
        setErrors((prev) => ({
            ...prev,
            passwordCheck: value !== password ? 'Passwords do not match.' : null,
        }));
    };

    const handleSubmit = async () => {
        const passwordError = validatePassword(password);
        const passwordCheckError = password !== passwordCheck ? 'Passwords do not match.' : null;

        if (passwordError || passwordCheckError) {
            setErrors({ password: passwordError, passwordCheck: passwordCheckError });
            return;
        }

        setLoading(true);
        try {
            const response = await client.post(`http://localhost:3000/reset-password/${uid}/${token}/`,{
                new_password: password,
            });
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
                <h1>Password Reset Successful</h1>
                <p className="form-success">{message}</p>
                <button onClick={() => navigate('/login')}>Sign In</button>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h1>Reset Password</h1>
            <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={handlePasswordChange}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
            <input
                type="password"
                placeholder="Confirm new password"
                value={passwordCheck}
                onChange={handlePasswordCheckChange}
            />
            {errors.passwordCheck && <p className="form-error">{errors.passwordCheck}</p>}
            {errors.general && <p className="form-error">{errors.general}</p>}
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>
        </div>
    );
}

export default ResetPasswordPage;