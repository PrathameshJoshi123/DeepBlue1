import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/ForecastPage.css';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const ForecastPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableFood, setAvailableFood] = useState(300);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [location, setLocation] = useState('Mumbai');
  const [withinKm, setWithinKm] = useState(10);
  const [daysAhead, setDaysAhead] = useState(30);
  const [activeTab, setActiveTab] = useState('forecast');
  const [consumptionData, setConsumptionData] = useState([
    { month: 'January', vegetarian: 1200, nonVegetarian: 800, perishable: 600, nonPerishable: 1400 },
    { month: 'February', vegetarian: 1100, nonVegetarian: 900, perishable: 650, nonPerishable: 1350 },
    { month: 'March', vegetarian: 1300, nonVegetarian: 750, perishable: 700, nonPerishable: 1350 },
  ]);
  const [timePeriod, setTimePeriod] = useState('last 3 months');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const { language } = useLanguage();

  // Translation messages
  const messages = {
    pageTitle: {
      'en': 'Event Forecasting & Food Distribution Optimization',
      'hi': 'इवेंट पूर्वानुमान और खाद्य वितरण अनुकूलन'
    },
    upcomingEvents: {
      'en': 'Upcoming Events',
      'hi': 'आगामी कार्यक्रम'
    },
    locationLabel: {
      'en': 'Location:',
      'hi': 'स्थान:'
    },
    withinLabel: {
      'en': 'Within (km):',
      'hi': 'इसके भीतर (किमी):'
    },
    daysAheadLabel: {
      'en': 'Days ahead:',
      'hi': 'आगे के दिन:'
    },
    applyFilters: {
      'en': 'Apply Filters',
      'hi': 'फिल्टर लागू करें'
    },
    loading: {
      'en': 'Loading events...',
      'hi': 'कार्यक्रम लोड हो रहे हैं...'
    },
    noEvents: {
      'en': 'No upcoming events found.',
      'hi': 'कोई आगामी कार्यक्रम नहीं मिला।'
    },
    date: {
      'en': 'Date:',
      'hi': 'तारीख:'
    },
    location: {
      'en': 'Location:',
      'hi': 'स्थान:'
    },
    attendance: {
      'en': 'Expected Attendance:',
      'hi': 'अपेक्षित उपस्थिति:'
    },
    foodNeeded: {
      'en': 'Estimated Food Needed:',
      'hi': 'अनुमानित खाद्य आवश्यकता:'
    },
    kg: {
      'en': 'kg',
      'hi': 'किग्रा'
    },
    optimization: {
      'en': 'Food Distribution Optimization',
      'hi': 'खाद्य वितरण अनुकूलन'
    },
    availableFood: {
      'en': 'Available Food (kg):',
      'hi': 'उपलब्ध खाद्य (किग्रा):'
    },
    optimizeButton: {
      'en': 'Optimize Distribution',
      'hi': 'वितरण अनुकूलित करें'
    },
    optimizedPlan: {
      'en': 'Optimized Distribution Plan',
      'hi': 'अनुकूलित वितरण योजना'
    },
    allocatedAmount: {
      'en': 'Allocated Amount:',
      'hi': 'आवंटित मात्रा:'
    },
    demandFulfilled: {
      'en': 'Demand Fulfilled:',
      'hi': 'पूरी की गई मांग:'
    },
    totalAllocated: {
      'en': 'Total Allocated:',
      'hi': 'कुल आवंटित:'
    },
    remainingUnallocated: {
      'en': 'Remaining Unallocated:',
      'hi': 'शेष अनावंटित:'
    },
    errorFetchingEvents: {
      'en': 'Failed to fetch events. Please try again later.',
      'hi': 'कार्यक्रम प्राप्त करने में विफल। कृपया बाद में पुनः प्रयास करें।'
    },
    errorOptimizing: {
      'en': 'Failed to optimize distribution. Please try again later.',
      'hi': 'वितरण अनुकूलित करने में विफल। कृपया बाद में पुनः प्रयास करें।'
    },
    language: {
      'en': 'Language:',
      'hi': 'भाषा:'
    },
    forecastTab: {
      'en': 'Event Forecast',
      'hi': 'इवेंट पूर्वानुमान'
    },
    analysisTab: {
      'en': 'Consumption Analysis',
      'hi': 'खपत विश्लेषण'
    },
    consumptionAnalysis: {
      'en': 'Food Consumption Pattern Analysis',
      'hi': 'खाद्य खपत पैटर्न विश्लेषण'
    },
    timePeriodLabel: {
      'en': 'Time Period:',
      'hi': 'समय अवधि:'
    },
    analyzeButton: {
      'en': 'Analyze Patterns',
      'hi': 'पैटर्न विश्लेषण करें'
    },
    consumptionData: {
      'en': 'Consumption Data',
      'hi': 'खपत डेटा'
    },
    month: {
      'en': 'Month',
      'hi': 'महीना'
    },
    vegetarian: {
      'en': 'Vegetarian (kg)',
      'hi': 'शाकाहारी (किग्रा)'
    },
    nonVegetarian: {
      'en': 'Non-Vegetarian (kg)',
      'hi': 'मांसाहारी (किग्रा)'
    },
    perishable: {
      'en': 'Perishable (kg)',
      'hi': 'नाशवान (किग्रा)'
    },
    nonPerishable: {
      'en': 'Non-Perishable (kg)',
      'hi': 'गैर-नाशवान (किग्रा)'
    },
    insights: {
      'en': 'Insights & Recommendations',
      'hi': 'अंतर्दृष्टि और सिफारिशें'
    },
    summary: {
      'en': 'Summary',
      'hi': 'सारांश'
    },
    loadingAnalysis: {
      'en': 'Analyzing consumption patterns...',
      'hi': 'खपत पैटर्न का विश्लेषण किया जा रहा है...'
    },
    errorAnalyzing: {
      'en': 'Failed to analyze consumption patterns. Please try again later.',
      'hi': 'खपत पैटर्न का विश्लेषण करने में विफल। कृपया बाद में पुनः प्रयास करें।'
    }
  };

  // Helper function to get translated message
  const getMessage = (key) => {
    const langCode = language.split('-')[0];
    return messages[key][langCode] || messages[key]['en']; // Fallback to English
  };

  // Fetch upcoming events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/forecast/events`, {
        params: {
          location: location,
          within_km: withinKm,
          days_ahead: daysAhead
        }
      });
      setEvents(response.data.events);
      setError(null);
    } catch (err) {
      setError(getMessage('errorFetchingEvents'));
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle optimization
  const handleOptimize = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/forecast/optimize', {
        available_food: availableFood
      });
      setOptimizationResult(response.data);
      setError(null);
    } catch (err) {
      setError(getMessage('errorOptimizing'));
      console.error('Error optimizing distribution:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle consumption pattern analysis
  const handleAnalyzeConsumption = async () => {
    try {
      setAnalysisLoading(true);
      const response = await axios.post('http://localhost:5000/forecast/analyze-consumption', {
        consumption_data: consumptionData,
        location: location,
        time_period: timePeriod
      });
      setAnalysisResult(response.data);
      setError(null);
    } catch (err) {
      setError(getMessage('errorAnalyzing'));
      console.error('Error analyzing consumption patterns:', err);
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="forecast-container">
      <div className="forecast-header">
        <h1>{getMessage('pageTitle')}</h1>
        <div className="language-control">
          <span>{getMessage('language')}</span>
          <LanguageSelector />
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'forecast' ? 'active' : ''}`}
          onClick={() => setActiveTab('forecast')}
        >
          {getMessage('forecastTab')}
        </button>
        <button 
          className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          {getMessage('analysisTab')}
        </button>
      </div>
      
      {activeTab === 'forecast' ? (
        <>
          <div className="forecast-section">
            <h2>{getMessage('upcomingEvents')}</h2>
            
            <div className="filter-controls">
              <div className="filter-group">
                <label htmlFor="location">{getMessage('locationLabel')}</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City name"
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="withinKm">{getMessage('withinLabel')}</label>
                <input
                  type="number"
                  id="withinKm"
                  value={withinKm}
                  onChange={(e) => setWithinKm(Number(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="daysAhead">{getMessage('daysAheadLabel')}</label>
                <input
                  type="number"
                  id="daysAhead"
                  value={daysAhead}
                  onChange={(e) => setDaysAhead(Number(e.target.value))}
                  min="1"
                  max="90"
                />
              </div>
              
              <button onClick={fetchEvents} className="filter-button">
                {getMessage('applyFilters')}
              </button>
            </div>
            
            {loading && <p>{getMessage('loading')}</p>}
            {error && <p className="error">{error}</p>}
            
            {events.length > 0 ? (
              <div className="events-grid">
                {events.map((event, index) => (
                  <div key={index} className="event-card">
                    <h3>{event.name}</h3>
                    <p><strong>{getMessage('date')}</strong> {event.date}</p>
                    <p><strong>{getMessage('location')}</strong> {event.location}</p>
                    <p><strong>{getMessage('attendance')}</strong> {event.expected_attendance}</p>
                    <p><strong>{getMessage('foodNeeded')}</strong> {event.estimated_food_needed} {getMessage('kg')}</p>
                  </div>
                ))}
              </div>
            ) : (
              !loading && <p>{getMessage('noEvents')}</p>
            )}
          </div>
          
          <div className="optimization-section">
            <h2>{getMessage('optimization')}</h2>
            <div className="optimization-input">
              <label htmlFor="availableFood">{getMessage('availableFood')}</label>
              <input
                type="number"
                id="availableFood"
                value={availableFood}
                onChange={(e) => setAvailableFood(Number(e.target.value))}
                min="0"
              />
              <button onClick={handleOptimize} disabled={loading}>
                {getMessage('optimizeButton')}
              </button>
            </div>
            
            {optimizationResult && (
              <div className="optimization-result">
                <h3>{getMessage('optimizedPlan')}</h3>
                <div className="distribution-grid">
                  {optimizationResult.optimized_distribution.map((item, index) => (
                    <div key={index} className="distribution-card">
                      <h4>{item.receiver_name}</h4>
                      <p><strong>{getMessage('location')}</strong> {item.location}</p>
                      <p><strong>{getMessage('allocatedAmount')}</strong> {item.allocated_amount} {getMessage('kg')}</p>
                      <p><strong>{getMessage('demandFulfilled')}</strong> {item.demand_fulfilled}</p>
                    </div>
                  ))}
                </div>
                <div className="summary">
                  <p><strong>{getMessage('totalAllocated')}</strong> {optimizationResult.total_allocated} {getMessage('kg')}</p>
                  <p><strong>{getMessage('remainingUnallocated')}</strong> {optimizationResult.remaining_unallocated} {getMessage('kg')}</p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="analysis-section">
          <h2>{getMessage('consumptionAnalysis')}</h2>
          
          <div className="analysis-controls">
            <div className="filter-group">
              <label htmlFor="location">{getMessage('locationLabel')}</label>
              <input
                type="text"
                id="analysis-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City name"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="timePeriod">{getMessage('timePeriodLabel')}</label>
              <select
                id="timePeriod"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
              >
                <option value="last month">Last Month</option>
                <option value="last 3 months">Last 3 Months</option>
                <option value="last 6 months">Last 6 Months</option>
                <option value="last year">Last Year</option>
              </select>
            </div>
            
            <button onClick={handleAnalyzeConsumption} className="filter-button" disabled={analysisLoading}>
              {getMessage('analyzeButton')}
            </button>
          </div>
          
          <div className="consumption-data-section">
            <h3>{getMessage('consumptionData')}</h3>
            <div className="consumption-table-container">
              <table className="consumption-table">
                <thead>
                  <tr>
                    <th>{getMessage('month')}</th>
                    <th>{getMessage('vegetarian')}</th>
                    <th>{getMessage('nonVegetarian')}</th>
                    <th>{getMessage('perishable')}</th>
                    <th>{getMessage('nonPerishable')}</th>
                  </tr>
                </thead>
                <tbody>
                  {consumptionData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.month}</td>
                      <td>{item.vegetarian}</td>
                      <td>{item.nonVegetarian}</td>
                      <td>{item.perishable}</td>
                      <td>{item.nonPerishable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {analysisLoading && <p className="loading-message">{getMessage('loadingAnalysis')}</p>}
          {error && <p className="error">{error}</p>}
          
          {analysisResult && (
            <div className="analysis-result">
              <h3>{getMessage('insights')}</h3>
              <div className="insights-grid">
                {analysisResult.insights.map((insight, index) => (
                  <div key={index} className="insight-card">
                    <h4>{insight.title}</h4>
                    <p className="insight-description">{insight.description}</p>
                    <p className="insight-recommendation"><strong>Recommendation:</strong> {insight.recommendation}</p>
                  </div>
                ))}
              </div>
              
              {analysisResult.summary && (
                <div className="analysis-summary">
                  <h3>{getMessage('summary')}</h3>
                  <p>{analysisResult.summary}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ForecastPage; 