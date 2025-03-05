import React from 'react';
import '../CSS/AboutUs.css';
import { useLanguage } from '../context/LanguageContext';

const AboutUs = () => {
  const { language } = useLanguage();

  const messages = {
    title: {
      'en': 'About Urban Food Waste Management',
      'hi': 'शहरी खाद्य अपशिष्ट प्रबंधन के बारे में'
    },
    mission: {
      title: {
        'en': 'Our Mission',
        'hi': 'हमारा मिशन'
      },
      content: {
        'en': 'To reduce food waste and hunger by connecting surplus food from restaurants and events with those in need through an efficient delivery network.',
        'hi': 'रेस्तरां और कार्यक्रमों से अतिरिक्त भोजन को एक कुशल वितरण नेटवर्क के माध्यम से जरूरतमंदों से जोड़कर खाद्य अपशिष्ट और भूख को कम करना।'
      }
    },
    vision: {
      title: {
        'en': 'Our Vision',
        'hi': 'हमारी दृष्टि'
      },
      content: {
        'en': 'A world where no edible food goes to waste while people go hungry. We envision a sustainable food distribution system that benefits all.',
        'hi': 'एक ऐसी दुनिया जहां कोई भी खाने योग्य भोजन बर्बाद नहीं होता जबकि लोग भूखे रहते हैं। हम एक स्थायी खाद्य वितरण प्रणाली की कल्पना करते हैं जो सभी को लाभान्वित करती है।'
      }
    },
    impact: {
      title: {
        'en': 'Our Impact',
        'hi': 'हमारा प्रभाव'
      },
      stats: {
        meals: {
          title: {
            'en': 'Meals Delivered',
            'hi': 'वितरित भोजन'
          },
          value: '10,000+'
        },
        restaurants: {
          title: {
            'en': 'Partner Restaurants',
            'hi': 'भागीदार रेस्तरां'
          },
          value: '50+'
        },
        communities: {
          title: {
            'en': 'Communities Served',
            'hi': 'सेवित समुदाय'
          },
          value: '25+'
        }
      }
    },
    howItWorks: {
      title: {
        'en': 'How It Works',
        'hi': 'यह कैसे काम करता है'
      },
      steps: {
        step1: {
          title: {
            'en': 'Donors Register',
            'hi': 'दाता पंजीकरण'
          },
          content: {
            'en': 'Restaurants and food businesses sign up to donate surplus food.',
            'hi': 'रेस्तरां और खाद्य व्यवसाय अतिरिक्त भोजन दान करने के लिए साइन अप करते हैं।'
          }
        },
        step2: {
          title: {
            'en': 'Food Listed',
            'hi': 'भोजन सूचीबद्ध'
          },
          content: {
            'en': 'Available food is listed with details and pickup times.',
            'hi': 'उपलब्ध भोजन विवरण और पिकअप समय के साथ सूचीबद्ध किया जाता है।'
          }
        },
        step3: {
          title: {
            'en': 'Delivery Partners Connect',
            'hi': 'डिलीवरी पार्टनर कनेक्ट'
          },
          content: {
            'en': 'Our delivery network ensures food reaches those in need.',
            'hi': 'हमारा डिलीवरी नेटवर्क सुनिश्चित करता है कि भोजन जरूरतमंदों तक पहुंचे।'
          }
        }
      }
    },
    contact: {
      title: {
        'en': 'Contact Us',
        'hi': 'संपर्क करें'
      },
      email: {
        'en': 'Email: contact@urbanfood.org',
        'hi': 'ईमेल: contact@urbanfood.org'
      },
      phone: {
        'en': 'Phone: +91 123-456-7890',
        'hi': 'फोन: +91 123-456-7890'
      },
      address: {
        'en': 'Address: 123 Food Street, City, State - 123456',
        'hi': 'पता: 123 फूड स्ट्रीट, शहर, राज्य - 123456'
      }
    }
  };

  const getMessage = (path) => {
    const langCode = language.split('-')[0];
    return path[langCode] || path['en'];
  };

  return (
    <div className="about-container">
      <h1>{getMessage(messages.title)}</h1>

      <section className="mission-section">
        <h2>{getMessage(messages.mission.title)}</h2>
        <p>{getMessage(messages.mission.content)}</p>
      </section>

      <section className="vision-section">
        <h2>{getMessage(messages.vision.title)}</h2>
        <p>{getMessage(messages.vision.content)}</p>
      </section>

      <section className="impact-section">
        <h2>{getMessage(messages.impact.title)}</h2>
        <div className="impact-stats">
          <div className="stat-card">
            <h3>{getMessage(messages.impact.stats.meals.title)}</h3>
            <p>{messages.impact.stats.meals.value}</p>
          </div>
          <div className="stat-card">
            <h3>{getMessage(messages.impact.stats.restaurants.title)}</h3>
            <p>{messages.impact.stats.restaurants.value}</p>
          </div>
          <div className="stat-card">
            <h3>{getMessage(messages.impact.stats.communities.title)}</h3>
            <p>{messages.impact.stats.communities.value}</p>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <h2>{getMessage(messages.howItWorks.title)}</h2>
        <div className="steps-container">
          <div className="step">
            <h3>{getMessage(messages.howItWorks.steps.step1.title)}</h3>
            <p>{getMessage(messages.howItWorks.steps.step1.content)}</p>
          </div>
          <div className="step">
            <h3>{getMessage(messages.howItWorks.steps.step2.title)}</h3>
            <p>{getMessage(messages.howItWorks.steps.step2.content)}</p>
          </div>
          <div className="step">
            <h3>{getMessage(messages.howItWorks.steps.step3.title)}</h3>
            <p>{getMessage(messages.howItWorks.steps.step3.content)}</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>{getMessage(messages.contact.title)}</h2>
        <div className="contact-info">
          <p>{getMessage(messages.contact.email)}</p>
          <p>{getMessage(messages.contact.phone)}</p>
          <p>{getMessage(messages.contact.address)}</p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
