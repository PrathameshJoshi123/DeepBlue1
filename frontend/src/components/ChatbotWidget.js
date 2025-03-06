import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ChatbotWidget = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const initializeChatbase = () => {
      // Update language in global config
      if (window.chatbaseConfig) {
        const langCode = language.split('-')[0];
        window.chatbaseConfig.language = langCode;
      }

      // Initialize chatbase if not already initialized
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        // Create and append the script
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "QMHh3L2hy-2aczmDsF1tb";
        script.domain = "www.chatbase.co";
        document.body.appendChild(script);
      }
    };

    // Call initialization
    if (document.readyState === "complete") {
      initializeChatbase();
    } else {
      window.addEventListener("load", initializeChatbase);
      return () => window.removeEventListener("load", initializeChatbase);
    }
  }, [language]);

  // Handle language changes
  useEffect(() => {
    if (window.chatbase && window.chatbaseConfig) {
      const langCode = language.split('-')[0];
      const currentTranslation = window.chatbaseConfig.translations[langCode] || window.chatbaseConfig.translations.en;

      // Update chatbot configuration
      window.chatbase("updateConfig", {
        language: langCode,
        welcomeMessage: currentTranslation.welcomeMessage,
        inputPlaceholder: currentTranslation.placeholderText,
        sendButtonText: currentTranslation.sendButtonText,
        headerText: currentTranslation.headerText
      });
    }
  }, [language]);

  return null;
};

export default ChatbotWidget; 