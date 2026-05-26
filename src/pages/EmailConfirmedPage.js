import { useNavigate } from 'react-router-dom';

function EmailConfirmedPage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Email підтверджено</h1>
            <p>Тепер можеш увійти в акаунт</p>
            <button onClick={() => navigate('/login')}>Увійти</button>
        </div>
    );
}

export default EmailConfirmedPage;