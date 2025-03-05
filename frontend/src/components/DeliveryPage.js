import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaIdCard,
  FaCar,
  FaBus,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaFileAlt,
  FaUpload,
  FaHome,
  FaCity,
  FaMapSigns,
  FaMailBulk,
  FaTruck
} from "react-icons/fa";
import "../CSS/Forms.css";

const DeliveryPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: "",
    person_name: "",
    email: "",
    number: "",
    website: "",
    registration_number: "",
    vehicle_types: "",
    fleet_size: "",
    building_name: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    terms_agreed: false,
    id_proof: null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        id_proof: e.target.files[0],
      }));
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
        "http://localhost:5000/delivery/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      if (response.status === 201) {
        navigate('/');
        const user = response.data.user;
        sessionStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to register. Please try again.");
    }
  };

  return (
    <div className="form-container delivery-form">
      <div className="form-header">
        <h2>Delivery Partner Registration</h2>
        <p>Join our network of delivery partners and help connect donors with receivers</p>
      </div>

      {errorMessage && <div className="message error-message">{errorMessage}</div>}
      {successMessage && <div className="message success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-section">
          <h3><FaUser /> Basic Information</h3>
          
          <div className="form-group">
            <label><FaBuilding /> Company/Individual Name</label>
            <input
              type="text"
              name="company_name"
              className="form-input"
              value={formData.company_name}
              placeholder="Enter company or individual name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaUser /> Contact Person Name</label>
            <input
              type="text"
              name="person_name"
              className="form-input"
              value={formData.person_name}
              placeholder="Enter contact person name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaEnvelope /> Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              placeholder="Enter email address"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaPhone /> Contact Number</label>
            <input
              type="tel"
              name="number"
              className="form-input"
              value={formData.number}
              placeholder="Enter contact number"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaGlobe /> Website (Optional)</label>
            <input
              type="url"
              name="website"
              className="form-input"
              value={formData.website}
              placeholder="Enter website URL"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3><FaTruck /> Vehicle Information</h3>
          
          <div className="form-group">
            <label><FaIdCard /> Registration Number</label>
            <input
              type="text"
              name="registration_number"
              className="form-input"
              value={formData.registration_number}
              placeholder="Enter vehicle registration number"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaCar /> Vehicle Types</label>
            <input
              type="text"
              name="vehicle_types"
              className="form-input"
              value={formData.vehicle_types}
              placeholder="Enter types of vehicles (e.g., Van, Truck)"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaBus /> Fleet Size</label>
            <input
              type="number"
              name="fleet_size"
              className="form-input"
              value={formData.fleet_size}
              placeholder="Enter number of vehicles"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3><FaMapMarkerAlt /> Address Details</h3>
          
          <div className="form-group">
            <label><FaHome /> Building Name</label>
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
            <label><FaMapSigns /> Street Address</label>
            <input
              type="text"
              name="street_address"
              className="form-input"
              value={formData.street_address}
              placeholder="Enter street address"
              onChange={handleChange}
              required
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
            <label><FaMapSigns /> State/Region</label>
            <input
              type="text"
              name="state"
              className="form-input"
              value={formData.state}
              placeholder="Enter state or region"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaMailBulk /> Postal/ZIP Code</label>
            <input
              type="text"
              name="postal_code"
              className="form-input"
              value={formData.postal_code}
              placeholder="Enter postal or ZIP code"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaGlobe /> Country</label>
            <input
              type="text"
              name="country"
              className="form-input"
              value={formData.country}
              placeholder="Enter country"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3><FaFileAlt /> Verification</h3>
          
          <div className="form-group">
            <label><FaUpload /> ID Proof</label>
            <div className="file-upload">
              <div className="file-upload-text">
                <FaUpload />
                <span>Click to upload or drag and drop</span>
                <span>Supported formats: JPG, PNG, PDF</span>
              </div>
              <input
                type="file"
                name="id_proof"
                accept=".jpg,.png,.pdf"
                onChange={handleFileChange}
                required
              />
            </div>
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
          <FaPaperPlane /> Register as Delivery Partner
        </button>
      </form>
    </div>
  );
};

export default DeliveryPage;
