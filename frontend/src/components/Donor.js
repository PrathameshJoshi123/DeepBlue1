import React, { useState } from "react";
import axios from "axios";
import {
  FaInfoCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaMapSigns,
  FaMailBulk,
  FaIdCard,
  FaCertificate,
  FaFileAlt,
  FaPaperPlane,
  FaBuilding,
  FaCalendarAlt,
  FaUpload
} from "react-icons/fa";
import "../CSS/Forms.css";
import { useNavigate } from "react-router-dom";

const Donor = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    restaurant_name: "",
    contact_number: "",
    building_name: "",
    street_name: "",
    shop_number: "",
    city: "",
    state: "",
    zip_code: "",
    donation_frequency: "",
    id_proof: null,
    fssai_id: "",
    terms_agreed: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        "http://localhost:5000/donor/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      if(response.status === 201){
        navigate('/');
        const user = response.data.user;
        sessionStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to register. Please try again.");
    }
  };

  return (
    <div className="form-container donor-form">
      <div className="form-header">
        <h2>Become a Food Donor</h2>
        <p>Join us in reducing food waste and helping those in need</p>
      </div>

      {errorMessage && <div className="message error-message">{errorMessage}</div>}
      {successMessage && <div className="message success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-section">
          <h3><FaInfoCircle /> Basic Information</h3>
          
          <div className="form-group">
            <label><FaUser /> Full Name</label>
            <input
              type="text"
              name="full_name"
              className="form-input"
              value={formData.full_name}
              placeholder="Enter your full name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaEnvelope /> Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaBuilding /> Restaurant Name (Optional)</label>
            <input
              type="text"
              name="restaurant_name"
              className="form-input"
              value={formData.restaurant_name}
              placeholder="Enter restaurant name if applicable"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><FaPhone /> Contact Number</label>
            <input
              type="tel"
              name="contact_number"
              className="form-input"
              value={formData.contact_number}
              placeholder="Enter your contact number"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3><FaMapMarkerAlt /> Address Details</h3>
          
          <div className="form-group">
            <label><FaBuilding /> Building Name</label>
            <input
              type="text"
              name="building_name"
              className="form-input"
              value={formData.building_name}
              placeholder="Enter building name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaMapSigns /> Street Name</label>
            <input
              type="text"
              name="street_name"
              className="form-input"
              value={formData.street_name}
              placeholder="Enter street name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaBuilding /> Shop Number (Optional)</label>
            <input
              type="text"
              name="shop_number"
              className="form-input"
              value={formData.shop_number}
              placeholder="Enter shop number if applicable"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><FaCity /> City</label>
            <input
              type="text"
              name="city"
              className="form-input"
              value={formData.city}
              placeholder="Enter city"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaMapSigns /> State</label>
            <input
              type="text"
              name="state"
              className="form-input"
              value={formData.state}
              placeholder="Enter state"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaMailBulk /> ZIP Code</label>
            <input
              type="text"
              name="zip_code"
              className="form-input"
              value={formData.zip_code}
              placeholder="Enter ZIP code"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3><FaCalendarAlt /> Donation Details</h3>
          
          <div className="form-group">
            <label><FaCalendarAlt /> Donation Frequency</label>
            <select
              name="donation_frequency"
              className="form-input"
              value={formData.donation_frequency}
              onChange={handleChange}
              required
            >
              <option value="">Select Frequency</option>
              <option value="One-time">One-time</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3><FaIdCard /> Verification</h3>
          
          <div className="form-group">
            <label><FaUpload /> ID Proof</label>
            <div className="file-upload">
              <div className="file-upload-text">
                <FaUpload />
                <span>Click to upload or drag and drop</span>
                <span>Supported formats: JPEG, PNG, PDF</span>
              </div>
              <input
                type="file"
                name="id_proof"
                accept="image/png, image/jpeg, application/pdf"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label><FaCertificate /> FSSAI ID</label>
            <input
              type="text"
              name="fssai_id"
              className="form-input"
              value={formData.fssai_id}
              placeholder="Enter FSSAI ID"
              onChange={handleChange}
              required
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="terms_agreed"
              name="terms_agreed"
              checked={formData.terms_agreed}
              onChange={handleChange}
              required
            />
            <label htmlFor="terms_agreed">
              I agree to the <a href="#">Terms and Conditions</a>
            </label>
          </div>
        </div>

        <button type="submit" className="submit-button">
          <FaPaperPlane /> Register as Donor
        </button>
      </form>
    </div>
  );
};

export default Donor;
