import { useNavigate } from 'react-router-dom';

function EmailErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="form-container">
            <h1>Verification Failed</h1>
            <p className="form-error">The link is invalid or has expired. Please register again.</p>
            <button onClick={() => navigate('/register')}>Sign Up</button>
        </div>
    );
}

export default EmailErrorPage;