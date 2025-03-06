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
    donationAmount: '',
    donationType: 'one-time'
  });
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
  
  // Community Forum states
  const [forumCategory, setForumCategory] = useState('success');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'success'
  });
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock forum data
  const mockForumData = {
    success: [
      {
        id: 1,
        title: 'Reduced food waste by 50% in our restaurant',
        author: 'Raj Sharma',
        date: '2023-10-15',
        content: 'We implemented a new inventory management system and started donating excess food through DeepBlue. This has helped us reduce our food waste by 50% in just three months!',
        likes: 24,
        comments: [
          {
            author: 'Priya Patel',
            content: 'That\'s amazing! What inventory system are you using?',
            date: '2023-10-16'
          },
          {
            author: 'Amit Kumar',
            content: 'Congratulations! We\'re trying to achieve similar results.',
            date: '2023-10-17'
          }
        ]
      },
      {
        id: 2,
        title: 'Our school reduced lunch waste by 40%',
        author: 'Meera Desai',
        date: '2023-09-28',
        content: 'By implementing portion control and a food sharing table, our school has managed to reduce lunch waste by 40%. Students can now place unopened items on the sharing table for others to take.',
        likes: 18,
        comments: [
          {
            author: 'Sanjay Gupta',
            content: 'This is a great initiative! How did you get the students on board?',
            date: '2023-09-29'
          }
        ]
      }
    ],
    initiatives: [
      {
        id: 3,
        title: 'Food Waste Reduction Challenge',
        author: 'Green Earth NGO',
        date: '2023-10-10',
        content: 'We\'re launching a 30-day food waste reduction challenge for restaurants and hotels in Mumbai. Participants will track their waste and implement reduction strategies. The establishment with the highest percentage reduction will win a sustainability award and media coverage.',
        likes: 32,
        comments: [
          {
            author: 'Hotel Sunshine',
            content: 'We\'d love to participate! How can we register?',
            date: '2023-10-11'
          }
        ]
      },
      {
        id: 4,
        title: 'Community Composting Project',
        author: 'Urban Farmers Collective',
        date: '2023-09-20',
        content: 'We\'ve started a community composting project in Pune where residents can drop off food scraps at designated collection points. The compost is then used in community gardens. We\'ve diverted over 500kg of food waste from landfills in just one month!',
        likes: 27,
        comments: []
      }
    ],
    tips: [
      {
        id: 5,
        title: 'Meal planning to reduce household waste',
        author: 'Nutritionist Neha',
        date: '2023-10-05',
        content: 'Plan your meals for the week before shopping. Make a detailed shopping list and stick to it. Store fruits and vegetables properly to extend their life. Use leftovers creatively in new dishes. These simple steps can reduce your household food waste by up to 25%.',
        likes: 45,
        comments: [
          {
            author: 'Homemaker Sunita',
            content: 'I\'ve been meal planning for a month now and our food waste has gone down dramatically!',
            date: '2023-10-06'
          },
          {
            author: 'Bachelor Rohit',
            content: 'Any tips specifically for single-person households?',
            date: '2023-10-07'
          }
        ]
      },
      {
        id: 6,
        title: 'Best practices for restaurant inventory management',
        author: 'Chef Vikram',
        date: '2023-09-15',
        content: 'Implement a first-in, first-out (FIFO) system for your inventory. Use digital tools to track stock levels and expiration dates. Train staff on proper storage techniques. Repurpose ingredients creatively across your menu. Review ordering patterns regularly to avoid overstocking.',
        likes: 38,
        comments: []
      }
    ],
    qa: [
      {
        id: 7,
        title: 'What types of food can be safely donated?',
        author: 'Curious Donor',
        date: '2023-10-12',
        content: 'I\'m interested in donating food but I\'m not sure what types of food are safe to donate. Can someone provide guidelines?',
        likes: 15,
        comments: [
          {
            author: 'Food Safety Expert',
            content: 'Non-perishable items like canned goods, dry pasta, and rice are always safe to donate. Fresh produce, dairy, and prepared meals can also be donated if they\'ve been properly stored and are within their use-by dates. Avoid items that show signs of spoilage or damage.',
            date: '2023-10-13'
          }
        ]
      },
      {
        id: 8,
        title: 'Legal protections for food donors',
        author: 'Restaurant Owner',
        date: '2023-09-25',
        content: 'Are there any legal protections for businesses that donate food? I\'m concerned about liability if someone gets sick.',
        likes: 22,
        comments: [
          {
            author: 'Legal Advisor',
            content: 'In India, the Food Safety and Standards Act provides protection to donors who donate food in good faith. As long as the food meets safety standards at the time of donation, donors are generally protected from liability.',
            date: '2023-09-26'
          }
        ]
      }
    ]
  };

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
    return path[langCode] || path['en'];
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
    // Here you would typically send the data to your backend
    console.log(`${formType} form submitted:`, formData);
    
    // Show success message
    setSuccessMessage(getMessage(messages.success));
    
    // Reset form after submission
    setTimeout(() => {
      setSuccessMessage('');
      setFormData({
        ...formData,
        message: '',
        availability: '',
        skills: '',
        donationAmount: ''
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

  const handleForumCategoryChange = (category) => {
    setForumCategory(category);
  };

  const handleNewPostChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNewPostSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('New forum post submitted:', newPost);
    
    // Show success message
    setSuccessMessage(getMessage(messages.success));
    
    // Reset form and hide it
    setTimeout(() => {
      setSuccessMessage('');
      setNewPost({
        title: '',
        content: '',
        category: forumCategory
      });
      setShowNewPostForm(false);
    }, 3000);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getFilteredPosts = () => {
    const posts = mockForumData[forumCategory] || [];
    
    if (!searchQuery) return posts;
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderForumPosts = () => {
    const filteredPosts = getFilteredPosts();
    
    if (filteredPosts.length === 0) {
      return (
        <div className="empty-state">
          <p>{getMessage(messages.community.emptyState)}</p>
        </div>
      );
    }
    
    return filteredPosts.map(post => (
      <div className="forum-post" key={post.id}>
        <h3 className="post-title">{post.title}</h3>
        <div className="post-meta">
          <span className="post-author">
            {getMessage(messages.community.post.by)} {post.author}
          </span>
          <span className="post-date">
            {getMessage(messages.community.post.on)} {post.date}
          </span>
        </div>
        <div className="post-content">
          <p>{post.content}</p>
        </div>
        <div className="post-actions">
          <button className="post-action-button">
            <FaThumbsUp /> {getMessage(messages.community.post.like)} ({post.likes})
          </button>
          <button className="post-action-button">
            <FaReply /> {getMessage(messages.community.post.reply)}
          </button>
          {post.comments.length > 0 && (
            <button className="post-action-button">
              <FaComments /> 
              {getMessage(messages.community.post.showComments)} ({post.comments.length})
            </button>
          )}
        </div>
        
        {post.comments.length > 0 && (
          <div className="post-comments">
            {post.comments.map((comment, index) => (
              <div className="comment" key={index}>
                <div className="comment-meta">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-date">{comment.date}</span>
                </div>
                <div className="comment-content">
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
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
      
      {activeTab === 'csr' && (
        <div className="tab-content csr-content">
          <h2>{getMessage(messages.csr.title)}</h2>
          <p className="subtitle">{getMessage(messages.csr.subtitle)}</p>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3><FaFileAlt /> {getMessage(messages.csr.benefits.taxBenefits.title)}</h3>
              <p>{getMessage(messages.csr.benefits.taxBenefits.description)}</p>
            </div>
            <div className="benefit-card">
              <h3><FaBuilding /> {getMessage(messages.csr.benefits.brandImage.title)}</h3>
              <p>{getMessage(messages.csr.benefits.brandImage.description)}</p>
            </div>
            <div className="benefit-card">
              <h3><FaUsers /> {getMessage(messages.csr.benefits.employeeEngagement.title)}</h3>
              <p>{getMessage(messages.csr.benefits.employeeEngagement.description)}</p>
            </div>
            <div className="benefit-card">
              <h3><FaHandsHelping /> {getMessage(messages.csr.benefits.sdgAlignment.title)}</h3>
              <p>{getMessage(messages.csr.benefits.sdgAlignment.description)}</p>
            </div>
          </div>
          
          <div className="contact-form">
            <h3>{getMessage(messages.csr.contactUs.title)}</h3>
            <form onSubmit={(e) => handleSubmit(e, 'csr')}>
              <div className="form-group">
                <label><FaBuilding /> {getMessage(messages.csr.contactUs.name)}</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label><FaEnvelope /> {getMessage(messages.csr.contactUs.email)}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label><FaPhone /> {getMessage(messages.csr.contactUs.phone)}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>{getMessage(messages.csr.contactUs.message)}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-button">
                {getMessage(messages.csr.contactUs.submit)}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {activeTab === 'volunteer' && (
        <div className="tab-content volunteer-content">
          <h2>{getMessage(messages.volunteer.title)}</h2>
          <p className="subtitle">{getMessage(messages.volunteer.subtitle)}</p>
          
          <div className="volunteer-opportunities">
            <h3>{getMessage(messages.volunteer.opportunities.title)}</h3>
            <ul className="opportunities-list">
              <li><FaHandsHelping /> {getMessage(messages.volunteer.opportunities.foodCollection)}</li>
              <li><FaUsers /> {getMessage(messages.volunteer.opportunities.eventManagement)}</li>
              <li><FaBuilding /> {getMessage(messages.volunteer.opportunities.awarenessPrograms)}</li>
              <li><FaFileAlt /> {getMessage(messages.volunteer.opportunities.techSupport)}</li>
            </ul>
          </div>
          
          <div className="volunteer-form">
            <h3>{getMessage(messages.volunteer.form.title)}</h3>
            <form onSubmit={(e) => handleSubmit(e, 'volunteer')}>
              <div className="form-group">
                <label><FaUser /> {getMessage(messages.volunteer.form.name)}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label><FaEnvelope /> {getMessage(messages.volunteer.form.email)}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label><FaPhone /> {getMessage(messages.volunteer.form.phone)}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>{getMessage(messages.volunteer.form.availability)}</label>
                <textarea
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  rows="2"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>{getMessage(messages.volunteer.form.skills)}</label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  rows="3"
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-button">
                {getMessage(messages.volunteer.form.submit)}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {activeTab === 'donate' && (
        <div className="tab-content donate-content">
          <h2>{getMessage(messages.donate.title)}</h2>
          <p className="subtitle">{getMessage(messages.donate.subtitle)}</p>
          
          <div className="impact-section">
            <h3>{getMessage(messages.donate.impact.title)}</h3>
            <div className="impact-cards">
              <div className="impact-card">
                <FaDonate className="impact-icon" />
                <p>{getMessage(messages.donate.impact.meals)}</p>
              </div>
              <div className="impact-card">
                <FaDonate className="impact-icon" />
                <p>{getMessage(messages.donate.impact.family)}</p>
              </div>
              <div className="impact-card">
                <FaDonate className="impact-icon" />
                <p>{getMessage(messages.donate.impact.community)}</p>
              </div>
            </div>
          </div>
          
          <div className="donation-form">
            <h3>{getMessage(messages.donate.form.title)}</h3>
            <form onSubmit={(e) => handleSubmit(e, 'donate')}>
              <div className="form-group">
                <label><FaUser /> {getMessage(messages.donate.form.name)}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label><FaEnvelope /> {getMessage(messages.donate.form.email)}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label><FaDonate /> {getMessage(messages.donate.form.amount)}</label>
                <input
                  type="number"
                  name="donationAmount"
                  value={formData.donationAmount}
                  onChange={handleChange}
                  min="100"
                  required
                />
              </div>
              <div className="form-group">
                <label>{getMessage(messages.donate.form.type)}</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="donationType"
                      value="one-time"
                      checked={formData.donationType === 'one-time'}
                      onChange={handleChange}
                    />
                    {getMessage(messages.donate.form.oneTime)}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="donationType"
                      value="monthly"
                      checked={formData.donationType === 'monthly'}
                      onChange={handleChange}
                    />
                    {getMessage(messages.donate.form.monthly)}
                  </label>
                </div>
              </div>
              <button type="submit" className="submit-button donate-button">
                {getMessage(messages.donate.form.submit)}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {activeTab === 'calculator' && (
        <div className="tab-content calculator-content">
          <h2>{getMessage(messages.calculator.title)}</h2>
          <p className="subtitle">{getMessage(messages.calculator.subtitle)}</p>
          
          <div className="calculator-tabs">
            <button 
              className={`calculator-tab ${calculatorType === 'restaurant' ? 'active' : ''}`}
              onClick={() => handleCalculatorTypeChange('restaurant')}
            >
              <FaUtensils /> {getMessage(messages.calculator.types.restaurant)}
            </button>
            <button 
              className={`calculator-tab ${calculatorType === 'individual' ? 'active' : ''}`}
              onClick={() => handleCalculatorTypeChange('individual')}
            >
              <FaHome /> {getMessage(messages.calculator.types.individual)}
            </button>
            <button 
              className={`calculator-tab ${calculatorType === 'organization' ? 'active' : ''}`}
              onClick={() => handleCalculatorTypeChange('organization')}
            >
              <FaIndustry /> {getMessage(messages.calculator.types.organization)}
            </button>
          </div>
          
          <div className="calculator-container">
            {renderCalculator()}
            
            <button 
              className="calculate-button" 
              onClick={calculateImpact}
            >
              <FaCalculator /> {getMessage(messages.calculator.calculate)}
            </button>
            
            {renderCalculationResults()}
          </div>
        </div>
      )}
      
      {activeTab === 'community' && (
        <div className="tab-content community-content">
          <h2>{getMessage(messages.community.title)}</h2>
          <p className="subtitle">{getMessage(messages.community.subtitle)}</p>
          
          <div className="forum-controls">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder={getMessage(messages.community.search)}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <FaSearch className="search-icon" />
            </div>
            
            <button 
              className="new-post-button"
              onClick={() => setShowNewPostForm(true)}
            >
              <FaPlus /> {getMessage(messages.community.newPost)}
            </button>
          </div>
          
          <div className="forum-categories">
            <button 
              className={`category-button ${forumCategory === 'success' ? 'active' : ''}`}
              onClick={() => handleForumCategoryChange('success')}
            >
              <FaStar /> {getMessage(messages.community.categories.success)}
            </button>
            <button 
              className={`category-button ${forumCategory === 'initiatives' ? 'active' : ''}`}
              onClick={() => handleForumCategoryChange('initiatives')}
            >
              <FaHandsHelping /> {getMessage(messages.community.categories.initiatives)}
            </button>
            <button 
              className={`category-button ${forumCategory === 'tips' ? 'active' : ''}`}
              onClick={() => handleForumCategoryChange('tips')}
            >
              <FaLightbulb /> {getMessage(messages.community.categories.tips)}
            </button>
            <button 
              className={`category-button ${forumCategory === 'qa' ? 'active' : ''}`}
              onClick={() => handleForumCategoryChange('qa')}
            >
              <FaQuestion /> {getMessage(messages.community.categories.qa)}
            </button>
          </div>
          
          {showNewPostForm && (
            <div className="new-post-form-container">
              <h3>{getMessage(messages.community.form.title)}</h3>
              <form onSubmit={handleNewPostSubmit} className="new-post-form">
                <div className="form-group">
                  <label>{getMessage(messages.community.form.postTitle)}</label>
                  <input
                    type="text"
                    name="title"
                    value={newPost.title}
                    onChange={handleNewPostChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>{getMessage(messages.community.form.content)}</label>
                  <textarea
                    name="content"
                    value={newPost.content}
                    onChange={handleNewPostChange}
                    rows="5"
                    required
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>{getMessage(messages.community.form.category)}</label>
                  <select
                    name="category"
                    value={newPost.category}
                    onChange={handleNewPostChange}
                    required
                  >
                    <option value="success">{getMessage(messages.community.categories.success)}</option>
                    <option value="initiatives">{getMessage(messages.community.categories.initiatives)}</option>
                    <option value="tips">{getMessage(messages.community.categories.tips)}</option>
                    <option value="qa">{getMessage(messages.community.categories.qa)}</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowNewPostForm(false)}>
                    {getMessage(messages.community.form.cancel)}
                  </button>
                  <button type="submit" className="submit-button">
                    {getMessage(messages.community.form.submit)}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="forum-posts-container">
            {renderForumPosts()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MorePage; 