import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../CSS/LanguageSelector.css';

const LanguageSelector = () => {
  const { language, switchLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' }
  ];

  return (
    <div className="language-selector">
      <select
        value={language}
        onChange={(e) => switchLanguage(e.target.value)}
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector; 