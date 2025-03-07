import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import Signup from "./components/Signup";
import Donor from "./components/Donor";
import Receiver from "./components/Receiver";
import DeliveryPage from "./components/DeliveryPage";
import AboutUs from "./components/AboutUs";
import DonationForm from "./components/DonationForm";
import Dashboard from "./components/Dashboard";
import DeliveryDashboard from "./components/DeliveryDashboard";
import Profile from "./components/Profile";
import ChatbotWidget from "./components/ChatbotWidget";
import MorePage from "./components/MorePage";
import ForecastPage from "./components/ForecastPage";
import "./App.css";

function App() {
  const [theme, setTheme] = useState('');

  useEffect(() => {
    const updateTheme = () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user) {
        switch (user.role) {
          case 'donor':
            setTheme('donor-theme');
            break;
          case 'receiver':
            setTheme('receiver-theme');
            break;
          case 'delivery_partner':
            setTheme('delivery-theme');
            break;
          default:
            setTheme('');
        }
      } else {
        setTheme('');
      }
    };

    updateTheme();
    window.addEventListener('storage', updateTheme);
    
    return () => {
      window.removeEventListener('storage', updateTheme);
    };
  }, []);

  return (
    <LanguageProvider>
      <div className={`app ${theme}`}>
        <Router>
          <Navbar />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/donor" element={<Donor />} />
              <Route path="/receiver" element={<Receiver />} />
              <Route path="/delivery" element={<DeliveryPage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/make-donation" element={<DonationForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/more" element={<MorePage />} />
              <Route path="/forecast" element={<ForecastPage />} />
            </Routes>
          </div>
          <Footer />
          <ChatbotWidget />
        </Router>
      </div>
    </LanguageProvider>
  );
}

export default App;
