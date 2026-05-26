import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

const handleLogin = async () => {
    try {
        const response = await client.post('/users/login/', { email, password });
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        navigate('/');
    } catch (err) {
        setError(err.response?.data?.error || 'Щось пішло не так');
    }
};

return (
    <div>
        <h1>Вхід</h1>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button onClick={handleLogin}>Увійти</button>
        <p onClick={() => navigate('/register')}>Немає акаунту? Зареєструватись</p>
        <p onClick={() => navigate('/forgot-password')}>Забув пароль?</p>
    </div>
);
}

export default LoginPage;