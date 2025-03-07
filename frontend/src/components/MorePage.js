import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  FaHandsHelping, 
  FaUsers, 
  FaDonate, 
  FaBuilding, 
  FaEnvelope, 
  FaPhone, 
  FaUser, 
  FaFileAlt,
  FaCalculator,
  FaUtensils,
  FaHome,
  FaIndustry,
  FaLeaf,
  FaMoneyBillWave,
  FaTrash,
  FaComments,
  FaLightbulb,
  FaStar,
  FaQuestion,
  FaThumbsUp,
  FaReply,
  FaPlus,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import '../CSS/MorePage.css';
import CommunityForum from './CommunityForum';
import axios from 'axios';

const MorePage = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('csr');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: '',
    availability: '',
    skills: '',
    amount: '',
    donationType: 'oneTime'
  });
  const [formSubmitted, setFormSubmitted] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Calculator states
  const [calculatorType, setCalculatorType] = useState('restaurant');
  const [calculatorData, setCalculatorData] = useState({
    // Restaurant calculator
    restaurantFoodWaste: 50, // kg per week
    restaurantFoodCost: 200, // cost per kg
    
    // Individual calculator
    householdSize: 4,
    weeklyFoodWaste: 5, // kg per week
    
    // Organization calculator
    employeeCount: 100,
    monthlyFoodWaste: 500 // kg per month
  });
  const [calculationResults, setCalculationResults] = useState(null);

  const messages = {
    title: {
      'en': 'More Ways to Help',
      'hi': 'मदद करने के और तरीके'
    },
    tabs: {
      csr: {
        'en': 'CSR Benefits',
        'hi': 'सीएसआर लाभ'
      },
      volunteer: {
        'en': 'Join as Volunteer',
        'hi': 'स्वयंसेवक के रूप में जुड़ें'
      },
      donate: {
        'en': 'Raise Donations',
        'hi': 'दान जुटाएं'
      },
      calculator: {
        'en': 'Food Waste Calculator',
        'hi': 'खाद्य अपशिष्ट कैलकुलेटर'
      },
      community: {
        'en': 'Community Forum',
        'hi': 'सामुदायिक मंच'
      }
    },
    calculator: {
      title: {
        'en': 'Food Waste Calculator',
        'hi': 'खाद्य अपशिष्ट कैलकुलेटर'
      },
      subtitle: {
        'en': 'Calculate the impact of food waste and the benefits of donating',
        'hi': 'खाद्य अपशिष्ट के प्रभाव और दान के लाभों की गणना करें'
      },
      types: {
        restaurant: {
          'en': 'Restaurant',
          'hi': 'रेस्तरां'
        },
        individual: {
          'en': 'Individual',
          'hi': 'व्यक्तिगत'
        },
        organization: {
          'en': 'Organization',
          'hi': 'संगठन'
        }
      },
      restaurant: {
        title: {
          'en': 'Restaurant Food Waste Calculator',
          'hi': 'रेस्तरां खाद्य अपशिष्ट कैलकुलेटर'
        },
        description: {
          'en': 'Estimate how much money your restaurant could save by donating excess food',
          'hi': 'अनुमान लगाएं कि अतिरिक्त भोजन दान करके आपका रेस्तरां कितना पैसा बचा सकता है'
        },
        foodWaste: {
          'en': 'Weekly Food Waste (kg)',
          'hi': 'साप्ताहिक खाद्य अपशिष्ट (किग्रा)'
        },
        foodCost: {
          'en': 'Average Food Cost (₹/kg)',
          'hi': 'औसत खाद्य लागत (₹/किग्रा)'
        }
      },
      individual: {
        title: {
          'en': 'Household Food Waste Calculator',
          'hi': 'घरेलू खाद्य अपशिष्ट कैलकुलेटर'
        },
        description: {
          'en': 'Calculate your household\'s food waste footprint',
          'hi': 'अपने घर के खाद्य अपशिष्ट फुटप्रिंट की गणना करें'
        },
        householdSize: {
          'en': 'Household Size (people)',
          'hi': 'घर का आकार (लोग)'
        },
        weeklyWaste: {
          'en': 'Weekly Food Waste (kg)',
          'hi': 'साप्ताहिक खाद्य अपशिष्ट (किग्रा)'
        }
      },
      organization: {
        title: {
          'en': 'Organization Food Waste Calculator',
          'hi': 'संगठन खाद्य अपशिष्ट कैलकुलेटर'
        },
        description: {
          'en': 'Understand the environmental impact of your organization\'s food waste',
          'hi': 'अपने संगठन के खाद्य अपशिष्ट के पर्यावरणीय प्रभाव को समझें'
        },
        employeeCount: {
          'en': 'Number of Employees',
          'hi': 'कर्मचारियों की संख्या'
        },
        monthlyWaste: {
          'en': 'Monthly Food Waste (kg)',
          'hi': 'मासिक खाद्य अपशिष्ट (किग्रा)'
        }
      },
      results: {
        title: {
          'en': 'Your Impact Results',
          'hi': 'आपके प्रभाव के परिणाम'
        },
        restaurant: {
          annualWaste: {
            'en': 'Annual Food Waste',
            'hi': 'वार्षिक खाद्य अपशिष्ट'
          },
          annualCost: {
            'en': 'Annual Cost of Waste',
            'hi': 'अपशिष्ट की वार्षिक लागत'
          },
          potentialMeals: {
            'en': 'Potential Meals Provided',
            'hi': 'संभावित भोजन प्रदान किया'
          },
          taxBenefits: {
            'en': 'Potential Tax Benefits',
            'hi': 'संभावित कर लाभ'
          }
        },
        individual: {
          annualWaste: {
            'en': 'Annual Household Waste',
            'hi': 'वार्षिक घरेलू अपशिष्ट'
          },
          co2Impact: {
            'en': 'CO₂ Emissions',
            'hi': 'CO₂ उत्सर्जन'
          },
          waterWasted: {
            'en': 'Water Wasted',
            'hi': 'बर्बाद पानी'
          },
          moneyWasted: {
            'en': 'Estimated Money Wasted',
            'hi': 'अनुमानित बर्बाद पैसा'
          }
        },
        organization: {
          annualWaste: {
            'en': 'Annual Organization Waste',
            'hi': 'वार्षिक संगठन अपशिष्ट'
          },
          co2Impact: {
            'en': 'CO₂ Emissions',
            'hi': 'CO₂ उत्सर्जन'
          },
          landfillSpace: {
            'en': 'Landfill Space Used',
            'hi': 'उपयोग किया गया लैंडफिल स्थान'
          },
          csr: {
            'en': 'CSR Opportunity Value',
            'hi': 'सीएसआर अवसर मूल्य'
          }
        }
      },
      calculate: {
        'en': 'Calculate Impact',
        'hi': 'प्रभाव की गणना करें'
      },
      kg: {
        'en': 'kg',
        'hi': 'किग्रा'
      },
      meals: {
        'en': 'meals',
        'hi': 'भोजन'
      },
      liters: {
        'en': 'liters',
        'hi': 'लीटर'
      },
      cubicMeters: {
        'en': 'cubic meters',
        'hi': 'घन मीटर'
      }
    },
    csr: {
      title: {
        'en': 'Corporate Social Responsibility Benefits',
        'hi': 'कॉर्पोरेट सामाजिक उत्तरदायित्व लाभ'
      },
      subtitle: {
        'en': 'Partner with us to make a meaningful impact',
        'hi': 'सार्थक प्रभाव डालने के लिए हमारे साथ भागीदारी करें'
      },
      benefits: {
        taxBenefits: {
          title: {
            'en': 'Tax Benefits',
            'hi': 'कर लाभ'
          },
          description: {
            'en': 'Companies can avail tax benefits under Section 80G of the Income Tax Act for donations made to our platform.',
            'hi': 'कंपनियां हमारे प्लेटफॉर्म पर किए गए दान के लिए आयकर अधिनियम की धारा 80G के तहत कर लाभ प्राप्त कर सकती हैं।'
          }
        },
        brandImage: {
          title: {
            'en': 'Enhanced Brand Image',
            'hi': 'बेहतर ब्रांड छवि'
          },
          description: {
            'en': 'Improve your company\'s reputation and brand image by associating with a social cause that addresses food waste and hunger.',
            'hi': 'खाद्य अपशिष्ट और भूख को संबोधित करने वाले सामाजिक कारण से जुड़कर अपनी कंपनी की प्रतिष्ठा और ब्रांड छवि में सुधार करें।'
          }
        },
        employeeEngagement: {
          title: {
            'en': 'Employee Engagement',
            'hi': 'कर्मचारी सहभागिता'
          },
          description: {
            'en': 'Boost employee morale and engagement by involving them in meaningful volunteer activities and food donation drives.',
            'hi': 'कर्मचारियों को सार्थक स्वयंसेवक गतिविधियों और खाद्य दान अभियानों में शामिल करके उनके मनोबल और सहभागिता को बढ़ावा दें।'
          }
        },
        sdgAlignment: {
          title: {
            'en': 'SDG Alignment',
            'hi': 'एसडीजी संरेखण'
          },
          description: {
            'en': 'Align your CSR initiatives with UN Sustainable Development Goal 2: Zero Hunger, demonstrating your commitment to global sustainability goals.',
            'hi': 'अपने सीएसआर पहलों को संयुक्त राष्ट्र सतत विकास लक्ष्य 2: शून्य भूख के साथ संरेखित करें, वैश्विक स्थिरता लक्ष्यों के प्रति अपनी प्रतिबद्धता प्रदर्शित करें।'
          }
        }
      },
      contactUs: {
        title: {
          'en': 'Contact Us for CSR Partnerships',
          'hi': 'सीएसआर साझेदारी के लिए हमसे संपर्क करें'
        },
        name: {
          'en': 'Company Name',
          'hi': 'कंपनी का नाम'
        },
        email: {
          'en': 'Email',
          'hi': 'ईमेल'
        },
        phone: {
          'en': 'Phone',
          'hi': 'फोन'
        },
        message: {
          'en': 'Message',
          'hi': 'संदेश'
        },
        submit: {
          'en': 'Submit Inquiry',
          'hi': 'पूछताछ जमा करें'
        }
      }
    },
    volunteer: {
      title: {
        'en': 'Join Our Volunteer Network',
        'hi': 'हमारे स्वयंसेवक नेटवर्क से जुड़ें'
      },
      subtitle: {
        'en': 'Make a difference in your community',
        'hi': 'अपने समुदाय में बदलाव लाएं'
      },
      opportunities: {
        title: {
          'en': 'Volunteer Opportunities',
          'hi': 'स्वयंसेवक के अवसर'
        },
        foodCollection: {
          'en': 'Food Collection & Distribution',
          'hi': 'खाद्य संग्रह और वितरण'
        },
        eventManagement: {
          'en': 'Event Management',
          'hi': 'कार्यक्रम प्रबंधन'
        },
        awarenessPrograms: {
          'en': 'Awareness Programs',
          'hi': 'जागरूकता कार्यक्रम'
        },
        techSupport: {
          'en': 'Technical Support',
          'hi': 'तकनीकी सहायता'
        }
      },
      form: {
        title: {
          'en': 'Register as a Volunteer',
          'hi': 'स्वयंसेवक के रूप में पंजीकरण करें'
        },
        name: {
          'en': 'Full Name',
          'hi': 'पूरा नाम'
        },
        email: {
          'en': 'Email',
          'hi': 'ईमेल'
        },
        phone: {
          'en': 'Phone',
          'hi': 'फोन'
        },
        availability: {
          'en': 'Availability',
          'hi': 'उपलब्धता'
        },
        skills: {
          'en': 'Skills & Interests',
          'hi': 'कौशल और रुचियां'
        },
        submit: {
          'en': 'Register',
          'hi': 'पंजीकरण करें'
        }
      }
    },
    donate: {
      title: {
        'en': 'Raise Donations',
        'hi': 'दान जुटाएं'
      },
      subtitle: {
        'en': 'Support our mission to reduce food waste and hunger',
        'hi': 'खाद्य अपशिष्ट और भूख को कम करने के हमारे मिशन का समर्थन करें'
      },
      impact: {
        title: {
          'en': 'Your Donation Impact',
          'hi': 'आपके दान का प्रभाव'
        },
        meals: {
          'en': '₹500 provides 10 meals to those in need',
          'hi': '₹500 जरूरतमंदों को 10 भोजन प्रदान करता है'
        },
        family: {
          'en': '₹2,000 supports a family for a week',
          'hi': '₹2,000 एक परिवार को एक सप्ताह तक सहायता प्रदान करता है'
        },
        community: {
          'en': '₹10,000 helps establish a community food distribution center',
          'hi': '₹10,000 सामुदायिक खाद्य वितरण केंद्र स्थापित करने में मदद करता है'
        }
      },
      form: {
        title: {
          'en': 'Make a Donation',
          'hi': 'दान करें'
        },
        name: {
          'en': 'Full Name',
          'hi': 'पूरा नाम'
        },
        email: {
          'en': 'Email',
          'hi': 'ईमेल'
        },
        amount: {
          'en': 'Donation Amount (₹)',
          'hi': 'दान राशि (₹)'
        },
        type: {
          'en': 'Donation Type',
          'hi': 'दान प्रकार'
        },
        oneTime: {
          'en': 'One-time',
          'hi': 'एक बार'
        },
        monthly: {
          'en': 'Monthly',
          'hi': 'मासिक'
        },
        submit: {
          'en': 'Donate Now',
          'hi': 'अभी दान करें'
        }
      }
    },
    community: {
      title: {
        'en': 'Community Forum',
        'hi': 'सामुदायिक मंच'
      },
      subtitle: {
        'en': 'Connect, share, and learn with our community',
        'hi': 'हमारे समुदाय के साथ जुड़ें, साझा करें और सीखें'
      },
      categories: {
        success: {
          'en': 'Success Stories',
          'hi': 'सफलता की कहानियां'
        },
        initiatives: {
          'en': 'Initiatives',
          'hi': 'पहल'
        },
        tips: {
          'en': 'Tips & Advice',
          'hi': 'सुझाव और सलाह'
        },
        qa: {
          'en': 'Questions & Answers',
          'hi': 'प्रश्न और उत्तर'
        }
      },
      search: {
        'en': 'Search discussions...',
        'hi': 'चर्चाएं खोजें...'
      },
      newPost: {
        'en': 'New Post',
        'hi': 'नया पोस्ट'
      },
      form: {
        title: {
          'en': 'Create New Post',
          'hi': 'नया पोस्ट बनाएं'
        },
        postTitle: {
          'en': 'Post Title',
          'hi': 'पोस्ट शीर्षक'
        },
        content: {
          'en': 'Content',
          'hi': 'सामग्री'
        },
        category: {
          'en': 'Category',
          'hi': 'श्रेणी'
        },
        submit: {
          'en': 'Submit Post',
          'hi': 'पोस्ट जमा करें'
        },
        cancel: {
          'en': 'Cancel',
          'hi': 'रद्द करें'
        }
      },
      post: {
        by: {
          'en': 'by',
          'hi': 'द्वारा'
        },
        on: {
          'en': 'on',
          'hi': 'पर'
        },
        likes: {
          'en': 'likes',
          'hi': 'पसंद'
        },
        comments: {
          'en': 'comments',
          'hi': 'टिप्पणियां'
        },
        reply: {
          'en': 'Reply',
          'hi': 'जवाब दें'
        },
        like: {
          'en': 'Like',
          'hi': 'पसंद करें'
        },
        showComments: {
          'en': 'Show Comments',
          'hi': 'टिप्पणियां दिखाएं'
        },
        hideComments: {
          'en': 'Hide Comments',
          'hi': 'टिप्पणियां छिपाएं'
        }
      },
      emptyState: {
        'en': 'No posts found. Be the first to start a discussion!',
        'hi': 'कोई पोस्ट नहीं मिला। चर्चा शुरू करने वाले पहले व्यक्ति बनें!'
      }
    },
    success: {
      'en': 'Thank you! Your submission has been received.',
      'hi': 'धन्यवाद! आपका प्रस्तुतीकरण प्राप्त हो गया है।'
    }
  };

  const getMessage = (path) => {
    const langCode = language.split('-')[0];
    if (!path) {
      console.log('Path is undefined in getMessage');
      return '';
    }
    console.log('Path in getMessage:', path);
    return path[langCode] || path['en'] || '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCalculatorChange = (e) => {
    const { name, value } = e.target;
    setCalculatorData(prevData => ({
      ...prevData,
      [name]: parseFloat(value)
    }));
  };

  const handleCalculatorTypeChange = (type) => {
    setCalculatorType(type);
    setCalculationResults(null);
  };

  const calculateImpact = () => {
    let results = {};
    
    switch(calculatorType) {
      case 'restaurant':
        const annualWaste = calculatorData.restaurantFoodWaste * 52; // kg per year
        const annualCost = annualWaste * calculatorData.restaurantFoodCost; // cost per year
        const potentialMeals = Math.round(annualWaste * 2); // Assuming 0.5kg per meal
        const taxBenefits = Math.round(annualCost * 0.3); // Assuming 30% tax benefit
        
        results = {
          annualWaste,
          annualCost,
          potentialMeals,
          taxBenefits
        };
        break;
        
      case 'individual':
        const householdAnnualWaste = calculatorData.weeklyFoodWaste * 52; // kg per year
        const co2Impact = householdAnnualWaste * 2.5; // kg of CO2 (2.5kg CO2 per 1kg food waste)
        const waterWasted = householdAnnualWaste * 1500; // liters (1500L water per 1kg food)
        const moneyWasted = householdAnnualWaste * 100; // ₹100 per kg of food
        
        results = {
          annualWaste: householdAnnualWaste,
          co2Impact,
          waterWasted,
          moneyWasted,
          perPerson: {
            waste: householdAnnualWaste / calculatorData.householdSize,
            co2: co2Impact / calculatorData.householdSize
          }
        };
        break;
        
      case 'organization':
        const orgAnnualWaste = calculatorData.monthlyFoodWaste * 12; // kg per year
        const orgCo2Impact = orgAnnualWaste * 2.5; // kg of CO2
        const landfillSpace = orgAnnualWaste * 0.001; // cubic meters (0.001 m³ per kg)
        const csrValue = orgAnnualWaste * 200; // ₹200 per kg in CSR value
        
        results = {
          annualWaste: orgAnnualWaste,
          co2Impact: orgCo2Impact,
          landfillSpace,
          csrValue,
          perEmployee: {
            waste: orgAnnualWaste / calculatorData.employeeCount,
            co2: orgCo2Impact / calculatorData.employeeCount
          }
        };
        break;
        
      default:
        break;
    }
    
    setCalculationResults(results);
  };

  const handleSubmit = (e, formType) => {
    e.preventDefault();
    
    // Here you would typically send the form data to your backend
    console.log(`${formType} form submitted:`, formData);
    
    // Show success message
    setFormSubmitted(formType);
    
    // Reset form after a delay
    setTimeout(() => {
      setFormSubmitted(null);
      setFormData({
        ...formData,
        message: '',
        availability: '',
        skills: '',
        amount: ''
      });
    }, 3000);
  };

  const renderCalculator = () => {
    switch(calculatorType) {
      case 'restaurant':
        return (
          <div className="calculator-form">
            <h3>{getMessage(messages.calculator.restaurant.title)}</h3>
            <p>{getMessage(messages.calculator.restaurant.description)}</p>
            
            <div className="form-group">
              <label><FaTrash /> {getMessage(messages.calculator.restaurant.foodWaste)}</label>
              <input
                type="number"
                name="restaurantFoodWaste"
                value={calculatorData.restaurantFoodWaste}
                onChange={handleCalculatorChange}
                min="1"
                step="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label><FaMoneyBillWave /> {getMessage(messages.calculator.restaurant.foodCost)}</label>
              <input
                type="number"
                name="restaurantFoodCost"
                value={calculatorData.restaurantFoodCost}
                onChange={handleCalculatorChange}
                min="1"
                step="1"
                required
              />
            </div>
          </div>
        );
        
      case 'individual':
        return (
          <div className="calculator-form">
            <h3>{getMessage(messages.calculator.individual.title)}</h3>
            <p>{getMessage(messages.calculator.individual.description)}</p>
            
            <div className="form-group">
              <label><FaUsers /> {getMessage(messages.calculator.individual.householdSize)}</label>
              <input
                type="number"
                name="householdSize"
                value={calculatorData.householdSize}
                onChange={handleCalculatorChange}
                min="1"
                step="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label><FaTrash /> {getMessage(messages.calculator.individual.weeklyWaste)}</label>
              <input
                type="number"
                name="weeklyFoodWaste"
                value={calculatorData.weeklyFoodWaste}
                onChange={handleCalculatorChange}
                min="0.1"
                step="0.1"
                required
              />
            </div>
          </div>
        );
        
      case 'organization':
        return (
          <div className="calculator-form">
            <h3>{getMessage(messages.calculator.organization.title)}</h3>
            <p>{getMessage(messages.calculator.organization.description)}</p>
            
            <div className="form-group">
              <label><FaUsers /> {getMessage(messages.calculator.organization.employeeCount)}</label>
              <input
                type="number"
                name="employeeCount"
                value={calculatorData.employeeCount}
                onChange={handleCalculatorChange}
                min="1"
                step="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label><FaTrash /> {getMessage(messages.calculator.organization.monthlyWaste)}</label>
              <input
                type="number"
                name="monthlyFoodWaste"
                value={calculatorData.monthlyFoodWaste}
                onChange={handleCalculatorChange}
                min="1"
                step="1"
                required
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderCalculationResults = () => {
    if (!calculationResults) return null;
    
    switch(calculatorType) {
      case 'restaurant':
        return (
          <div className="calculation-results">
            <h3>{getMessage(messages.calculator.results.title)}</h3>
            <div className="results-grid">
              <div className="result-card">
                <div className="result-icon"><FaTrash /></div>
                <div className="result-content">
                  <h4>{getMessage(messages.calculator.results.restaurant.annualWaste)}</h4>
                  <div className="result-value">
                    {calculationResults.annualWaste.toLocaleString()} <span className="result-unit">{getMessage(messages.calculator.kg)}</span>
                  </div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon"><FaMoneyBillWave /></div>
                <div className="result-content">
                  <h4>{getMessage(messages.calculator.results.restaurant.annualCost)}</h4>
                  <div className="result-value">
                    ₹{calculationResults.annualCost.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon"><FaUtensils /></div>
                <div className="result-content">
                  <h4>{getMessage(messages.calculator.results.restaurant.potentialMeals)}</h4>
                  <div className="result-value">
                    {calculationResults.potentialMeals.toLocaleString()} <span className="result-unit">{getMessage(messages.calculator.meals)}</span>
                  </div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon"><FaFileAlt /></div>
                <div className="result-content">
                  <h4>{getMessage(messages.calculator.results.restaurant.taxBenefits)}</h4>
                  <div className="result-value">
                    ₹{calculationResults.taxBenefits.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'individual':
        return (
          <div className="calculation-results">
            <h3>{getMessage(messages.calculator.results.title)}</h3>
            <div className="results-grid">
              <div className="result-card">
                <div className="result-icon"><FaTrash /></div>
                <div className="result-content">
                  <h4>{getMessage(messages.calculator.results.individual.annualWaste)}</h4>
                  <div className="result-value">
                    {calculationResults.annualWaste.toLocaleString()} <span className="result-unit">{getMessage(messages.calculator.kg)}</span>
                  </div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon"><FaLeaf /></div>
                <div className="result-content">
                  <h4>{getMessage(messages.calculator.results.individual.co2Impact)}</h4>
                  <div className="result-value">
                    {calculationResults.co2Impact.toLocaleString()} <span className="result-unit">{getMessage(messages.calculator.kg)}</span>
                  </div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon"><FaHome /></div>
                <div className="result-content">
                  <h4>{getMessage(messages.calculator.results.individual.waterWasted)}</h4>
                  <div className="result-value">
                    {calculationResults.waterWasted.toLocaleString()} <span className="result-unit">{getMessage(messages.calculator.liters)}</span>
                  </div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon"><FaMoneyBillWave /></div>
                <div className="result-content">
                  <h4>{getMessage(messages.calculator.results.individual.moneyWasted)}</h4>
                  <div className="result-value">
                    ₹{calculationResults.moneyWasted.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'organization':
        return (
          <div className="calculation-results">
            <h3>{getMessage(messages.calculator.results.title)}</h3>
            <div className="results-grid">
              <div className="result-card">
                <div className="result-icon"><FaTrash /></div>
                <div className="result-content">
                  <h4>{getMessage(messages.calculator.results.organization.annualWaste)}</h4>
                  <div className="result-value">
                    {calculationResults.annualWaste.toLocaleString()} <span className="result-unit">{getMessage(messages.calculator.kg)}</span>
                  </div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon"><FaLeaf /></div>
                <div className="result-content">
                  <h4>{getMessage(messages.calculator.results.organization.co2Impact)}</h4>
                  <div className="result-value">
                    {calculationResults.co2Impact.toLocaleString()} <span className="result-unit">{getMessage(messages.calculator.kg)}</span>
                  </div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon"><FaIndustry /></div>
                <div className="result-content">
                  <h4>{getMessage(messages.calculator.results.organization.landfillSpace)}</h4>
                  <div className="result-value">
                    {calculationResults.landfillSpace.toLocaleString()} <span className="result-unit">{getMessage(messages.calculator.cubicMeters)}</span>
                  </div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon"><FaHandsHelping /></div>
                <div className="result-content">
                  <h4>{getMessage(messages.calculator.results.organization.csr)}</h4>
                  <div className="result-value">
                    ₹{calculationResults.csrValue.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Render CSR content
  const renderCSRContent = () => {
    // Check if messages.csr exists
    if (!messages || !messages.csr) {
      console.error('messages.csr is undefined');
      return <div>Loading CSR content...</div>;
    }
    
    return (
      <div className="csr-content">
        <h2>{messages.csr.title ? getMessage(messages.csr.title) : 'Corporate Social Responsibility Benefits'}</h2>
        <p className="section-intro">{messages.csr.subtitle ? getMessage(messages.csr.subtitle) : 'Partner with us to make a meaningful impact'}</p>
        
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon"><FaHandsHelping /></div>
            <h3>{messages.csr.benefits && messages.csr.benefits.taxBenefits && messages.csr.benefits.taxBenefits.title ? 
              getMessage(messages.csr.benefits.taxBenefits.title) : 'Tax Benefits'}</h3>
            <p>{messages.csr.benefits && messages.csr.benefits.taxBenefits && messages.csr.benefits.taxBenefits.description ? 
              getMessage(messages.csr.benefits.taxBenefits.description) : 'Companies can avail tax benefits for donations made to our platform.'}</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon"><FaLeaf /></div>
            <h3>{messages.csr.benefits && messages.csr.benefits.brandImage && messages.csr.benefits.brandImage.title ? 
              getMessage(messages.csr.benefits.brandImage.title) : 'Enhanced Brand Image'}</h3>
            <p>{messages.csr.benefits && messages.csr.benefits.brandImage && messages.csr.benefits.brandImage.description ? 
              getMessage(messages.csr.benefits.brandImage.description) : 'Improve your company\'s reputation by associating with a social cause.'}</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon"><FaMoneyBillWave /></div>
            <h3>{messages.csr.benefits && messages.csr.benefits.employeeEngagement && messages.csr.benefits.employeeEngagement.title ? 
              getMessage(messages.csr.benefits.employeeEngagement.title) : 'Employee Engagement'}</h3>
            <p>{messages.csr.benefits && messages.csr.benefits.employeeEngagement && messages.csr.benefits.employeeEngagement.description ? 
              getMessage(messages.csr.benefits.employeeEngagement.description) : 'Boost employee morale by involving them in meaningful volunteer activities.'}</p>
        </div>
          
          <div className="benefit-card">
            <div className="benefit-icon"><FaBuilding /></div>
            <h3>{messages.csr.benefits && messages.csr.benefits.sdgAlignment && messages.csr.benefits.sdgAlignment.title ? 
              getMessage(messages.csr.benefits.sdgAlignment.title) : 'SDG Alignment'}</h3>
            <p>{messages.csr.benefits && messages.csr.benefits.sdgAlignment && messages.csr.benefits.sdgAlignment.description ? 
              getMessage(messages.csr.benefits.sdgAlignment.description) : 'Align your CSR initiatives with UN Sustainable Development Goals.'}</p>
        </div>
        </div>
        
        <div className="csr-contact">
          <h3>{messages.csr.contactUs && messages.csr.contactUs.title ? 
            getMessage(messages.csr.contactUs.title) : 'Contact Us for CSR Partnerships'}</h3>
          <p>{messages.csr.subtitle ? getMessage(messages.csr.subtitle) : 'Partner with us to make a meaningful impact'}</p>
          <a href="mailto:csr@deepblue.org" className="contact-button">
            <FaEnvelope /> Contact Us
          </a>
                </div>
                </div>
    );
  };
  
  // Render Volunteer content
  const renderVolunteerContent = () => {
    // Check if messages.volunteer exists
    if (!messages || !messages.volunteer) {
      console.error('messages.volunteer is undefined');
      return <div>Loading Volunteer content...</div>;
    }

  return (
      <div className="volunteer-content">
        <h2>{messages.volunteer.title ? getMessage(messages.volunteer.title) : 'Volunteer Opportunities'}</h2>
        <p className="section-intro">{messages.volunteer.subtitle ? getMessage(messages.volunteer.subtitle) : 'Join our mission to reduce food waste and hunger'}</p>
        
        <div className="opportunities-list">
          <div className="opportunity-card">
            <div className="opportunity-icon"><FaHandsHelping /></div>
            <h3>{messages.volunteer.opportunities && messages.volunteer.opportunities.foodCollection && messages.volunteer.opportunities.foodCollection.title ? 
              getMessage(messages.volunteer.opportunities.foodCollection.title) : 'Food Collection'}</h3>
            <p>{messages.volunteer.opportunities && messages.volunteer.opportunities.foodCollection && messages.volunteer.opportunities.foodCollection.description ? 
              getMessage(messages.volunteer.opportunities.foodCollection.description) : 'Help collect excess food from restaurants, events, and grocery stores.'}</p>
      </div>

          <div className="opportunity-card">
            <div className="opportunity-icon"><FaUsers /></div>
            <h3>{messages.volunteer.opportunities && messages.volunteer.opportunities.eventManagement && messages.volunteer.opportunities.eventManagement.title ? 
              getMessage(messages.volunteer.opportunities.eventManagement.title) : 'Event Management'}</h3>
            <p>{messages.volunteer.opportunities && messages.volunteer.opportunities.eventManagement && messages.volunteer.opportunities.eventManagement.description ? 
              getMessage(messages.volunteer.opportunities.eventManagement.description) : 'Organize and manage food donation drives and awareness events.'}</p>
        </div>
          
          <div className="opportunity-card">
            <div className="opportunity-icon"><FaLightbulb /></div>
            <h3>{messages.volunteer.opportunities && messages.volunteer.opportunities.awarenessPrograms && messages.volunteer.opportunities.awarenessPrograms.title ? 
              getMessage(messages.volunteer.opportunities.awarenessPrograms.title) : 'Awareness Programs'}</h3>
            <p>{messages.volunteer.opportunities && messages.volunteer.opportunities.awarenessPrograms && messages.volunteer.opportunities.awarenessPrograms.description ? 
              getMessage(messages.volunteer.opportunities.awarenessPrograms.description) : 'Conduct workshops and sessions on food waste reduction and management.'}</p>
          </div>
          
          <div className="opportunity-card">
            <div className="opportunity-icon"><FaCalculator /></div>
            <h3>{messages.volunteer.opportunities && messages.volunteer.opportunities.techSupport && messages.volunteer.opportunities.techSupport.title ? 
              getMessage(messages.volunteer.opportunities.techSupport.title) : 'Technical Support'}</h3>
            <p>{messages.volunteer.opportunities && messages.volunteer.opportunities.techSupport && messages.volunteer.opportunities.techSupport.description ? 
              getMessage(messages.volunteer.opportunities.techSupport.description) : 'Help with website maintenance, app development, and technical troubleshooting.'}</p>
              </div>
          </div>
          
          <div className="volunteer-form">
          <h3>{messages.volunteer.form && messages.volunteer.form.title ? 
            getMessage(messages.volunteer.form.title) : 'Register as a Volunteer'}</h3>
          
            <form onSubmit={(e) => handleSubmit(e, 'volunteer')}>
              <div className="form-group">
              <label htmlFor="name">{messages.volunteer.form && messages.volunteer.form.name ? 
                getMessage(messages.volunteer.form.name) : 'Full Name'}</label>
                <input
                  type="text"
                id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div className="form-group">
              <label htmlFor="email">{messages.volunteer.form && messages.volunteer.form.email ? 
                getMessage(messages.volunteer.form.email) : 'Email'}</label>
                <input
                  type="email"
                id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div className="form-group">
              <label htmlFor="phone">{messages.volunteer.form && messages.volunteer.form.phone ? 
                getMessage(messages.volunteer.form.phone) : 'Phone'}</label>
                <input
                  type="tel"
                id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div className="form-group">
              <label htmlFor="availability">{messages.volunteer.form && messages.volunteer.form.availability ? 
                getMessage(messages.volunteer.form.availability) : 'Availability'}</label>
              <select 
                id="availability" 
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
              >
                <option value="">{messages.volunteer.form && messages.volunteer.form.selectAvailability ? 
                  getMessage(messages.volunteer.form.selectAvailability) : 'Select your availability'}</option>
                <option value="weekdays">{messages.volunteer.form && messages.volunteer.form.weekdays ? 
                  getMessage(messages.volunteer.form.weekdays) : 'Weekdays'}</option>
                <option value="weekends">{messages.volunteer.form && messages.volunteer.form.weekends ? 
                  getMessage(messages.volunteer.form.weekends) : 'Weekends'}</option>
                <option value="both">{messages.volunteer.form && messages.volunteer.form.both ? 
                  getMessage(messages.volunteer.form.both) : 'Both'}</option>
              </select>
              </div>
            
              <div className="form-group">
              <label htmlFor="skills">{messages.volunteer.form && messages.volunteer.form.skills ? 
                getMessage(messages.volunteer.form.skills) : 'Skills'}</label>
                <textarea
                id="skills" 
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                placeholder={messages.volunteer.form && messages.volunteer.form.skillsPlaceholder ? 
                  getMessage(messages.volunteer.form.skillsPlaceholder) : 'Tell us about your skills and how you can contribute'}
                ></textarea>
              </div>
            
              <button type="submit" className="submit-button">
              {messages.volunteer.form && messages.volunteer.form.submit ? 
                getMessage(messages.volunteer.form.submit) : 'Submit Application'}
              </button>
            </form>
          
          {formSubmitted === 'volunteer' && (
            <div className="success-message">
              {messages.volunteer.form && messages.volunteer.form.success ? 
                getMessage(messages.volunteer.form.success) : 'Thank you for your interest in volunteering! We will contact you soon.'}
        </div>
      )}
        </div>
      </div>
    );
  };
  
  // Render Donate content
  const renderDonateContent = () => {
    // Check if messages.donate exists
    if (!messages || !messages.donate) {
      console.error('messages.donate is undefined');
      return <div>Loading Donate content...</div>;
    }
    
    return (
      <div className="donate-content">
        <h2>{messages.donate.title ? getMessage(messages.donate.title) : 'Support Our Mission'}</h2>
        <p className="section-intro">{messages.donate.subtitle ? getMessage(messages.donate.subtitle) : 'Your contribution helps us reduce food waste and hunger'}</p>
        
        <div className="donation-options">
          <div className="donation-option">
            <div className="option-icon"><FaDonate /></div>
            <h3>{messages.donate.options && messages.donate.options.oneTime && messages.donate.options.oneTime.title ? 
              getMessage(messages.donate.options.oneTime.title) : 'One-time Donation'}</h3>
            <p>{messages.donate.options && messages.donate.options.oneTime && messages.donate.options.oneTime.description ? 
              getMessage(messages.donate.options.oneTime.description) : 'Make a one-time donation to support our food rescue operations.'}</p>
              </div>
          
          <div className="donation-option">
            <div className="option-icon"><FaHandsHelping /></div>
            <h3>{messages.donate.options && messages.donate.options.monthly && messages.donate.options.monthly.title ? 
              getMessage(messages.donate.options.monthly.title) : 'Monthly Support'}</h3>
            <p>{messages.donate.options && messages.donate.options.monthly && messages.donate.options.monthly.description ? 
              getMessage(messages.donate.options.monthly.description) : 'Become a monthly donor to provide sustained support for our mission.'}</p>
              </div>
          
          <div className="donation-option">
            <div className="option-icon"><FaBuilding /></div>
            <h3>{messages.donate.options && messages.donate.options.corporate && messages.donate.options.corporate.title ? 
              getMessage(messages.donate.options.corporate.title) : 'Corporate Sponsorship'}</h3>
            <p>{messages.donate.options && messages.donate.options.corporate && messages.donate.options.corporate.description ? 
              getMessage(messages.donate.options.corporate.description) : 'Partner with us as a corporate sponsor to make a bigger impact.'}</p>
          </div>
        </div>
        
        <div className="donation-impact">
          <h3>{messages.donate.impact && messages.donate.impact.title ? 
            getMessage(messages.donate.impact.title) : 'Your Donation Impact'}</h3>
          
          <div className="impact-items">
            <div className="impact-item">
              <div className="impact-amount">₹500</div>
              <div className="impact-description">{messages.donate.impact && messages.donate.impact.amount500 ? 
                getMessage(messages.donate.impact.amount500) : 'Provides 10 meals to those in need'}</div>
            </div>
            
            <div className="impact-item">
              <div className="impact-amount">₹2,000</div>
              <div className="impact-description">{messages.donate.impact && messages.donate.impact.amount2000 ? 
                getMessage(messages.donate.impact.amount2000) : 'Supports a family for a week'}</div>
            </div>
            
            <div className="impact-item">
              <div className="impact-amount">₹5,000</div>
              <div className="impact-description">{messages.donate.impact && messages.donate.impact.amount5000 ? 
                getMessage(messages.donate.impact.amount5000) : 'Funds a food collection drive'}</div>
            </div>
            
            <div className="impact-item">
              <div className="impact-amount">₹10,000</div>
              <div className="impact-description">{messages.donate.impact && messages.donate.impact.amount10000 ? 
                getMessage(messages.donate.impact.amount10000) : 'Helps establish a community food distribution center'}</div>
              </div>
            </div>
          </div>
          
          <div className="donation-form">
          <h3>{messages.donate.form && messages.donate.form.title ? 
            getMessage(messages.donate.form.title) : 'Make a Donation'}</h3>
          
            <form onSubmit={(e) => handleSubmit(e, 'donate')}>
              <div className="form-group">
              <label htmlFor="name">{messages.donate.form && messages.donate.form.name ? 
                getMessage(messages.donate.form.name) : 'Full Name'}</label>
                <input
                  type="text"
                id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div className="form-group">
              <label htmlFor="email">{messages.donate.form && messages.donate.form.email ? 
                getMessage(messages.donate.form.email) : 'Email'}</label>
                <input
                  type="email"
                id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div className="form-group">
              <label htmlFor="organization">{messages.donate.form && messages.donate.form.organization ? 
                getMessage(messages.donate.form.organization) : 'Organization (Optional)'}</label>
              <input 
                type="text" 
                id="organization" 
                name="organization" 
                value={formData.organization}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="amount">{messages.donate.form && messages.donate.form.amount ? 
                getMessage(messages.donate.form.amount) : 'Donation Amount (₹)'}</label>
                <input
                  type="number"
                id="amount" 
                name="amount" 
                value={formData.amount}
                  onChange={handleChange}
                  min="100"
                  required
                />
              </div>
            
              <div className="form-group">
              <label>{messages.donate.form && messages.donate.form.donationType ? 
                getMessage(messages.donate.form.donationType) : 'Donation Type'}</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="donationType"
                    value="oneTime" 
                    checked={formData.donationType === 'oneTime'} 
                      onChange={handleChange}
                    />
                  {messages.donate.form && messages.donate.form.oneTime ? 
                    getMessage(messages.donate.form.oneTime) : 'One-time'}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="donationType"
                      value="monthly"
                      checked={formData.donationType === 'monthly'}
                      onChange={handleChange}
                    />
                  {messages.donate.form && messages.donate.form.monthly ? 
                    getMessage(messages.donate.form.monthly) : 'Monthly'}
                  </label>
                </div>
              </div>
            
            <button type="submit" className="submit-button">
              {messages.donate.form && messages.donate.form.submit ? 
                getMessage(messages.donate.form.submit) : 'Donate Now'}
              </button>
            </form>
          
          {formSubmitted === 'donate' && (
            <div className="success-message">
              {messages.donate.form && messages.donate.form.success ? 
                getMessage(messages.donate.form.success) : 'Thank you for your generous donation! Your contribution will help us make a difference.'}
        </div>
      )}
        </div>
      </div>
    );
  };
  
  // Render Calculator content
  const renderCalculatorContent = () => {
    // Check if messages.calculator exists
    if (!messages || !messages.calculator) {
      console.error('messages.calculator is undefined');
      return <div>Loading Calculator content...</div>;
    }
    
    return (
      <div className="calculator-content">
        <h2>{messages.calculator.title ? getMessage(messages.calculator.title) : 'Food Waste Impact Calculator'}</h2>
        <p className="section-intro">{messages.calculator.subtitle ? getMessage(messages.calculator.subtitle) : 'Calculate the impact of food waste and the benefits of donation'}</p>
          
          <div className="calculator-tabs">
            <button 
            className={calculatorType === 'restaurant' ? 'active' : ''} 
              onClick={() => handleCalculatorTypeChange('restaurant')}
            >
            {messages.calculator.types && messages.calculator.types.restaurant ? 
              getMessage(messages.calculator.types.restaurant) : 'Restaurant'}
            </button>
            <button 
            className={calculatorType === 'individual' ? 'active' : ''} 
              onClick={() => handleCalculatorTypeChange('individual')}
            >
            {messages.calculator.types && messages.calculator.types.individual ? 
              getMessage(messages.calculator.types.individual) : 'Individual'}
            </button>
            <button 
            className={calculatorType === 'organization' ? 'active' : ''} 
              onClick={() => handleCalculatorTypeChange('organization')}
            >
            {messages.calculator.types && messages.calculator.types.organization ? 
              getMessage(messages.calculator.types.organization) : 'Organization'}
            </button>
          </div>
          
            {renderCalculator()}
            
        {calculationResults && renderCalculationResults()}
          </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'csr':
        return renderCSRContent();
      
      case 'volunteer':
        return renderVolunteerContent();
      
      case 'donate':
        return renderDonateContent();
      
      case 'calculator':
        return renderCalculatorContent();
      
      case 'community':
        return <CommunityForum />;
      
      default:
        return null;
    }
  };

  useEffect(() => {
    // Function to handle scrolling to the section based on the hash
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove the '#' from the hash
      if (hash) {
        setActiveTab(hash);
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Call the function on component mount to handle initial load
    handleHashChange();

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="more-page-container">
      <h1 className="more-page-title">{getMessage(messages.title)}</h1>
      
      <div className="tabs">
            <button 
          className={`tab-button ${activeTab === 'csr' ? 'active' : ''}`}
          onClick={() => setActiveTab('csr')}
            >
          <FaBuilding /> {getMessage(messages.tabs.csr)}
            </button>
            <button 
          className={`tab-button ${activeTab === 'volunteer' ? 'active' : ''}`}
          onClick={() => setActiveTab('volunteer')}
            >
          <FaUsers /> {getMessage(messages.tabs.volunteer)}
            </button>
            <button 
          className={`tab-button ${activeTab === 'donate' ? 'active' : ''}`}
          onClick={() => setActiveTab('donate')}
            >
          <FaDonate /> {getMessage(messages.tabs.donate)}
            </button>
            <button 
          className={`tab-button ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
            >
          <FaCalculator /> {getMessage(messages.tabs.calculator)}
            </button>
            <button 
          className={`tab-button ${activeTab === 'community' ? 'active' : ''}`}
          onClick={() => setActiveTab('community')}
            >
          <FaComments /> {getMessage(messages.tabs.community)}
            </button>
          </div>
          
      {successMessage && (
        <div className="success-message">
          {successMessage}
            </div>
          )}
          
      {renderTabContent()}
    </div>
  );
};

export default MorePage; 