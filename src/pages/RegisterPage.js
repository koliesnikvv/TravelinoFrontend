import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await client.post('/users/register/', {
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                password,
                password_check: passwordCheck,
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Щось пішло не так');
        }
    };

    return (
        <div>
            <h1>Реєстрація</h1>
            <input
                placeholder="Ім'я"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <br/>
            <input
                placeholder="Прізвище"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <br/>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br/>
            <input
                placeholder="Телефон (+380...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <br/>
            <input
                type="password"
                placeholder="Пароль"
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
            <button onClick={handleRegister}>Зареєструватись</button>
            <br/>
            <p onClick={() => navigate('/login')}>Вже є акаунт? Увійти</p>
        </div>
    );
}

export default RegisterPage;