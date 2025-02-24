import React, { useState } from "react";
import "../CSS/Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const history = useNavigate(); // To redirect after successful login

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setErrorMessage("Please fill in both fields.");
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

        // Redirect to a dashboard or home page after successful login
        history("/");
      } else {
        setErrorMessage(
          response.data.error || "Login failed. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "An error occurred. Please try again later."
      );
    }
  };

  return (
    <div className="login-container-big">
      <div className="container login-container" id="login-form-container">
        <div className="card login-card">
          <h2>Sign In</h2>
          <form id="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <FaLock /> Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Sign In
            </button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="form-footer">
              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
              <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
