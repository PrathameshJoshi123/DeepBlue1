import React, { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaBuilding,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaMailBulk,
  FaGlobe,
  FaIdCard,
  FaFileAlt,
  FaCalendarAlt,
  FaUsers,
  FaCarrot,
  FaLeaf,
  FaBox,
  FaTruck,
  FaTruckPickup,
  FaClock,
  FaWarehouse,
  FaCheckCircle,
  FaHeart,
  FaPaperPlane,
  FaEnvelope,
  FaUpload
} from "react-icons/fa";
import "../CSS/Forms.css";
import { useNavigate } from "react-router-dom";

const Receiver = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [formData, setFormData] = useState({
    ngo_name: "",
    contact_person: "",
    contact_number: "",
    email: "",
    building_name: "",
    street_name: "",
    shop_number: "",
    city: "",
    state: "",
    zip_code: "",
    website: "",
    registration_number: "",
    ngo_gov_no: "",
    date_of_establishment: "",
    support_level: "state",
    funding_type: "government",
    benefits_to_receiver: "",
    items_received: "",
    delivery_details: "",
    delivery_method: "direct",
    preferred_delivery_time: "",
    warehouse_details: "",
    id_proof: null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        "http://localhost:5000/receiver/register",
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
    <div className="form-container receiver-form">
      <div className="form-header">
        <h2>NGO/Receiver Registration</h2>
        <p>Help us distribute food to those who need it most</p>
      </div>

      {errorMessage && <div className="message error-message">{errorMessage}</div>}
      {successMessage && <div className="message success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-section">
          <h3><FaUser /> Basic Information</h3>
          
          <div className="form-group">
            <label><FaBuilding /> NGO Name</label>
            <input
              type="text"
              name="ngo_name"
              className="form-input"
              value={formData.ngo_name}
              placeholder="Enter NGO name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaUser /> Contact Person</label>
            <input
              type="text"
              name="contact_person"
              className="form-input"
              value={formData.contact_person}
              placeholder="Enter contact person name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaPhone /> Contact Number</label>
            <input
              type="tel"
              name="contact_number"
              className="form-input"
              value={formData.contact_number}
              placeholder="Enter contact number"
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
              placeholder="Enter email address"
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
            <label><FaMapMarkerAlt /> Street Name</label>
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
            <label><FaBuilding /> Shop/Office Number</label>
            <input
              type="text"
              name="shop_number"
              className="form-input"
              value={formData.shop_number}
              placeholder="Enter shop/office number"
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
            <label><FaCity /> State</label>
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
          <h3><FaBuilding /> NGO Information</h3>
          
          <div className="form-group">
            <label><FaGlobe /> Website/Social Media</label>
            <input
              type="url"
              name="website"
              className="form-input"
              value={formData.website}
              placeholder="Enter website or social media URL"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><FaIdCard /> Registration Number</label>
            <input
              type="text"
              name="registration_number"
              className="form-input"
              value={formData.registration_number}
              placeholder="Enter NGO registration number"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaUpload /> ID Proof</label>
            <div className="file-upload">
              <div className="file-upload-text">
                <FaUpload />
                <span>Click to upload or drag and drop</span>
                <span>Supported formats: PDF, JPG, PNG</span>
              </div>
              <input
                type="file"
                name="id_proof"
                accept=".pdf,.jpg,.png"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label><FaFileAlt /> NGO Government Number</label>
            <input
              type="text"
              name="ngo_gov_no"
              className="form-input"
              value={formData.ngo_gov_no}
              placeholder="Enter NGO government number"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaCalendarAlt /> Date of Establishment</label>
            <input
              type="date"
              name="date_of_establishment"
              className="form-input"
              value={formData.date_of_establishment}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3><FaTruck /> Delivery & Logistics</h3>
          
          <div className="form-group">
            <label><FaTruckPickup /> Delivery Method</label>
            <select
              name="delivery_method"
              className="form-input"
              value={formData.delivery_method}
              onChange={handleChange}
              required
            >
              <option value="direct">Direct Pickup</option>
              <option value="courier">Courier Service</option>
            </select>
          </div>

          <div className="form-group">
            <label><FaClock /> Preferred Delivery Time</label>
            <input
              type="time"
              name="preferred_delivery_time"
              className="form-input"
              value={formData.preferred_delivery_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaWarehouse /> Warehouse Details</label>
            <input
              type="text"
              name="warehouse_details"
              className="form-input"
              value={formData.warehouse_details}
              placeholder="Enter warehouse/storage facility details"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          <FaPaperPlane /> Register as Receiver
        </button>
      </form>
    </div>
  );
};

export default Receiver;
