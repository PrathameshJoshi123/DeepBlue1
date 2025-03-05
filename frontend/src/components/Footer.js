import React from "react";
import '../CSS/Footer.css';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { language } = useLanguage();

    const messages = {
        copyright: {
            'en': '© 2024 Urban Food Waste Management. Connecting Communities, Reducing Waste.',
            'hi': '© 2024 शहरी खाद्य अपशिष्ट प्रबंधन। समुदायों को जोड़ना, अपशिष्ट को कम करना।'
        }
    };

    const getMessage = (path) => {
        const langCode = language.split('-')[0];
        return path[langCode] || path['en'];
    };

    return (
        <div className="footer-container">
            <p className="footer">{getMessage(messages.copyright)}</p>            
        </div>
    );
};

export default Footer;