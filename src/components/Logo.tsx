import React from 'react';
import './Logo.css';
import cryptoCatalyst from '../asserts/images/logo3.jpg'; // Import the image

const Logo: React.FC = () => {
    return (
        <div className="logo-container">
            <div className="logo-icon">
                <img src={cryptoCatalyst} alt="Crypto Catalyst" className="logo-image" /> {/* Add the image */}
            </div>
            <div className="logo-text">
                <h1 className="logo-title">Crypto Catalyst</h1>
                <p className="logo-tagline">Trade Smart, Trade Secure</p>
            </div>
        </div>
    );
};

export default Logo;
