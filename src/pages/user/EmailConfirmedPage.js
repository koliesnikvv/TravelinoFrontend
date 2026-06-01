import { useNavigate } from 'react-router-dom';

function EmailConfirmedPage() {
    const navigate = useNavigate();

    return (
        <div className="form-container">
            <h1>Email Confirmed</h1>
            <p className="form-success">Your email has been verified. You can now sign in.</p>
            <button onClick={() => navigate('/login')}>Sign In</button>
        </div>
    );
}

export default EmailConfirmedPage;