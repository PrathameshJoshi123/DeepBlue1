import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../CSS/Navbar.css";
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage();

  const messages = {
    home: {
      'en': 'Home',
      'hi': 'होम'
    },
    about: {
      'en': 'About Us',
      'hi': 'हमारे बारे में'
    },
    login: {
      'en': 'Login',
      'hi': 'लॉग इन'
    },
    signup: {
      'en': 'Sign Up',
      'hi': 'साइन अप'
    },
    profile: {
      'en': 'Profile',
      'hi': 'प्रोफ़ाइल'
    },
    logout: {
      'en': 'Logout',
      'hi': 'लॉग आउट'
    },
    makeDonation: {
      'en': 'Make Donation',
      'hi': 'दान करें'
    },
    dashboard: {
      'en': 'Dashboard',
      'hi': 'डैशबोर्ड'
    },
    title: {
      'en': 'Urban Food Waste Management',
      'hi': 'शहरी खाद्य अपशिष्ट प्रबंधन'
    }
  };

  const getMessage = (path) => {
    const langCode = language.split('-')[0];
    return path[langCode] || path['en']; // Fallback to English if translation not available
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      setIsLoggedIn(true);
      setUserRole(user.role);
    } else {
      setIsLoggedIn(false);
      setUserRole('');
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:5000/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserRole('');
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-title">
          <h1>
            <i className="fas fa-hands-helping"></i> {getMessage(messages.title)}
          </h1>
        </Link>
        <div className="header-buttons">
          <Link to="/">{getMessage(messages.home)}</Link>
          <Link to="/about-us">{getMessage(messages.about)}</Link>

          {!isLoggedIn ? (
            <>
              <Link to="/login">{getMessage(messages.login)}</Link>
              <Link to="/signup">{getMessage(messages.signup)}</Link>
            </>
          ) : (
            <>
              {userRole === 'donor' && (
                <Link to="/make-donation">{getMessage(messages.makeDonation)}</Link>
              )}
              {userRole === 'receiver' && (
                <Link to="/dashboard">{getMessage(messages.dashboard)}</Link>
              )}
              {userRole === 'delivery_partner' && (
                <Link to="/delivery-dashboard">{getMessage(messages.dashboard)}</Link>
              )}
              <Link to="/profile" className="profile-link">
                <FaUser /> {getMessage(messages.profile)}
              </Link>
              <button onClick={handleLogout} className="logout-button">
                {getMessage(messages.logout)}
              </button>
            </>
          )}
          <LanguageSelector />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
