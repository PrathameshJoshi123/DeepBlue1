import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/Signup.css";
import { useLanguage } from '../context/LanguageContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "donor",
    phone: "",
    address: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { language } = useLanguage();

  const messages = {
    title: {
      'en': 'Create an Account',
      'hi': 'खाता बनाएं'
    },
    fields: {
      name: {
        label: {
          'en': 'Full Name',
          'hi': 'पूरा नाम'
        },
        placeholder: {
          'en': 'Enter your full name',
          'hi': 'अपना पूरा नाम दर्ज करें'
        }
      },
      email: {
        label: {
          'en': 'Email Address',
          'hi': 'ईमेल पता'
        },
        placeholder: {
          'en': 'Enter your email',
          'hi': 'अपना ईमेल दर्ज करें'
        }
      },
      password: {
        label: {
          'en': 'Password',
          'hi': 'पासवर्ड'
        },
        placeholder: {
          'en': 'Enter your password',
          'hi': 'अपना पासवर्ड दर्ज करें'
        }
      },
      confirmPassword: {
        label: {
          'en': 'Confirm Password',
          'hi': 'पासवर्ड की पुष्टि करें'
        },
        placeholder: {
          'en': 'Confirm your password',
          'hi': 'अपने पासवर्ड की पुष्टि करें'
        }
      },
      phone: {
        label: {
          'en': 'Phone Number',
          'hi': 'फ़ोन नंबर'
        },
        placeholder: {
          'en': 'Enter your phone number',
          'hi': 'अपना फ़ोन नंबर दर्ज करें'
        }
      },
      address: {
        label: {
          'en': 'Address',
          'hi': 'पता'
        },
        placeholder: {
          'en': 'Enter your address',
          'hi': 'अपना पता दर्ज करें'
        }
      },
      role: {
        label: {
          'en': 'Select Role',
          'hi': 'भूमिका चुनें'
        },
        options: {
          donor: {
            'en': 'Donor',
            'hi': 'दाता'
          },
          receiver: {
            'en': 'Receiver',
            'hi': 'प्राप्तकर्ता'
          },
          delivery_partner: {
            'en': 'Delivery Partner',
            'hi': 'डिलीवरी पार्टनर'
          }
        }
      }
    },
    buttons: {
      signup: {
        'en': 'Sign Up',
        'hi': 'साइन अप करें'
      }
    },
    links: {
      haveAccount: {
        'en': 'Already have an account?',
        'hi': 'पहले से खाता है?'
      },
      login: {
        'en': 'Login',
        'hi': 'लॉग इन करें'
      }
    },
    errors: {
      required: {
        'en': 'Please fill in all required fields',
        'hi': 'कृपया सभी आवश्यक फ़ील्ड भरें'
      },
      passwordMismatch: {
        'en': 'Passwords do not match',
        'hi': 'पासवर्ड मेल नहीं खाते'
      },
      invalidEmail: {
        'en': 'Please enter a valid email address',
        'hi': 'कृपया एक वैध ईमेल पता दर्ज करें'
      },
      signupFailed: {
        'en': 'Signup failed. Please try again.',
        'hi': 'साइन अप विफल। कृपया पुनः प्रयास करें।'
      }
    }
  };

  const getMessage = (path) => {
    const langCode = language.split('-')[0];
    return path[langCode] || path['en'];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password || !formData.name || !formData.phone || !formData.address) {
      setError(getMessage(messages.errors.required));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(getMessage(messages.errors.passwordMismatch));
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/auth/signup", formData);

      if (response.status === 201) {
        // Redirect to login page after successful signup
        navigate("/login");
      }
    } catch (error) {
      setError(getMessage(messages.errors.signupFailed));
      console.error("Signup error:", error.response?.data || error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>{getMessage(messages.title)}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{getMessage(messages.fields.name.label)}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={getMessage(messages.fields.name.placeholder)}
              required
            />
          </div>

          <div className="form-group">
            <label>{getMessage(messages.fields.email.label)}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={getMessage(messages.fields.email.placeholder)}
              required
            />
          </div>

          <div className="form-group">
            <label>{getMessage(messages.fields.password.label)}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={getMessage(messages.fields.password.placeholder)}
              required
            />
          </div>

          <div className="form-group">
            <label>{getMessage(messages.fields.confirmPassword.label)}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={getMessage(messages.fields.confirmPassword.placeholder)}
              required
            />
          </div>

          <div className="form-group">
            <label>{getMessage(messages.fields.phone.label)}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={getMessage(messages.fields.phone.placeholder)}
              required
            />
          </div>

          <div className="form-group">
            <label>{getMessage(messages.fields.address.label)}</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder={getMessage(messages.fields.address.placeholder)}
              required
            />
          </div>

          <div className="form-group">
            <label>{getMessage(messages.fields.role.label)}</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="donor">{getMessage(messages.fields.role.options.donor)}</option>
              <option value="receiver">{getMessage(messages.fields.role.options.receiver)}</option>
              <option value="delivery_partner">{getMessage(messages.fields.role.options.delivery_partner)}</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="signup-button">
            {getMessage(messages.buttons.signup)}
          </button>

          <div className="login-link">
            <span>{getMessage(messages.links.haveAccount)}</span>
            <a href="/login">{getMessage(messages.links.login)}</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
