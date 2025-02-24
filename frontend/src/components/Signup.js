import React from "react";
import "../CSS/Signup.css";
import { FaEnvelope } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setconfPassword] = useState("");
  const Navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password===confpassword){
      const conf = await axios.post("http://127.0.0.1:5000/auth/signup", {
        email,
        password,
      });
      console.log(conf);
      if (conf) {
        alert("Account created");
        Navigate("/login");
      }
    }
  };

  return (
    <div className="sign-container-big">
      <div className="login-container" id="signup-form-container">
        <div className="login-card">
          <h2>Sign Up</h2>
          <form id="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">
                <FaLock /> Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm your password"
                onChange={(e) => setconfPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
