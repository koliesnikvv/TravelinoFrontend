import React from "react";
import './Contacts.css';

const Contacts = () => {
    return (
        <div className="contacts-page">
            <div className="contacts-hero">
                <h1>Get in Touch</h1>
                <p>We'd love to hear from you</p>
            </div>

            <div className="contacts-content">
                <div className="contact-info">
                    <div className="contact-card">
                        <span className="contact-icon"></span>
                        <h3>Email</h3>
                        <p>hello@travellino.com</p>
                        <p>support@travellino.com</p>
                    </div>
                    <div className="contact-card">
                        <span className="contact-icon"></span>
                        <h3>Phone</h3>
                        <p>+1 (555) 123-4567</p>
                        <p>Mon-Fri, 9am-6pm</p>
                    </div>
                    <div className="contact-card">
                        <span className="contact-icon"></span>
                        <h3>Office</h3>
                        <p>123 Travel Street</p>
                        <p>Kyiv, Ukraine</p>
                    </div>
                </div>

                <div className="contact-form-section">
                    <h2>Send us a message</h2>
                    <form className="contact-form">
                        <input type="text" placeholder="Your Name" className="form-input" />
                        <input type="email" placeholder="Your Email" className="form-input" />
                        <textarea placeholder="Your Message" rows="5" className="form-textarea"></textarea>
                        <button type="submit" className="submit-btn">Send Message </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contacts;