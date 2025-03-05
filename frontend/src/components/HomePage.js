import React from "react";
import '../CSS/HomePage.css'
import { Link } from "react-router-dom";
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
    const { language } = useLanguage();

    // Using browser's Intl.DisplayNames for role translations
    const roleDisplayNames = new Intl.DisplayNames([language], { type: 'language' });
    
    // Using browser's Intl.MessageFormat for complex messages
    const messages = {
        intro: {
            'en': 'Transform surplus food into community support. Choose your role and be part of the solution.',
            'hi': 'अतिरिक्त भोजन को सामुदायिक सहायता में बदलें। अपनी भूमिका चुनें और समाधान का हिस्सा बनें।'
        },
        donor: {
            title: {
                'en': 'Donor',
                'hi': 'दाता'
            },
            description: {
                'en': 'Be a food hero. Donate your surplus and help those in need while reducing waste.',
                'hi': 'एक फूड हीरो बनें। अपना अतिरिक्त भोजन दान करें और जरूरतमंदों की मदद करें।'
            },
            cta: {
                'en': 'Become a Donor',
                'hi': 'दाता बनें'
            }
        },
        receiver: {
            title: {
                'en': 'Receiver',
                'hi': 'प्राप्तकर्ता'
            },
            description: {
                'en': 'Access nutritious meals and support from your community. Every plate matters.',
                'hi': 'अपने समुदाय से पौष्टिक भोजन और सहायता प्राप्त करें। हर थाली मायने रखती है।'
            },
            cta: {
                'en': 'Become a Receiver',
                'hi': 'प्राप्तकर्ता बनें'
            }
        },
        delivery: {
            title: {
                'en': 'Delivery Partner',
                'hi': 'डिलीवरी पार्टनर'
            },
            description: {
                'en': 'Connect donors and receivers. Your journey helps bridge food gaps in our community.',
                'hi': 'दाताओं और प्राप्तकर्ताओं को जोड़ें। आपकी यात्रा समुदाय में भोजन की कमी को दूर करने में मदद करती है।'
            },
            cta: {
                'en': 'Join Delivery',
                'hi': 'डिलीवरी से जुड़ें'
            }
        }
    };

    const getMessage = (path) => {
        const langCode = language.split('-')[0];
        return path[langCode] || path['en']; // Fallback to English if translation not available
    };

    return (
        <div className='homepage-container'>
            <div className="intro-box">
                <p>{getMessage(messages.intro)}</p>
            </div>

            <section className="cards-section">
                <div className="card donor-card">
                    <i className="fas fa-user-plus"></i>
                    <h2>{getMessage(messages.donor.title)}</h2>
                    <p>{getMessage(messages.donor.description)}</p>
                    <Link to="/donor">{getMessage(messages.donor.cta)}</Link>
                </div>
        
                <div className="card receiver-card">
                    <i className="fas fa-user"></i>
                    <h2>{getMessage(messages.receiver.title)}</h2>
                    <p>{getMessage(messages.receiver.description)}</p>
                    <Link to="/receiver">{getMessage(messages.receiver.cta)}</Link>
                </div>
        
                <div className="card delivery-card">
                    <i className="fas fa-truck"></i>
                    <h2>{getMessage(messages.delivery.title)}</h2>
                    <p>{getMessage(messages.delivery.description)}</p>
                    <Link to="/delivery">{getMessage(messages.delivery.cta)}</Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;

