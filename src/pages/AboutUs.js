import React from "react";
import './contacts&aboutUs.css';
const AboutUs = () => {
    return (
        <div className="about-page">
            <div className="about-hero">
                <h1>About Travellino</h1>
                <p>Your journey begins here</p>
            </div>

            <div className="about-content">
                <div className="about-section">
                    <div className="about-text">
                        <h2>Our Story</h2>
                        <p>
                            We wanted to create a platform that helps people easily dream up, plan and organize exciting trips – all in one place.
                        </p>
                        <p>
                            Our idea was simple: traveling should be inspiring and not stressful. That's why we built a website where users can generate their own trips, explore destinations and eventually turn those ideas into real journeys.
                        </p>
                    </div>
                    <div className="about-icon">✈️</div>
                </div>

                <div className="about-section reverse">
                    <div className="about-icon">🌍</div>
                    <div className="about-text">
                        <h2>What We Offer</h2>
                        <p>
                            With help of our platform you can not only get inspiration for your next trip, but also find flights and plan every step of your journey in one place.
                        </p>
                        <p>
                            We believe that planning a trip should be as enjoyable as the trip itself and our goal is to make that experience smooth, creative and accessible for everyone!
                        </p>
                    </div>
                </div>

                <div className="values-section">
                    <h2>Our Values</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <span className="value-icon"></span>
                            <h3>Inspiration</h3>
                            <p>Helping you discover amazing destinations</p>
                        </div>
                        <div className="value-card">
                            <span className="value-icon"></span>
                            <h3>Organization</h3>
                            <p>Everything in one place, perfectly planned</p>
                        </div>
                        <div className="value-card">
                            <span className="value-icon"></span>
                            <h3>Community</h3>
                            <p>Share and plan trips with friends</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;