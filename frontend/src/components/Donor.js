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
} from "react-icons/fa";
import "../CSS/Donor.css";
import { Navigate, useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  // Handle input changes (text, checkbox, file uploads)
  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      console.log("File Selected:", files[0]);
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      const formDataToSend = new FormData();

      // Append only non-null values
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

      alert(response.data.message);
      if(response.status == 201){
        navigate('/');
        const user = response.data.user;
        sessionStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      console.error("Error registering donor:", error.response?.data || error);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <div className="donor-container">
      <form
        className="donorform"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h3>
          <FaInfoCircle /> Donor Information
        </h3>

        <label>
          <FaUser /> Full Name:
        </label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          placeholder="Enter full name"
          onChange={handleChange}
          required
        />

        <label>
          <FaEnvelope /> Email:
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter email"
          onChange={handleChange}
          required
        />

        <label>
          <FaUser /> Restaurant Name (Optional):
        </label>
        <input
          type="text"
          name="restaurant_name"
          value={formData.restaurant_name}
          placeholder="Enter restaurant name"
          onChange={handleChange}
        />

        <label>
          <FaPhone /> Contact Number:
        </label>
        <input
          type="tel"
          name="contact_number"
          value={formData.contact_number}
          placeholder="Enter contact number"
          onChange={handleChange}
          required
        />

        <h3>
          <FaMapMarkerAlt /> Address Details
        </h3>

        <label>Building Name:</label>
        <input
          type="text"
          name="building_name"
          value={formData.building_name}
          placeholder="Enter building name"
          onChange={handleChange}
          required
        />

        <label>Street Name:</label>
        <input
          type="text"
          name="street_name"
          value={formData.street_name}
          placeholder="Enter street name"
          onChange={handleChange}
          required
        />

        <label>Shop Number (Optional):</label>
        <input
          type="text"
          name="shop_number"
          value={formData.shop_number}
          placeholder="Enter shop number"
          onChange={handleChange}
        />

        <label>
          <FaCity /> City:
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          placeholder="Enter city"
          onChange={handleChange}
          required
        />

        <label>
          <FaMapSigns /> State:
        </label>
        <input
          type="text"
          name="state"
          value={formData.state}
          placeholder="Enter state"
          onChange={handleChange}
          required
        />

        <label>
          <FaMailBulk /> Zip Code:
        </label>
        <input
          type="text"
          name="zip_code"
          value={formData.zip_code}
          placeholder="Enter ZIP code"
          onChange={handleChange}
          required
        />

        <h3>Food Donation Details</h3>
        <label>Donation Frequency:</label>
        <select
          name="donation_frequency"
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

        <h3>Verification & Compliance</h3>
        <label>
          <FaIdCard /> ID Proof (JPEG, PNG, PDF):
        </label>
        <input
          type="file"
          name="id_proof"
          accept="image/png, image/jpeg, application/pdf"
          onChange={handleChange}
          required
        />

        <label>
          <FaCertificate /> FSSAI ID:
        </label>
        <input
          type="text"
          name="fssai_id"
          value={formData.fssai_id}
          placeholder="Enter FSSAI ID"
          onChange={handleChange}
          required
        />

        <h3>
          <FaFileAlt /> Terms of Service
        </h3>
        <div className="terms-section">
          <input
            type="checkbox"
            id="terms_agreed"
            name="terms_agreed"
            checked={formData.terms_agreed}
            onChange={handleChange}
            required
          />
          <label htmlFor="terms_agreed">
            I agree to the <a href="#">Terms and Conditions</a>.
          </label>
        </div>

        <button type="submit">
          <FaPaperPlane /> Register
        </button>
      </form>
    </div>
  );
};

export default Donor;
