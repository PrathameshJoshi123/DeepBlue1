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
} from "react-icons/fa";
import "../CSS/Receiver.css";
import { useNavigate } from "react-router-dom";

const Receiver = () => {
  const navigate = useNavigate();
  const token =  sessionStorage.getItem('token');
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
    id_proof: null, // File upload
  });

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
        formDataToSend.append(key, formData[key]);
      });

      const response = await axios.post(
        "http://localhost:5000/receiver/register",
        formDataToSend,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" },
        }
      );

      alert(response.data.message);
      if(response.status == 201){
        const user = response.data.user;
        sessionStorage.setItem("user", user);

        navigate('/');
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Registration failed!");
    }
  };

  return (
    <div className="receiver-container">
      <main>
        <section className="form-section">
          <form
            className="receiverform"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <h2>
              <FaUser /> Basic Info
            </h2>
            <div>
              <label htmlFor="ngo_name">
                <FaBuilding /> NGO Name:
              </label>
              <input
                type="text"
                id="ngo_name"
                name="ngo_name"
                value={formData.ngo_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="contact_person">
                <FaUser /> Contact Person:
              </label>
              <input
                type="text"
                id="contact_person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="contact_number">
                <FaPhone /> Contact Number:
              </label>
              <input
                type="tel"
                id="contact_number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">
                <FaMailBulk /> Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <h2>
              <FaMapMarkerAlt /> Address Details
            </h2>
            <div>
              <label htmlFor="building_name">
                <FaBuilding /> Building Name:
              </label>
              <input
                type="text"
                id="building_name"
                name="building_name"
                value={formData.building_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="street_name">
                <FaMapMarkerAlt /> Street Name:
              </label>
              <input
                type="text"
                id="street_name"
                name="street_name"
                value={formData.street_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="shop_number">
                <FaFileAlt /> Shop Number (Optional):
              </label>
              <input
                type="text"
                id="shop_number"
                name="shop_number"
                value={formData.shop_number}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="city">
                <FaCity /> City:
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="state">
                <FaCity /> State:
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="zip_code">
                <FaMailBulk /> Zip Code:
              </label>
              <input
                type="text"
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                required
              />
            </div>

            <h2>
              <FaBuilding /> NGO Information
            </h2>
            <div>
              <label htmlFor="website">
                <FaGlobe /> Website/Social Media:
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="registration_number">
                <FaIdCard /> Registration Number:
              </label>
              <input
                type="text"
                id="registration_number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="id_proof">
                <FaIdCard /> ID Proof (PDF/JPG/PNG):
              </label>
              <input
                type="file"
                id="id_proof"
                name="id_proof"
                accept=".pdf,.jpg,.png"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="ngo_gov_no">
                <FaFileAlt /> NGO Gov No.:
              </label>
              <input
                type="text"
                id="ngo_gov_no"
                name="ngo_gov_no"
                value={formData.ngo_gov_no}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="date_of_establishment">
                <FaCalendarAlt /> Date of Establishment:
              </label>
              <input
                type="date"
                id="date_of_establishment"
                name="date_of_establishment"
                value={formData.date_of_establishment}
                onChange={handleChange}
                required
              />
            </div>

            <h2>
              <FaTruck /> Delivery & Logistics
            </h2>
            
            <div>
              <label htmlFor="delivery_method">
                <FaTruckPickup /> Delivery Method:
              </label>
              <select
                id="delivery_method"
                name="delivery_method"
                value={formData.delivery_method}
                onChange={handleChange}
                required
              >
                <option value="direct">Direct</option>
                <option value="courier">Courier</option>
              </select>
            </div>
            <div>
              <label htmlFor="preferred_delivery_time">
                <FaClock /> Preferred Delivery Time:
              </label>
              <input
                type="time"
                id="preferred_delivery_time"
                name="preferred_delivery_time"
                value={formData.preferred_delivery_time}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="warehouse_details">
                <FaWarehouse /> Warehouse Details:
              </label>
              <input
                type="text"
                id="warehouse_details"
                name="warehouse_details"
                value={formData.warehouse_details}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">
              <FaPaperPlane /> Submit
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Receiver;
