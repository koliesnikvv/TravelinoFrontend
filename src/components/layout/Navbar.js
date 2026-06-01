import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const isAuthenticated = !!token;

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo">
                    ✈️ Travellino
                </Link>

                <div className="nav-menu">
                    <Link to="/" className="nav-link">Home</Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/trips" className="nav-link">My Trips</Link>
                            <Link to="/profile" className="nav-link">Profile</Link>
                            <button onClick={handleLogout} className="nav-link logout-btn">
                                Logout
                            </button>
                        </>
                    )}
                    {!isAuthenticated && (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link register-btn">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;