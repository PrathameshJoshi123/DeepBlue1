import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Get browser's language or stored preference
  const getBrowserLanguage = () => {
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang) {
      return storedLang;
    }
    
    const browserLang = navigator.language;
    return browserLang || 'en';
  };

  const [language, setLanguage] = useState(getBrowserLanguage());

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.dir = new Intl.Locale(language).textInfo?.direction || 'ltr';
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  const formatMessage = (message) => {
    try {
      return new Intl.RelativeTimeFormat(language).format(message);
    } catch (error) {
      return message;
    }
  };

  const formatNumber = (number) => {
    try {
      return new Intl.NumberFormat(language).format(number);
    } catch (error) {
      return number;
    }
  };

  const formatDate = (date) => {
    try {
      return new Intl.DateTimeFormat(language).format(date);
    } catch (error) {
      return date;
    }
  };

  const formatCurrency = (amount, currency = 'INR') => {
    try {
      return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch (error) {
      return amount;
    }
  };

  const switchLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        switchLanguage,
        formatMessage,
        formatNumber,
        formatDate,
        formatCurrency
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 