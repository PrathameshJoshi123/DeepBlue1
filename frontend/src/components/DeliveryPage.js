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
} from "react-icons/fa";
import "../CSS/DeliveryPage.css";

const DeliveryPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: "",
    person_name: "",
    email: "",
    number: "",
    website: "",
    registration_number: "",
    vehicle_types: "", // Accepting user input as a string
    fleet_size: "",
    building_name: "", // Added new field
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        id_proof: e.target.files[0],
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.terms_agreed) {
      setErrorMessage("You must agree to the terms and conditions.");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      setErrorMessage("Unauthorized: Please log in to continue.");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/delivery/register",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Registration successful! Redirecting...");
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="delivery-container">
      <header>
        <h1>Partner Registration</h1>
      </header>

      <main>
        <section className="form-section">
          <form className="deliveryform" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <h2>Basic Information</h2>
            <div>
              <label>
                <FaBuilding /> Company/Individual Name:
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>
                <FaUser /> Contact Person Name:
              </label>
              <input
                type="text"
                name="person_name"
                value={formData.person_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>
                <FaEnvelope /> Contact Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>
                <FaPhone /> Contact Number:
              </label>
              <input
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>
                <FaGlobe /> Website/Social Media Handle (optional):
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            {/* Business Details */}
            <h2>Business/Individual Details</h2>
            <div>
              <label>
                <FaIdCard /> Registration Number/License ID:
              </label>
              <input
                type="text"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>
                <FaCar /> Vehicle Type(s):
              </label>
              <input
                type="text"
                name="vehicle_types"
                value={formData.vehicle_types}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>
                <FaBus /> Fleet Size:
              </label>
              <input
                type="number"
                name="fleet_size"
                value={formData.fleet_size}
                onChange={handleChange}
                required
              />
            </div>

            {/* Address Details */}
            <h2>
              <FaMapMarkerAlt /> Address Details
            </h2>
            <div>
              <label>
                <FaHome /> Building Name:
              </label>
              <input
                type="text"
                name="building_name"
                value={formData.building_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Street Address:</label>
              <input
                type="text"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>City:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>State/Region:</label>
              <input
                type="text"
                name="state_region"
                value={formData.state_region}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Postal/ZIP Code:</label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            {/* Terms & File Upload */}
            <h2>
              <FaFileAlt /> Terms of Service
            </h2>
            <div>
              <input
                type="checkbox"
                name="terms_agreed"
                checked={formData.terms_agreed}
                onChange={handleChange}
                required
              />
              <label>
                I agree to the <a href="#">Terms and Conditions</a>.
              </label>
            </div>
            <div>
              <label>
                <FaUpload /> Upload ID Proof:
              </label>
              <input
                type="file"
                name="id_proof"
                accept=".jpg,.png,.pdf"
                onChange={handleFileChange}
                required
              />
            </div>

            <button type="submit">
              <FaPaperPlane /> Register
            </button>

            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
          </form>
        </section>
      </main>
    </div>
  );
};

export default DeliveryPage;
