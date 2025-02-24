import React from "react";
import '../CSS/HomePage.css'
import { Link } from "react-router-dom";
const HomePage = () => {
    return(
        <div className='homepage-container'>
            <div className="intro-box">
                <p>Transform surplus food into community support. Choose your role and be part of the solution.</p>
            </div>

            <section className="cards-section">
            <div className="card donor-card">
                <i className="fas fa-user-plus"></i>
                <h2>Donor</h2>
                <p>Be a food hero. Donate your surplus and help those in need while reducing waste.</p>
                <Link to="/donor">Become a Donor</Link>
            </div>
    
            <div className="card receiver-card">
                <i className="fas fa-user"></i>
                <h2>Receiver</h2>
                <p>Access nutritious meals and support from your community. Every plate matters.</p>
                <Link to="/receiver">Become a Receiver</Link>
            </div>
    
            <div className="card delivery-card">
                <i className="fas fa-truck"></i>
                <h2>Delivery Partner</h2>
                <p>Connect donors and receivers. Your journey helps bridge food gaps in our community.</p>
                <Link to="/delivery">Join Delivery</Link>
            </div>
        </section>
        </div>
    )
}

export default HomePage;

