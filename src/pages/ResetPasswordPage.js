import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { uid, token } = useParams();

    const handleSubmit = async () => {
        if (password !== passwordCheck) {
            setError('Паролі не збігаються');
            return;
        }

        try {
            const response = await client.post(`/users/reset-password/${uid}/${token}/`, {
                new_password: password,
            });
            setMessage(response.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Щось пішло не так');
        }
    };

    return (
        <div>
            <h1>Новий пароль</h1>
            <input
                type="password"
                placeholder="Новий пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br/>
            <input
                type="password"
                placeholder="Повторіть пароль"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
            />
            <br/>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
            <button onClick={handleSubmit}>Змінити пароль</button>
        </div>
    );
}

export default ResetPasswordPage;