import React, { useState } from "react";
import "../CSS/Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const history = useNavigate(); // To redirect after successful login
  const { language } = useLanguage();

  const messages = {
    title: {
      'en': 'Login to Your Account',
      'hi': 'अपने खाते में लॉग इन करें'
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
    loginButton: {
      'en': 'Login',
      'hi': 'लॉग इन करें'
    },
    forgotPassword: {
      'en': 'Forgot Password?',
      'hi': 'पासवर्ड भूल गए?'
    },
    noAccount: {
      'en': "Don't have an account?",
      'hi': 'खाता नहीं है?'
    },
    signUp: {
      'en': 'Sign Up',
      'hi': 'साइन अप करें'
    },
    errors: {
      required: {
        'en': 'Please fill in all fields',
        'hi': 'कृपया सभी फ़ील्ड भरें'
      },
      invalid: {
        'en': 'Invalid email or password',
        'hi': 'अमान्य ईमेल या पासवर्ड'
      }
    }
  };

  const getMessage = (path) => {
    const langCode = language.split('-')[0];
    return path[langCode] || path['en'];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setErrorMessage(getMessage(messages.errors.required));
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/auth/login", {
        email,
        password,
      });

      console.log(response);
      
      // Assuming the response contains the user data and token
      if (response.status === 200) {
        const { user, token } = response.data;

        // Store user info and token in session or local storage
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", token); // Store token for authenticated requests

        // Redirect to a dashboard or home page based on user role
        switch (user.role) {
          case "donor":
            history("/make-donation");
            break;
          case "receiver":
            history("/dashboard");
            break;
          case "delivery_partner":
            history("/delivery-dashboard");
            break;
          default:
            history("/");
        }
      } else {
        setErrorMessage(
          response.data.error || "Login failed. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage(getMessage(messages.errors.invalid));
      console.error("Login error:", error.response?.data || error);
    }
  };

  return (
    <div className="login-container-big">
      <div className="container login-container" id="login-form-container">
        <div className="card login-card">
          <h2>{getMessage(messages.title)}</h2>
          <form id="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope /> {getMessage(messages.email.label)}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={getMessage(messages.email.placeholder)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <FaLock /> {getMessage(messages.password.label)}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={getMessage(messages.password.placeholder)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {getMessage(messages.loginButton)}
            </button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="form-footer">
              <a href="/forgot-password" className="forgot-password">
                {getMessage(messages.forgotPassword)}
              </a>
              <p>
                {getMessage(messages.noAccount)} <Link to="/signup">{getMessage(messages.signUp)}</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
