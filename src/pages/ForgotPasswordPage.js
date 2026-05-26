import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await client.post('/users/forgot-password/', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Щось пішло не так');
        }
    };

    return (
        <div>
            <h1>Відновлення пароля</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br/>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
            <button onClick={handleSubmit}>Відправити</button>
            <br/>
            <p onClick={() => navigate('/login')}>Назад до входу</p>
        </div>
    );
}

export default ForgotPasswordPage;