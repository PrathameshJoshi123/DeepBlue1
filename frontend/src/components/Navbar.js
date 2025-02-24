import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Navbar.css";
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate(); // useNavigate hook to handle navigation

  // Logout function
  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.post(
        "http://127.0.0.1:5000/auth/logout",
        {}, // Empty body (if needed)
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        // Axios uses `.status`, not `.ok`
        sessionStorage.removeItem("token"); // Clear token from storage
        sessionStorage.removeItem("user");
        navigate("/login"); // Redirect to login page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error);
    }
  };


  return (
    <div className="navbar-container">
      <Link to="/">
        <h1>
          <i className="fas fa-hands-helping"></i> Urban Food Waste Management
        </h1>
      </Link>
      <nav className="header-buttons">
        <Link to="/about-us">About Us</Link>

        {sessionStorage.getItem("token") ? (
          <>
            {/* Get user role from sessionStorage */}
            {JSON.parse(sessionStorage.getItem("user"))?.role === "donor" && (
              <Link to="/make-donation">Make Donation</Link> // Show only for donors
            )}
            {JSON.parse(sessionStorage.getItem("user"))?.role === "receiver" && (
              <Link to="/dashboard">Dashboard</Link> // Show only for donors
            )}
            {JSON.parse(sessionStorage.getItem("user"))?.role === "delivery_partner" && (
              <Link to="/delivery-dashboard">Dashboard</Link> // Show only for donors
            )}

            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Sign In</Link>
        )}
      </nav>
    </div>
  );

};

export default Navbar;
