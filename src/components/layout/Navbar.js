import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('access');
            setIsAuthenticated(!!token);
        };

        checkAuth();

        window.addEventListener('storage', checkAuth);
        window.addEventListener('focus', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('focus', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo">
                    Travellino
                </Link>

                <div className="nav-menu">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/trips" className="nav-link">My Trips</Link>

                   {isAuthenticated ? (
                       <div className="auth-buttons">
                           <Link to="/profile" className="nav-link profile-btn">
                               Profile
                           </Link>
                           <button
                               onClick={handleLogout}
                               className="nav-link logout-btn">
                               Logout
                           </button>
                       </div>
                   ) : (
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