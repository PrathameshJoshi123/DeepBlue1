import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaUtensils, FaLeaf, FaChartLine, FaWeightHanging } from 'react-icons/fa';
import '../CSS/ImpactDashboard.css';

// Mock data - in a real application, this would come from your backend API
const mockData = {
  totalMeals: 24750,
  wasteReduced: 12375, // in kg
  co2Reduced: 37125, // in kg (approximately 3kg CO2 per 1kg food waste)
  monthlyStats: [
    { month: 'Jan', meals: 1200, waste: 600, co2: 1800 },
    { month: 'Feb', meals: 1350, waste: 675, co2: 2025 },
    { month: 'Mar', meals: 1500, waste: 750, co2: 2250 },
    { month: 'Apr', meals: 1650, waste: 825, co2: 2475 },
    { month: 'May', meals: 1800, waste: 900, co2: 2700 },
    { month: 'Jun', meals: 2100, waste: 1050, co2: 3150 },
    { month: 'Jul', meals: 2250, waste: 1125, co2: 3375 },
    { month: 'Aug', meals: 2400, waste: 1200, co2: 3600 },
    { month: 'Sep', meals: 2550, waste: 1275, co2: 3825 },
    { month: 'Oct', meals: 2700, waste: 1350, co2: 4050 },
    { month: 'Nov', meals: 2850, waste: 1425, co2: 4275 },
    { month: 'Dec', meals: 2400, waste: 1200, co2: 3600 }
  ]
};

const ImpactDashboard = () => {
  const { language } = useLanguage();
  const [activeChart, setActiveChart] = useState('meals');
  const [animatedStats, setAnimatedStats] = useState({
    totalMeals: 0,
    wasteReduced: 0,
    co2Reduced: 0
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const messages = {
    title: {
      'en': 'Our Impact Dashboard',
      'hi': 'हमारा प्रभाव डैशबोर्ड'
    },
    subtitle: {
      'en': 'See the difference we\'re making together',
      'hi': 'देखें हम मिलकर क्या बदलाव ला रहे हैं'
    },
    stats: {
      meals: {
        title: {
          'en': 'Meals Distributed',
          'hi': 'वितरित भोजन'
        },
        unit: {
          'en': 'meals',
          'hi': 'भोजन'
        }
      },
      waste: {
        title: {
          'en': 'Food Waste Prevented',
          'hi': 'खाद्य अपशिष्ट रोका गया'
        },
        unit: {
          'en': 'kg',
          'hi': 'किलोग्राम'
        }
      },
      co2: {
        title: {
          'en': 'CO₂ Emissions Reduced',
          'hi': 'CO₂ उत्सर्जन कम किया गया'
        },
        unit: {
          'en': 'kg',
          'hi': 'किलोग्राम'
        }
      }
    },
    chartTitle: {
      'en': 'Monthly Progress',
      'hi': 'मासिक प्रगति'
    },
    chartLabels: {
      meals: {
        'en': 'Meals',
        'hi': 'भोजन'
      },
      waste: {
        'en': 'Waste Prevented',
        'hi': 'अपशिष्ट रोका गया'
      },
      co2: {
        'en': 'CO₂ Reduced',
        'hi': 'CO₂ कम किया गया'
      }
    }
  };

  const getMessage = (path) => {
    const langCode = language.split('-')[0];
    return path[langCode] || path['en'];
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animate the counter numbers
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 50;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        totalMeals: Math.round(mockData.totalMeals * progress),
        wasteReduced: Math.round(mockData.wasteReduced * progress),
        co2Reduced: Math.round(mockData.co2Reduced * progress)
      });
      
      if (currentStep === steps) {
        clearInterval(interval);
      }
    }, stepTime);
    
    return () => clearInterval(interval);
  }, []);

  // Function to render the bar chart
  const renderChart = () => {
    const data = mockData.monthlyStats;
    // For mobile, show only 6 months if screen width is less than 768px
    const displayData = windowWidth < 768 ? data.slice(6) : data;
    const maxValue = Math.max(...data.map(item => item[activeChart]));
    
    return (
      <div className="chart-container">
        <h3>{getMessage(messages.chartTitle)}</h3>
        <div className="chart-tabs">
          <button 
            className={`chart-tab ${activeChart === 'meals' ? 'active' : ''}`}
            onClick={() => setActiveChart('meals')}
          >
            <FaUtensils /> {getMessage(messages.chartLabels.meals)}
          </button>
          <button 
            className={`chart-tab ${activeChart === 'waste' ? 'active' : ''}`}
            onClick={() => setActiveChart('waste')}
          >
            <FaWeightHanging /> {getMessage(messages.chartLabels.waste)}
          </button>
          <button 
            className={`chart-tab ${activeChart === 'co2' ? 'active' : ''}`}
            onClick={() => setActiveChart('co2')}
          >
            <FaLeaf /> {getMessage(messages.chartLabels.co2)}
          </button>
        </div>
        <div className="bar-chart">
          {displayData.map((item, index) => (
            <div className="bar-column" key={index}>
              <div className="bar-wrapper">
                <div 
                  className="bar" 
                  style={{ 
                    height: `${(item[activeChart] / maxValue) * 100}%`,
                    backgroundColor: getBarColor(activeChart)
                  }}
                  data-value={item[activeChart]}
                >
                  <span className="bar-value">{item[activeChart].toLocaleString()}</span>
                </div>
              </div>
              <div className="bar-label">{item.month}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Function to get the appropriate color for each chart type
  const getBarColor = (chartType) => {
    switch(chartType) {
      case 'meals':
        return '#3498db';
      case 'waste':
        return '#2ecc71';
      case 'co2':
        return '#e67e22';
      default:
        return '#3498db';
    }
  };

  return (
    <div className="impact-dashboard">
      <h2 className="dashboard-title">{getMessage(messages.title)}</h2>
      <p className="dashboard-subtitle">{getMessage(messages.subtitle)}</p>
      
      <div className="stats-container">
        <div className="stat-card meals">
          <div className="stat-icon">
            <FaUtensils />
          </div>
          <div className="stat-content">
            <h3>{getMessage(messages.stats.meals.title)}</h3>
            <div className="stat-value">
              {animatedStats.totalMeals.toLocaleString()}
              <span className="stat-unit"> {getMessage(messages.stats.meals.unit)}</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card waste">
          <div className="stat-icon">
            <FaWeightHanging />
          </div>
          <div className="stat-content">
            <h3>{getMessage(messages.stats.waste.title)}</h3>
            <div className="stat-value">
              {animatedStats.wasteReduced.toLocaleString()}
              <span className="stat-unit"> {getMessage(messages.stats.waste.unit)}</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card co2">
          <div className="stat-icon">
            <FaLeaf />
          </div>
          <div className="stat-content">
            <h3>{getMessage(messages.stats.co2.title)}</h3>
            <div className="stat-value">
              {animatedStats.co2Reduced.toLocaleString()}
              <span className="stat-unit"> {getMessage(messages.stats.co2.unit)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {renderChart()}
    </div>
  );
};

export default ImpactDashboard; 