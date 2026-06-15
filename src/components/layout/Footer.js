import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3 className="footer-logo">✈Travellino</h3>
                    <p className="footer-description">
                        Your personal travel planner for unforgettable adventures
                    </p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/trips">My Trips</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        {/* <li><Link to="/about">About Us</Link></li>*/}
                        {/*<li><Link to="/contact">Contact</Link></li>*/}
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Support</h4>
                    <ul className="footer-links">
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="social-links">
                        <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a href="#" target="_blank" rel="noopener noreferrer">X (formerly Twitter)</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} Travellino Capuccino. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;